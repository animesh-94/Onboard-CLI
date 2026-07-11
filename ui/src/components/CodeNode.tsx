import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronRight, FileCode2, FolderOpen } from 'lucide-react';

export default function CodeNode({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    if (data.kind === 'dir') {
      return <FolderOpen size={14} className="text-yellow-500" />;
    }
    
    switch (data.extension) {
      case '.ts':
      case '.tsx':
        return <FileCode2 size={14} className="text-blue-400" />;
      case '.go':
        return <FileCode2 size={14} className="text-cyan-400" />;
      case '.js':
      case '.jsx':
        return <FileCode2 size={14} className="text-yellow-400" />;
      case '.py':
        return <FileCode2 size={14} className="text-green-400" />;
      case '.md':
        return <FileCode2 size={14} className="text-gray-300" />;
      default:
        return <FileCode2 size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#222] rounded-lg shadow-2xl min-w-[250px] overflow-hidden font-mono">
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-[#222] !border-gray-500" />
      
      {/* Node Header */}
      <div className="bg-black px-3 py-2 border-b border-[#222] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-[12px] font-bold text-gray-200">{data.label}</span>
        </div>
        <span className="text-[9px] text-gray-500 uppercase tracking-widest">{data.kind}</span>
      </div>

      {/* Signature Section */}
      {(data.signature || data.returnType) && (
        <div className="p-3 flex flex-col gap-1 text-[11px]">
          {data.signature && (
            <div className="flex justify-between items-center text-gray-400">
              <span>Parameters:</span>
              <span className="text-orange-300">{data.signature}</span>
            </div>
          )}
          {data.returnType && (
            <div className="flex justify-between items-center text-gray-400">
              <span>Returns:</span>
              <span className="text-indigo-300">{data.returnType}</span>
            </div>
          )}
        </div>
      )}

      {/* Toggle Snippet */}
      {data.snippet && (
        <div className="border-t border-[#111]">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-3 py-1.5 flex items-center gap-2 text-[10px] text-gray-500 hover:text-gray-300 hover:bg-[#111] transition-colors"
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
          </button>
          
          {isExpanded && (
            <div className="p-3 bg-[#050505] text-[10px] text-gray-300 overflow-x-auto max-h-[200px] scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent">
              <pre className="whitespace-pre-wrap"><code>{data.snippet}</code></pre>
            </div>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-[#222] !border-gray-500" />
    </div>
  );
}
