import { useState, useCallback } from 'react';

// 50MB threshold for client-side processing
const MAX_CLIENT_SIZE_BYTES = 50 * 1024 * 1024;

export function useRepositoryPipeline() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processRepository = useCallback(async (repoUrl: string) => {
    setIsProcessing(true);
    setProgress(10);
    try {
      // 1. Pre-flight Check
      // Convert standard URL (e.g. https://github.com/animesh-94/Onboard-CLI) to API URL
      const urlParts = new URL(repoUrl).pathname.split('/').filter(Boolean);
      if (urlParts.length < 2) throw new Error("Invalid GitHub repository URL");
      
      const owner = urlParts[0];
      const repo = urlParts[1];
      
      const apiResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!apiResponse.ok) throw new Error("Failed to fetch repository metadata");
      
      const repoData = await apiResponse.json();
      const sizeBytes = repoData.size * 1024; // GitHub API returns size in KB

      setProgress(30);

      if (sizeBytes < MAX_CLIENT_SIZE_BYTES) {
        // --- CLIENT-SIDE PIPELINE (Web Worker + JSZip + WebAssembly) ---
        console.log("Repository under 50MB. Processing completely in-browser.");
        
        // Use the default branch from metadata
        const branch = repoData.default_branch;
        const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;

        // Initialize our web worker
        const worker = new Worker(new URL('../workers/ast.worker.ts', import.meta.url), { type: 'module' });
        
        return new Promise((resolve, reject) => {
          worker.onmessage = (e) => {
            if (e.data.type === 'SUCCESS') {
              worker.terminate();
              resolve(e.data.payload); // Returns { nodes, edges }
            } else if (e.data.type === 'ERROR') {
              worker.terminate();
              reject(new Error(e.data.message));
            } else if (e.data.type === 'PROGRESS') {
              setProgress(30 + Math.floor(e.data.percent * 0.7)); // Scale remaining 70%
            }
          };

          worker.onerror = (err) => {
            worker.terminate();
            reject(err);
          };

          // Send the download URL to the worker to handle JSZip download & extraction
          worker.postMessage({ type: 'PROCESS_REPO', url: zipUrl });
        });
      } else {
        // --- FALLBACK CONDITION (Go Backend Microservice) ---
        console.log("Repository exceeds 50MB. Offloading to Go Backend.");
        
        const backendResponse = await fetch('http://localhost:8080/api/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: repoUrl })
        });

        if (!backendResponse.ok) {
          throw new Error("Backend parsing failed");
        }
        
        setProgress(100);
        return await backendResponse.json();
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { processRepository, isProcessing, progress };
}
