import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black pt-32 pb-12 px-8 relative overflow-hidden ">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none opacity-40" />

      <div className="max-w-[1442px] mx-auto relative z-10">

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-24">
          <div className="col-span-2 lg:col-span-2 pr-8">
            <Link to="/" className="flex items-center gap-3 font-semibold text-[28px] tracking-tight text-white mb-6 hover:opacity-80 transition-opacity">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1l14.2-14.2" />
              </svg>
              <span className="tracking-[-0.04em]">onboard</span>
            </Link>
            <p className="text-zinc-400 text-[16px] leading-[1.6] font-medium max-w-sm">
              The local-first CLI that turns massive distributed systems from C++ cores to Java schedulers into dynamic, visual execution maps in seconds.
            </p>
          </div>

          <div className="lg:col-start-4">
            <h3 className="text-white font-semibold mb-6 text-[15px] tracking-wide">Product</h3>
            <ul className="flex flex-col gap-4">
              <li><a href="#context-owner" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Context Owner</a></li>
              <li><a href="#blast-radius" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Blast Radius</a></li>
              <li><a href="#visual-mapper" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Visual Mapper</a></li>
              <li><a href="#arch-linter" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Architecture Linter</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 text-[15px] tracking-wide">Resources</h3>
            <ul className="flex flex-col gap-4">
              <li><Link to="/docs" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Documentation</Link></li>
              <li><Link to="/blog" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Blog</Link></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">API Reference</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 text-[15px] tracking-wide">Legal</h3>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Privacy Policy</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Terms of Service</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors text-[15px] font-medium">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.05] gap-6">
          <div className="text-[14px] font-medium text-zinc-600">
            © {new Date().getFullYear()} Onboard-CLI. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/animesh-94/Onboard-CLI" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}