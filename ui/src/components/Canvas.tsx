import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CodeNode from './CodeNode';
import dagre from 'dagre';
import {
  Play, Search, Settings, FolderOpen, Archive, UploadCloud, Download, Share2,
  Menu, Code2, AlertTriangle, Activity, Database, GitBranch
} from 'lucide-react';
import { Github } from './GithubIcon';

const nodeTypes = {
  codeNode: CodeNode,
};

// Initial empty state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  // Increase ranksep (horizontal gap) and decrease nodesep (vertical gap)
  dagreGraph.setGraph({ rankdir: direction, nodesep: 30, ranksep: 900 });

  nodes.forEach((node) => {
    // Height is smaller since most nodes (directories/files) are just a single row unless expanded
    dagreGraph.setNode(node.id, { width: 280, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 280 / 2,
        y: nodeWithPosition.y - 180 / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [url, setUrl] = useState(() => {
    return new URLSearchParams(window.location.search).get('url') || '';
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [isRoutesSidebarOpen, setIsRoutesSidebarOpen] = useState(false);
  const hasAutoAnalyzed = useRef(false);

  const handleDownload = () => {
    const canvasElem = document.getElementById('canvas-container');
    if (canvasElem) {
      toPng(canvasElem, { backgroundColor: '#050505' })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'onboard-architecture.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Failed to export image', err);
          alert('Failed to export image');
        });
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.origin + window.location.pathname + '?url=' + encodeURIComponent(url);
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch('http://localhost:8080/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.replace(/^["']|["']$/g, '').trim() })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to analyze repository');
      }

      const data = await response.json();

      const newNodes: Node[] = (data.nodes || []).map((n: any) => {
        let snippetText = `Path: ${n.filePath}`;
        if (n.type === 'file' && n.functions && n.functions.length > 0) {
          snippetText = `Functions:\n- ${n.functions.join('\n- ')}`;
        }

        return {
          id: n.id,
          type: 'codeNode',
          position: { x: 0, y: 0 },
          data: {
            label: n.name,
            kind: n.type, // 'file' or 'dir'
            extension: n.extension || '',
            snippet: snippetText,
            filePath: n.filePath,
            functions: n.functions || []
          }
        };
      });

      const newEdges: Edge[] = (data.edges || []).map((e: any, index: number) => ({
        id: `e${index}-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: '#3b82f6' }
      }));

      if (newNodes.length === 0) {
        alert('No data found for this directory.');
      } else {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges, 'LR');
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setHasData(true);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error analyzing repository. Make sure the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (url && !hasAutoAnalyzed.current) {
      hasAutoAnalyzed.current = true;
      handleAnalyze();
    }
  }, [url, handleAnalyze]);

  const dynamicRoutes = useMemo(() => {
    const routes: { method: string; path: string; file: string }[] = [];
    nodes.forEach(node => {
      const funcs = (node.data.functions as string[]) || [];
      const filePath = (node.data.filePath as string) || '';
      
      funcs.forEach(func => {
        const lowerFunc = func.toLowerCase();
        let method = 'GET';
        if (lowerFunc.includes('post') || lowerFunc.includes('create')) method = 'POST';
        else if (lowerFunc.includes('put') || lowerFunc.includes('update')) method = 'PUT';
        else if (lowerFunc.includes('delete') || lowerFunc.includes('remove')) method = 'DELETE';
        else if (lowerFunc.includes('get') || lowerFunc.includes('fetch') || lowerFunc.includes('read') || lowerFunc.includes('handler')) method = 'GET';
        
        if (
          lowerFunc.includes('route') || 
          lowerFunc.includes('handler') || 
          lowerFunc.includes('controller') ||
          lowerFunc.includes('api') ||
          filePath.includes('routes') ||
          filePath.includes('controllers')
        ) {
          // Approximate a path based on function name
          let pathStr = `/api/${func.replace(/Handler|Controller|Route/i, '').toLowerCase()}`;
          if (pathStr === '/api/') pathStr = `/api/${String(node.data.label || '').replace(/\.[^/.]+$/, '')}`;
          routes.push({
            method,
            path: pathStr,
            file: filePath
          });
        }
      });
    });
    
    // De-duplicate
    const unique = new Map();
    routes.forEach(r => unique.set(r.method + r.path + r.file, r));
    return Array.from(unique.values()).slice(0, 50); // Limit to 50 for performance
  }, [nodes]);

  return (
    <div className="flex flex-col w-screen h-screen bg-[#050505] text-white font-sans overflow-hidden">

      {/* Top Navigation Bar */}
      <div className="h-14 border-b border-[#1c1c1c] bg-[#0A0A0A] flex items-center justify-between px-4 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 pr-4 border-r border-[#222] hover:opacity-80 transition-opacity">
            <img src="/favicon.svg" alt="Logo" className="w-5 h-5" />
            <span className="font-bold tracking-tight">Onboard</span>
          </Link>

          <div className="flex items-center bg-[#050505] border border-[#222] rounded-md px-2 py-1 focus-within:border-emerald-500/50 transition-colors w-[300px]">
            <Github size={14} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Enter GitHub Repo URL..."
              className="bg-transparent border-none outline-none text-xs w-full text-gray-200 placeholder-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
          </div>

          <button className="text-xs px-3 py-1.5 border border-[#222] rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#111] transition-colors">
            Excludes
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="text-xs px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium transition-colors flex items-center gap-2"
          >
            {isAnalyzing ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              <>
                <Play size={12} /> Analyze
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-[#222] rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#111] transition-colors" title="Open Folder">
            <FolderOpen size={14} />
          </button>
          <button className="p-1.5 border border-[#222] rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#111] transition-colors" title="Open ZIP">
            <Archive size={14} />
          </button>
          <div className="w-px h-4 bg-[#222] mx-1"></div>
          <button 
            onClick={() => setIsRoutesSidebarOpen(!isRoutesSidebarOpen)}
            className={`text-xs px-3 py-1.5 border border-[#222] rounded-md transition-colors flex items-center gap-1 ${isRoutesSidebarOpen ? 'bg-[#222] text-white' : 'text-orange-400 hover:text-orange-300 hover:bg-orange-400/10'}`}
          >
            <Database size={12} /> Backend Routes
          </button>
          <button onClick={handleDownload} className="p-1.5 border border-[#222] rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#111] transition-colors" title="Export as PNG">
            <Download size={14} />
          </button>
          <button onClick={handleShare} className="p-1.5 border border-[#222] rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#111] transition-colors" title="Share Link">
            <Share2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar: Repository Explorer */}
        <div className="w-[280px] bg-[#0A0A0A] border-r border-[#1c1c1c] flex flex-col shrink-0 z-10 shadow-lg">
          <div className="p-3 border-b border-[#1c1c1c] flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Menu size={12} /> Repository Explorer
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent hover:scrollbar-thumb-[#333]">
            {!hasData ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <FolderOpen size={32} className="text-gray-600 mb-3" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  No Repository:<br />Enter a GitHub URL, open a folder, or load a ZIP archive.
                </p>
              </div>
            ) : (
              <div className="text-xs text-gray-300 flex flex-col font-mono overflow-x-hidden">
                {(() => {
                  const rootNodes = nodes.filter(n => !edges.some(e => e.target === n.id));

                  const renderTree = (nodeId: string, depth = 0): any => {
                    const node = nodes.find(n => n.id === nodeId);
                    if (!node) return null;

                    const childrenIds = edges.filter(e => e.source === nodeId).map(e => e.target);
                    const children = childrenIds.map(id => nodes.find(n => n.id === id)).filter(Boolean) as Node[];
                    children.sort((a, b) => {
                      if (a.data.kind === b.data.kind) return String(a.data.label).localeCompare(String(b.data.label));
                      return a.data.kind === 'dir' ? -1 : 1;
                    });

                    return (
                      <div key={nodeId} className="flex flex-col">
                        <div
                          className="flex items-center gap-2 py-1 hover:bg-[#111] px-1 rounded-sm cursor-pointer"
                          style={{ paddingLeft: `${depth * 16}px` }}
                        >
                          {node.data.kind === 'dir' ? (
                            <FolderOpen size={14} className="text-blue-400 shrink-0" />
                          ) : (
                            <Code2 size={14} className="text-gray-500 shrink-0" />
                          )}
                          <span className={node.data.kind === 'dir' ? "text-gray-300 truncate" : "text-gray-500 truncate"}>
                            {String(node.data.label)}{node.data.kind === 'dir' ? '/' : ''}
                          </span>
                        </div>
                        {children.map(child => renderTree(child.id, depth + 1))}
                      </div>
                    );
                  };

                  return rootNodes.map(root => renderTree(root.id, 0));
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-[#050505]" id="canvas-container">
          {!hasData && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
              <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#0A0A0A] border border-[#222] shadow-[0_0_50px_rgba(16,185,129,0.1)] flex items-center justify-center">
                <Code2 size={40} className="text-emerald-500/50" />
              </div>
              <h2 className="text-xl font-medium tracking-tight mb-2 text-gray-200">Visualize architecture, blast radius, ownership...</h2>
              <p className="text-sm text-gray-500 max-w-md text-center leading-relaxed">
                Enter a repository URL above or drag and drop a ZIP archive to generate a high-fidelity interactive execution map.
              </p>
            </div>
          )}
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              colorMode="dark"
              minZoom={0.1}
              maxZoom={2.0}
            >
              <Background color="#333" gap={24} size={1.5} />
              <Controls className="!bg-[#0A0A0A] !border-[#222] !fill-gray-400" />
            </ReactFlow>
          </ReactFlowProvider>
        </div>



        {/* Right Sidebar: Backend Routes */}
        {isRoutesSidebarOpen && (
          <div className="w-[320px] bg-[#0A0A0A] border-l border-[#1c1c1c] flex flex-col shrink-0 z-10 shadow-lg">
            <div className="p-3 border-b border-[#1c1c1c] flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Database size={12} /> Backend Routes
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent">
              {dynamicRoutes.length > 0 ? dynamicRoutes.map((route, i) => (
                <div key={i} className="p-3 bg-[#111] border border-[#222] rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      route.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                      route.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                      route.method === 'PUT' ? 'bg-purple-500/20 text-purple-400' :
                      route.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {route.method}
                    </span>
                    <span className="text-sm font-mono text-gray-200 truncate">{route.path}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-2 flex items-center gap-1">
                    <FolderOpen size={10} /> {route.file}
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 text-xs py-4">
                  No backend routes detected in this repository.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
