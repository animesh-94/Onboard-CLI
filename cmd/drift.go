package cmd

import (
	"fmt"
	"os"
	"regexp"

	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

var rulesFile string

// ArchitectureRules defines the structure for our drift YAML file
type ArchitectureRules struct {
	Boundaries   map[string]string `yaml:"boundaries"`
	Restrictions []struct {
		From         string   `yaml:"from"`
		CannotAccess []string `yaml:"cannot_access"`
	} `yaml:"restrictions"`
}

var driftCmd = &cobra.Command{
	Use:   "drift",
	Short: "Detects architectural violations based on a YAML ruleset",
	Run: func(cmd *cobra.Command, args []string) {
		rules, err := parseRules(rulesFile)
		if err != nil {
			fmt.Printf("Error parsing rules: %v\n", err)
			os.Exit(1)
		}

		fmt.Printf("Analyzing drift using ruleset: %s\n", rulesFile)

		// 1. Load the AST Graph (Stubbed)
		// graph := parser.LoadGraph(".onboard/cache.db")

		// 2. Cross-reference cross-file imports against ruleset
		violations := detectDrift(rules)

		// 3. Output violations
		if len(violations) > 0 {
			fmt.Println("\n❌ Architectural Violations Detected:")
			for _, v := range violations {
				fmt.Printf(" - [Line %d] %s: %s cannot import %s (Rule broken: %s)\n", v.LineNum, v.File, v.From, v.To, v.Rule)
			}
			os.Exit(1)
		} else {
			fmt.Println("\n✅ No architectural violations detected.")
		}
	},
}

func init() {
	driftCmd.Flags().StringVarP(&rulesFile, "rules", "r", "architecture.yml", "Path to the architecture rules YAML file")
	rootCmd.AddCommand(driftCmd)
}

func parseRules(filepath string) (*ArchitectureRules, error) {
	data, err := os.ReadFile(filepath)
	if err != nil {
		return nil, err
	}

	var rules ArchitectureRules
	if err := yaml.Unmarshal(data, &rules); err != nil {
		return nil, err
	}
	return &rules, nil
}

// Violation represents an architectural rule break
type Violation struct {
	File    string
	LineNum int
	From    string
	To      string
	Rule    string
}

// detectDrift simulates cross-referencing the AST graph against the YAML rules
func detectDrift(rules *ArchitectureRules) []Violation {
	var violations []Violation

	// Example implementation logic:
	// 1. Compile boundary regexes
	boundaryRegexes := make(map[string]*regexp.Regexp)
	for name, pattern := range rules.Boundaries {
		boundaryRegexes[name] = regexp.MustCompile(pattern)
	}

	// 2. Iterate through AST Graph Edges (Imports)
	// For each edge (A imports B):
	//   Identify which boundary A belongs to.
	//   Identify which boundary B belongs to.
	//   Check if rules.Restrictions prohibits A -> B.
	//   If yes, append to violations.

	return violations
}
