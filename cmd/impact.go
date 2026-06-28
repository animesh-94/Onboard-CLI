package cmd

import (
	"fmt"
	"os"

	"github.com/onboard-cli/internal/impact"
	"github.com/spf13/cobra"
)

var impactTarget string

var impactCmd = &cobra.Command{
	Use:   "impact",
	Short: "Prevent breaking changes by mapping reverse-dependency blast radius",
	Run: func(cmd *cobra.Command, args []string) {
		if impactTarget == "" {
			fmt.Println("Error: --target is required")
			os.Exit(1)
		}

		fmt.Printf("Analyzing blast radius for function signature: %s...\n", impactTarget)
		result, err := impact.Analyze(impactTarget, ".")
		if err != nil {
			fmt.Printf("Error analyzing impact: %v\n", err)
			os.Exit(1)
		}

		fmt.Println(impact.FormatTerminal(result))
	},
}

func init() {
	rootCmd.AddCommand(impactCmd)
	impactCmd.Flags().StringVar(&impactTarget, "target", "", "Target function signature to trace")
	impactCmd.MarkFlagRequired("target")
}
