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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}