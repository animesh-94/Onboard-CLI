import { AbsoluteFill, interpolate, spring } from 'remotion';
import { useEffect, useState } from 'react';

export const BlastRadiusScene = () => {
  const [frame, setFrame] = useState(0);
  const fps = 60;

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const loop = (currentTime: number) => {
      if (currentTime - lastTime >= 1000 / fps) {
        setFrame(f => (f >= 120 ? 0 : f + 1));
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 1. The Core Pulse (Starts at frame 10)
  const corePulse = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12 },
  });

  // 2. The Shockwave Expansion (Interpolated over 60 frames)
  const shockwaveRadius = interpolate(frame, [15, 75], [0, 1000], {
    extrapolateRight: 'clamp',
  });
  
  const shockwaveOpacity = interpolate(frame, [15, 30, 60, 75], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  const nodes = [
    { id: 'core', label: 'CheckoutService.submit()', x: '50%', y: '50%', type: 'core', hitFrame: 10 },
    { id: 'affected1', label: 'StripeAPI.charge()', x: '75%', y: '25%', type: 'affected', hitFrame: 40 },
    { id: 'affected2', label: 'InventoryDB.decrement()', x: '25%', y: '75%', type: 'affected', hitFrame: 35 },
    { id: 'unaffected1', label: 'UserProfile.get()', x: '25%', y: '25%', type: 'unaffected', hitFrame: 999 },
    { id: 'unaffected2', label: 'Analytics.trackEvent()', x: '75%', y: '80%', type: 'unaffected', hitFrame: 999 },
    { id: 'unaffected3', label: 'EmailService.send()', x: '85%', y: '50%', type: 'unaffected', hitFrame: 999 },
  ];

  return (
    <AbsoluteFill className="bg-[#050505] items-center justify-center overflow-hidden font-mono">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full z-0">
        {nodes.filter(n => n.id !== 'core').map(node => (
          <line 
            key={`line-${node.id}`}
            x1="50%" y1="50%" x2={node.x} y2={node.y} 
            stroke={node.type === 'affected' ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"} 
            strokeWidth="2" 
            strokeDasharray={node.type === 'unaffected' ? "4 4" : "none"} 
          />
        ))}
      </svg>

      {/* Expanding Shockwave */}
      <div 
        className="absolute rounded-full border border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.3)] z-10 pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: shockwaveRadius,
          height: shockwaveRadius,
          opacity: shockwaveOpacity,
        }}
      />

      {/* Nodes */}
      {nodes.map(node => {
        const infection = spring({
          frame: frame - node.hitFrame,
          fps,
          config: { damping: 14 },
        });

        const isCore = node.type === 'core';
        const isAffected = node.type === 'affected';
        
        let scale = 1;
        if (isCore) scale = corePulse;
        else if (isAffected) scale = 1 + (infection * 0.15);

        let bgColor = '#27272a'; // default dim
        if (isCore) bgColor = '#ffffff';
        else if (isAffected && infection > 0.5) bgColor = '#ef4444'; // turn red
        else if (isAffected && infection <= 0.5) bgColor = '#3f3f46'; // bit brighter before hit
        
        let shadow = 'none';
        if (isCore) shadow = '0 0 30px rgba(255,255,255,0.6)';
        else if (isAffected && infection > 0.5) shadow = '0 0 40px rgba(239,68,68,0.5)';

        let textColor = 'text-white/40';
        if (isCore) textColor = 'text-white';
        else if (isAffected && infection > 0.5) textColor = 'text-red-400 font-bold';

        return (
          <div 
            key={node.id}
            className="absolute flex items-center justify-center z-20"
            style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
          >
            {/* The Label */}
            <div className={`absolute bottom-full mb-3 text-[10px] sm:text-[12px] bg-black/60 px-2 py-1 rounded border border-white/10 ${textColor} transition-colors whitespace-nowrap`}>
              {node.label}
            </div>

            {/* The Node Dot */}
            <div 
              className="rounded-full transition-colors border border-white/10"
              style={{
                width: isCore ? 40 : 24,
                height: isCore ? 40 : 24,
                transform: `scale(${scale})`,
                backgroundColor: bgColor,
                boxShadow: shadow,
              }}
            />
          </div>
        );
      })}

    </AbsoluteFill>
  );
};
