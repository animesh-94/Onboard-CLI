import Parser from 'web-tree-sitter';

// Map file extensions to grammar wasm files available in /public/tree-sitter
const extensionToLanguage: Record<string, string> = {
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.go': 'go',
  '.py': 'python',
  '.rs': 'rust',
  '.java': 'java',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'c',
  '.hpp': 'cpp'
};

// Cache for loaded grammars to avoid reloading
const languageCache = new Map<string, Parser.Language>();

// A minimal Node abstraction for the result graph
export interface ASTNode {
  id: string;
  type: string;
  name: string;
  filePath: string;
  startLine: number;
  endLine: number;
}

export interface ParsedGraph {
  nodes: ASTNode[];
  edges: { source: string; target: string }[];
}

async function loadLanguage(lang: string): Promise<Parser.Language> {
  if (languageCache.has(lang)) {
    return languageCache.get(lang)!;
  }
  
  // Assumes tree-sitter-[lang].wasm is located in /tree-sitter/ directory
  const wasmPath = `/tree-sitter/tree-sitter-${lang}.wasm`;
  const language = await Parser.Language.load(wasmPath);
  languageCache.set(lang, language);
  return language;
}

function extractNodesFromTree(tree: Parser.Tree, filePath: string): ASTNode[] {
  const nodes: ASTNode[] = [];
  
  // A simple recursive traversal to find function/class declarations
  function traverse(node: Parser.SyntaxNode) {
    // Identifying functions and methods (grammar-dependent, this is a generalized approach)
    if (
      node.type === 'function_declaration' || 
      node.type === 'method_declaration' ||
      node.type === 'class_declaration'
    ) {
      // Find the identifier child which is usually the name of the function/class
      const nameNode = node.children.find(c => c.type === 'identifier' || c.type === 'type_identifier');
      
      if (nameNode) {
        nodes.push({
          id: `${filePath}::${nameNode.text}`,
          type: node.type,
          name: nameNode.text,
          filePath,
          startLine: node.startPosition.row + 1,
          endLine: node.endPosition.row + 1
        });
      }
    }

    for (let i = 0; i < node.childCount; i++) {
      traverse(node.child(i)!);
    }
  }

  traverse(tree.rootNode);
  return nodes;
}

self.onmessage = async (event: MessageEvent<{ files: { path: string; content: string }[] }>) => {
  try {
    // Initialize Web Tree-Sitter runtime
    await Parser.init({
      locateFile(path: string, prefix: string) {
        if (path.endsWith('.wasm')) {
          // Serve the core wasm from the root public dir
          return '/' + path;
        }
        return prefix + path;
      }
    });

    const parser = new Parser();
    const result: ParsedGraph = { nodes: [], edges: [] };

    for (const file of event.data.files) {
      // Determine the extension
      const extMatch = file.path.match(/\.[^/.]+$/);
      if (!extMatch) continue;
      
      const ext = extMatch[0].toLowerCase();
      const langString = extensionToLanguage[ext];
      
      if (!langString) {
        continue; // Unsupported file type
      }

      try {
        const language = await loadLanguage(langString);
        parser.setLanguage(language);

        // Parse the code
        const tree = parser.parse(file.content);
        
        // Extract AST Nodes
        const fileNodes = extractNodesFromTree(tree, file.path);
        result.nodes.push(...fileNodes);

        // CRITICAL MEMORY MANAGEMENT: Delete tree to prevent memory leak in V8
        tree.delete();
      } catch (err) {
        console.warn(`Failed to parse file: ${file.path}`, err);
      }
    }

    // Cleanup parser when completely done
    parser.delete();
    
    // Post back the serialized JSON graph payload
    self.postMessage({ type: 'SUCCESS', payload: result });

  } catch (error: any) {
    self.postMessage({ type: 'ERROR', error: error.message });
  }
};
