import { useState, useEffect, useRef } from 'react';
import { useReactFlow, type Node } from '@xyflow/react';

export default function SearchPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { getNodes, setCenter } = useReactFlow();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setQuery('');
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nodes = getNodes();
  const results = nodes.filter(n => {
    const label = (n.data?.label as string) || '';
    const id = n.id;
    const q = query.toLowerCase();
    return label.toLowerCase().includes(q) || id.toLowerCase().includes(q);
  }).slice(0, 10);

  const handleSelect = (node: Node) => {
    setIsOpen(false);
    // XYFlow requires passing x and y. If node doesn't have width/height parsed yet, we approximate.
    const x = node.position.x + (node.measured?.width || 150) / 2;
    const y = node.position.y + (node.measured?.height || 50) / 2;
    
    setCenter(x, y, { zoom: 1.5, duration: 800 });
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="p-3 border-b border-zinc-800">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none text-white outline-none placeholder:text-zinc-500"
            placeholder="Search nodes (Ctrl+P)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        {results.length > 0 && (
          <ul className="max-h-64 overflow-y-auto p-1">
            {results.map(n => (
              <li key={n.id}>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded flex items-center justify-between"
                  onClick={() => handleSelect(n)}
                >
                  <span className="truncate pr-4">{n.data?.label as string}</span>
                  <span className="text-xs text-zinc-500 shrink-0 bg-zinc-800 px-1.5 py-0.5 rounded uppercase">{n.type}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {query && results.length === 0 && (
          <div className="p-4 text-center text-sm text-zinc-500">
            No nodes found
          </div>
        )}
      </div>
    </div>
  );
}
