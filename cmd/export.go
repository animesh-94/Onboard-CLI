package cmd

import (
	"fmt"
	"os"
	"strings"

	"github.com/onboard-cli/internal/export"
	"github.com/onboard-cli/internal/store"
	"github.com/spf13/cobra"
)

var (
	formatFlag string
	outputFlag string
	depthFlag  int
	nodeFlag   string
)

var exportCmd = &cobra.Command{
	Use:   "export",
	Short: "Export the architecture graph to various formats",
	Run: func(cmd *cobra.Command, args []string) {
		db, err := store.InitDB(".onboard/cache.db")
		if err != nil {
			fmt.Printf("Error opening cache DB: %v\n", err)
			os.Exit(1)
		}
		defer db.Close()

		nodes, edges, err := store.GetGraph(db, nodeFlag, depthFlag)
		if err != nil {
			fmt.Printf("Error retrieving graph: %v\n", err)
			os.Exit(1)
		}

		if len(nodes) == 0 {
			fmt.Println("Graph is empty. Please run 'onboard map' or ensure the DB is populated.")
			os.Exit(1)
		}

		var exporter export.Exporter
		switch strings.ToLower(formatFlag) {
		case "mermaid":
			exporter = &export.MermaidExporter{}
		case "dot":
			exporter = &export.DOTExporter{}
		case "json":
			exporter = &export.JSONExporter{}
		case "png":
			if outputFlag == "" {
				fmt.Println("Error: --output flag is required for PNG format to prevent binary dump to terminal.")
				os.Exit(1)
			}
			exporter = &export.PNGExporter{}
		default:
			fmt.Printf("Unsupported format: %s. Supported formats: mermaid, dot, json, png.\n", formatFlag)
			os.Exit(1)
		}

		result, err := exporter.Export(nodes, edges)
		if err != nil {
			fmt.Printf("Error exporting graph: %v\n", err)
			os.Exit(1)
		}

		if outputFlag != "" {
			err = os.WriteFile(outputFlag, []byte(result), 0644)
			if err != nil {
				fmt.Printf("Error writing to file: %v\n", err)
				os.Exit(1)
			}
			fmt.Printf("Exported successfully to %s\n", outputFlag)
		} else {
			fmt.Println(result)
		}
	},
}

func init() {
	rootCmd.AddCommand(exportCmd)
	exportCmd.Flags().StringVar(&formatFlag, "format", "json", "Output format (mermaid, dot, json, png)")
	exportCmd.Flags().StringVar(&outputFlag, "output", "", "Output file path (default stdout)")
	exportCmd.Flags().IntVar(&depthFlag, "depth", 0, "Depth for BFS traversal (0 for full graph)")
	exportCmd.Flags().StringVar(&nodeFlag, "node", "", "Starting node ID for BFS traversal")
}
