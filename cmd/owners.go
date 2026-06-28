package cmd

import (
	"fmt"
	"os"

	"github.com/onboard-cli/internal/owners"
	"github.com/spf13/cobra"
)

var ownersTarget string

var ownersCmd = &cobra.Command{
	Use:   "owners",
	Short: "Solve the 'Who do I ask?' problem by computing git ownership",
	Run: func(cmd *cobra.Command, args []string) {
		if ownersTarget == "" {
			fmt.Println("Error: --target is required")
			os.Exit(1)
		}

		fmt.Printf("Analyzing git history for %s...\n", ownersTarget)
		result, err := owners.Analyze(ownersTarget)
		if err != nil {
			fmt.Printf("Error analyzing owners: %v\n", err)
			os.Exit(1)
		}

		fmt.Println(owners.FormatTerminal(result))
	},
}

func init() {
	rootCmd.AddCommand(ownersCmd)
	ownersCmd.Flags().StringVar(&ownersTarget, "target", "", "Target file or module to analyze")
	ownersCmd.MarkFlagRequired("target")
}
