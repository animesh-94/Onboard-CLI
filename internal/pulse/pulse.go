package pulse

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// FilePulse represents the activity metric of a file.
type FilePulse struct {
	Path        string
	LastCommit  time.Time
	CommitCount int
	Status      string // "Hot", "Cold", "Dead"
}

// Result contains the pulse analysis for a directory.
type Result struct {
	Dir   string
	Files []FilePulse
	Hot   int
	Cold  int
	Dead  int
}

// Analyze scans the git history of files in the given directory to determine their pulse.
func Analyze(dir string) (*Result, error) {
	result := &Result{Dir: dir}

	// Get all files tracked by git in the directory
	out, err := exec.Command("git", "ls-files", dir).Output()
	if err != nil {
		return nil, fmt.Errorf("git ls-files failed: %w", err)
	}

	files := strings.Split(strings.TrimSpace(string(out)), "\n")
	now := time.Now()

	for _, file := range files {
		if file == "" {
			continue
		}

		// Skip non-source files for this analysis
		ext := filepath.Ext(file)
		if ext != ".go" && ext != ".js" && ext != ".ts" && ext != ".tsx" && ext != ".py" {
			continue
		}

		// Get last commit time
		timeOut, err := exec.Command("git", "log", "-1", "--format=%ct", "--", file).Output()
		if err != nil {
			continue
		}

		timeStr := strings.TrimSpace(string(timeOut))
		if timeStr == "" {
			continue // Uncommitted file
		}

		ts, err := strconv.ParseInt(timeStr, 10, 64)
		if err != nil {
			continue
		}

		lastCommit := time.Unix(ts, 0)

		// Get commit count
		countOut, err := exec.Command("git", "rev-list", "--count", "HEAD", "--", file).Output()
		count := 0
		if err == nil {
			c, _ := strconv.Atoi(strings.TrimSpace(string(countOut)))
			count = c
		}

		monthsSince := now.Sub(lastCommit).Hours() / 24 / 30
		status := "Hot"
		if monthsSince > 12 {
			status = "Dead"
			result.Dead++
		} else if monthsSince > 6 {
			status = "Cold"
			result.Cold++
		} else {
			result.Hot++
		}

		result.Files = append(result.Files, FilePulse{
			Path:        file,
			LastCommit:  lastCommit,
			CommitCount: count,
			Status:      status,
		})
	}

	return result, nil
}

// FormatTerminal renders the pulse report.
func FormatTerminal(r *Result) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("\n  💓  Pulse Report for: %s\n\n", r.Dir))
	sb.WriteString(fmt.Sprintf("  Summary: %d Hot, %d Cold, %d Dead\n\n", r.Hot, r.Cold, r.Dead))

	sb.WriteString(fmt.Sprintf("  %-40s  %-12s  %-10s  %s\n", "File", "Last Update", "Commits", "Status"))
	sb.WriteString("  " + strings.Repeat("─", 80) + "\n")

	for _, f := range r.Files {
		statusStr := f.Status
		if f.Status == "Dead" {
			statusStr = "💀 Dead"
		} else if f.Status == "Cold" {
			statusStr = "❄️  Cold"
		} else {
			statusStr = "🔥 Hot"
		}

		dateStr := f.LastCommit.Format("2006-01-02")
		sb.WriteString(fmt.Sprintf("  %-40s  %-12s  %-10d  %s\n", truncate(f.Path, 40), dateStr, f.CommitCount, statusStr))
	}
	sb.WriteString("\n")
	return sb.String()
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return "…" + s[len(s)-(max-1):]
}
