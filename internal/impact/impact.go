package impact

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// Hit represents a single call site where the target function is used.
type Hit struct {
	File     string
	Line     int
	LineText string
}

// Result is the full blast radius analysis.
type Result struct {
	Target string
	Hits   []Hit
}

// Analyze scans all source files under rootDir looking for references to funcSig.
func Analyze(funcSig string, rootDir string) (*Result, error) {
	result := &Result{Target: funcSig}

	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			name := info.Name()
			if name == "node_modules" || name == ".git" || name == "dist" {
				return filepath.SkipDir
			}
			return nil
		}
		ext := filepath.Ext(path)
		// Only scan supported source files
		supported := map[string]bool{
			".go": true, ".js": true, ".ts": true,
			".tsx": true, ".jsx": true, ".py": true,
		}
		if !supported[ext] {
			return nil
		}

		raw, err := os.ReadFile(path)
		if err != nil {
			return nil
		}

		lines := strings.Split(string(raw), "\n")
		for i, line := range lines {
			if strings.Contains(line, funcSig) {
				result.Hits = append(result.Hits, Hit{
					File:     path,
					Line:     i + 1,
					LineText: strings.TrimSpace(line),
				})
			}
		}
		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("blast radius scan failed: %w", err)
	}
	return result, nil
}

// FormatTerminal renders the blast radius report to terminal.
func FormatTerminal(r *Result) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("\n  💥  Blast Radius Report: %q\n\n", r.Target))

	if len(r.Hits) == 0 {
		sb.WriteString("  ✅  No references found. Safe to modify.\n\n")
		return sb.String()
	}

	// Group by file
	byFile := map[string][]Hit{}
	var order []string
	for _, h := range r.Hits {
		if _, ok := byFile[h.File]; !ok {
			order = append(order, h.File)
		}
		byFile[h.File] = append(byFile[h.File], h)
	}

	sb.WriteString(fmt.Sprintf("  ⚠️   %d call site(s) found across %d file(s):\n\n",
		len(r.Hits), len(byFile)))

	for _, file := range order {
		hits := byFile[file]
		sb.WriteString(fmt.Sprintf("  📄  %s  (%d hit(s))\n", file, len(hits)))
		for _, h := range hits {
			sb.WriteString(fmt.Sprintf("       L%-5d  %s\n", h.Line, truncate(h.LineText, 80)))
		}
		sb.WriteString("\n")
	}

	return sb.String()
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max-1] + "…"
}
