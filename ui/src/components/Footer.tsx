'use client';

export default function Footer() {
  return (
    <footer className="bg-black pt-12 pb-12 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.05] gap-5">
          <div className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] rounded-[5px] border border-white/[0.12] bg-white/[0.04] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L9 5L5 9L1 5Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-zinc-700 tracking-tight">
              Onboard-CLI © 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}