import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HookAnimation() {
  const [key, setKey] = useState(0);

  // Auto-loop the animation every 16 seconds to give users plenty of time to read
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, 16000);
    return () => clearInterval(interval);
  }, []);

  const isSuccess = key % 2 === 0;

  return (
    <section className="bg-black w-full py-20 relative font-sans overflow-hidden">

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Shift-Left Architecture Protection</h2>
        <p className="text-zinc-400 mt-4 text-xl">
          {isSuccess
            ? "Clean architecture allows your pipeline to move forward instantly."
            : "Catch bad dependencies and block toxic commits before they leave your laptop."}
        </p>
      </div>

      {/* Full Width Topology - No Outer Border, edge to edge */}
      <div className="w-full relative mt-16">
        <div className="w-full relative" style={{ height: '420px' }}>
          <TopologyStage key={key} isSuccess={isSuccess} />
        </div>
      </div>
    </section>
  );
}

function TopologyStage({ isSuccess }: { isSuccess: boolean }) {
  const [phase, setPhase] = useState(0);

  // Dramatically slowed down phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2000); // 2.0s: Path starts drawing
    const t2 = setTimeout(() => setPhase(2), 5000); // 5.0s: Result shows
    const t3 = setTimeout(() => setPhase(3), 8000); // 8.0s: CI/CD Deployment path starts
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isSuccess]);

  // Helper for absolute positioning percentages based on 1200x400 viewBox
  const pos = (x: number, y: number) => ({ left: `${(x / 1200) * 100}%`, top: `${(y / 400) * 100}%` });

  // Paths
  const revertPath = "M 800 200 L 800 112 Q 800 100 788 100 L 412 100 Q 400 100 400 112 L 400 200";
  const forwardPath = "M 800 200 L 800 288 Q 800 300 812 300 L 1050 300";
  const fallbackPath = "M 400 200 L 400 288 Q 400 300 412 300 L 650 300";

  const primaryPath = isSuccess ? forwardPath : revertPath;
  const primaryColor = isSuccess ? "#10b981" : "#f5a623";

  return (
    <div className="absolute inset-0 w-full h-full font-mono">

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="edge-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="white" />
            <stop offset="85%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Grid pattern with higher contrast (0.15) */}
          <pattern id="grid-full" width="20" height="400" patternUnits="userSpaceOnUse">
            <line x1="20" y1="0" x2="20" y2="400" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          </pattern>
        </defs>

        <g mask="url(#edge-fade)">
          {/* Background Grid */}
          <rect width="1200" height="400" fill="url(#grid-full)" />

          {/* Main Timeline Base Line */}
          <line x1="0" y1="200" x2="1200" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Sweeping Flowing Timeline */}
          <motion.line
            x1="0" y1="200" x2="1200" y2="200"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.0, ease: "easeOut" }}
          />

          {/* Small Ticks (Top side only) */}
          {[...Array(150)].map((_, i) => (
            <line key={i} x1={i * 8} y1="196" x2={i * 8} y2="200" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          ))}

          {/* Major Event Ticks */}
          <line x1="200" y1="192" x2="200" y2="200" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <line x1="400" y1="192" x2="400" y2="200" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <line x1="600" y1="192" x2="600" y2="200" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

          {/* The target commit tick */}
          <motion.line
            x1="800" y1="192" x2="800" y2="200"
            stroke={phase >= 2 ? (isSuccess ? "#10b981" : "#ef4444") : "rgba(255,255,255,0.6)"}
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          />

          {/* Primary Animation Path (Revert or Forward) */}
          <motion.path
            d={primaryPath}
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={phase >= 1 ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />

          {/* Fallback CI/CD Path (Only on Fail, phase 3) */}
          {!isSuccess && (
            <motion.path
              d={fallbackPath}
              fill="none"
              stroke="#3b82f6" // Blue for CI/CD deployment
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={phase >= 3 ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          )}
        </g>
      </svg>

      {/* HTML Overlays (Stacked labels below the timeline with flowing entrance animations) */}

      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="absolute flex flex-col items-start -translate-x-1/2 pt-4" style={pos(200, 200)}
      >
        <span className="text-xs text-zinc-500 mb-1">12:24</span>
        <span className="text-sm text-zinc-400">schema-v1</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="absolute flex flex-col items-start -translate-x-1/2 pt-4" style={pos(400, 200)}
      >
        <span className="text-xs text-zinc-500 mb-1">13:48</span>
        <span className="text-sm text-zinc-200">arch-checkpoint</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
        className="absolute flex flex-col items-start -translate-x-1/2 pt-4" style={pos(600, 200)}
      >
        <span className="text-xs text-zinc-500 mb-1">14:15</span>
        <span className="text-sm text-zinc-400">add-routes</span>
      </motion.div>

      {/* The Target Commit Label */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="absolute flex flex-col items-start -translate-x-1/2 pt-4"
        style={pos(800, 200)}
      >
        <span className="text-xs text-zinc-500 mb-1">17:18</span>
        <span className={`text-sm transition-colors duration-500 ${phase >= 2 ? (isSuccess ? 'text-[#10b981]' : 'text-[#ef4444]') : 'text-zinc-200'}`}>
          {phase >= 2 && !isSuccess ? 'commit-blocked' : 'git-commit'}
        </span>
      </motion.div>

      {/* The Glowing Pill for Onboard Drift */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide border z-10 transition-colors duration-500 ${phase >= 2
                ? isSuccess
                  ? 'bg-black text-[#10b981] border-[#10b981]/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-black text-[#ef4444] border-[#ef4444]/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : 'bg-black text-[#f5a623] border-[#f5a623]/50 shadow-[0_0_20px_rgba(245,166,35,0.2)]'
              }`}
            style={isSuccess ? pos(925, 300) : pos(600, 100)} // Positioned on the active path
          >
            <span>
              {phase >= 2
                ? (isSuccess ? 'architecture clean' : 'architecture drift detected')
                : 'checking architectural drift'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CI/CD Deployment Nodes (Phase 3) */}
      <AnimatePresence>
        {phase >= 3 && !isSuccess && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute flex items-center gap-2 -translate-y-1/2 ml-3"
            style={pos(650, 300)}
          >
            <div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" />
            <span className="text-xs text-[#3b82f6]">CI/CD deploys last clean version</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase >= 3 && isSuccess && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute flex items-center gap-2 -translate-y-1/2 ml-3"
            style={pos(1050, 300)}
          >
            <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]" />
            <span className="text-xs text-[#10b981]">CI/CD deploys new commit</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
