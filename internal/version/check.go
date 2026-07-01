package version

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/onboard-cli/internal/logger"
)

type GitHubRelease struct {
	TagName string `json:"tag_name"`
}

const (
	repoURL        = "https://api.github.com/repos/animesh-94/Onboard-CLI/releases/latest"
	cacheFileName  = "latest_version"
	cacheTTL       = 24 * time.Hour
	requestTimeout = 500 * time.Millisecond
)

var CurrentVersion = "v0.0.0-dev"

func CheckVersionAsync() {
	go func() {
		defer logger.Recover("CheckVersionAsync")

		home, err := os.UserHomeDir()
		if err != nil {
			return
		}
		cachePath := filepath.Join(home, ".onboard", cacheFileName)
		
		// Check cache
		info, err := os.Stat(cachePath)
		if err == nil && time.Since(info.ModTime()) < cacheTTL {
			// Cache is fresh, do not ping network
			return
		}

		client := &http.Client{
			Timeout: requestTimeout,
		}

		resp, err := client.Get(repoURL)
		if err != nil {
			return // Silently fail: network slow or offline
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return
		}

		var release GitHubRelease
		if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
			return
		}

		// Write the latest version string to cache file (modifies ModTime automatically)
		os.WriteFile(cachePath, []byte(release.TagName), 0644)
	}()
}

func NotifyIfUpdateAvailable() {
	home, err := os.UserHomeDir()
	if err != nil {
		return
	}
	cachePath := filepath.Join(home, ".onboard", cacheFileName)
	
	data, err := os.ReadFile(cachePath)
	if err != nil {
		return
	}
	latestVersion := string(data)
	// Simple string comparison for now. A real semver library would be better but this handles basics.
	if latestVersion != "" && latestVersion != CurrentVersion && CurrentVersion != "v0.0.0-dev" {
		fmt.Printf("\n[i] A new version of Onboard-CLI is available (%s). Run 'onboard update' to upgrade.\n", latestVersion)
	}
}
