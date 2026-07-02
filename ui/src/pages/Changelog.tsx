import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';

const releases = [
  {
    version: 'v1.3.0',
    date: 'July 2, 2026',
    title: 'AST Physics Engine & Pre-Commit Hooks',
    description: 'We completely overhauled the Visual Mapper layout engine for massive monorepos and added local git pre-commit hooks to catch architectural drift before it hits your CI/CD pipeline.',
    features: [
      'Added `onboard hooks install` command for local validation.',
      'Upgraded the Force-Directed graph algorithm for 40% faster layout rendering.',
      'Added support for C# (.NET) syntax parsing.',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'June 25, 2026',
    title: 'Blast Radius Engine',
    description: 'Introducing `onboard impact`! You can now run a reverse-dependency analysis on any PR to see exactly which downstream microservices will be affected by your core module changes.',
    features: [
      'New `impact` CLI command utilizing reverse AST traversal.',
      'GitHub Actions integration for PR blast radius warnings.',
      'Improved memory caching for the local SQLite node database.',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'June 15, 2026',
    title: 'The Context Owner Engine',
    description: 'Our first major public release. Onboard CLI can now accurately map who owns the cognitive weight of any file or directory by cross-referencing git history with AST density.',
    features: [
      'Initial release of `onboard owners`.',
      'Tree-sitter support for Go, TypeScript, Java, and Python.',
      'Local React-based Visual Mapper via `onboard map`.',
    ],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <SEO title="Versions - Onboard CLI" description="Onboard CLI release history and changelog." />
      <Navbar />

      <main className="flex-1 max-w-[1100px] mx-auto w-full px-6 md:px-8 py-20 md:py-24">
        <div className="mb-12">
          <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight mb-3 text-[#ededed]">Versions</h1>
          <p className="text-[#a1a1aa] text-[16px]">
            Onboard CLI release history and changelog
          </p>
        </div>

        <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#0c0c0c] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="py-5 px-6 text-[14px] font-semibold text-[#ededed] whitespace-nowrap w-[20%]">Onboard CLI Version</th>
                  <th className="py-5 px-6 text-[14px] font-semibold text-[#ededed] whitespace-nowrap w-[20%]">Release Date</th>
                  <th className="py-5 px-6 text-[14px] font-semibold text-[#ededed] min-w-[400px]">What's New</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.08]">
                {releases.map((release, index) => (
                  <tr key={index} className="align-top hover:bg-white/[0.02] transition-colors">
                    <td className="py-6 px-6">
                      <span className="font-mono text-[14px] text-[#ededed]">{release.version.replace('v', '')}</span>
                    </td>
                    <td className="py-6 px-6">
                      <span className="font-mono text-[14px] text-[#a1a1aa]">{release.date}</span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="text-[15px] text-[#d4d4d8] leading-relaxed">
                        <strong className="text-[#ededed] block mb-2">{release.title}</strong>
                        <span className="mb-3 block text-[#a1a1aa]">{release.description}</span>
                        <ul className="space-y-1.5 mt-2">
                          {release.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2 text-white/30">•</span>
                              <span className="text-[#a1a1aa]">
                                {feature.split(/`([^`]+)`/).map((part, pIndex) =>
                                  pIndex % 2 === 1 ? (
                                    <code key={pIndex} className="bg-white/[0.08] border border-white/[0.05] px-1.5 py-0.5 rounded text-[13px] font-mono text-[#ededed] mx-0.5">
                                      {part}
                                    </code>
                                  ) : (
                                    <span key={pIndex}>{part}</span>
                                  )
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
