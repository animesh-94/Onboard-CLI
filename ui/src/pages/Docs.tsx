import { Link, useLocation } from 'react-router-dom';

// Load all MDX modules at build time
const mdxModules = import.meta.glob('/content/docs/**/*.mdx', { eager: true });
const rawMdxModules = import.meta.glob('/content/docs/**/*.mdx', { as: 'raw', eager: true });

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

// Parse and sort documents
export const docsContext = Object.entries(mdxModules).map(([path, module]: [string, any]) => {
  const slug = path.split('/').pop()?.replace('.mdx', '') || '';
  const frontmatter = module.frontmatter || {};

  const rawData = rawMdxModules[path] as any;
  const rawText = typeof rawData === 'string' ? rawData : (rawData && typeof rawData === 'object' ? rawData.default : '') || '';

  const headingMatches = rawText.match(/^##\s+(.*)/gm) || [];
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
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-emerald-500/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-14 flex items-center gap-4">
          <Link to="/" className="text-white font-bold text-lg tracking-tight">onboard-cli</Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-sm font-medium text-zinc-300">Documentation</span>
        </div>
      </header>

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
                        ? 'bg-emerald-500/10 text-emerald-400 font-medium'
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
                            className="text-[13px] text-zinc-500 hover:text-emerald-400 transition-colors"
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
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-zinc-200
              prose-code:text-emerald-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-white/10 prose-pre:p-4 prose-pre:rounded-xl shadow-2xl"
            >
              <div className="mb-8">
                <h1 className="mb-2 !text-4xl">{currentDoc.title}</h1>
                {currentDoc.description && (
                  <p className="text-lg text-zinc-500 !mt-0">{currentDoc.description}</p>
                )}
              </div>
              <currentDoc.Component />
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
  );
}
