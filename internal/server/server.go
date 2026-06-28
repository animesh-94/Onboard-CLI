package server

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/onboard-cli/internal/graph"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for local dev
	},
}

// Server handles HTTP and WebSocket connections
type Server struct {
	Addr            string
	Hub             *Hub
	CurrentTopology *graph.Topology
}

// NewServer initializes a new visualizer server
func NewServer(addr string, top *graph.Topology) *Server {
	return &Server{
		Addr:            addr,
		Hub:             NewHub(top),
		CurrentTopology: top,
	}
}

// Start boots up the HTTP and WebSocket listeners
func (s *Server) Start() error {
	go s.Hub.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		s.serveWs(w, r)
	})

	// Serve static frontend files from ui/dist
	fs := http.FileServer(http.Dir("ui/dist"))
	http.Handle("/", fs)

	log.Printf("Starting visualizer server on %s", s.Addr)
	return http.ListenAndServe(s.Addr, nil)
}

func (s *Server) serveWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	client := &Client{hub: s.Hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
