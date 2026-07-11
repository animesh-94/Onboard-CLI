package cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"sync"

	"github.com/go-git/go-git/v5"
	sitter "github.com/smacker/go-tree-sitter"
	"github.com/onboard-cli/internal/parser"
	"github.com/spf13/cobra"
)

var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "Start the Onboard backend API server",
	Run: func(cmd *cobra.Command, args []string) {
		startServer()
	},
}

func init() {
	rootCmd.AddCommand(serverCmd)
}

type ParseRequest struct {
	URL    string `json:"url"`
	Branch string `json:"branch,omitempty"`
}

type ASTNode struct {
	ID        string   `json:"id"`
	Type      string   `json:"type"`
	Name      string   `json:"name"`
	FilePath  string   `json:"filePath"`
	Functions []string `json:"functions"`
	Extension string   `json:"extension"`
}

type ParsedGraph struct {
	Nodes []ASTNode `json:"nodes"`
	Edges []struct {
		Source string `json:"source"`
		Target string `json:"target"`
	} `json:"edges"`
}

type ParseJob struct {
	Path    string
	Content []byte
}

func startServer() {
	http.HandleFunc("/api/parse", parseHandler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Starting API server on :%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func parseHandler(w http.ResponseWriter, r *http.Request) {
	// CORS Middleware headers - allow frontend traffic
	origin := r.Header.Get("Origin")
	if origin == "" {
		origin = "*" // fallback to allow all
	}
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ParseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if req.URL == "" {
		http.Error(w, "Path (URL field) is required", http.StatusBadRequest)
		return
	}

	targetURL := req.URL // Can be github URL
	
	// We will clone the github repo to a temp directory
	tempDir, err := os.MkdirTemp("", "repo-clone-*")
	if err != nil {
		http.Error(w, "Failed to create temporary directory", http.StatusInternalServerError)
		return
	}
	defer os.RemoveAll(tempDir)

	log.Printf("Cloning repository %s to ephemeral disk...", targetURL)

	cloneOpts := &git.CloneOptions{
		URL:          targetURL,
		Depth:        1,
		SingleBranch: true,
		Progress:     nil,
	}

	if _, err := git.PlainClone(tempDir, false, cloneOpts); err != nil {
		log.Printf("Clone error: %v", err)
		http.Error(w, fmt.Sprintf("Failed to clone repository: %v", err), http.StatusInternalServerError)
		return
	}

	targetDir := tempDir

	log.Printf("Analyzing local directory %s...", targetDir)

	var mu sync.Mutex
	graph := ParsedGraph{Nodes: []ASTNode{}, Edges: []struct {
		Source string `json:"source"`
		Target string `json:"target"`
	}{}}

	addedDirs := make(map[string]bool)

	addDirNode := func(dirPath string) {
		mu.Lock()
		defer mu.Unlock()
		if addedDirs[dirPath] {
			return
		}
		addedDirs[dirPath] = true
		
		graph.Nodes = append(graph.Nodes, ASTNode{
			ID:       dirPath,
			Type:     "dir",
			Name:     filepath.Base(dirPath),
			FilePath: dirPath,
		})

		if dirPath != targetDir {
			parentDir := filepath.Dir(dirPath)
			graph.Edges = append(graph.Edges, struct {
				Source string `json:"source"`
				Target string `json:"target"`
			}{Source: parentDir, Target: dirPath})
		}
	}

	addDirNode(targetDir)

	jobs := make(chan ParseJob, 1000)
	var wg sync.WaitGroup

	numWorkers := runtime.NumCPU()
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobs {
				funcs := extractFunctions(job.Path, job.Content)
				
				mu.Lock()
				graph.Nodes = append(graph.Nodes, ASTNode{
					ID:        job.Path,
					Type:      "file",
					Name:      filepath.Base(job.Path),
					FilePath:  job.Path,
					Functions: funcs,
					Extension: filepath.Ext(job.Path),
				})
				graph.Edges = append(graph.Edges, struct {
					Source string `json:"source"`
					Target string `json:"target"`
				}{Source: filepath.Dir(job.Path), Target: job.Path})
				mu.Unlock()
			}
		}()
	}

	filepath.Walk(targetDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			if info.Name() == ".git" || info.Name() == "node_modules" {
				return filepath.SkipDir
			}
			addDirNode(path)
			return nil
		}
		
		ext := strings.ToLower(filepath.Ext(info.Name()))
		if ext == ".go" || ext == ".ts" || ext == ".tsx" || ext == ".js" || ext == ".jsx" || ext == ".py" {
			content, err := os.ReadFile(path)
			if err == nil {
				jobs <- ParseJob{Path: path, Content: content}
			}
		}
		return nil
	})

	close(jobs)
	wg.Wait()

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(graph); err != nil {
		log.Printf("JSON Encode error: %v", err)
	}
}

func extractFunctions(path string, content []byte) []string {
	registry := parser.NewLanguageRegistry()
	lang := registry.GetLanguage(path)
	if lang == nil {
		return nil
	}

	parser := sitter.NewParser()
	parser.SetLanguage(lang)
	tree := parser.Parse(nil, content)
	defer tree.Close()

	var funcs []string
	var traverse func(node *sitter.Node)
	traverse = func(node *sitter.Node) {
		typ := node.Type()
		if registry.IsNodeInteresting(typ) {
			for i := 0; i < int(node.ChildCount()); i++ {
				child := node.Child(i)
				if child.Type() == "identifier" || child.Type() == "type_identifier" {
					funcs = append(funcs, child.Content(content))
					break
				}
			}
		}
		for i := 0; i < int(node.ChildCount()); i++ {
			traverse(node.Child(i))
		}
	}

	if root := tree.RootNode(); root != nil {
		traverse(root)
	}
	return funcs
}
