package cmd

import (
	"os"

	"github.com/onboard-cli/internal/version"
	"github.com/spf13/cobra"
)

var noUpdateCheck bool

var rootCmd = &cobra.Command{
	Use:   "onboard",
	Short: "Onboard-CLI - Developer platform for code parsing and graph visualization",
	Long:  `Onboard-CLI combines code parsing, systems profiling, and canvas-based node visualization.`,
}

func Execute() {
	if !noUpdateCheck {
		version.CheckVersionAsync()
	}

	err := rootCmd.Execute()

	if !noUpdateCheck {
		version.NotifyIfUpdateAvailable()
	}

	if err != nil {
		os.Exit(1)
	}
}

func init() {
	rootCmd.PersistentFlags().BoolVar(&noUpdateCheck, "no-update-check", false, "Disable async version checking")
}
