
import React from 'react';

interface AIVisualizerProps {
  isLoading: boolean;
}

const AIVisualizer: React.FC<AIVisualizerProps> = ({ isLoading }) => {
  const numSquares = 12;
  const radius = 100;
  const center = 125;

  return (
    <div className="relative w-64 h-64">
      <svg viewBox="0 0 250 250" className="w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Central Orb */}
        <circle cx={center} cy={center} r="50" fill="#1B1F3B" />
        <circle 
          cx={center} 
          cy={center} 
          r="65" 
          fill="none" 
          stroke="rgba(77, 181, 255, 0.8)" 
          strokeWidth="10" 
          filter="url(#glow)"
          className={`transition-transform duration-500 ${isLoading ? 'scale-105' : 'scale-100'}`}
        />

        {/* Pulsing Squares */}
        {Array.from({ length: numSquares }).map((_, i) => {
          const angle = (i / numSquares) * 2 * Math.PI;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const animationDelay = `${i * 0.2}s`;
          
          return (
            <rect
              key={i}
              x={x - 10}
              y={y - 10}
              width="20"
              height="20"
              rx="5"
              fill="rgba(77, 181, 255, 0.7)"
              className={`pulsing-square ${isLoading ? 'animate-pulse-fast' : 'animate-pulse-slow'}`}
              style={{ animationDelay }}
            />
          );
        })}
      </svg>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s infinite ease-in-out;
        }
        .pulsing-square {
          transform-origin: center;
        }
      `}</style>
    </div>
  );
};

export default AIVisualizer;
