package cmd

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"text/tabwriter"

	"github.com/onboard-cli/internal/parser"
	"github.com/onboard-cli/internal/store"
	sitter "github.com/smacker/go-tree-sitter"
	"github.com/spf13/cobra"
)

var (
	framework string
	protocol  string
)

var routesCmd = &cobra.Command{
	Use:   "routes",
	Short: "Automatically map backend API routes to their handler functions",
	Run: func(cmd *cobra.Command, args []string) {
		var queryStr string
		var exts []string

		switch strings.ToLower(framework) {
		case "gin":
			exts = []string{".go"}
			queryStr = `
			(call_expression
				function: (selector_expression
					field: (field_identifier) @method
					(#match? @method "^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)$")
				)
				arguments: (argument_list
					(interpreted_string_literal) @path
					(identifier) @handler
				)
			)`
		case "express":
			exts = []string{".js", ".ts"}
			queryStr = `
			(call_expression
				function: (member_expression
					property: (property_identifier) @method
					(#match? @method "^(get|post|put|delete|patch|options|head)$")
				)
				arguments: (arguments
					(string) @path
					(_) @handler
				)
			)`
		case "fastapi":
			exts = []string{".py"}
			queryStr = `
			(decorated_definition
				(decorator
					(call
						function: (attribute
							attribute: (identifier) @method
							(#match? @method "^(get|post|put|delete|patch|options|head)$")
						)
						arguments: (argument_list
							(string) @path
						)
					)
				)
				definition: (function_definition
					name: (identifier) @handler
				)
			)`
		case "spring":
			exts = []string{".java"}
			queryStr = `
			(method_declaration
				(modifiers
					(annotation
						name: (identifier) @method
						(#match? @method "^(GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping)$")
						arguments: (annotation_argument_list
							(string_literal) @path
						)
					)
				)
				name: (identifier) @handler
			)`
		default:
			fmt.Printf("Unsupported framework: %s. Supported: gin, express, fastapi, spring\n", framework)
			os.Exit(1)
		}

		fmt.Printf("Scanning AST for %s routing patterns...\n", strings.Title(framework))

		routes := executeRouteQuery(queryStr, exts)

		// Output clean terminal table
		fmt.Println()
		w := tabwriter.NewWriter(os.Stdout, 0, 0, 4, ' ', 0)
		fmt.Fprintln(w, "METHOD\tROUTE PATH\tHANDLER FUNCTION")
		fmt.Fprintln(w, "------\t----------\t----------------")
		for _, r := range routes {
			fmt.Fprintf(w, "%s\t%s\t%s\n", r.Method, r.Path, r.HandlerPath)
		}
		w.Flush()
	},
}

func init() {
	routesCmd.Flags().StringVarP(&protocol, "protocol", "p", "", "The type of communication protocol (rest, grpc, graphql)")
	routesCmd.MarkFlagRequired("protocol")
	routesCmd.Flags().StringVarP(&framework, "framework", "f", "", "The routing framework to target (e.g. gin)")
	routesCmd.MarkFlagRequired("framework")
	rootCmd.AddCommand(routesCmd)
}

type RouteData struct {
	Method      string
	Path        string
	HandlerPath string
}

func loadOnboardIgnore() []string {
	ignores := []string{"node_modules", ".git", "dist", ".next", "build", ".cache"} // ALWAYS include defaults
	
	content, err := os.ReadFile(".onboardignore")
	if err == nil {
		lines := strings.Split(string(content), "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if line != "" && !strings.HasPrefix(line, "#") {
				ignores = append(ignores, line)
			}
		}
	}
	return ignores
}

func hasExt(exts []string, ext string) bool {
	for _, e := range exts {
		if e == ext {
			return true
		}
	}
	return false
}

func FastScan(path string, fw string) bool {
	f, err := os.Open(path)
	if err != nil {
		return false
	}
	defer f.Close()

	buf := make([]byte, 8192)
	n, _ := f.Read(buf)
	if n == 0 {
		return false
	}
	content := buf[:n]

	switch strings.ToLower(fw) {
	case "gin":
		return bytes.Contains(content, []byte("gin")) || bytes.Contains(content, []byte("GET")) || bytes.Contains(content, []byte("POST")) || bytes.Contains(content, []byte("PUT")) || bytes.Contains(content, []byte("DELETE")) || bytes.Contains(content, []byte("PATCH")) || bytes.Contains(content, []byte("OPTIONS")) || bytes.Contains(content, []byte("HEAD")) || bytes.Contains(content, []byte("Any"))
	case "express":
		return bytes.Contains(content, []byte("express")) || bytes.Contains(content, []byte("Router")) || bytes.Contains(content, []byte("get(")) || bytes.Contains(content, []byte("post(")) || bytes.Contains(content, []byte("put(")) || bytes.Contains(content, []byte("delete(")) || bytes.Contains(content, []byte("patch(")) || bytes.Contains(content, []byte("options(")) || bytes.Contains(content, []byte("head(")) || bytes.Contains(content, []byte("all("))
	case "fastapi":
		return bytes.Contains(content, []byte("fastapi")) || bytes.Contains(content, []byte("APIRouter")) || bytes.Contains(content, []byte("@app.")) || bytes.Contains(content, []byte("@router."))
	case "spring":
		return bytes.Contains(content, []byte("Mapping")) || bytes.Contains(content, []byte("RestController")) || bytes.Contains(content, []byte("@Controller"))
	}
	return true
}

func getFileHash(path string) string {
	f, err := os.Open(path)
	if err != nil {
		return ""
	}
	defer f.Close()
	h := sha256.New()
	if _, err := io.Copy(h, f); err != nil {
		return ""
	}
	return hex.EncodeToString(h.Sum(nil))
}

func executeRouteQuery(queryStr string, exts []string) []RouteData {
	engine := parser.NewEngine()
	lang := engine.Registry.GetLanguage("file" + exts[0])
	if lang == nil {
		fmt.Printf("Unsupported file extension for selected framework.\n")
		os.Exit(1)
	}

	q, err := sitter.NewQuery([]byte(queryStr), lang)
	if err != nil {
		fmt.Printf("Failed to compile tree-sitter query: %v\n", err)
		os.Exit(1)
	}
	defer q.Close()

	dbPath := filepath.Join(".onboard", "cache.db")
	db, err := store.InitDB(dbPath)
	if err != nil {
		fmt.Printf("Warning: failed to initialize cache DB: %v\n", err)
	}
	if db != nil {
		defer db.Close()
	}

	ignores := loadOnboardIgnore()

	jobs := make(chan string, 1000)
	results := make(chan []RouteData, 1000)
	var wg sync.WaitGroup

	numWorkers := runtime.NumCPU()
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for path := range jobs {
				if db != nil {
					hash := getFileHash(path)
					if store.CheckCache(db, path, hash) {
						cached, _ := store.GetCachedRoutes(db, path)
						if len(cached) > 0 {
							var res []RouteData
							for _, cr := range cached {
								res = append(res, RouteData{
									Method:      cr.Method,
									Path:        cr.Path,
									HandlerPath: cr.HandlerPath,
								})
							}
							results <- res
						}
						continue
					}

					// Not cached or changed, FastScan
					if !FastScan(path, framework) {
						store.UpdateCacheAndRoutes(db, path, hash, nil)
						continue
					}

					routes := parseFile(path, lang, q)
					if len(routes) > 0 {
						var cRoutes []store.CachedRoute
						for _, r := range routes {
							cRoutes = append(cRoutes, store.CachedRoute{
								Method:      r.Method,
								Path:        r.Path,
								HandlerPath: r.HandlerPath,
							})
						}
						store.UpdateCacheAndRoutes(db, path, hash, cRoutes)
						results <- routes
					} else {
						store.UpdateCacheAndRoutes(db, path, hash, nil)
					}
				} else {
					if !FastScan(path, framework) {
						continue
					}
					routes := parseFile(path, lang, q)
					if len(routes) > 0 {
						results <- routes
					}
				}
			}
		}()
	}

	go func() {
		filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return nil
			}
			if info.IsDir() {
				name := info.Name()
				for _, ignore := range ignores {
					if name == ignore {
						return filepath.SkipDir
					}
				}
				return nil
			}

			if !hasExt(exts, filepath.Ext(path)) {
				return nil
			}

			jobs <- path
			return nil
		})
		close(jobs)
	}()

	go func() {
		wg.Wait()
		close(results)
	}()

	var allRoutes []RouteData
	for r := range results {
		allRoutes = append(allRoutes, r...)
	}

	return allRoutes
}

func parseFile(path string, lang *sitter.Language, q *sitter.Query) []RouteData {
	content, err := os.ReadFile(path)
	if err != nil {
		return nil
	}

	p := sitter.NewParser()
	defer p.Close()
	p.SetLanguage(lang)
	tree, _ := p.ParseCtx(context.Background(), nil, content)
	defer tree.Close()

	qc := sitter.NewQueryCursor()
	defer qc.Close()
	qc.Exec(q, tree.RootNode())

	var routes []RouteData
	for {
		m, ok := qc.NextMatch()
		if !ok {
			break
		}
		m = qc.FilterPredicates(m, content)
		if len(m.Captures) == 0 {
			continue
		}

		var method, rpath, handler string
		for _, c := range m.Captures {
			name := q.CaptureNameForId(c.Index)
			text := c.Node.Content(content)
			switch name {
			case "method":
				method = string(text)
			case "path":
				rpath = string(text)
			case "handler":
				handlerStr := strings.TrimSpace(string(text))
				if idx := strings.Index(handlerStr, "\n"); idx != -1 {
					handlerStr = strings.TrimSpace(handlerStr[:idx])
					if len(handlerStr) > 50 {
						handlerStr = handlerStr[:47] + "..."
					} else {
						handlerStr += " ..."
					}
				} else if len(handlerStr) > 50 {
					handlerStr = handlerStr[:47] + "..."
				}
				handler = handlerStr
			}
		}

		if method != "" && rpath != "" && handler != "" {
			routes = append(routes, RouteData{
				Method:      method,
				Path:        rpath,
				HandlerPath: filepath.Base(path) + ":" + handler,
			})
		}
	}
	return routes
}
