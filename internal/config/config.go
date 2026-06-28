package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// TraceStep is one hop in the config resolution path.
type TraceStep struct {
	Source   string // e.g. ".env", "docker-compose.yml", "config.yaml"
	FilePath string
	Line     int
	Value    string // raw line showing the var definition or usage
}

// Result is the full config trace.
type Result struct {
	VarName string
	Steps   []TraceStep
}

// configFileExts are the config file patterns we scan.
var configFiles = []string{
	".env", ".env.local", ".env.development", ".env.production",
	"docker-compose.yml", "docker-compose.yaml",
	"config.yml", "config.yaml",
	"settings.yml", "settings.yaml",
	"application.yml", "application.yaml",
}

var sourceExts = map[string]bool{
	".go": true, ".js": true, ".ts": true, ".tsx": true, ".jsx": true, ".py": true,
}

// Trace locates varName across config files and source references under rootDir.
func Trace(varName string, rootDir string) (*Result, error) {
	result := &Result{VarName: varName}

	// ── Stage 1: scan known config files ──────────────────────────────
	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return nil
		}
		base := filepath.Base(path)
		isConfig := false
		for _, cf := range configFiles {
			if base == cf || strings.HasSuffix(base, ".env") {
				isConfig = true
				break
			}
		}
		if !isConfig {
			return nil
		}

		raw, err := os.ReadFile(path)
		if err != nil {
			return nil
		}
		lines := strings.Split(string(raw), "\n")
		for i, line := range lines {
			if strings.Contains(line, varName) {
				result.Steps = append(result.Steps, TraceStep{
					Source:   base,
					FilePath: path,
					Line:     i + 1,
					Value:    strings.TrimSpace(line),
				})
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	// ── Stage 2: scan source code for runtime usage ────────────────────
	err = filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return nil
		}
		if !sourceExts[filepath.Ext(path)] {
			return nil
		}
		raw, err := os.ReadFile(path)
		if err != nil {
			return nil
		}
		content := string(raw)
		// Look for common patterns: os.Getenv, process.env.X, os.environ[...]
		patterns := []string{
			fmt.Sprintf(`os.Getenv("%s")`, varName),
			fmt.Sprintf(`process.env.%s`, varName),
			fmt.Sprintf(`os.environ["%s"]`, varName),
			fmt.Sprintf(`os.environ.get("%s"`, varName),
			varName, // generic fallback
		}
		lines := strings.Split(content, "\n")
		for i, line := range lines {
			for _, pat := range patterns {
				if strings.Contains(line, pat) {
					result.Steps = append(result.Steps, TraceStep{
						Source:   filepath.Ext(path)[1:] + " source",
						FilePath: path,
						Line:     i + 1,
						Value:    strings.TrimSpace(line),
					})
					break
				}
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	return result, nil
}

// FormatTerminal renders the config trace as a visual path.
func FormatTerminal(r *Result) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("\n  🔍  Config Trace: %q\n\n", r.VarName))

	if len(r.Steps) == 0 {
		sb.WriteString("  ❌  Variable not found in any config file or source.\n\n")
		return sb.String()
	}

	for i, step := range r.Steps {
		connector := "  │"
		if i == len(r.Steps)-1 {
			connector = "  └"
		}

		prefix := "  ┌"
		if i > 0 {
			prefix = connector
		}

		sb.WriteString(fmt.Sprintf("%s ─ [%s]  %s : L%d\n", prefix, step.Source, step.FilePath, step.Line))
		sb.WriteString(fmt.Sprintf("  │    %s\n", truncate(step.Value, 100)))
		if i < len(r.Steps)-1 {
			sb.WriteString("  │\n")
		}
	}

	sb.WriteString(fmt.Sprintf("\n  Total references found: %d\n\n", len(r.Steps)))
	return sb.String()
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max-1] + "…"
}
