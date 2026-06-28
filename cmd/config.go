package cmd

import (
	"fmt"
	"os"

	"github.com/onboard-cli/internal/config"
	"github.com/spf13/cobra"
)

var configVar string

var configCmd = &cobra.Command{
	Use:   "config",
	Short: "Trace where a specific configuration variable is defined and used",
	Run: func(cmd *cobra.Command, args []string) {
		if configVar == "" {
			fmt.Println("Error: --var is required")
			os.Exit(1)
		}

		fmt.Printf("Tracing configuration variable %s...\n", configVar)
		result, err := config.Trace(configVar, ".")
		if err != nil {
			fmt.Printf("Error tracing config: %v\n", err)
			os.Exit(1)
		}

		fmt.Println(config.FormatTerminal(result))
	},
}

func init() {
	rootCmd.AddCommand(configCmd)
	configCmd.Flags().StringVar(&configVar, "var", "", "Target ENV var or config key")
	configCmd.MarkFlagRequired("var")
}
