package cmd

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"regexp"

	"github.com/onboard-cli/internal/parser"
	sitter "github.com/smacker/go-tree-sitter"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

var rulesFile string

type ArchitectureRules struct {
	Boundaries map[string]string `yaml:"boundaries"`
	Rules      []struct {
		Source       string `yaml:"source"`
		CannotImport string `yaml:"cannot_import"`
		Message      string `yaml:"message"`
	} `yaml:"rules"`
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

var importQueries = map[string]string{
	".go":   `(import_spec path: (interpreted_string_literal) @import)`,
	".js":   `(import_statement source: (string) @import)`,
	".ts":   `(import_statement source: (string) @import)`,
	".py":   `(import_from_statement module_name: (dotted_name) @import) (import_statement name: (dotted_name) @import)`,
	".java": `(import_declaration (scoped_identifier) @import)`,
}

func detectDrift(rules *ArchitectureRules) []Violation {
	var violations []Violation

	boundaryRegexes := make(map[string]*regexp.Regexp)
	for name, pattern := range rules.Boundaries {
		boundaryRegexes[name] = regexp.MustCompile(pattern)
	}

	engine := parser.NewEngine()

	filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			if info != nil && info.IsDir() && (info.Name() == "node_modules" || info.Name() == ".git" || info.Name() == "dist") {
				return filepath.SkipDir
			}
			return nil
		}

		ext := filepath.Ext(path)
		queryStr, supported := importQueries[ext]
		if !supported {
			return nil
		}

		lang := engine.Registry.GetLanguage(path)
		if lang == nil {
			return nil
		}

		q, err := sitter.NewQuery([]byte(queryStr), lang)
		if err != nil {
			return nil // invalid query for lang
		}

		content, err := os.ReadFile(path)
		if err != nil {
			return nil
		}

		p := sitter.NewParser()
		p.SetLanguage(lang)
		tree, _ := p.ParseCtx(context.Background(), nil, content)

		qc := sitter.NewQueryCursor()
		qc.Exec(q, tree.RootNode())

		for {
			m, ok := qc.NextMatch()
			if !ok {
				break
			}
			m = qc.FilterPredicates(m, content)
			for _, c := range m.Captures {
				importPath := string(c.Node.Content(content))
				lineNum := int(c.Node.StartPoint().Row + 1)

				// Determine from_boundary (based on file path)
				var fromBoundary string
				// normalize path slashes for regex matching
				normalizedPath := filepath.ToSlash(path)
				for name, regex := range boundaryRegexes {
					if regex.MatchString(normalizedPath) {
						fromBoundary = name
						break
					}
				}

				// Determine to_boundary (based on import string)
				var toBoundary string
				for name, regex := range boundaryRegexes {
					if regex.MatchString(importPath) {
						toBoundary = name
						break
					}
				}

				if fromBoundary != "" && toBoundary != "" {
					// Check rules
					for _, rule := range rules.Rules {
						if rule.Source == fromBoundary && rule.CannotImport == toBoundary {
							violations = append(violations, Violation{
								File:    path,
								LineNum: lineNum,
								From:    fromBoundary,
								To:      toBoundary,
								Rule:    rule.Message,
							})
						}
					}
				}
			}
		}
		return nil
	})

	return violations
}
