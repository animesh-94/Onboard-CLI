package cmd

import (
	"fmt"
	"os"
	"text/tabwriter"

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
		if framework != "gin" {
			fmt.Printf("Currently only the 'gin' framework is supported.\n")
			os.Exit(1)
		}

		fmt.Println("Scanning AST for Gin routing patterns...")

		// Tree-sitter S-expression query for Gin routes
		// Looks for: router.<METHOD>("<PATH>", <HANDLER>)
		// e.g., r.GET("/api/data", handler)
		queryStr := `
		(call_expression
			function: (selector_expression
				operand: (identifier) @router
				field: (field_identifier) @method
				(#match? @method "^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)$")
			)
			arguments: (argument_list
				(interpreted_string_literal) @path
				(identifier) @handler
			)
		)
		`

		// Execute the Tree-sitter query (Stubbed execution)
		routes := executeRouteQuery(queryStr)

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

func executeRouteQuery(query string) []RouteData {
	// 1. Initialize tree-sitter parser for Go
	// 2. Parse the AST
	// 3. Create a query object from `queryStr`
	// 4. Iterate over query matches and extract @method, @path, and @handler

	// Stubbed return data for visual output
	return []RouteData{
		{Method: "GET", Path: "\"/api/data\"", HandlerPath: "/internal/api/handlers.go:GetData"},
		{Method: "POST", Path: "\"/api/users\"", HandlerPath: "/internal/api/users.go:CreateUser"},
	}
}
