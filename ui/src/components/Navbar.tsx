import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-8 md:px-12 h-[80px] relative z-20 w-full"
    >
      {/* Left - Logo */}
      <div className="flex items-center w-1/3">
        <Link to="/" className="flex items-center gap-3 font-semibold text-[22px] tracking-tight text-white hover:opacity-80 transition-opacity">
          {/* Asterisk Logo matching the screenshot */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1l14.2-14.2" />
          </svg>
          <span className="tracking-[-0.04em]">onboard</span>
        </Link>
      </div>

      {/* Center - Pill Navigation */}
      <div className="hidden lg:flex items-center justify-center w-1/3">
        <div className="flex items-center bg-[#1A1A1A]/20 border border-white/[0.05] p-1.5 rounded-full backdrop-blur-xl">
          <Link
            to="/docs"
            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${path.startsWith('/docs') ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-[#888888] hover:text-white hover:bg-white/[0.04]'
              }`}
          >
            Docs
          </Link>
          <a
            href="#context-owner"
            className="px-5 py-2 rounded-full text-[#888888] hover:text-white hover:bg-white/[0.04] text-[13px] font-medium transition-all"
          >
            Features
          </a>
          <Link
            to="/blog"
            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${path.startsWith('/blog') ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-[#888888] hover:text-white hover:bg-white/[0.04]'
              }`}
          >
            Blog
          </Link>
        </div>
      </div>

      {/* Right - Mobile Toggle */}
      <div className="flex lg:hidden items-center justify-end w-1/3">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white/70 hover:text-white p-2 focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Right - Desktop CTA */}
      <div className="hidden lg:flex items-center justify-end w-1/3">
        {/* <Button variant="secondary" className="rounded-full px-5 py-2.5 h-auto text-[13px] font-medium bg-white text-black hover:bg-[#e0e0e0] transition-colors">
          Request Access
        </Button> */}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[80px] left-0 right-0 bg-[#0A0A0A] border-b border-white/10 flex flex-col p-6 shadow-2xl z-50 lg:hidden"
          >
            <Link to="/docs" onClick={() => setIsOpen(false)} className={`py-4 text-[15px] font-medium border-b border-white/[0.05] ${path.startsWith('/docs') ? 'text-white' : 'text-zinc-400'}`}>Docs</Link>
            <a href="#context-owner" onClick={() => setIsOpen(false)} className="py-4 text-[15px] font-medium border-b border-white/[0.05] text-zinc-400">Features</a>
            <Link to="/blog" onClick={() => setIsOpen(false)} className={`py-4 text-[15px] font-medium ${path.startsWith('/blog') ? 'text-white' : 'text-zinc-400'}`}>Blog</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
