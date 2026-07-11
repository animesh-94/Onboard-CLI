import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import type { ParsedGraph } from '../workers/parser.worker';

// Allowed extensions for source code parsing
const ALLOWED_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.go', '.py', '.rs', '.java', '.c', '.cpp', '.h', '.hpp'
]);

interface GithubZipState {
  status: 'idle' | 'fetching_metadata' | 'downloading_zip' | 'unzipping' | 'parsing_wasm' | 'parsing_backend' | 'success' | 'error';
  progress?: number;
  graph?: ParsedGraph;
  error?: string;
}

export function useGithubZip() {
  const [state, setState] = useState<GithubZipState>({ status: 'idle' });

  const parseRepository = useCallback(async (owner: string, repo: string, branch: string = 'main', token?: string) => {
    setState({ status: 'fetching_metadata' });

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // 1. Fetch Repository Metadata to check size
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (!repoRes.ok) throw new Error(`Failed to fetch repo metadata: ${repoRes.statusText}`);
      
      const repoData = await repoRes.json();
      const sizeKB = repoData.size;
      
      // If repository is greater than 50MB (50,000 KB), route to Go backend
      if (sizeKB > 50000) {
        setState({ status: 'parsing_backend' });
        
        // This simulates hitting the high-performance Go backend
        const backendRes = await fetch('/api/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: `https://github.com/${owner}/${repo}`, branch })
        });

        if (!backendRes.ok) {
          throw new Error(`Backend parsing failed: ${backendRes.statusText}`);
        }

        const graph: ParsedGraph = await backendRes.json();
        setState({ status: 'success', graph });
        return;
      }

      // 2. Fetch the Zipball for Client-Side Parsing
      setState({ status: 'downloading_zip' });
      const zipRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`, { headers });
      
      if (!zipRes.ok) {
        throw new Error(`Failed to fetch zipball: ${zipRes.statusText}`);
      }

      const zipBuffer = await zipRes.arrayBuffer();

      // 3. In-Memory Decompression
      setState({ status: 'unzipping' });
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(zipBuffer);
      
      const filesToParse: { path: string; content: string }[] = [];

      for (const [relativePath, zipEntry] of Object.entries(unzipped.files)) {
        if (zipEntry.dir) continue;

        const extMatch = relativePath.match(/\.[^/.]+$/);
        const ext = extMatch ? extMatch[0].toLowerCase() : '';

        // Filter out non-code files
        if (ALLOWED_EXTENSIONS.has(ext) && !relativePath.includes('node_modules/')) {
          const content = await zipEntry.async('text');
          filesToParse.push({ path: relativePath, content });
        }
      }

      if (filesToParse.length === 0) {
        throw new Error('No valid source code files found to parse.');
      }

      // 4. Web Worker Parsing (WASM)
      setState({ status: 'parsing_wasm' });
      
      return new Promise<void>((resolve, reject) => {
        const worker = new Worker(new URL('../workers/parser.worker.ts', import.meta.url), { type: 'module' });

        worker.onmessage = (event) => {
          if (event.data.type === 'SUCCESS') {
            setState({ status: 'success', graph: event.data.payload });
            worker.terminate();
            resolve();
          } else if (event.data.type === 'ERROR') {
            const err = new Error(event.data.error);
            setState({ status: 'error', error: err.message });
            worker.terminate();
            reject(err);
          }
        };

        worker.onerror = (error) => {
          setState({ status: 'error', error: error.message });
          worker.terminate();
          reject(error);
        };

        // Pass unzipped code files to the Web Worker
        worker.postMessage({ files: filesToParse });
      });

    } catch (err: any) {
      setState({ status: 'error', error: err.message });
    }
  }, []);

  return { ...state, parseRepository };
}
