package owners

import (
	"fmt"
	"math"
	"os/exec"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

// Contributor holds aggregate authorship data for one person.
type Contributor struct {
	Name        string
	Email       string
	LineCount   int
	CommitCount int
	LastCommit  time.Time
	Percentage  float64
}

// Result is the full ownership analysis for a target path.
type Result struct {
	Target       string
	TotalLines   int
	Contributors []Contributor // Sorted by line ownership descending
}

var blameAuthorRe = regexp.MustCompile(`^author (.+)`)
var blameEmailRe = regexp.MustCompile(`^author-mail <(.+)>`)
var blameTimeRe = regexp.MustCompile(`^author-time (\d+)`)

// Analyze runs git blame + git log on target and returns ranked contributors.
func Analyze(target string) (*Result, error) {
	// ── Step 1: git blame --porcelain ────────────────────────────────
	blameOut, err := exec.Command("git", "blame", "--porcelain", target).Output()
	if err != nil {
		return nil, fmt.Errorf("git blame failed (is this file tracked by git?): %w", err)
	}

	authorMap := map[string]*Contributor{}
	var currentName, currentEmail string
	var currentTime int64

	for _, line := range strings.Split(string(blameOut), "\n") {
		if m := blameAuthorRe.FindStringSubmatch(line); m != nil {
			currentName = strings.TrimSpace(m[1])
		} else if m := blameEmailRe.FindStringSubmatch(line); m != nil {
			currentEmail = strings.TrimSpace(m[1])
		} else if m := blameTimeRe.FindStringSubmatch(line); m != nil {
			currentTime, _ = strconv.ParseInt(m[1], 10, 64)
		} else if strings.HasPrefix(line, "\t") {
			// Actual code line — record authorship
			key := currentEmail
			if key == "" {
				key = currentName
			}
			if key == "" {
				continue
			}
			c, ok := authorMap[key]
			if !ok {
				c = &Contributor{Name: currentName, Email: currentEmail}
				authorMap[key] = c
			}
			c.LineCount++
			ts := time.Unix(currentTime, 0)
			if ts.After(c.LastCommit) {
				c.LastCommit = ts
			}
		}
	}

	if len(authorMap) == 0 {
		return nil, fmt.Errorf("no blame data found for %q — is the file committed?", target)
	}

	// ── Step 2: git log for commit counts ────────────────────────────
	logOut, err := exec.Command(
		"git", "log", "--pretty=format:%ae", "--follow", "--", target,
	).Output()
	if err == nil {
		for _, email := range strings.Split(string(logOut), "\n") {
			email = strings.TrimSpace(email)
			if email == "" {
				continue
			}
			if c, ok := authorMap[email]; ok {
				c.CommitCount++
			}
		}
	}

	// ── Step 3: compute percentages & sort ───────────────────────────
	total := 0
	for _, c := range authorMap {
		total += c.LineCount
	}

	var sorted []Contributor
	for _, c := range authorMap {
		c.Percentage = math.Round(float64(c.LineCount)/float64(total)*1000) / 10
		sorted = append(sorted, *c)
	}
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].LineCount > sorted[j].LineCount
	})

	return &Result{
		Target:       target,
		TotalLines:   total,
		Contributors: sorted,
	}, nil
}

// FormatTerminal renders a styled terminal table for the owners result.
func FormatTerminal(r *Result) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("\n  📂  Context Owner Report: %s\n\n", r.Target))
	sb.WriteString(fmt.Sprintf("  %-28s  %-34s  %6s  %6s  %7s  %s\n",
		"Author", "Email", "Lines", "% Own", "Commits", "Ownership"))
	sb.WriteString("  " + strings.Repeat("─", 100) + "\n")

	for i, c := range r.Contributors {
		badge := "   "
		switch i {
		case 0:
			badge = "👑 "
		case 1:
			badge = "🥈 "
		case 2:
			badge = "🥉 "
		}
		bar := buildBar(c.Percentage, 20)
		sb.WriteString(fmt.Sprintf("%s%-27s  %-34s  %6d  %5.1f%%  %6d   %s\n",
			badge,
			truncate(c.Name, 27),
			truncate(c.Email, 34),
			c.LineCount,
			c.Percentage,
			c.CommitCount,
			bar,
		))
	}
	sb.WriteString(fmt.Sprintf("\n  Total tracked lines: %d\n\n", r.TotalLines))

	// Primary owner + recent contributor summary
	if len(r.Contributors) > 0 {
		primary := r.Contributors[0]
		sb.WriteString(fmt.Sprintf("  🎯  Primary Owner   : %s <%s>  (%.1f%% of lines)\n",
			primary.Name, primary.Email, primary.Percentage))
		if len(r.Contributors) > 1 {
			recent := r.Contributors[0]
			for _, c := range r.Contributors {
				if c.LastCommit.After(recent.LastCommit) {
					recent = c
				}
			}
			sb.WriteString(fmt.Sprintf("  🕐  Last Committer  : %s — %s\n",
				recent.Name, recent.LastCommit.Format("2006-01-02")))
		}
	}
	sb.WriteString("\n")
	return sb.String()
}

func buildBar(pct float64, width int) string {
	filled := int(pct / 100 * float64(width))
	if filled > width {
		filled = width
	}
	return "[" + strings.Repeat("█", filled) + strings.Repeat("░", width-filled) + "]"
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max-1] + "…"
}
