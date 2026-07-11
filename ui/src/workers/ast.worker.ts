import JSZip from 'jszip';
import Parser from 'web-tree-sitter';

self.onmessage = async (e) => {
  if (e.data.type === 'PROCESS_REPO') {
    try {
      const { url } = e.data;
      self.postMessage({ type: 'PROGRESS', percent: 10 });

      // 1. Download zipball in browser memory
      const response = await fetch(url);
      const blob = await response.blob();
      
      // 2. Unzip using JSZip
      self.postMessage({ type: 'PROGRESS', percent: 30 });
      const zip = new JSZip();
      const zipData = await zip.loadAsync(blob);
      
      // 3. Initialize Web-Tree-Sitter
      self.postMessage({ type: 'PROGRESS', percent: 50 });
      await Parser.init({
        locateFile() {
          return '/tree-sitter.wasm'; // Make sure this is in public folder
        }
      });
      const parser = new Parser();
      // Assume javascript for now, ideally dynamically load the wasm language binding
      // const Lang = await Parser.Language.load('/tree-sitter-javascript.wasm');
      // parser.setLanguage(Lang);

      const nodes = [];
      const edges = [];
      let processedCount = 0;
      const fileCount = Object.keys(zipData.files).length;

      // 4. Memory-isolated AST Parsing
      for (const [filename, fileInfo] of Object.entries(zipData.files)) {
        if (!fileInfo.dir && filename.match(/\.(js|ts|tsx|jsx)$/)) {
          const content = await fileInfo.async('string');
          
          try {
            // Memory Isolation: Parse file
            const tree = parser.parse(content);
            
            // Execute semantic queries or walk AST here
            // (Mocking finding a function for the pipeline output structure)
            if (content.includes('function ')) {
                nodes.push({
                  id: filename,
                  type: 'codeNode',
                  data: {
                    label: filename.split('/').pop(),
                    kind: 'function',
                    signature: '()',
                    returnType: 'unknown',
                    snippet: content.substring(0, 100) + '...'
                  }
                });
            }

            // INSTANTLY DESTROY AST ALLOCATIONS TO PREVENT MEMORY LEAKS
            tree.delete(); 
          } catch (err) {
            console.warn(`Failed to parse ${filename}`, err);
          }
        }
        processedCount++;
        if (processedCount % 10 === 0) {
          self.postMessage({ type: 'PROGRESS', percent: 50 + (processedCount / fileCount) * 50 });
        }
      }

      self.postMessage({ 
        type: 'SUCCESS', 
        payload: { nodes, edges } 
      });

    } catch (err: any) {
      self.postMessage({ type: 'ERROR', message: err.message });
    }
  }
};
