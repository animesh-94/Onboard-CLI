import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { FluidMatrix } from '@/components/ui/fluid-matrix';
import { Copy, Check } from 'lucide-react';

export default function Hero() {
  const [installTab, setInstallTab] = useState<'curl' | 'npm' | 'windows'>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let text = '';
    if (installTab === 'curl') {
      text = 'curl -sL https://raw.githubusercontent.com/animesh-94/Onboard-CLI/main/install.sh | bash';
    } else if (installTab === 'npm') {
      text = 'npm install -g onboard-cli';
    } else {
      text = 'Invoke-WebRequest -Uri "https://raw.githubusercontent.com/animesh-94/Onboard-CLI/main/install.ps1" -OutFile "install.ps1"; .\\install.ps1';
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logos = [
    { name: 'AST Context Slicing', desc: 'Navigate massive monorepos instantly. Dynamically prune noise and collapse out-of-scope directories into abstracted macro-nodes using native Tree-sitter parsing.' },
    { name: 'Visual Execution Canvas', desc: 'Launch a local, high-fidelity node editor directly from your terminal. Trace data flows and thread concurrency across microservices in a fully interactive map.' },
    { name: 'Blast Radius Analysis', tag: 'EARLY ACCESS', desc: 'Never break production. Run onboard impact to generate a complete reverse-dependency tree, showing exactly what remote services your local changes will affect.' },
    { name: 'Gamified Sandbox Evaluator', desc: 'Turn onboarding into an active challenge. Isolate specific repository modules and evaluate new developer code against hidden test cases in secure, containerized environments.' },
  ];

  return (
    <section className="relative w-full max-w-[1442px] mx-auto min-h-[850px] bg-black flex flex-col font-sans border-b border-[#1c1c1c] text-white">

      {/* Background Simulation */}
      <div className="absolute inset-y-0 w-[100vw] left-[calc(50%-50vw)] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_80%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] pointer-events-none">
        <FluidMatrix />
      </div>

      {/* Navbar overlay */}
      <Navbar />

      {/* Hero Body */}
      <div className="flex-1 flex flex-col justify-center relative z-10 px-10 md:px-20 pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-[1000px]"
        >
          <h1 className="text-[52px] md:text-[64px] lg:text-[72px] font-semibold tracking-[-0.03em] leading-[1.05] text-white mb-6">
            Stop reading code. <br />Start seeing architecture.
          </h1>

          <p className="pt-6 text-[18px] md:text-[20px] text-[#A1A1AA] leading-[1.6] max-w-[650px] mb-10 font-light">
            A local-first CLI that turns massive distributed systems from C++ cores to Java schedulers into dynamic, visual execution maps in seconds.
          </p>

          {/* Installation Command Box */}
          <div className="w-full max-w-[600px] bg-[#0A0A0A] border border-white/[0.1] rounded-xl overflow-hidden mb-8 shadow-2xl relative">
            <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none"></div>

            <div className="flex border-b border-white/[0.08] bg-black/40">
              <button
                onClick={() => setInstallTab('curl')}
                className={`px-5 py-3 text-[13px] font-medium transition-colors border-b-2 ${installTab === 'curl' ? 'border-emerald-500 text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
              >
                macOS / Linux
              </button>
              <button
                onClick={() => setInstallTab('windows')}
                className={`px-5 py-3 text-[13px] font-medium transition-colors border-b-2 ${installTab === 'windows' ? 'border-emerald-500 text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
              >
                Windows (PowerShell)
              </button>
              <button
                onClick={() => setInstallTab('npm')}
                className={`px-5 py-3 text-[13px] font-medium transition-colors border-b-2 ${installTab === 'npm' ? 'border-emerald-500 text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
              >
                NPM Package
              </button>
            </div>

            {/* Code Content */}
            <div className="p-5 flex items-center justify-between group">
              <div className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <code className="font-mono text-[14px] text-white/80 pr-4">
                  <span className="text-emerald-500 mr-2">{installTab === 'windows' ? '>' : '$'}</span>
                  {installTab === 'curl' && 'curl -sL https://raw.githubusercontent.com/animesh-94/Onboard-CLI/main/install.sh | bash'}
                  {installTab === 'npm' && 'npm install -g onboard-cli'}
                  {installTab === 'windows' && 'Invoke-WebRequest -Uri "https://raw.githubusercontent.com/animesh-94/Onboard-CLI/main/install.ps1" -OutFile "install.ps1"; .\\install.ps1'}
                </code>
              </div>

              <button
                onClick={handleCopy}
                className="ml-2 p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white transition-all flex-shrink-0"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* <Button variant="secondary" className="rounded-full px-6 py-6 text-[15px] font-semibold bg-white text-black hover:bg-zinc-200">
              Get started
            </Button>
            <Button variant="outline" className="rounded-full px-6 py-6 text-[15px] font-semibold bg-transparent border-white/20 text-white hover:bg-white/10">
              Read the docs
            </Button> */}
          </div>
        </motion.div>
      </div>

      {/* Bottom Feature Grid (replaces logo bar) */}
      <div className="relative z-10 border-t border-white/[0.08] bg-black/60 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          {logos.map((feature, i) => (
            <div key={i} className="p-8 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-emerald-400 transition-colors">
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                  <path d="M7 7h.01" />
                </svg>
                <h3 className="text-[15px] font-bold text-white tracking-tight">{feature.name}</h3>
                {feature.tag && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 ml-1">
                    {feature.tag}
                  </span>
                )}
              </div>
              <p className="text-[14px] text-white/50 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}