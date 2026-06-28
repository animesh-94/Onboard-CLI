package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Scans the current workspace, initializes local data cache, identifies entry points",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Initializing Onboard-CLI workspace...")
		// TODO: Workspace scan, cache initialization, entry point identification
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}
