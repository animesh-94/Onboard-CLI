import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
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
import LoDNode from './LoDNode';

const nodeTypes = {
  lod: LoDNode,
};

const initialNodes: Node[] = [
  { id: '1', type: 'lod', position: { x: 250, y: 50 }, data: { label: 'Server Core' } },
  { id: '2', type: 'lod', position: { x: 100, y: 300 }, data: { label: 'Parser Engine' } },
  { id: '3', type: 'lod', position: { x: 400, y: 300 }, data: { label: 'Graph Cluster' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#10b981', strokeWidth: 2, filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#10b981', strokeWidth: 2, filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' } },
];

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws');
    ws.onmessage = (event) => {
      try {
        const topology = JSON.parse(event.data);
        if (topology.nodes) {
          const cols = 3;
          const colGap = 320;
          const rowGap = 160;
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
            },
          }));
          setNodes(xyNodes);
        }
        if (topology.edges) {
          const styledEdges = topology.edges.map((e: any) => ({
            ...e,
            animated: true,
            style: { stroke: '#10b981', strokeWidth: 2, filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' }
          }));
          setEdges(styledEdges);
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };
    return () => ws.close();
  }, [setNodes, setEdges]);

  return (
    <div className="w-screen h-screen bg-[#050505] font-mono">
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
        maxZoom={3.0}
      >
        <Background color="#808080" style={{ opacity: 0.15 }} gap={24} size={1.5} />
        <Controls className="!bg-[#0A0A0A] !border-white/10 !fill-white/50" />
      </ReactFlow>
    </div>
  );
}
