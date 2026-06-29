package parser

import (
	"context"
	"crypto/sha256"
	"fmt"
	"os"
	"path/filepath"

	"github.com/onboard-cli/internal/store"
	sitter "github.com/smacker/go-tree-sitter"
)

type SymbolExtractor struct {
	Engine *Engine
}

func NewSymbolExtractor(engine *Engine) *SymbolExtractor {
	return &SymbolExtractor{Engine: engine}
}

func generateNodeID(filePath string, lineNum int, name string) string {
	hash := sha256.Sum256([]byte(fmt.Sprintf("%s:%d:%s", filePath, lineNum, name)))
	return fmt.Sprintf("%x", hash)[:16]
}

func (e *SymbolExtractor) Extract(target string) ([]store.DBNode, error) {
	lang := e.Engine.Registry.GetLanguage(target)
	if lang == nil {
		return nil, fmt.Errorf("unsupported language for file: %s", target)
	}

	content, err := os.ReadFile(target)
	if err != nil {
		return nil, err
	}

	parser := sitter.NewParser()
	parser.SetLanguage(lang)
	tree, _ := parser.ParseCtx(context.Background(), nil, content)

	var nodes []store.DBNode
	seen := map[string]bool{}

	var walk func(node *sitter.Node)
	walk = func(node *sitter.Node) {
		nodeType := node.Type()
		
		// Map standard AST nodes to graph nodes
		if e.Engine.Registry.IsNodeInteresting(nodeType) {
			if topLevelOnly[nodeType] && isInsideFunction(node) {
				for i := 0; i < int(node.ChildCount()); i++ {
					walk(node.Child(i))
				}
				return
			}

			name := extractName(node, content)
			if name == "" {
				name = nodeType
			}

			lineNum := int(node.StartPoint().Row + 1)
			id := generateNodeID(target, lineNum, name)
			
			if !seen[id] {
				seen[id] = true
				nodes = append(nodes, store.DBNode{
					ID:         id,
					Type:       kindFor(nodeType),
					Name:       name,
					FilePath:   filepath.ToSlash(target),
					LineNumber: lineNum,
				})
			}
		}

		for i := 0; i < int(node.ChildCount()); i++ {
			walk(node.Child(i))
		}
	}

	walk(tree.RootNode())
	return nodes, nil
}
