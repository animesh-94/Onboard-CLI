import { Handle, Position, useStore } from '@xyflow/react';

// Color and icon mapping per symbol kind using Tailwind classes
const kindMeta: Record<string, { text: string; bg: string; border: string; icon: string }> = {
  function:  { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'ƒ' },
  method:    { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'm' },
  closure:   { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'λ' },
  class:     { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '◈' },
  type:      { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'T' },
  interface: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: 'I' },
  enum:      { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: 'E' },
  decorated: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', icon: '@' },
  symbol:    { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: '·' },
};

export default function LoDNode({ data }: { data: any }) {
  const zoom = useStore((s) => s.transform[2]);
  const kind = data.kind ?? 'symbol';
  const meta = kindMeta[kind] ?? kindMeta['symbol'];

  return (
    <div className="bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.5)] min-w-[160px] max-w-[280px] font-mono transition-all overflow-hidden group">
      
      <Handle type="target" position={Position.Top} className="!bg-emerald-500 !w-2 !h-2 border-none shadow-[0_0_8px_#10b981]" />
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-2 !h-2 border-none shadow-[0_0_8px_#10b981]" />

      {/* Macro view: zoom < 0.5 */}
      {zoom < 0.5 && (
        <div className="px-3 py-2 text-center">
          <span className={`${meta.text} text-[10px] font-bold tracking-widest uppercase`}>
            {meta.icon} {data.label}
          </span>
        </div>
      )}

      {/* Mid view: zoom 0.5–1.2 */}
      {zoom >= 0.5 && zoom <= 1.2 && (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`${meta.text} ${meta.bg} ${meta.border} border px-1.5 py-0.5 rounded text-[10px] font-bold`}>
              {meta.icon} {kind.toUpperCase()}
            </span>
          </div>
          <div className="text-white/90 text-[12px] font-semibold truncate">
            {data.label}
          </div>
          {data.file && (
            <div className="text-white/30 text-[9px] mt-1 truncate">
              {data.file.split('/').pop()}:{data.lineNum}
            </div>
          )}
        </div>
      )}

      {/* Micro view: zoom > 1.2 */}
      {zoom > 1.2 && (
        <div className="p-4">
          <div className={`flex items-center gap-2 pb-2 mb-2 border-b border-white/5`}>
            <span className={`${meta.text} ${meta.bg} ${meta.border} border px-2 py-0.5 rounded text-[10px] font-bold`}>
              {meta.icon} {kind.toUpperCase()}
            </span>
            <span className="text-white/20 text-[9px] ml-auto">NODE ID: {data.id?.substring(0,6) || 'LOCAL'}</span>
          </div>
          
          <div className="text-white text-[14px] font-bold mb-2 break-all">
            {data.label}
          </div>
          
          {data.file && (
            <div className="bg-[#050505] border border-white/5 rounded-md p-2 flex justify-between items-center mt-3">
              <span className="text-white/40 text-[10px] truncate max-w-[150px]">
                {data.file.split('/').pop()}
              </span>
              <span className="text-emerald-500/70 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Ln {data.lineNum}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
