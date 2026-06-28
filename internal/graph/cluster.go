package graph

// Cluster handles the pruning algorithm based on the --radius flag.
type Cluster struct {
	Radius int
}

// NewCluster initializes a cluster with a specific radius.
func NewCluster(radius int) *Cluster {
	return &Cluster{
		Radius: radius,
	}
}

// Prune detaches files beyond the radius into Macro-Nodes.
func (c *Cluster) Prune() {
	// TODO: Implement pruning logic
}
