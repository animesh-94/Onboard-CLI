package parser

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/onboard-cli/internal/graph"
	sitter "github.com/smacker/go-tree-sitter"
)

// Engine handles the AST parsing logic using tree-sitter.
type Engine struct {
	Registry *LanguageRegistry
}

// NewEngine creates a new parsing engine.
func NewEngine() *Engine {
	return &Engine{
		Registry: NewLanguageRegistry(),
	}
}

// kindFor maps raw tree-sitter node types to a clean, human-readable kind string.
func kindFor(nodeType string) string {
	switch nodeType {
	case "function_declaration", "function_definition", "function_expression":
		return "function"
	case "method_declaration", "method_definition":
		return "method"
	case "func_literal", "arrow_function":
		return "closure"
	case "class_declaration", "class_definition", "abstract_class_declaration":
		return "class"
	case "type_declaration", "type_spec", "type_alias_declaration":
		return "type"
	case "interface_declaration":
		return "interface"
	case "enum_declaration":
		return "enum"
	case "decorated_definition":
		return "decorated"
	default:
		return "symbol"
	}
}

// topLevelOnly contains node types that we only want at the top-level scope,
// NOT when they appear nested inside function bodies.
var topLevelOnly = map[string]bool{
	"short_var_declaration": true,
	"var_declaration":       true,
	"const_declaration":     true,
	"lexical_declaration":   true,
	"variable_declaration":  true,
}

// isInsideFunction returns true if any ancestor of node is a function/closure body.
func isInsideFunction(node *sitter.Node) bool {
	parent := node.Parent()
	for parent != nil {
		t := parent.Type()
		if t == "block" || t == "function_body" || t == "statement_block" {
			return true
		}
		parent = parent.Parent()
	}
	return false
}

// extractName pulls the human-readable symbol name from a node.
func extractName(node *sitter.Node, src []byte) string {
	if nameNode := node.ChildByFieldName("name"); nameNode != nil {
		return nameNode.Content(src)
	}
	for i := 0; i < int(node.NamedChildCount()); i++ {
		child := node.NamedChild(i)
		switch child.Type() {
		case "var_spec", "const_spec":
			if id := child.ChildByFieldName("name"); id != nil {
				return id.Content(src)
			}
		case "type_spec":
			if id := child.ChildByFieldName("name"); id != nil {
				return id.Content(src)
			}
		case "identifier":
			return child.Content(src)
		}
	}
	return ""
}

// Parse orchestrates the AST slicing for a given target file.
func (e *Engine) Parse(target string) ([]graph.Node, error) {
	lang := e.Registry.GetLanguage(target)
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

	baseName := filepath.Base(target)
	var nodes []graph.Node
	seen := map[string]bool{}

	var walk func(node *sitter.Node)
	walk = func(node *sitter.Node) {
		nodeType := node.Type()
		if e.Registry.IsNodeInteresting(nodeType) {
			// Skip internal variable declarations inside function bodies
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

			id := fmt.Sprintf("%s:%d", target, node.StartPoint().Row)
			if !seen[id] {
				seen[id] = true
				nodes = append(nodes, graph.Node{
					ID:       id,
					Label:    name,
					Kind:     kindFor(nodeType),
					NodeType: "CodeBlock",
					Path:     target,
					File:     baseName,
					LineNum:  int(node.StartPoint().Row + 1),
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
