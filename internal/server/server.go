package server

import (
	"io/fs"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/onboard-cli/internal/graph"
	"github.com/onboard-cli/ui"
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

	// Serve static frontend files from embedded ui/dist with SPA fallback
	dist, err := fs.Sub(ui.Assets, "dist")
	if err != nil {
		log.Fatalf("Failed to load embedded UI assets: %v", err)
	}
	
	fileServer := http.FileServer(http.FS(dist))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/")
		if path == "" {
			path = "index.html"
		}
		
		// Check if file exists in the embedded FS
		f, err := dist.Open(path)
		if err != nil {
			// File doesn't exist, serve index.html (SPA fallback)
			b, err := fs.ReadFile(dist, "index.html")
			if err != nil {
				http.Error(w, "index.html not found", http.StatusNotFound)
				return
			}
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Write(b)
			return
		}
		f.Close()
		fileServer.ServeHTTP(w, r)
	})

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
