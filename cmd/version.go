package cmd

import (
	"fmt"
	"runtime"

	"github.com/spf13/cobra"
)

// Version gets populated via ldflags at build time during GitHub Actions release.
// When running locally, it defaults to "dev" unless specified.
var Version = "dev"

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the current version of Onboard-CLI",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Onboard-CLI version %s %s/%s\n", Version, runtime.GOOS, runtime.GOARCH)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
