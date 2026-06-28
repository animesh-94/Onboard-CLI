import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Canvas from './components/Canvas';
import Landing from './pages/Landing';
import DocsLayout from './pages/Docs';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <Router>
      <Analytics />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/app" element={<Canvas />} />
        <Route path="/docs" element={<Navigate to="/docs/getting-started" replace />} />
        <Route path="/docs/:slug" element={<DocsLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
