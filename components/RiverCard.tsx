import React from 'react';

interface RiverCardProps {
  clientId: string;
}

const RiverCard: React.FC<RiverCardProps> = ({ clientId }) => {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white overflow-hidden shadow-lg">
      <div className="absolute inset-0 opacity-5">
        {/* Subtle background pattern */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="absolute -right-16 -bottom-16 w-48 h-48">
         <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-10 100C-10 44.7715 34.7715 0 90 0L90 0C145.228 0 190 44.7715 190 100V200H-10L-10 100Z" fill="url(#paint0_linear_1_2)"/>
            <defs>
                <linearGradient id="paint0_linear_1_2" x1="90" y1="0" x2="90" y2="200" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4DB5FF" stopOpacity="0.1"/>
                    <stop offset="1" stopColor="#4DB5FF" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-400">{today}</p>
                <p className="text-lg font-semibold mt-1">Water Saving</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-500">Client ID</p>
                <p className="text-xs font-mono text-gray-400">{clientId}</p>
            </div>
        </div>
        <p className="text-5xl font-bold mt-2">15%</p>
        <p className="text-sm text-gray-400 mt-1">20,5 L this month</p>
      </div>
    </div>
  );
};

export default RiverCard;
