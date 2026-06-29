package cmd

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"text/tabwriter"

	"github.com/onboard-cli/internal/parser"
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
		var ext string

		switch strings.ToLower(framework) {
		case "gin":
			ext = ".go"
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
			ext = ".js"
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
			ext = ".py"
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
			ext = ".java"
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

		routes := executeRouteQuery(queryStr, ext)

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

func executeRouteQuery(queryStr string, ext string) []RouteData {
	engine := parser.NewEngine()
	lang := engine.Registry.GetLanguage("file" + ext)
	if lang == nil {
		fmt.Printf("Unsupported file extension for selected framework.\n")
		os.Exit(1)
	}

	q, err := sitter.NewQuery([]byte(queryStr), lang)
	if err != nil {
		fmt.Printf("Failed to compile tree-sitter query: %v\n", err)
		os.Exit(1)
	}

	var routes []RouteData
	
	filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			name := info.Name()
			if name == "node_modules" || name == ".git" || name == "dist" {
				return filepath.SkipDir
			}
			return nil
		}
		
		if filepath.Ext(path) != ext {
			return nil
		}
		
		content, err := os.ReadFile(path)
		if err != nil {
			return nil
		}

		p := sitter.NewParser()
		p.SetLanguage(lang)
		tree, _ := p.ParseCtx(context.Background(), nil, content)

		qc := sitter.NewQueryCursor()
		qc.Exec(q, tree.RootNode())

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
					handler = string(text)
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
		
		return nil
	})

	return routes
}
