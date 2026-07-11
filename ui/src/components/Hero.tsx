import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Copy, Check } from 'lucide-react';

const Github = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Hero() {
  const [installTab, setInstallTab] = useState<'curl' | 'go' | 'windows'>('curl');
  const [copied, setCopied] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');

  const handleCopy = () => {
    let text = '';
    if (installTab === 'curl') {
      text = 'curl -sL https://raw.githubusercontent.com/animesh-94/Onboard-CLI/main/install.sh | bash';
    } else if (installTab === 'go') {
      text = 'go install github.com/animesh-94/Onboard-CLI@latest';
    } else {
      text = "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri \"https://raw.githubusercontent.com/animesh-94/Onboard-CLI/main/install.ps1\" -OutFile \"install.ps1\"; .\\install.ps1";
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logos = [
    { name: 'AST Context Slicing', desc: 'Navigate massive monorepos instantly. Dynamically prune noise and collapse out-of-scope directories into abstracted macro-nodes using native Tree-sitter parsing.', video: '/feature-ast.mp4' },
    { name: 'Visual Execution Canvas', desc: 'Launch a local, high-fidelity node editor directly from your terminal. Trace data flows and thread concurrency across microservices in a fully interactive map.', image: '/feature-canvas.png' },
    { name: 'Blast Radius Analysis', desc: 'Never break production. Run onboard impact to generate a complete reverse-dependency tree, showing exactly what remote services your local changes will affect.', image: '/feature-impact.png' },
  ];

  return (
    <section className="relative w-full max-w-[1442px] mx-auto min-h-screen bg-black flex flex-col font-sans border-x border-[#1c1c1c] text-white">

      {/* Navbar overlay */}
      <div className="w-full border-b border-[#1c1c1c]">
        <Navbar />
      </div>

      {/* Hero Body */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 px-6 md:px-20 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col items-center w-full max-w-[800px]"
        >

          <h1 className="text-[48px] md:text-[64px] lg:text-[72px] font-semibold tracking-[-0.03em] leading-[1.05] mb-6">
            <span className="text-white">Stop reading code.</span> <span className="text-[#888]">Start seeing architecture.</span>
          </h1>

          <p className="pt-2 text-[18px] md:text-[20px] text-[#A1A1AA] leading-[1.6] max-w-[650px] mb-8 font-light">
            A local-first CLI that turns massive distributed systems from C++ cores to Java schedulers into dynamic, visual execution maps in seconds.
          </p>

          {/* Installation Command Box */}
          <div className="w-full max-w-[650px] bg-[#0A0A0A] border border-[#222] rounded-lg overflow-hidden mb-12 flex flex-col text-left shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#222] bg-black">
              <span className="text-[10px] font-mono tracking-widest text-[#666] uppercase">Terminal</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setInstallTab('curl')}
                  className={`px-3 py-1 text-[11px] font-mono rounded ${installTab === 'curl' ? 'bg-white text-black font-semibold' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
                >
                  curl
                </button>
                <button
                  onClick={() => setInstallTab('windows')}
                  className={`px-3 py-1 text-[11px] font-mono rounded ${installTab === 'windows' ? 'bg-white text-black font-semibold' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
                >
                  powershell
                </button>
                <button
                  onClick={() => setInstallTab('go')}
                  className={`px-3 py-1 text-[11px] font-mono rounded ${installTab === 'go' ? 'bg-white text-black font-semibold' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
                >
                  go
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-5 flex items-center justify-between group bg-[#0A0A0A]">
              <div className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <code className="font-mono text-[13px] text-white/90 pr-4">
                  <span className="text-[#00FF00] mr-3">{'>_'}</span>
                  {installTab === 'curl' && 'curl -sL https://raw.githubusercontent.com/animesh-94/Onboard-CLI/main/install.sh | bash'}
                  {installTab === 'go' && 'go install github.com/animesh-94/Onboard-CLI@latest'}
                  {installTab === 'windows' && "Invoke-WebRequest -Uri \"...\" -OutFile \"install.ps1\"; .\\install.ps1"}
                </code>
              </div>

              <button
                onClick={handleCopy}
                className="ml-3 p-1.5 text-[#666] hover:text-white transition-all flex-shrink-0"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-white" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full max-w-[650px] items-center mt-8 relative group">
            <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full pointer-events-none group-focus-within:bg-white/10 transition-colors duration-500"></div>
            <p className="text-[#888] text-sm mb-4 font-medium tracking-wide">Try it now with any public GitHub repository</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (repoUrl.trim()) {
                  window.location.href = `/app?url=${encodeURIComponent(repoUrl.trim())}`;
                }
              }}
              className="relative flex items-center w-full bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-full focus-within:border-white/50 focus-within:ring-4 focus-within:ring-white/10 transition-all duration-300 shadow-2xl p-1.5"
            >
              <div className="pl-5 pr-3 flex items-center justify-center text-gray-400">
                <Github size={20} />
              </div>
              <input
                type="text"
                placeholder="https://github.com/facebook/react"
                className="bg-transparent border-none outline-none text-[16px] py-3.5 w-full text-white placeholder-[#555] font-medium"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded-full font-semibold text-[15px] transition-all duration-300 whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center gap-2"
              >
                Analyze Repo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Video Placeholder Section */}
      <div className="w-full px-6 md:px-20 pb-32 relative z-10 flex justify-center mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[1024px] aspect-video rounded-2xl p-2 border border-[#333] bg-[#0A0A0A] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group overflow-hidden"
        >
          {/* Inner Video Container */}
          <div className="w-full h-full bg-[#050505] border border-[#222] rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>

      {/* Revamped Feature Section */}
      <div className="relative z-10 bg-black w-full pt-24 pb-0">
        <div className="px-8 md:px-16 mb-20 max-w-[1000px]">
          <span className="text-[11px] font-mono tracking-[0.2em] text-[#555] uppercase mb-6 block">Why Onboard</span>
          <h2 className="text-[32px] md:text-[46px] font-medium tracking-tight text-white leading-[1.15] mb-6">
            The tradeoffs other tools make, <span className="text-[#888]">solved.</span>
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#888] font-light max-w-[750px] leading-[1.6]">
            We built Onboard because relying on standard static analysis or heavy profilers forces you into a false choice between shallow context and unmanageable complexity.
          </p>
        </div>

        <div className="w-full flex flex-col border-y border-[#1c1c1c] divide-y divide-[#1c1c1c]">
          {logos.map((feature, i) => {
            const isReversed = i % 2 === 1;
            return (
              <div key={i} className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} w-full`}>

                {/* Text Section */}
                <div className={`w-full md:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center`}>
                  <h3 className="text-[24px] md:text-[28px] font-medium text-white tracking-tight mb-5">{feature.name}</h3>
                  <p className="text-[16px] md:text-[18px] text-[#888] leading-relaxed font-light max-w-[450px]">
                    {feature.desc}
                  </p>
                </div>

                {/* Image Section */}
                <div className={`w-full md:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col items-center justify-center bg-[#050505]/50 border-t md:border-t-0 ${isReversed ? 'md:border-r' : 'md:border-l'} border-[#1c1c1c]`}>
                  <div className="w-full aspect-video bg-[#0A0A0A] border border-white/5 rounded-xl flex items-center justify-center shadow-lg relative group overflow-hidden">
                    {/* Subtle Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/[0.02] blur-[80px] rounded-full pointer-events-none group-hover:bg-white/[0.04] transition-colors duration-500 z-0"></div>
                    {/* Media */}
                    {feature.video ? (
                      <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      >
                        <source src={feature.video} type="video/mp4" />
                      </video>
                    ) : (
                      <img 
                        src={feature.image} 
                        alt={feature.name} 
                        className="w-full h-full object-cover z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.querySelector('.fallback-text')?.classList.remove('hidden');
                        }}
                      />
                    )}
                    
                    {/* Fallback Text (shows if image fails to load) */}
                    {!feature.video && (
                      <div className="fallback-text hidden absolute inset-0 flex items-center justify-center text-sm text-[#555] font-mono uppercase tracking-widest z-0 text-center px-4">
                        Placeholder for: {feature.image}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}