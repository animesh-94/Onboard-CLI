package logger

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime/debug"
)

var (
	errorLog *log.Logger
)

func init() {
	home, err := os.UserHomeDir()
	if err != nil {
		home = "."
	}

	logDir := filepath.Join(home, ".onboard", "logs")
	os.MkdirAll(logDir, 0755)

	logFile, err := os.OpenFile(filepath.Join(logDir, "error.log"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		// Fallback to standard logger if file creation fails
		errorLog = log.New(os.Stderr, "ONBOARD_ERR: ", log.Ldate|log.Ltime|log.Lshortfile)
		return
	}
	errorLog = log.New(logFile, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
}

// LogError logs an error to the error file without terminating the program.
func LogError(err error, context string) {
	if errorLog != nil {
		errorLog.Printf("[%s] %v", context, err)
	}
	fmt.Printf("[WARNING] %s: %v. Check ~/.onboard/logs/error.log for details.\n", context, err)
}

// Recover gracefully recovers from panics, logs the stack trace to the file, and prints a user warning.
func Recover(context string) {
	if r := recover(); r != nil {
		if errorLog != nil {
			errorLog.Printf("PANIC [%s]: %v\nStack Trace:\n%s", context, r, string(debug.Stack()))
		}
		fmt.Printf("[WARNING] Encountered an unexpected error during %s. Process will continue, but results may be incomplete. Check ~/.onboard/logs/error.log for details.\n", context)
	}
}
