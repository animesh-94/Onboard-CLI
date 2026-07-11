import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Star } from 'lucide-react';
import { Github } from './GithubIcon';
import CommandPalette from './CommandPalette';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/animesh-94/Onboard-CLI')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center w-full h-[80px] relative z-20"
    >
      <div className="flex items-center justify-between w-full max-w-[1442px] px-8 md:px-12">
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

        {/* Center - Flat Navigation */}
        <div className="hidden lg:flex items-center justify-center w-1/3">
          <div className="flex items-center gap-8">
            <Link
              to="/docs"
              className={`text-[14px] font-medium transition-colors ${path.startsWith('/docs') ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
            >
              Docs
            </Link>
            <Link
              to="/changelog"
              className={`text-[14px] font-medium transition-colors ${path.startsWith('/changelog') ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
            >
              Versions
            </Link>
            <Link
              to="/blog"
              className={`text-[14px] font-medium transition-colors ${path.startsWith('/blog') ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
            >
              Blog
            </Link>
          </div>
        </div>

        {/* Right - Mobile Toggle */}
        <div className="flex lg:hidden items-center justify-end w-2/3 gap-2">
          <a
            href="https://github.com/animesh-94/Onboard-CLI"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-lg text-white/90 hover:text-white transition-all shadow-sm"
          >
            <Github size={14} />
            {stars !== null && (
              <span className="flex items-center gap-1 text-[12px] font-medium border-l border-white/20 pl-1.5 ml-0.5">
                <Star size={12} className="fill-yellow-500 text-yellow-500" />
                {stars.toLocaleString()}
              </span>
            )}
          </a>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white/70 hover:text-white p-1 focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Right - Desktop CTA */}
        <div className="hidden lg:flex items-center justify-end w-1/3 gap-4">
          <a
            href="https://github.com/animesh-94/Onboard-CLI"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-lg text-white/90 hover:text-white transition-all shadow-sm"
          >
            <Github size={16} />
            <span className="text-[13px] font-medium">Star</span>
            {stars !== null && (
              <span className="flex items-center gap-1.5 text-[13px] font-medium border-l border-white/20 pl-2 ml-1">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                {stars.toLocaleString()}
              </span>
            )}
          </a>
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-lg text-white/90 hover:text-white transition-all text-[13px] shadow-sm"
          >
            <Search size={14} />
            <span>Search...</span>
            <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] ml-2 font-mono border border-white/10">Ctrl K</span>
          </button>
        </div>

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
            <Link to="/changelog" onClick={() => setIsOpen(false)} className={`py-4 text-[15px] font-medium border-b border-white/[0.05] ${path.startsWith('/changelog') ? 'text-white' : 'text-zinc-400'}`}>Changelog</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className={`py-4 text-[15px] font-medium ${path.startsWith('/blog') ? 'text-white' : 'text-zinc-400'}`}>Blog</Link>
          </motion.div>
        )}
      </AnimatePresence>
      <CommandPalette />
    </motion.nav>
  );
}
