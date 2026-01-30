
import React from 'react';

const Gauge = ({ percentage }: { percentage: number }) => {
  const radius = 90;
  const strokeWidth = 3;
  const center = 100;
  const circumference = 2 * Math.PI * radius;
  
  // The arc is 270 degrees, from 135deg to 405deg (or 45deg)
  const arcLength = circumference * (270 / 360);
  const progress = Math.min(1, Math.max(0, percentage / 100));
  const strokeDashoffset = arcLength * (1 - progress);

  // Calculate start and end points of the arc
  const startAngle = 135;
  const endAngle = 405;
  const startX = center + radius * Math.cos(startAngle * Math.PI / 180);
  const startY = center + radius * Math.sin(startAngle * Math.PI / 180);
  const endX = center + radius * Math.cos(endAngle * Math.PI / 180);
  const endY = center + radius * Math.sin(endAngle * Math.PI / 180);

  // Calculate handle position
  const handleAngle = startAngle + progress * 270;
  const handleX = center + radius * Math.cos(handleAngle * Math.PI / 180);
  const handleY = center + radius * Math.sin(handleAngle * Math.PI / 180);

  const largeArcFlag = 270 > 180 ? 1 : 0;

  const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
      {/* Background Arc */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={strokeWidth - 1}
      />
      {/* Progress Arc */}
      <path
        d={pathData}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={arcLength}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {/* Handle */}
      <circle
        cx={handleX}
        cy={handleY}
        r="8"
        fill="white"
        style={{ transition: 'cx 0.5s ease, cy 0.5s ease' }}
      />
    </svg>
  );
};

export default Gauge;
