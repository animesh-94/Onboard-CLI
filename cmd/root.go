package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "onboard",
	Short: "Onboard-CLI - Developer platform for code parsing and graph visualization",
	Long:  `Onboard-CLI combines code parsing, systems profiling, and canvas-based node visualization.`,
}

func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	// Root flags and config
}
