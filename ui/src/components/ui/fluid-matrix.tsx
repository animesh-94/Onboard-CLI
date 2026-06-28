'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function FluidMatrix({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (canvas.parentElement) {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const columns: { x: number, width: number, opacity: number, speed: number, height: number, y: number, color: string }[] = [];
    const colors = ['#10b981', '#059669', '#34d399', '#ffffff', '#a7f3d0'];

    for (let i = 0; i < 150; i++) {
      columns.push({
        x: Math.random() * 2000,
        width: Math.random() > 0.8 ? Math.random() * 8 + 4 : Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.4, // Increased base opacity (0.4 to 0.9)
        speed: Math.random() * 0.2 + 0.1,
        height: Math.random() * 800 + 200,
        y: Math.random() * 800 - 400,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let time = 0;
    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);
      
      // Draw a dark base
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw columns
      columns.forEach((col, i) => {
        const pulse = Math.sin(time * col.speed + i) * 0.3 + 0.7;
        const currentOpacity = col.opacity * pulse;
        
        ctx.fillStyle = col.color;
        ctx.globalAlpha = currentOpacity;
        
        // Add a blur effect for the glow (increased blur)
        ctx.shadowBlur = 20; 
        ctx.shadowColor = col.color;
        
        // Vertical movement
        const currentY = col.y + Math.sin(time * 0.5) * 50;

        ctx.fillRect(col.x, currentY, col.width, col.height);
      });

      // Overlay a vignette/gradient to blend the edges - reduced strength so it doesn't wash out the bars
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.85)'); 
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden bg-black", className)}>
      {/* Increased opacity from 60 to 90 */}
      <canvas ref={canvasRef} className="w-full h-full opacity-90 mix-blend-screen" />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
    </div>
  );
}
