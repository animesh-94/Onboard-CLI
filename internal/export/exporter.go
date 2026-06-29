package export

import (
	"github.com/onboard-cli/internal/store"
)

// Exporter defines the interface for different output formatters
type Exporter interface {
	Export(nodes []store.DBNode, edges []store.DBEdge) (string, error)
}
