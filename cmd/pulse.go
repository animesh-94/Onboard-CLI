package cmd

import (
	"fmt"
	"os"

	"github.com/onboard-cli/internal/pulse"
	"github.com/spf13/cobra"
)

var pulseDir string

var pulseCmd = &cobra.Command{
	Use:   "pulse",
	Short: "Check for dead/stale code and identify hot zones",
	Run: func(cmd *cobra.Command, args []string) {
		if pulseDir == "" {
			pulseDir = "." // Default to current directory
		}

		fmt.Printf("Analyzing code pulse in %s...\n", pulseDir)
		result, err := pulse.Analyze(pulseDir)
		if err != nil {
			fmt.Printf("Error checking pulse: %v\n", err)
			os.Exit(1)
		}

		fmt.Println(pulse.FormatTerminal(result))
	},
}

func init() {
	rootCmd.AddCommand(pulseCmd)
	pulseCmd.Flags().StringVar(&pulseDir, "dir", ".", "Target directory to analyze")
}
