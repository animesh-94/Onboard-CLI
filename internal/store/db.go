package store

import (
	"database/sql"
	"fmt"
	"path/filepath"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

// InitDB initializes the SQLite database with our schema
func InitDB(dbPath string) (*sql.DB, error) {
	err := os.MkdirAll(filepath.Dir(dbPath), 0755)
	if err != nil {
		return nil, err
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	schema := `
	CREATE TABLE IF NOT EXISTS nodes (
		id TEXT PRIMARY KEY,
		type TEXT NOT NULL,
		name TEXT NOT NULL,
		file_path TEXT NOT NULL,
		line_number INTEGER NOT NULL
	);

	CREATE TABLE IF NOT EXISTS edges (
		source_id TEXT NOT NULL,
		target_id TEXT NOT NULL,
		relationship_type TEXT NOT NULL,
		PRIMARY KEY (source_id, target_id, relationship_type),
		FOREIGN KEY (source_id) REFERENCES nodes(id) ON DELETE CASCADE,
		FOREIGN KEY (target_id) REFERENCES nodes(id) ON DELETE CASCADE
	);

	CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source_id);
	CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target_id);
	CREATE INDEX IF NOT EXISTS idx_nodes_file_path ON nodes(file_path);
	`

	_, err = db.Exec(schema)
	if err != nil {
		return nil, fmt.Errorf("failed to create schema: %v", err)
	}

	return db, nil
}

// InsertNodes bulk inserts extracted nodes
func InsertNodes(db *sql.DB, nodes []DBNode) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT OR REPLACE INTO nodes (id, type, name, file_path, line_number) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, n := range nodes {
		if _, err := stmt.Exec(n.ID, n.Type, n.Name, n.FilePath, n.LineNumber); err != nil {
			return err
		}
	}
	return tx.Commit()
}

// GetNeighbors recursively looks up connected nodes up to a specified depth
func GetNeighbors(db *sql.DB, nodeID string, depth int) ([]DBNode, error) {
	if depth <= 0 {
		return nil, nil
	}

	query := `
		WITH RECURSIVE bfs(id, depth) AS (
			SELECT ?, 0
			UNION ALL
			SELECT e.target_id, b.depth + 1
			FROM bfs b
			JOIN edges e ON b.id = e.source_id
			WHERE b.depth < ?
		)
		SELECT DISTINCT n.id, n.type, n.name, n.file_path, n.line_number
		FROM bfs b
		JOIN nodes n ON b.id = n.id
		WHERE n.id != ?;
	`

	rows, err := db.Query(query, nodeID, depth, nodeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var neighbors []DBNode
	for rows.Next() {
		var n DBNode
		if err := rows.Scan(&n.ID, &n.Type, &n.Name, &n.FilePath, &n.LineNumber); err != nil {
			return nil, err
		}
		neighbors = append(neighbors, n)
	}
	return neighbors, nil
}

// GetGraph retrieves the graph topology. If startNodeID is empty, it returns the entire graph.
// If startNodeID is provided and depth > 0, it returns a BFS subgraph.
func GetGraph(db *sql.DB, startNodeID string, depth int) ([]DBNode, []DBEdge, error) {
	var nodes []DBNode
	var edges []DBEdge

	var nodeQuery, edgeQuery string
	var args []interface{}

	if startNodeID == "" || depth <= 0 {
		nodeQuery = "SELECT id, type, name, file_path, line_number FROM nodes"
		edgeQuery = "SELECT source_id, target_id, relationship_type FROM edges"
	} else {
		nodeQuery = `
			WITH RECURSIVE bfs(id, depth) AS (
				SELECT ?, 0
				UNION ALL
				SELECT e.target_id, b.depth + 1
				FROM bfs b
				JOIN edges e ON b.id = e.source_id
				WHERE b.depth < ?
			)
			SELECT DISTINCT n.id, n.type, n.name, n.file_path, n.line_number
			FROM bfs b
			JOIN nodes n ON b.id = n.id;
		`
		edgeQuery = `
			WITH RECURSIVE bfs(id, depth) AS (
				SELECT ?, 0
				UNION ALL
				SELECT e.target_id, b.depth + 1
				FROM bfs b
				JOIN edges e ON b.id = e.source_id
				WHERE b.depth < ?
			)
			SELECT DISTINCT e.source_id, e.target_id, e.relationship_type
			FROM edges e
			WHERE e.source_id IN (SELECT id FROM bfs) AND e.target_id IN (SELECT id FROM bfs);
		`
		args = []interface{}{startNodeID, depth}
	}

	nodeRows, err := db.Query(nodeQuery, args...)
	if err != nil {
		return nil, nil, err
	}
	defer nodeRows.Close()

	for nodeRows.Next() {
		var n DBNode
		if err := nodeRows.Scan(&n.ID, &n.Type, &n.Name, &n.FilePath, &n.LineNumber); err != nil {
			return nil, nil, err
		}
		nodes = append(nodes, n)
	}

	edgeRows, err := db.Query(edgeQuery, args...)
	if err != nil {
		return nil, nil, err
	}
	defer edgeRows.Close()

	for edgeRows.Next() {
		var e DBEdge
		if err := edgeRows.Scan(&e.SourceID, &e.TargetID, &e.RelationshipType); err != nil {
			return nil, nil, err
		}
		edges = append(edges, e)
	}

	return nodes, edges, nil
}
