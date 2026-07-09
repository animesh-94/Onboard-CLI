import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LoDNode from './LoDNode';
import SearchPanel from './SearchPanel';
import { useTheme } from '../contexts/ThemeContext';
import { Play, RotateCcw, AlertTriangle, Layers, Info } from 'lucide-react';

const nodeTypes = {
  lod: LoDNode,
};

// Rich E-Commerce Microservices Dataset
const MOCK_NODES: Node[] = [
  { id: 'api-gw', type: 'lod', position: { x: 400, y: 50 }, data: { label: 'API Gateway', kind: 'function', file: 'gateway.go', lineNum: 42, complexity: 18, owner: 'animesh-94', loc: 420 } },
  { id: 'auth-svc', type: 'lod', position: { x: 100, y: 250 }, data: { label: 'Auth Service', kind: 'method', file: 'auth.go', lineNum: 110, complexity: 34, owner: 'security-team', loc: 1200 } },
  { id: 'catalog-svc', type: 'lod', position: { x: 400, y: 250 }, data: { label: 'Product Catalog', kind: 'class', file: 'catalog.ts', lineNum: 15, complexity: 8, owner: 'frontend-team', loc: 300 } },
  { id: 'order-svc', type: 'lod', position: { x: 700, y: 250 }, data: { label: 'Order Processor', kind: 'function', file: 'orders.py', lineNum: 88, complexity: 45, owner: 'backend-team', loc: 1800 } },
  { id: 'payment-gw', type: 'lod', position: { x: 900, y: 450 }, data: { label: 'Payment Gateway', kind: 'class', file: 'payment.java', lineNum: 200, complexity: 55, owner: 'finance-eng', loc: 2500 } },
  { id: 'postgres', type: 'lod', position: { x: 400, y: 500 }, data: { label: 'Postgres DB', kind: 'symbol', file: 'schema.sql', lineNum: 1, complexity: 2, owner: 'dba', loc: 850 } },
  { id: 'redis', type: 'lod', position: { x: 100, y: 500 }, data: { label: 'Redis Cache', kind: 'symbol', file: 'redis.conf', lineNum: 12, complexity: 1, owner: 'devops', loc: 50 } },
  { id: 'user-svc', type: 'lod', position: { x: 700, y: 50 }, data: { label: 'User Profile', kind: 'interface', file: 'user.ts', lineNum: 22, complexity: 4, owner: 'frontend-team', loc: 150 } },
];

const normalEdgeStyle = { stroke: '#10b981', strokeWidth: 2, filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.3))' };
const blastEdgeStyle = { stroke: '#ef4444', strokeWidth: 3, filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.8))' };

const MOCK_EDGES: Edge[] = [
  { id: 'e-gw-auth', source: 'api-gw', target: 'auth-svc', animated: true, style: normalEdgeStyle },
  { id: 'e-gw-cat', source: 'api-gw', target: 'catalog-svc', animated: true, style: normalEdgeStyle },
  { id: 'e-gw-ord', source: 'api-gw', target: 'order-svc', animated: true, style: normalEdgeStyle },
  { id: 'e-gw-usr', source: 'api-gw', target: 'user-svc', animated: true, style: normalEdgeStyle },
  { id: 'e-ord-pay', source: 'order-svc', target: 'payment-gw', animated: true, style: normalEdgeStyle },
  { id: 'e-ord-db', source: 'order-svc', target: 'postgres', animated: true, style: normalEdgeStyle },
  { id: 'e-auth-db', source: 'auth-svc', target: 'postgres', animated: true, style: normalEdgeStyle },
  { id: 'e-auth-red', source: 'auth-svc', target: 'redis', animated: true, style: normalEdgeStyle },
  { id: 'e-cat-red', source: 'catalog-svc', target: 'redis', animated: true, style: normalEdgeStyle },
  { id: 'e-cat-db', source: 'catalog-svc', target: 'postgres', animated: true, style: normalEdgeStyle },
  { id: 'e-usr-auth', source: 'user-svc', target: 'auth-svc', animated: true, style: normalEdgeStyle },
];

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(MOCK_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MOCK_EDGES);
  const { isDarkMode, isCompactMode, toggleDarkMode, toggleCompactMode } = useTheme();
  
  const [isSimulating, setIsSimulating] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    // Connect to WS on the same host/port serving this page
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${wsProtocol}//${window.location.host}/ws`);
    ws.onmessage = (event) => {
      try {
        const topology = JSON.parse(event.data);
        if (topology.nodes) {
          const cols = 3;
          const colGap = isCompactMode ? 200 : 320;
          const rowGap = isCompactMode ? 100 : 160;
          const xyNodes = topology.nodes.map((n: any, i: number) => ({
            id: n.id,
            type: 'lod',
            position: {
              x: (i % cols) * colGap + 80,
              y: Math.floor(i / cols) * rowGap + 60,
            },
            data: {
              label:   n.label,
              kind:    n.kind ?? 'symbol',
              file:    n.file ?? '',
              lineNum: n.lineNum ?? 0,
              complexity: n.complexity ?? Math.floor(Math.random() * 20),
              owner: n.owner ?? 'unknown',
              loc: n.loc ?? Math.floor(Math.random() * 500)
            },
          }));
          setNodes(xyNodes);
        }
        if (topology.edges) {
          const styledEdges = topology.edges.map((e: any) => ({
            ...e,
            animated: true,
            style: normalEdgeStyle
          }));
          setEdges(styledEdges);
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };
    return () => ws.close();
  }, [setNodes, setEdges, isCompactMode]);

  const simulateBlastRadius = () => {
    setIsSimulating(true);
    // Highlight paths starting from Order Processor down to Postgres and Payment
    const blastPaths = ['e-ord-pay', 'e-ord-db', 'e-gw-ord'];
    const affectedNodes = ['order-svc', 'payment-gw', 'postgres'];

    setEdges(eds => eds.map(e => ({
      ...e,
      style: blastPaths.includes(e.id) ? blastEdgeStyle : { ...normalEdgeStyle, opacity: 0.2 },
      animated: blastPaths.includes(e.id)
    })));

    setNodes(nds => nds.map(n => ({
      ...n,
      data: {
        ...n.data,
        isAffected: affectedNodes.includes(n.id)
      },
      style: affectedNodes.includes(n.id) 
        ? { filter: 'drop-shadow(0 0 15px rgba(239,68,68,0.8))' } 
        : { opacity: 0.3 }
    })));
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setEdges(MOCK_EDGES);
    setNodes(MOCK_NODES);
  };

  return (
    <div className={`w-screen h-screen font-mono relative overflow-hidden ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-black'}`}>
      
      {/* Demo Overlay */}
      <div className="absolute top-6 left-6 z-10 w-[340px] bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="text-emerald-400" size={20} />
            <h2 className="text-lg font-bold text-white tracking-tight">Interactive Demo</h2>
          </div>
          <p className="text-[13px] text-white/50 leading-relaxed">
            Welcome to the Visual Mapper! This mock e-commerce architecture shows how <code className="text-emerald-400">onboard-cli</code> visualizes complex relationships.
          </p>
        </div>
        
        <div className="p-5 bg-white/[0.02]">
          <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle size={12} />
            Actions
          </h3>
          
          {!isSimulating ? (
            <button 
              onClick={simulateBlastRadius}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg py-2.5 px-4 transition-all text-sm font-semibold"
            >
              <Play size={16} />
              Simulate Blast Radius
            </button>
          ) : (
            <button 
              onClick={resetSimulation}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg py-2.5 px-4 transition-all text-sm font-semibold"
            >
              <RotateCcw size={16} />
              Reset Graph
            </button>
          )}

          <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-3">
             <Info size={16} className="text-white/30 shrink-0 mt-0.5" />
             <p className="text-[11px] text-white/40 leading-relaxed">
               <strong>Tip:</strong> Scroll to zoom in on a node to see detailed cognitive complexity and ownership metrics. Drag the canvas to pan.
             </p>
          </div>
        </div>
      </div>

      <ReactFlowProvider>
        <SearchPanel />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          colorMode={isDarkMode ? "dark" : "light"}
          minZoom={0.1}
          maxZoom={3.0}
        >
          <Background color={isDarkMode ? "#808080" : "#cbd5e1"} style={{ opacity: 0.15 }} gap={24} size={1.5} />
          <Controls className={isDarkMode ? "!bg-[#0A0A0A] !border-white/10 !fill-white/50" : "!bg-white !border-black/10 !fill-black/50"} />
          <Panel position="top-right" className="flex gap-2 p-2 mt-4 mr-4">
            <button
              onClick={toggleCompactMode}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors shadow-lg ${
                isDarkMode ? 'border-white/10 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white/70' : 'border-gray-300 bg-white hover:bg-gray-100'
              }`}
            >
              {isCompactMode ? 'Standard Layout' : 'Compact Layout'}
            </button>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors shadow-lg ${
                isDarkMode ? 'border-white/10 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white/70' : 'border-gray-300 bg-white hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
