package parser

import (
	"path/filepath"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/golang"
	"github.com/smacker/go-tree-sitter/java"
	"github.com/smacker/go-tree-sitter/javascript"
	"github.com/smacker/go-tree-sitter/python"
)

// LanguageRegistry maps file extensions to tree-sitter languages
type LanguageRegistry struct {
	languages map[string]*sitter.Language
}

// NewLanguageRegistry initializes the supported universal grammars
func NewLanguageRegistry() *LanguageRegistry {
	goLang := golang.GetLanguage()
	jsLang := javascript.GetLanguage()
	pyLang := python.GetLanguage()
	javaLang := java.GetLanguage()
	return &LanguageRegistry{
		languages: map[string]*sitter.Language{
			".go":  goLang,
			".js":  jsLang,
			".mjs": jsLang,
			".cjs": jsLang,
			".jsx": jsLang,
			".ts":  jsLang, // TypeScript uses JS grammar in smacker
			".tsx": jsLang,
			".py":  pyLang,
			".java": javaLang,
		},
	}
}

// GetLanguage returns the tree-sitter language for a given file extension
func (r *LanguageRegistry) GetLanguage(filename string) *sitter.Language {
	ext := filepath.Ext(filename)
	return r.languages[ext]
}

// interestingNodes is the expanded universal mapping of interesting AST node types.
var interestingNodes = map[string]bool{
	// ── Go ──────────────────────────────────────────────────────────
	"function_declaration":  true, // func foo() {}
	"method_declaration":    true, // func (r Recv) foo() {}
	"func_literal":          true, // anonymous func inside var/run
	"type_declaration":      true, // type Foo struct / type Bar interface
	"type_spec":             true, // Foo struct{...} inside type_declaration
	"var_declaration":       true, // var foo = ...
	"const_declaration":     true, // const foo = ...
	"short_var_declaration": true, // foo := ...

	// ── JavaScript / TypeScript ──────────────────────────────────────
	"function_expression":        true, // const f = function() {}
	"arrow_function":             true, // const f = () => {}
	"class_declaration":          true, // class Foo {}
	"method_definition":          true, // inside class body
	"export_statement":           true, // export default / export function
	"lexical_declaration":        true, // const/let at top-level
	"variable_declaration":       true, // var at top-level
	"interface_declaration":      true, // TypeScript interface Foo {}
	"type_alias_declaration":     true, // TypeScript type Foo = ...
	"enum_declaration":           true, // TypeScript enum Foo {}
	"abstract_class_declaration": true, // TypeScript abstract class

	// ── Python ───────────────────────────────────────────────────────
	"function_definition":  true, // def foo():
	"class_definition":     true, // class Foo:
	"decorated_definition": true, // @decorator\ndef/class

	// ── Java ─────────────────────────────────────────────────────────
	"annotation": true,
}

// IsNodeInteresting checks if a node is a high-level architectural node we want to map.
func (r *LanguageRegistry) IsNodeInteresting(nodeType string) bool {
	return interestingNodes[nodeType]
}
