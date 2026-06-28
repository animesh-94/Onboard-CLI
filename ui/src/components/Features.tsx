import { FluidMatrix } from './ui/fluid-matrix';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, TerminalSquare, Unlock } from 'lucide-react';

export default function Features() {
  return (
    <section className="bg-black relative w-full border-t border-white/[0.05] overflow-hidden min-h-[600px] flex items-center">
      <div className="absolute inset-0 w-full h-full [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_95%,transparent)]">
        <FluidMatrix className="opacity-30" />
      </div>
      <div className="max-w-[1442px] mx-auto px-10 py-40 relative z-10 w-full">
        <h2 className="text-[48px] md:text-[56px] font-semibold text-white tracking-tight leading-[1.1] mb-20 max-w-[800px]">
          Zero telemetry.<br /> Enterprise-grade security by default.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          <div className="group">
            <ShieldCheck className="w-8 h-8 mb-6 text-emerald-500/80 group-hover:scale-110 transition-transform" />
            <h3 className="text-[18px] font-bold text-white mb-3 tracking-tight">Air-Gapped Ready</h3>
            <p className="text-[16px] text-zinc-400 font-medium leading-relaxed">
              <strong className="text-zinc-300 font-semibold block mb-1">Local-First Execution</strong>
              Your source code never leaves your machine. Onboard parses ASTs and compiles the SQLite dependency graphs entirely locally. No cloud endpoints, no data harvesting.
            </p>
          </div>

          <div className="group">
            <TerminalSquare className="w-8 h-8 mb-6 text-emerald-500/80 group-hover:scale-110 transition-transform" />
            <h3 className="text-[18px] font-bold text-white mb-3 tracking-tight">CI/CD Native</h3>
            <p className="text-[16px] text-zinc-400 font-medium leading-relaxed">
              <strong className="text-zinc-300 font-semibold block mb-1">Headless Pipeline Integration</strong>
              Don't just run it locally. Embed onboard drift and onboard impact directly into your GitHub Actions or GitLab CI to automatically block toxic PRs before they merge.
            </p>
          </div>

          <div className="group">
            <Unlock className="w-8 h-8 mb-6 text-emerald-500/80 group-hover:scale-110 transition-transform" />
            <h3 className="text-[18px] font-bold text-white mb-3 tracking-tight">Open Architecture</h3>
            <p className="text-[16px] text-zinc-400 font-medium leading-relaxed">
              <strong className="text-zinc-300 font-semibold block mb-1">No Vendor Lock-In</strong>
              Stop paying per-seat licenses for static analysis. Export your reverse-dependency graphs to standard JSON formats, or visualize them via the zero-dependency local React canvas.
            </p>
          </div>
        </div>

        {/* CTA block */}
        <div className="flex flex-col items-center text-center mt-48 mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-[56px] md:text-[80px] font-extrabold tracking-[-0.045em] leading-[1.02] text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700 mb-10"
          >
            Ready to map <br /> your systems?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
          </motion.div>
        </div>
      </div>
    </section>
  );
}
