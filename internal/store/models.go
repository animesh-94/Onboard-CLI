package store

// DBNode represents a node in the SQLite graph
type DBNode struct {
	ID         string `json:"id"`
	Type       string `json:"type"` // Function, Class, Module, Endpoint
	Name       string `json:"name"`
	FilePath   string `json:"file_path"`
	LineNumber int    `json:"line_number"`
}

// DBEdge represents a relationship in the SQLite graph
type DBEdge struct {
	SourceID         string `json:"source_id"`
	TargetID         string `json:"target_id"`
	RelationshipType string `json:"relationship_type"` // Import, Call, Inherits, Implements
}
