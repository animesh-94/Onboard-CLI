import { motion } from 'framer-motion';

export default function ArchitectureDiagram() {
  return (
    <div className="w-full bg-[#050505] border border-white/[0.1] rounded-2xl p-6 md:p-10 shadow-2xl overflow-hidden font-sans relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-stretch justify-between max-w-[800px] mx-auto">
        
        {/* Left Side: User & Entry Point */}
        <div className="flex flex-col items-center justify-center min-w-[180px] gap-8">
          <div className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl p-4 text-center">
            <span className="block text-zinc-400 text-xs font-semibold tracking-wider mb-2">USER</span>
            <span className="text-white font-mono text-sm">Terminal</span>
          </div>
          
          <div className="h-8 w-px bg-emerald-500/50" />
          
          <div className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center shadow-[0_0_20px_rgba(16,185,129,0.15)] relative">
            <span className="block text-emerald-400 text-xs font-bold tracking-wider mb-2">ENTRY</span>
            <span className="text-white font-bold">Cobra CLI Engine</span>
          </div>
        </div>
        
        {/* Connection Lines for Desktop (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col justify-center relative min-w-[40px]">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.15] -translate-y-1/2" />
          <div className="absolute left-1/2 top-[15%] bottom-[15%] w-px bg-white/[0.15]" />
          {/* Prongs */}
          <div className="absolute left-1/2 right-0 top-[15%] h-px bg-white/[0.15]" />
          <div className="absolute left-1/2 right-0 bottom-[15%] h-px bg-white/[0.15]" />
        </div>
        
        {/* Right Side: The 3 Subsystems */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Analysis Engine */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
            <h4 className="text-blue-400 text-xs font-bold tracking-widest mb-4">ANALYSIS ENGINE</h4>
            <div className="flex flex-col gap-3">
              <div className="bg-black border border-white/[0.1] rounded p-3 text-center">
                <span className="text-zinc-300 text-sm font-mono">Tree-sitter AST Parser</span>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-3 bg-white/[0.2]" />
              </div>
              <div className="bg-black border border-white/[0.1] rounded p-3 text-center">
                <span className="text-zinc-300 text-sm font-mono">Graph Abstraction</span>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-3 bg-white/[0.2]" />
              </div>
              <div className="bg-black border border-white/[0.1] rounded p-3 text-center border-dashed">
                <span className="text-zinc-300 text-sm font-mono text-blue-200">Local SQLite Cache</span>
              </div>
            </div>
          </div>
          
          {/* Frontend Delivery */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
            <h4 className="text-emerald-400 text-xs font-bold tracking-widest mb-4">FRONTEND DELIVERY</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 bg-black border border-white/[0.1] rounded p-3 text-center w-full">
                <span className="text-zinc-300 text-sm font-mono">Internal HTTP Server</span>
              </div>
              <div className="text-zinc-600 text-xs font-mono">↔ WS ↔</div>
              <div className="flex-1 bg-black border border-white/[0.1] rounded p-3 text-center w-full">
                <span className="text-zinc-300 text-sm font-mono text-emerald-200">React Node Canvas</span>
              </div>
            </div>
          </div>
          
          {/* Security Layer */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50" />
            <h4 className="text-rose-400 text-xs font-bold tracking-widest mb-4">SECURITY LAYER</h4>
            <div className="flex gap-4">
              <div className="flex-1 bg-black border border-white/[0.1] rounded p-3 text-center">
                <span className="text-zinc-300 text-[13px] font-mono">Wazero Sandbox</span>
              </div>
              <div className="flex-1 bg-black border border-white/[0.1] rounded p-3 text-center">
                <span className="text-zinc-300 text-[13px] font-mono">OS Resource Limiter</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
