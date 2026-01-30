
import React from 'react';

const AnimatedRiverIcon: React.FC = () => {
  const numSquares = 12;
  const radius = 28;
  const center = 32;

  return (
    <div className="w-8 h-8">
      <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
        <defs>
          <filter id="nav-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Central Orb */}
        <circle 
          cx={center} 
          cy={center} 
          r="16" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          filter="url(#nav-glow)"
        />

        {/* Pulsing Squares */}
        {Array.from({ length: numSquares }).map((_, i) => {
          const angle = (i / numSquares) * 2 * Math.PI;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const animationDelay = `${i * 0.25}s`;
          
          return (
            <rect
              key={i}
              x={x - 2.5}
              y={y - 2.5}
              width="5"
              height="5"
              rx="1.5"
              fill="white"
              className="animate-nav-pulse"
              style={{ animationDelay }}
            />
          );
        })}
      </svg>
      <style>{`
        @keyframes nav-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
        .animate-nav-pulse {
          animation: nav-pulse 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AnimatedRiverIcon;
