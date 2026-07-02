import { Handle, Position, useStore } from '@xyflow/react';
import { Users, Activity, Hash, AlertCircle } from 'lucide-react';

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
  
  const isAffected = data.isAffected;

  return (
    <div className={`
      bg-[#0A0A0A]/90 backdrop-blur-md border rounded-lg min-w-[160px] max-w-[320px] font-mono transition-all overflow-hidden group
      ${isAffected ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] scale-[1.02]' : 'border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'}
    `}>
      
      <Handle type="target" position={Position.Top} className={`!w-2 !h-2 border-none ${isAffected ? '!bg-red-500 shadow-[0_0_8px_#ef4444]' : '!bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
      <Handle type="source" position={Position.Bottom} className={`!w-2 !h-2 border-none ${isAffected ? '!bg-red-500 shadow-[0_0_8px_#ef4444]' : '!bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />

      {/* Macro view: zoom < 0.5 */}
      {zoom < 0.5 && (
        <div className="px-3 py-2 text-center relative">
          {isAffected && <div className="absolute inset-0 bg-red-500/10 animate-pulse" />}
          <span className={`${isAffected ? 'text-red-400' : meta.text} text-[10px] font-bold tracking-widest uppercase relative z-10`}>
            {meta.icon} {data.label}
          </span>
        </div>
      )}

      {/* Mid view: zoom 0.5–1.2 */}
      {zoom >= 0.5 && zoom <= 1.2 && (
        <div className="p-3 relative">
          {isAffected && <div className="absolute inset-0 bg-red-500/5 animate-pulse" />}
          <div className="flex items-center gap-2 mb-1.5 relative z-10">
            <span className={`${isAffected ? 'text-red-400 bg-red-500/10 border-red-500/20' : `${meta.text} ${meta.bg} ${meta.border}`} border px-1.5 py-0.5 rounded text-[10px] font-bold`}>
              {meta.icon} {kind.toUpperCase()}
            </span>
            {isAffected && (
              <span className="flex items-center gap-1 text-[9px] text-red-400 font-bold uppercase tracking-wider ml-auto bg-red-500/10 px-1.5 py-0.5 rounded">
                <AlertCircle size={10} /> Impacted
              </span>
            )}
          </div>
          <div className="text-white/90 text-[12px] font-semibold truncate relative z-10">
            {data.label}
          </div>
          {data.file && (
            <div className="text-white/30 text-[9px] mt-1 truncate relative z-10">
              {data.file.split('/').pop()}:{data.lineNum}
            </div>
          )}
        </div>
      )}

      {/* Micro view: zoom > 1.2 */}
      {zoom > 1.2 && (
        <div className="p-4 relative">
          {isAffected && <div className="absolute inset-0 bg-red-500/5" />}
          
          <div className="relative z-10">
            <div className={`flex items-center gap-2 pb-2 mb-3 border-b ${isAffected ? 'border-red-500/20' : 'border-white/5'}`}>
              <span className={`${isAffected ? 'text-red-400 bg-red-500/10 border-red-500/20' : `${meta.text} ${meta.bg} ${meta.border}`} border px-2 py-0.5 rounded text-[10px] font-bold`}>
                {meta.icon} {kind.toUpperCase()}
              </span>
              <span className="text-white/20 text-[9px] ml-auto">NODE ID: {data.id?.substring(0,6) || 'LOCAL'}</span>
            </div>
            
            <div className="text-white text-[15px] font-bold mb-3 break-all flex items-start justify-between gap-2">
              {data.label}
              {isAffected && (
                <div className="flex items-center gap-1 text-[9px] text-red-400 font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md shrink-0">
                  <AlertCircle size={12} /> Impacted
                </div>
              )}
            </div>
            
            {/* Rich Metadata Metrics */}
            {data.complexity !== undefined && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#111] border border-white/5 rounded p-2 flex flex-col justify-center">
                  <span className="text-white/30 text-[9px] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity size={10} /> Complexity
                  </span>
                  <div className="flex items-end gap-1">
                    <span className={`text-[13px] font-bold ${data.complexity > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {data.complexity}
                    </span>
                    <span className="text-[9px] text-white/30 mb-0.5">score</span>
                  </div>
                </div>
                
                <div className="bg-[#111] border border-white/5 rounded p-2 flex flex-col justify-center">
                  <span className="text-white/30 text-[9px] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Hash size={10} /> Lines
                  </span>
                  <div className="flex items-end gap-1">
                    <span className="text-[13px] font-bold text-white/80">{data.loc || 0}</span>
                    <span className="text-[9px] text-white/30 mb-0.5">LOC</span>
                  </div>
                </div>
              </div>
            )}
            
            {data.owner && (
              <div className="bg-[#111] border border-white/5 rounded p-2 mb-3 flex items-center justify-between">
                 <span className="text-white/30 text-[9px] uppercase tracking-wider flex items-center gap-1">
                    <Users size={10} /> Owner
                 </span>
                 <span className="text-[11px] font-medium text-white/70 bg-white/5 px-2 py-0.5 rounded">
                   @{data.owner}
                 </span>
              </div>
            )}
            
            {data.file && (
              <div className="bg-black/50 border border-white/5 rounded-md p-2 flex justify-between items-center">
                <span className="text-white/40 text-[10px] truncate max-w-[150px]">
                  {data.file.split('/').pop()}
                </span>
                <span className="text-emerald-500/70 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Ln {data.lineNum}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
