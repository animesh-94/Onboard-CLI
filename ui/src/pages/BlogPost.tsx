import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArchitectureDiagram from '../components/ArchitectureDiagram';

export default function Blog() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[720px] mx-auto px-6 py-24 w-full">
        <article className="prose-lg font-serif">
          <header className="mb-14 font-sans text-center md:text-left">
            <h1 className="text-[40px] md:text-[52px] font-bold text-white tracking-tight leading-[1.15] mb-6">
              The Architecture of Onboard-CLI: Built for Speed and Security
            </h1>
            <div className="flex items-center gap-4 text-zinc-500 text-[15px] font-medium justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <span>Animesh Yadav</span>
              </div>
              <span>•</span>
              <span>June 29, 2026</span>
            </div>
          </header>

          <div className="space-y-8 text-[18px] md:text-[21px] leading-[1.8] text-[#B0B0B0]">
            <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-emerald-400 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
              To build Onboard-CLI as a production-grade systems tool, you need an architecture that balances the heavy-lifting of native code analysis with a lightning-fast user experience. Because your tool must operate locally (for security and speed) and handle massive codebases, it utilizes a Multi-Layered Abstraction Architecture.
            </p>

            <h2 className="text-[28px] font-bold text-white font-sans mt-16 mb-6 tracking-tight">
              1. The Architectural Layers
            </h2>

            <h3 className="text-[22px] font-semibold text-zinc-200 font-sans mt-10 mb-4">
              A. The Frontend Integration Layer (User Interface)
            </h3>
            <ul className="list-disc pl-6 space-y-3 mb-8 marker:text-emerald-500">
              <li><strong className="text-zinc-200">The CLI Controller (cobra):</strong> The entry point. Handles all CLI flags, sub-commands (drift, routes, map), and standardizes output.</li>
              <li><strong className="text-zinc-200">The Local Web Server:</strong> When you run <code className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded text-[16px] font-mono">onboard map</code>, the Go CLI spawns an ephemeral, local HTTP server using Go's net/http package. It serves a lightweight, static React bundle that interacts with the CLI via local WebSockets or a REST API to query graph data.</li>
            </ul>

            <h3 className="text-[22px] font-semibold text-zinc-200 font-sans mt-10 mb-4">
              B. The Orchestration Layer (The "Brain")
            </h3>
            <ul className="list-disc pl-6 space-y-3 mb-8 marker:text-emerald-500">
              <li><strong className="text-zinc-200">Tree-Sitter Engine:</strong> This is the core of the tool. It doesn't rely on regex or simple text searches. It uses tree-sitter bindings to parse your files into a real, navigable Abstract Syntax Tree (AST).</li>
              <li><strong className="text-zinc-200">Graph Traverser:</strong> This layer bridges the AST to a searchable database. It converts the hierarchical code structure into a directed graph (nodes = functions/classes/files, edges = imports/calls/injections).</li>
              <li><strong className="text-zinc-200">SQLite Persistence Layer:</strong> To avoid re-parsing the codebase every time you run a command, all metadata is persisted in a local, hidden <code className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded text-[16px] font-mono">.onboard/cache.db</code>. This allows drift and impact to run in milliseconds, even on massive repositories.</li>
            </ul>

            <h3 className="text-[22px] font-semibold text-zinc-200 font-sans mt-10 mb-4">
              C. The Security & Execution Layer
            </h3>
            <ul className="list-disc pl-6 space-y-3 mb-8 marker:text-emerald-500">
              <li><strong className="text-zinc-200">WebAssembly (Wasm) Runtime (wazero):</strong> Used for the (future) sandbox. By embedding this in the Go binary, you run user code in an isolated memory-space without requiring heavy Docker containers.</li>
              <li><strong className="text-zinc-200">System Resource Limiter:</strong> For native tasks, this layer uses OS-level primitives (setrlimit on Linux/macOS) to ensure the analysis tools do not crash the user's host machine.</li>
            </ul>

            <h2 className="text-[28px] font-bold text-white font-sans mt-16 mb-6 tracking-tight">
              2. The Architectural Data Flow
            </h2>
            <p>The flow is designed to be deterministic and reactive:</p>
            <ol className="list-decimal pl-6 space-y-3 mb-8 marker:text-emerald-500 font-sans text-[18px]">
              <li><strong className="text-zinc-200">Ingestion:</strong> The init command recursively walks the directory tree.</li>
              <li><strong className="text-zinc-200">Normalization:</strong> Files are passed through the Tree-sitter parser, creating a language-agnostic intermediate representation.</li>
              <li><strong className="text-zinc-200">Graph Construction:</strong> The Orchestrator maps all references (imports, function calls, class instantiations) into the graph structure.</li>
              <li><strong className="text-zinc-200">Query Execution:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1 marker:text-zinc-600">
                  <li><strong className="text-zinc-200">Map:</strong> A UI query fetches nodes within radius N.</li>
                  <li><strong className="text-zinc-200">Drift:</strong> A graph traversal checks for forbidden edge paths between boundary nodes.</li>
                  <li><strong className="text-zinc-200">Routes:</strong> An S-expression query filters nodes by framework-specific routing signatures.</li>
                </ul>
              </li>
            </ol>

            <h2 className="text-[28px] font-bold text-white font-sans mt-16 mb-6 tracking-tight">
              3. High-Level Architecture Graph
            </h2>
            
            <div className="mb-10 mt-6">
              <ArchitectureDiagram />
            </div>

            <h2 className="text-[28px] font-bold text-white font-sans mt-16 mb-6 tracking-tight">
              4. Technical Constraints & Design Principles
            </h2>
            <ul className="list-disc pl-6 space-y-4 mb-8 marker:text-emerald-500">
              <li><strong className="text-zinc-200">Local-First:</strong> No telemetry. No cloud storage. All AST data stays in <code className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded text-[16px] font-mono">.onboard/cache.db</code>.</li>
              <li><strong className="text-zinc-200">Tree-Sitter Dependency:</strong> All language-specific logic is isolated to the language-specific tree-sitter grammars. This makes adding support for a new language as simple as adding a new go-tree-sitter module.</li>
              <li><strong className="text-zinc-200">Zero-Copy Memory:</strong> Where possible, the Go engine uses mmap to read the SQLite cache, ensuring that visualizing even a massive monorepo does not spike the user's RAM.</li>
              <li><strong className="text-zinc-200">Non-Blocking UI:</strong> The CLI engine acts as the "backend" for the visualization canvas. This means the visualizer is never "loading"—it is simply rendering the graph that the CLI engine has already pre-processed.</li>
            </ul>

          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
