import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { SEO } from '@/components/SEO';

// Load all MDX modules at build time
const mdxModules = import.meta.glob('/content/docs/**/*.mdx', { eager: true });
const rawMdxModules = import.meta.glob('/content/docs/**/*.mdx', { query: '?raw', eager: true });

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

// Parse and sort documents
export const docsContext = Object.entries(mdxModules).map(([path, module]: [string, any]) => {
  const slug = path.split('/').pop()?.replace('.mdx', '') || '';
  const frontmatter = module.frontmatter || {};

  const rawData = rawMdxModules[path] as any;
  let rawText = '';
  if (typeof rawData === 'string') {
    rawText = rawData;
  } else if (rawData && typeof rawData.default === 'string') {
    rawText = rawData.default;
  }

  const headingMatches = (typeof rawText === 'string' ? rawText : '').match(/^##\s+(.*)/gm) || [];
  const headings = headingMatches.map((h: any) => {
    // Strip the markdown formatting like backticks and asterisks
    const text = h.replace(/^##\s+/, '').replace(/[`*]/g, '');
    return { title: text, hash: generateSlug(text) };
  });

  return {
    slug,
    path,
    title: frontmatter.title || slug,
    description: frontmatter.description || '',
    order: frontmatter.order || 99,
    Component: module.default,
    headings,
  };
}).sort((a, b) => a.order - b.order);

export default function DocsLayout() {
  const { pathname } = useLocation();
  const currentSlug = pathname.split('/').pop();

  const currentDoc = docsContext.find(d => d.slug === currentSlug) || docsContext[0];

  return (
    <div className="bg-black min-h-screen text-zinc-400 font-sans selection:bg-white/20 selection:text-white">
      <SEO title={`${currentDoc.title} - Onboard CLI Docs`} description={currentDoc.description} />
      
      <div className="relative w-full max-w-[1442px] mx-auto min-h-screen border-x border-[#1c1c1c] flex flex-col">
        <div className="w-full border-b border-[#1c1c1c]">
          <Navbar />
        </div>

        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row gap-12 pt-8 pb-24">

        {/* Left Sidebar (Navigation) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Onboarding</h4>
            <nav className="flex flex-col gap-2">
              {docsContext.map(doc => {
                const isActive = doc.slug === currentSlug;
                return (
                  <div key={doc.slug} className="flex flex-col">
                    <Link
                      to={`/docs/${doc.slug}`}
                      className={`text-sm py-1.5 px-3 -ml-3 rounded-md transition-colors ${isActive
                        ? 'bg-white/10 text-white font-medium'
                        : 'hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {doc.title}
                    </Link>
                    {isActive && doc.headings.length > 0 && (
                      <div className="flex flex-col gap-2 pl-3 mt-1.5 mb-2 border-l border-white/10 ml-0.5">
                        {doc.headings.map((h: any) => (
                          <a
                            key={h.hash}
                            href={`#${h.hash}`}
                            className="text-[13px] text-zinc-500 hover:text-white transition-colors"
                          >
                            {h.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Center Content (MDX Rendered) */}
        <main className="flex-1 min-w-0">
          {currentDoc ? (
            <article className="prose prose-invert prose-zinc max-w-none 
              prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-zinc-400 prose-p:leading-relaxed
              prose-a:text-white prose-a:no-underline hover:prose-a:underline
              prose-strong:text-zinc-200"
            >
              <div className="mb-8">
                <h1 className="mb-2 !text-4xl">{currentDoc.title}</h1>
                {currentDoc.description && (
                  <p className="text-lg text-zinc-500 !mt-0">{currentDoc.description}</p>
                )}
              </div>
              <currentDoc.Component components={{
                pre: ({ children, ...props }: any) => {
                  const [copied, setCopied] = React.useState(false);
                  const preRef = React.useRef<HTMLPreElement>(null);

                  const handleCopy = () => {
                    if (preRef.current) {
                      // Grab text content
                      const text = preRef.current.innerText;
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  };

                  return (
                    <div className="group relative my-5 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden">
                      <button
                        onClick={handleCopy}
                        className="absolute right-3 top-3 p-2 rounded-md bg-zinc-800/90 hover:bg-zinc-700 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-md border border-white/10"
                        title="Copy code"
                      >
                        {copied ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        )}
                      </button>
                      <pre ref={preRef} {...props} className={`${props.className || ''} !bg-transparent !border-none !m-0 !p-5 whitespace-pre-wrap break-words`}>
                        {children}
                      </pre>
                    </div>
                  );
                }
              }} />
            </article>
          ) : (
            <div className="text-center py-20 text-zinc-500">Document not found</div>
          )}
        </main>

        {/* Right Sidebar (Table of Contents placeholder) */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider"></h4>
            <div className="text-sm text-zinc-500">
              {/* ToC logic will be implemented by parsing the MDX headers */}
              <a href="#" className="block hover:text-white transition-colors py-1"></a>
              <a href="#" className="block hover:text-white transition-colors py-1 pl-4"></a>
            </div>
          </div>
        </aside>

        </div>
      </div>
    </div>
  );
}
