'use client';

import { useState, useEffect } from 'react';
import { BlastRadiusScene } from '@/remotion/BlastRadiusScene';
function FeatureSection({ id, title, subtitle, description, imageNode }: { id: string, title: string, subtitle: string, description?: string, imageNode: React.ReactNode }) {
  return (
    <div id={id} className="min-h-[80vh] py-32 border-t border-white/[0.05] first:border-0 relative grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16 items-center">
      <div className="xl:col-span-5 w-full">
        <h2 className="text-[32px] md:text-[36px] font-semibold text-white tracking-tight leading-[1.1] mb-6">
          {title}
        </h2>
        <p className="text-[18px] md:text-[20px] text-[#A1A1AA] leading-[1.5] font-light mb-6">
          {subtitle}
        </p>
        {description && (
          <p className="text-[15px] text-[#A1A1AA]/70 leading-[1.6] font-light">
            {description}
          </p>
        )}
      </div>

      <div className="xl:col-span-7 relative w-full rounded-xl border border-white/[0.1] bg-black overflow-hidden flex items-center justify-center p-4 sm:p-8 shadow-2xl">
        {/* Glow effect behind the image node */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

        {imageNode}
      </div>
    </div>
  );
}

export default function BentoGrid() {
  const [activeSection, setActiveSection] = useState('context-owner');

  const sections = [
    { id: 'context-owner', label: 'Context Owner' },
    { id: 'blast-radius', label: 'Blast Radius' },
    { id: 'visual-mapper', label: 'Visual Mapper' },
    { id: 'entry-mapper', label: 'Entry Point Mapper' },
    { id: 'arch-linter', label: 'Architecture Linter' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is intersecting and covers a good portion of the screen
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-black relative w-full max-w-[1442px] mx-auto px-10">
      <div className="flex relative">

        {/* Sticky Sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0 border-r border-white/[0.05] py-32 sticky top-0 h-screen">
          <ul className="space-y-4">
            {sections.map(section => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`text-[13px] font-medium flex items-center transition-colors ${activeSection === section.id ? 'text-white' : 'text-white/40 hover:text-white/80'
                    }`}
                >
                  {activeSection === section.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-3"></span>
                  )}
                  <span className={activeSection !== section.id ? 'pl-[18px]' : ''}>
                    {section.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 lg:pl-20">

          <FeatureSection
            id="context-owner"
            title="Context Owner Engine."
            subtitle="Calculate which team members own the highest percentage of any given module. Stop guessing who to tag for a PR review."
            description="Bypass superficial git blame logs. The Context Owner Engine cross-references deep commit history with AST node density to find the true architect of any codebase segment. Whether you are looking at a localized memory allocator or a distributed scheduling service, onboard owners cuts through legacy noise to instantly identify the engineer who actually understands the active business logic."
            imageNode={
              <div className="w-full h-full min-h-[350px] md:min-h-[450px] border border-white/[0.05] rounded-xl bg-[#0A0A0A] shadow-2xl relative overflow-hidden flex flex-col font-sans text-xs text-zinc-400">
                {/* IDE Window Bar */}
                <div className="h-8 border-b border-white/[0.05] flex items-center px-4 bg-[#050505] shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/50"></div>
                  </div>
                  <div className="mx-auto text-[11px] font-medium text-zinc-500">Your Code Editor</div>
                </div>

                {/* IDE Body */}
                <div className="flex-1 flex overflow-hidden">
                  
                  {/* Left Sidebar (File Tree) */}
                  <div className="w-32 hidden md:block border-r border-white/[0.05] p-3 font-mono text-[10px] bg-[#050505]">
                    <div className="text-zinc-600 mb-2 uppercase tracking-wider text-[9px] font-sans">PROJECT</div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-zinc-300 flex items-center gap-1.5"><span>▾</span> src</div>
                      <div className="pl-3 flex flex-col gap-1.5">
                        <div className="text-zinc-500">auth</div>
                        <div className="pl-3 text-emerald-400 bg-emerald-500/10 -mx-1 px-1 rounded">auth.go</div>
                        <div className="pl-3 text-zinc-500">models.go</div>
                        <div className="text-zinc-500">db</div>
                      </div>
                    </div>
                  </div>

                  {/* Center Column (Editor + Terminal) */}
                  <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.05]">
                    {/* Editor Tabs */}
                    <div className="h-8 border-b border-white/[0.05] flex items-center px-2 bg-[#050505]">
                      <div className="px-3 py-1 bg-[#0A0A0A] border-t border-emerald-500/30 text-zinc-300 text-[11px] flex items-center gap-2 rounded-t-md mt-1">
                        auth.go <span className="text-zinc-600 hover:text-zinc-400 cursor-pointer">×</span>
                      </div>
                    </div>
                    {/* Editor Content */}
                    <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-hidden bg-[#0A0A0A]">
                      <div className="flex gap-4">
                        <div className="text-zinc-700 flex flex-col select-none">
                          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                        </div>
                        <div className="text-zinc-300">
                          <span className="text-pink-400">func</span> <span className="text-blue-400">VerifyToken</span>(tokenString <span className="text-emerald-400">string</span>) (*Claims, <span className="text-emerald-400">error</span>) {'{\n'}
                          <span className="text-zinc-500">  // Parse and validate JWT token</span><br/>
                          {'  '}token, err := jwt.<span className="text-blue-300">ParseWithClaims</span>(tokenString, &Claims{'{}{}'}, keyFunc)<br/>
                          {'  '}<span className="text-pink-400">if</span> err != <span className="text-orange-400">nil</span> {'{\n'}
                          {'    '}<span className="text-pink-400">return</span> <span className="text-orange-400">nil</span>, err<br/>
                          {'  }'}
                        </div>
                      </div>
                    </div>

                    {/* Terminal Pane */}
                    <div className="h-[120px] shrink-0 border-t border-white/[0.05] bg-[#050505] flex flex-col">
                      <div className="flex items-center px-4 h-8 border-b border-white/[0.05] gap-4 text-[10px]">
                        <span className="text-zinc-600 hover:text-zinc-300">Problems</span>
                        <span className="text-zinc-600 hover:text-zinc-300">Output</span>
                        <span className="text-emerald-400 border-b border-emerald-400 h-full flex items-center">Terminal</span>
                      </div>
                      <div className="p-3 font-mono text-[11px] leading-relaxed overflow-hidden">
                        <span className="text-emerald-400">$</span> onboard owners --target src/auth<br/>
                        <span className="text-zinc-500">Analyzing git history & AST dependencies...</span><br/>
                        <span className="text-emerald-400">Success! Context mapped.</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar (Assistant / Output) */}
                  <div className="w-56 hidden lg:flex flex-col bg-[#050505] p-4 text-[11px]">
                    <div className="text-zinc-200 font-medium mb-4 flex items-center justify-between">
                      Context Owner Map
                      <span className="text-zinc-600">⋯</span>
                    </div>
                    
                    <div className="text-zinc-400 mb-4 leading-relaxed">
                      Based on AST density and git history, here are the true architects of <span className="text-zinc-200 bg-white/5 px-1 rounded">src/auth</span>:
                    </div>

                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex items-start gap-2 p-2 rounded-md bg-white/[0.02] border border-white/[0.05]">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px]">S</div>
                        <div>
                          <div className="text-emerald-400 font-medium">@sarah_dev <span className="text-zinc-500 font-normal">(Primary)</span></div>
                          <div className="text-zinc-500 text-[10px] mt-0.5">68% logic • 42 commits</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2 rounded-md bg-transparent">
                        <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px]">M</div>
                        <div>
                          <div className="text-blue-400 font-medium">@mike_eng</div>
                          <div className="text-zinc-500 text-[10px] mt-0.5">22% logic • 15 commits</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="relative border border-white/10 rounded-md bg-[#0A0A0A] p-2 flex items-center">
                        <span className="text-zinc-600 italic text-[10px]">Tag @sarah_dev for review...</span>
                        <div className="absolute right-2 text-zinc-500">↑</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            }
          />

          <FeatureSection
            id="blast-radius"
            title="Blast Radius Analyzer."
            subtitle="Traverses the reverse AST call-graph to map exact downstream dependencies before you merge. Never break production blindly again."
            description="Before you commit a refactor in your core engine, know exactly which external microservices will fail. onboard impact recursively traces reverse-dependencies across your entire system architecture. It doesn't just read imports; it calculates the exact architectural blast radius of a specific function signature, highlighting vulnerable downstream endpoints in your terminal before your CI/CD pipeline even triggers."
            imageNode={
              <div className="w-full h-full min-h-[350px] md:min-h-[450px] border border-white/[0.05] rounded-xl bg-[#050505] shadow-2xl relative overflow-hidden flex flex-col font-mono">
                <BlastRadiusScene />
              </div>
            }
          />

          <FeatureSection
            id="visual-mapper"
            title="Visual Execution Mapper."
            subtitle="Don't just read code see it. Spawns a localized React canvas bridging terminal AST outputs to high-fidelity visual node graphs."
            description="Instantly translate tens of thousands of lines of complex logic into a navigable, infinite canvas. Running onboard map spins up a secure, zero-telemetry local rendering engine. Zoom effortlessly from a macro-architecture overview down to individual function execution threads. By hooking into runtime traces, the mapper illuminates active data pathways, letting you watch how payloads move through your system in real-time."
            imageNode={
              <div className="w-full h-full min-h-[350px] md:min-h-[450px] border border-white/[0.05] rounded-xl bg-[#050505] shadow-2xl relative overflow-hidden flex flex-col font-mono">
                {/* Canvas Background Grid */}
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                  <path d="M 220 225 C 300 225, 300 120, 380 120" stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 220 225 C 300 225, 300 330, 380 330" stroke="rgba(16,185,129,0.5)" fill="none" strokeWidth="2" />
                  <path d="M 540 330 L 620 330" stroke="rgba(16,185,129,0.5)" fill="none" strokeWidth="2" />

                  {/* Animated Payload Dot */}
                  <circle cx="380" cy="330" r="4" fill="#10b981" className="animate-pulse">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M -160 -105 C -80 -105, -80 0, 0 0" />
                  </circle>
                </svg>

                <div className="relative z-10 w-full h-full">
                  {/* Gateway Node */}
                  <div className="absolute top-[225px] left-[60px] w-[160px] -translate-y-1/2 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/50">ENTRY</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                    </div>
                    <div className="text-[12px] text-white font-medium">Gateway.route()</div>
                    <div className="text-[10px] text-white/40 mt-1">45ms • HTTP 200</div>
                  </div>

                  {/* Auth Node (Inactive path) */}
                  <div className="absolute top-[120px] left-[380px] w-[160px] -translate-y-1/2 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/5 rounded-lg p-3 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/30">MIDDLEWARE</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                    </div>
                    <div className="text-[12px] text-white/70 font-medium">Auth.verify()</div>
                    <div className="text-[10px] text-white/30 mt-1">cached • 2ms</div>
                  </div>

                  {/* Payment Node (Active path) */}
                  <div className="absolute top-[330px] left-[380px] w-[160px] -translate-y-1/2 bg-[#050505] backdrop-blur-md border border-emerald-500/30 rounded-lg p-3 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-emerald-500/70">SERVICE</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <div className="text-[12px] text-emerald-400 font-medium">Payment.process()</div>
                    <div className="text-[10px] text-white/40 mt-1 flex items-center gap-2">
                      <span className="text-emerald-500/70">active</span>
                      <span>142ms</span>
                    </div>
                  </div>

                  {/* Stripe DB Node (Active path) */}
                  <div className="absolute top-[330px] left-[620px] w-[140px] -translate-y-1/2 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/50">EXTERNAL</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="text-[12px] text-white font-medium">Stripe API</div>
                    <div className="text-[10px] text-white/40 mt-1">req_id: 8f92a...</div>
                  </div>
                </div>

                {/* Mini UI Controls */}
                <div className="absolute bottom-4 right-4 flex bg-black/80 border border-white/10 rounded-md p-1 backdrop-blur-md">
                  <div className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors">+</div>
                  <div className="w-px h-6 bg-white/10 mx-1"></div>
                  <div className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors">-</div>
                </div>

                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded">Live Trace</div>
                  <div className="px-2 py-1 bg-white/5 border border-white/10 text-white/50 text-[10px] rounded">ReqID: req_99x2</div>
                </div>
              </div>
            }
          />

          <FeatureSection
            id="entry-mapper"
            title="Map the Perimeter."
            subtitle="Run `onboard routes` to parse gRPC, Spring, and Gin routers instantly."
            description="Generate a clean table mapping every exposed API endpoint directly to its handler function."
            imageNode={
              <div className="w-full h-full min-h-[350px] md:min-h-[450px] border border-white/[0.05] rounded-xl bg-[#0A0A0A] shadow-2xl relative overflow-hidden flex flex-col font-sans text-xs text-zinc-400">
                {/* Neovim Top Bar (tmux-like) */}
                <div className="h-6 flex items-center px-2 bg-emerald-900/20 text-[10px] font-mono text-emerald-500/70 border-b border-white/[0.05]">
                  <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 mr-2">NORMAL</span>
                  <span className="text-zinc-500">routes.go</span>
                  <span className="ml-auto text-zinc-600">utf-8[unix]</span>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  
                  {/* Left Sidebar (NvimTree) */}
                  <div className="w-32 hidden md:block border-r border-white/[0.05] p-2 font-mono text-[10px] bg-[#050505]">
                    <div className="text-zinc-300 flex items-center gap-1 mb-1"><span>▾</span> src</div>
                    <div className="pl-2 flex flex-col gap-1 text-zinc-500">
                      <div>▾ api</div>
                      <div className="pl-2 text-emerald-400">routes.go</div>
                      <div className="pl-2">handlers.go</div>
                      <div className="pl-2">middleware.go</div>
                    </div>
                  </div>

                  {/* Center Column (Code) */}
                  <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.05]">
                    <div className="flex-1 p-3 font-mono text-[11px] leading-relaxed overflow-hidden bg-[#050505]">
                      <div className="flex gap-3">
                        <div className="text-zinc-700 flex flex-col select-none text-right w-4">
                          <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span>
                        </div>
                        <div className="text-zinc-300">
                          r.<span className="text-blue-400">GET</span>(<span className="text-emerald-400">"/api/data"</span>, handlers.GetData)<br/>
                          r.<span className="text-blue-400">POST</span>(<span className="text-emerald-400">"/api/users"</span>, handlers.CreateUser)<br/>
                          <br/>
                          <span className="text-zinc-500">~</span><br/>
                          <span className="text-zinc-500">~</span><br/>
                        </div>
                      </div>
                    </div>

                    {/* Terminal Pane */}
                    <div className="h-[140px] shrink-0 border-t border-white/[0.05] bg-[#0A0A0A] p-3 font-mono text-[11px] leading-relaxed">
                      <span className="text-emerald-400">❯</span> onboard routes --framework gin<br/>
                      <span className="text-zinc-500">Mapping endpoints...</span><br/><br/>
                      <span className="text-emerald-400">GET</span>  /api/data  <span className="text-zinc-500">-&gt;</span> handlers.GetData<br/>
                      <span className="text-blue-400">POST</span> /api/users <span className="text-zinc-500">-&gt;</span> handlers.CreateUser
                    </div>
                  </div>

                  {/* Right Sidebar (Assistant) */}
                  <div className="w-56 hidden lg:flex flex-col bg-[#050505] p-4 text-[11px]">
                    <div className="text-zinc-200 font-medium mb-3">Endpoint Analysis</div>
                    <div className="text-zinc-400 mb-4 leading-relaxed">
                      Found <span className="text-white">2</span> endpoints in <span className="text-emerald-400">routes.go</span>.
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-2 border border-emerald-500/20 bg-emerald-500/5 rounded-md">
                        <div className="text-emerald-400 font-mono text-[10px] mb-1">GET /api/data</div>
                        <div className="text-zinc-500 text-[10px]">Public · No Auth</div>
                      </div>
                      <div className="p-2 border border-blue-500/20 bg-blue-500/5 rounded-md">
                        <div className="text-blue-400 font-mono text-[10px] mb-1">POST /api/users</div>
                        <div className="text-zinc-500 text-[10px]">Protected · JWT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          <FeatureSection
            id="arch-linter"
            title="Prevent Spaghetti Code."
            subtitle="Run `onboard drift` to enforce strict architectural boundaries."
            description="Define rules in YAML and use AST traversal to catch structural violations before they merge."
            imageNode={
              <div className="w-full h-full min-h-[350px] md:min-h-[450px] border border-white/[0.05] rounded-xl bg-[#0A0A0A] shadow-2xl relative overflow-hidden flex flex-col font-sans text-xs text-zinc-400">
                {/* Neovim Top Bar */}
                <div className="h-6 flex items-center px-2 bg-red-900/20 text-[10px] font-mono text-red-500/70 border-b border-white/[0.05]">
                  <span className="bg-red-500/10 px-2 py-0.5 rounded text-red-400 mr-2">ERROR</span>
                  <span className="text-zinc-500">handlers.go</span>
                  <span className="ml-auto text-zinc-600">L42:C15</span>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  
                  {/* Left Sidebar (NvimTree) */}
                  <div className="w-32 hidden md:block border-r border-white/[0.05] p-2 font-mono text-[10px] bg-[#050505]">
                    <div className="text-zinc-300 flex items-center gap-1 mb-1"><span>▾</span> project</div>
                    <div className="pl-2 flex flex-col gap-1 text-zinc-500">
                      <div className="text-zinc-400">architecture.yml</div>
                      <div className="mt-2">▾ src</div>
                      <div className="pl-2 text-red-400">handlers.go</div>
                      <div className="pl-2">db/</div>
                    </div>
                  </div>

                  {/* Center Column (Code) */}
                  <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.05]">
                    <div className="flex-1 p-3 font-mono text-[11px] leading-relaxed overflow-hidden bg-[#050505] relative">
                      <div className="absolute top-1/2 left-0 w-full h-[18px] bg-red-500/10 -translate-y-1/2 pointer-events-none"></div>
                      <div className="flex gap-3 relative z-10">
                        <div className="text-zinc-700 flex flex-col select-none text-right w-4">
                          <span>40</span><span>41</span><span className="text-red-400">42</span><span>43</span><span>44</span>
                        </div>
                        <div className="text-zinc-300">
                          <span className="text-pink-400">import</span> (<br/>
                          {'  '}<span className="text-emerald-400">"fmt"</span><br/>
                          {'  '}<span className="text-emerald-400 bg-red-500/20">"github.com/org/db/postgres"</span> <span className="text-red-400 ml-2">← UI cannot import DB</span><br/>
                          )<br/>
                          <br/>
                        </div>
                      </div>
                    </div>

                    {/* Terminal Pane */}
                    <div className="h-[140px] shrink-0 border-t border-white/[0.05] bg-[#0A0A0A] p-3 font-mono text-[11px] leading-relaxed">
                      <span className="text-emerald-400">❯</span> onboard drift --rules architecture.yml<br/><br/>
                      <span className="text-red-400">❌ Violation Detected:</span><br/>
                      <span className="text-zinc-400">[Line 42]</span> handlers.go: UI Layer cannot import Database Layer<br/>
                      <span className="text-zinc-500">(Rule: strict-layers)</span>
                    </div>
                  </div>

                  {/* Right Sidebar (Assistant) */}
                  <div className="w-56 hidden lg:flex flex-col bg-[#050505] p-4 text-[11px]">
                    <div className="text-zinc-200 font-medium mb-3">Dependency Graph</div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                      <div className="px-3 py-1.5 border border-white/10 bg-[#0A0A0A] rounded text-zinc-300">
                        UI Layer
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-px h-6 bg-red-500/50"></div>
                        <div className="text-red-400 text-[16px] leading-none -mt-1">×</div>
                      </div>
                      
                      <div className="px-3 py-1.5 border border-red-500/30 bg-red-500/10 rounded text-red-400">
                        Database Layer
                      </div>
                    </div>

                    <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded-md text-red-400/80 text-[10px]">
                      Fix: Route this query through the Domain Layer service instead.
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
