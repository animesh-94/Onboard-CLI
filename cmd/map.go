package cmd

import (
	"fmt"

	"github.com/onboard-cli/internal/graph"
	"github.com/onboard-cli/internal/parser"
	"github.com/onboard-cli/internal/server"
	"github.com/spf13/cobra"
)

var (
	target string
	radius int
)

var mapCmd = &cobra.Command{
	Use:   "map",
	Short: "Triggers context engine and boots up the local visualizer server",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Mapping context for target: %s with radius: %d\n", target, radius)

		// Context engine trigger
		fmt.Println("--- AST Slicing Engine ---")
		eng := parser.NewEngine()
		nodes, edges, err := eng.Parse(target)

		topology := &graph.Topology{
			Nodes: nodes,
			Edges: edges,
		}

		if err != nil {
			fmt.Printf("Parser error: %v\n", err)
		} else {
			fmt.Printf("Successfully parsed %d structural nodes and %d edge connections.\n", len(nodes), len(edges))
			for _, n := range nodes {
				fmt.Printf(" - [Line %d] %s (ID: %s)\n", n.LineNum, n.Label, n.ID)
			}
		}
		fmt.Println("--------------------------")

		// Boot up the visualizer server
		fmt.Println("Starting visualizer server...")
		fmt.Println("👉 Click here to view the canvas: http://localhost:3000/app")
		srv := server.NewServer(":3000", topology)
		if err := srv.Start(); err != nil {
			fmt.Printf("Error starting server: %v\n", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(mapCmd)
	mapCmd.Flags().StringVar(&target, "target", "", "Symbol or path to map (required)")
	mapCmd.MarkFlagRequired("target")
	mapCmd.Flags().IntVar(&radius, "radius", 1, "Topological distance radius for pruning (default 1)")
}
