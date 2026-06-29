package cmd

import (
	"fmt"
	"os"

	"github.com/onboard-cli/internal/store"
	"github.com/spf13/cobra"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Scans the current workspace, initializes local data cache, identifies entry points",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("[INFO] Initializing Onboard-CLI in current directory...")

		// 1. Create .onboard directory
		err := os.MkdirAll(".onboard", 0755)
		if err != nil {
			fmt.Printf("[ERROR] Failed to create .onboard directory: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("[OK] Created .onboard directory structure.")

		// 2. Generate onboard.yaml
		yamlContent := []byte(`version: 1
project: my-project
ignore:
  - vendor/
  - node_modules/
`)
		err = os.WriteFile("onboard.yaml", yamlContent, 0644)
		if err != nil {
			fmt.Printf("[ERROR] Failed to create onboard.yaml: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("[OK] Generated onboard.yaml default configuration.")

		// 3. Initialize SQLite cache
		db, err := store.InitDB(".onboard/cache.db")
		if err != nil {
			fmt.Printf("[ERROR] Failed to initialize cache DB: %v\n", err)
			os.Exit(1)
		}
		db.Close()
		fmt.Println("[OK] Initialized cache.db SQLite schema.\n")
		fmt.Println("Initialization complete! Run 'onboard map' to start building your AST graph.")
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}
