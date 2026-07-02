import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Zap, BookOpen, Terminal, Code, LayoutDashboard } from 'lucide-react';
import { Github } from './GithubIcon';
import Fuse from 'fuse.js';
import { docsContext } from '../pages/Docs';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const allItems = useMemo(() => {
    const baseItems = [
      { name: 'Documentation', icon: <BookOpen size={16} />, path: '/docs', type: 'page' },
      { name: 'Versions', icon: <FileText size={16} />, path: '/changelog', type: 'page' },
      { name: 'Blog', icon: <LayoutDashboard size={16} />, path: '/blog', type: 'page' },
      { name: 'Features', icon: <Zap size={16} />, path: '/#context-owner', type: 'section' },
      { name: 'Visual Mapper Demo', icon: <Code size={16} />, path: '/app', type: 'app' },
      { name: 'GitHub Repository', icon: <Github size={16} />, path: 'https://github.com/animesh-94/Onboard-CLI', type: 'external' },
    ];

    const docsItems = docsContext.flatMap(doc => {
      const mainPage = { name: doc.title, icon: <Terminal size={16} />, path: `/docs/${doc.slug}`, type: 'doc' };
      const headings = doc.headings.map((h: any) => ({
        name: `${doc.title} > ${h.title}`,
        icon: <FileText size={16} />,
        path: `/docs/${doc.slug}#${h.hash}`,
        type: 'heading'
      }));
      return [mainPage, ...headings];
    });

    return [...baseItems, ...docsItems];
  }, []);

  const fuse = useMemo(() => new Fuse(allItems, {
    keys: ['name', 'type'],
    threshold: 0.3,
  }), [allItems]);

  const filteredItems = query
    ? fuse.search(query).map(result => result.item)
    : allItems;

  const handleSelect = (item: typeof allItems[0]) => {
    setIsOpen(false);
    if (item.type === 'external') {
      window.open(item.path, '_blank');
    } else if (item.path.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(item.path.substring(2));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (item.path.includes('#')) {
      navigate(item.path.split('#')[0]);
      setTimeout(() => {
        const hash = item.path.split('#')[1];
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(item.path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />
          <div className="fixed inset-0 flex items-start justify-center pt-[15vh] z-[1000] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-[600px] bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col mx-4"
            >
              <div className="flex items-center px-4 py-4 border-b border-white/10">
                <Search size={20} className="text-white/40 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search docs, features, or jump to..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-white text-[16px] placeholder:text-white/30 outline-none focus:ring-0"
                />
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/40 font-mono tracking-widest border border-white/5 ml-3 shrink-0">
                  ESC
                </div>
              </div>

              <div className="max-h-[350px] overflow-y-auto p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center text-white/40 text-[14px]">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    {filteredItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(item)}
                        className="flex items-center w-full px-3 py-3 rounded-lg text-left text-white/70 hover:bg-white/5 hover:text-white transition-colors group"
                      >
                        <span className="text-white/40 group-hover:text-emerald-400 transition-colors mr-3">
                          {item.icon}
                        </span>
                        <span className="text-[14px] flex-1">{item.name}</span>
                        <span className="text-[11px] text-white/20 uppercase tracking-wider bg-white/[0.02] px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
