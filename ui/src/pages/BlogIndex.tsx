import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';

const BLOG_POSTS = [
  {
    id: '2',
    number: 2,
    title: 'Building the Graph Abstraction Engine: Recursive SQL and Tree-Sitter',
    preview: 'When we set out to build Onboard-CLI, we knew standard text-based analysis tools (like grep or simple regex scripts) wouldn\'t cut it. Developers need to know exactly how a system connects at a topological level...',
    date: '2026-06-29',
    time: '20:15 IST',
    author: 'Animesh Yadav',
    timestamp: 1782764100000 // A UNIX timestamp for sorting
  },
  {
    id: '1',
    number: 1,
    title: 'The Architecture of Onboard-CLI: Built for Speed and Security',
    preview: 'To build Onboard-CLI as a production-grade systems tool, you need an architecture that balances the heavy-lifting of native code analysis with a lightning-fast user experience...',
    date: '2026-06-18',
    time: '14:30 IST',
    author: 'Animesh Yadav',
    timestamp: 1782743400000 // A UNIX timestamp for sorting
  }
];

export default function BlogIndex() {
  // Sort posts in descending order by timestamp (newest first)
  const sortedPosts = [...BLOG_POSTS].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-black min-h-screen text-zinc-300 font-sans selection:bg-white/20 selection:text-white flex flex-col">
      <SEO title="Engineering Blog - Onboard CLI" description="Read our latest engineering posts about building Onboard CLI." />
      
      <div className="relative w-full max-w-[1442px] mx-auto min-h-screen border-x border-[#1c1c1c] flex flex-col">
        <div className="w-full border-b border-[#1c1c1c]">
          <Navbar />
        </div>

        <main className="flex-1 max-w-[800px] mx-auto px-6 py-24 w-full">
        <header className="mb-16">
          <h1 className="text-[48px] md:text-[56px] font-bold text-white tracking-tight leading-[1.1] mb-6">
            Engineering Blog
          </h1>
          <p className="text-[20px] text-zinc-400 font-medium max-w-[600px]">
            Deep dives into the systems, architecture, and design decisions behind Onboard-CLI.
          </p>
        </header>

        <div className="space-y-12">
          {sortedPosts.map((post) => (
            <article key={post.id} className="group relative border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] p-8 rounded-2xl transition-all duration-300">
              <Link to={`/blog/${post.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">Read Post</span>
              </Link>

              <div className="flex items-center gap-4 text-zinc-500 text-[14px] font-medium mb-4">
                <span className="bg-white/10 text-zinc-300 px-2.5 py-1 rounded-md text-[13px] font-bold tracking-wide">
                  BLOG #{post.number}
                </span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.time}</span>
              </div>

              <h2 className="text-[28px] md:text-[32px] font-bold text-white tracking-tight leading-[1.2] mb-4 group-hover:text-white transition-colors">
                {post.title}
              </h2>

              <p className="text-[17px] text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                {post.preview}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 text-zinc-300 flex items-center justify-center font-bold text-[11px]">
                  A
                </div>
                <span className="text-sm font-medium text-zinc-300">{post.author}</span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
}
