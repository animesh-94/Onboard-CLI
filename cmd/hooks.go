package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

const hookPayload = `
# --- ONBOARD-CLI PRE-COMMIT HOOK START ---
echo "🔍 Onboard-CLI: Checking architectural drift..."
onboard drift
if [ $? -ne 0 ]; then
  echo "❌ Commit blocked: Architectural boundaries violated."
  echo "   Fix the invalid imports, or bypass using 'git commit --no-verify' in emergencies."
  exit 1
fi
# --- ONBOARD-CLI PRE-COMMIT HOOK END ---
`

var hooksCmd = &cobra.Command{
	Use:   "hooks",
	Short: "Manage Git hooks for Onboard-CLI",
}

var hooksInstallCmd = &cobra.Command{
	Use:   "install",
	Short: "Install the Onboard-CLI pre-commit hook to enforce architectural boundaries locally",
	Run: func(cmd *cobra.Command, args []string) {
		// 1. Locate Git
		gitHooksDir := filepath.Join(".git", "hooks")
		if _, err := os.Stat(gitHooksDir); os.IsNotExist(err) {
			fmt.Println("[ERROR] Not a Git repository (or no .git/hooks directory found). Please run 'git init' first.")
			os.Exit(1)
		}

		preCommitPath := filepath.Join(gitHooksDir, "pre-commit")

		// 2. Idempotency Check
		if content, err := os.ReadFile(preCommitPath); err == nil {
			if strings.Contains(string(content), "# --- ONBOARD-CLI PRE-COMMIT HOOK START ---") {
				fmt.Println("[INFO] Hook already installed in .git/hooks/pre-commit.")
				return
			}
		}

		// 3. Safe Append
		// Use os.O_APPEND | os.O_CREATE | os.O_WRONLY to append or create safely
		f, err := os.OpenFile(preCommitPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0755)
		if err != nil {
			fmt.Printf("[ERROR] Failed to open pre-commit file for writing: %v\n", err)
			os.Exit(1)
		}
		defer f.Close()

		// If the file is brand new, make sure it has a shebang
		stat, _ := f.Stat()
		isNewFile := stat.Size() == 0

		payload := hookPayload
		if isNewFile {
			payload = "#!/bin/sh\n" + payload
		} else {
			payload = "\n" + payload
		}

		if _, err := f.WriteString(payload); err != nil {
			fmt.Printf("[ERROR] Failed to write to pre-commit file: %v\n", err)
			os.Exit(1)
		}

		// 4. Permissions
		if err := os.Chmod(preCommitPath, 0755); err != nil {
			fmt.Printf("[WARNING] Successfully installed hook, but failed to make it executable. Please run 'chmod +x %s'\n", preCommitPath)
		} else {
			fmt.Println("[OK] Successfully installed Onboard-CLI pre-commit hook!")
			fmt.Println("     Architectural boundaries will now be verified before every commit.")
		}
	},
}

func init() {
	rootCmd.AddCommand(hooksCmd)
	hooksCmd.AddCommand(hooksInstallCmd)
}
