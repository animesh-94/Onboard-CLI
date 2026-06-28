package graph

// Node represents a generic node in the architectural graph.
type Node struct {
	ID       string `json:"id"`
	Label    string `json:"label"`    // Human-readable symbol name (e.g. "NewServer")
	Kind     string `json:"kind"`     // e.g. "function", "type", "method", "class", "interface"
	NodeType string `json:"nodeType"` // e.g. "File", "Macro-Node"
	Path     string `json:"path,omitempty"`
	File     string `json:"file,omitempty"` // Basename of the file
	LineNum  int    `json:"lineNum,omitempty"`
}

// Edge represents a relationship between two nodes.
type Edge struct {
	ID     string `json:"id"`
	Source string `json:"source"`
	Target string `json:"target"`
	Type   string `json:"type"`
}

// Topology represents the hierarchical JSON payload for the visualizer.
type Topology struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}
