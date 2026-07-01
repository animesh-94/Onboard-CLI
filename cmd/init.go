package cmd

import (
	"fmt"
	"os"

	"github.com/onboard-cli/internal/store"
	"github.com/spf13/cobra"
)

var archTemplate string

var (
	archGeneric = `version: 1
boundaries:
  # Example generic boundaries
  - name: Domain
    paths: ["internal/domain/**"]
    allowed_imports: [] # Domain should be isolated
  - name: App
    paths: ["internal/app/**"]
    allowed_imports: ["internal/domain"]
`

	archCleanArchitecture = `version: 1
boundaries:
  - name: domain
    paths: ["domain/**", "core/**"]
    forbidden_imports: ["infrastructure/**", "adapters/**"]
  - name: usecases
    paths: ["usecases/**"]
    allowed_imports: ["domain/**"]
    forbidden_imports: ["infrastructure/**"]
  - name: infrastructure
    paths: ["infrastructure/**", "adapters/**"]
    allowed_imports: ["usecases/**", "domain/**"]
`

	archModularMonolith = `version: 1
boundaries:
  - name: billing_module
    paths: ["modules/billing/**"]
    allowed_imports: ["pkg/**", "interfaces/**"]
    forbidden_imports: ["modules/users/**", "modules/orders/**"]
  - name: users_module
    paths: ["modules/users/**"]
    allowed_imports: ["pkg/**", "interfaces/**"]
    forbidden_imports: ["modules/billing/**", "modules/orders/**"]
`

	archMVC = `version: 1
boundaries:
  - name: views
    paths: ["views/**"]
    forbidden_imports: ["models/**", "database/**"]
  - name: controllers
    paths: ["controllers/**"]
    allowed_imports: ["models/**", "views/**"]
  - name: models
    paths: ["models/**"]
    allowed_imports: ["database/**"]
`

	archServerless = `version: 1
boundaries:
  - name: handlers
    paths: ["handlers/*"]
    allowed_imports: ["shared/**", "core/**"]
    forbidden_imports: ["handlers/**"]
`
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Scans the current workspace, initializes local data cache, identifies entry points",
	Run: func(cmd *cobra.Command, args []string) {
		var archContent string
		switch archTemplate {
		case "generic":
			archContent = archGeneric
		case "clean-architecture":
			archContent = archCleanArchitecture
		case "modular-monolith":
			archContent = archModularMonolith
		case "mvc":
			archContent = archMVC
		case "serverless":
			archContent = archServerless
		default:
			fmt.Printf("[ERROR] Invalid template '%s' provided. Valid options are:\n", archTemplate)
			fmt.Println("  - generic")
			fmt.Println("  - clean-architecture")
			fmt.Println("  - modular-monolith")
			fmt.Println("  - mvc")
			fmt.Println("  - serverless")
			os.Exit(1)
		}

		const banner = `
   ____        __                         __
  / __ \____  / /_  ____  ____ __________/ /
 / / / / __ \/ __ \/ __ \/ __ ` + "`" + `/ ___/ __  /
/ /_/ / / / / /_/ / /_/ / /_/ / /  / /_/ / 
\____/_/ /_/_.___/\____/\__,_/_/   \__,_/  
`
		fmt.Println(banner)
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

		// 3. Generate architecture.yaml
		err = os.WriteFile("architecture.yaml", []byte(archContent), 0644)
		if err != nil {
			fmt.Printf("[ERROR] Failed to create architecture.yaml: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("[OK] Generated architecture.yaml using '%s' template.\n", archTemplate)

		// 4. Initialize SQLite cache
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
	initCmd.Flags().StringVar(&archTemplate, "template", "generic", "Template for architecture.yaml (generic, clean-architecture, modular-monolith, mvc, serverless)")
}
