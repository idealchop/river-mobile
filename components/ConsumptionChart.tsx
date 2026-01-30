
import React, { useState, useMemo } from 'react';
import type { MonthlyConsumption } from '../types.ts';

interface ConsumptionChartProps {
  data: MonthlyConsumption[];
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data }) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const width = 500;
  const height = 250;
  const padding = { top: 40, right: 20, bottom: 30, left: 20 };

  const { points, path, areaPath, maxConsumption } = useMemo(() => {
    const maxVal = Math.max(...data.map(d => d.liters), 0);
    const maxConsumption = Math.ceil(maxVal / 100) * 100; // Round up to nearest 100

    const getCoords = (liters: number, index: number) => {
      const x = padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
      const y = padding.top + (1 - liters / maxConsumption) * (height - padding.top - padding.bottom);
      return [x, y];
    };

    const points = data.map((d, i) => {
      const [x, y] = getCoords(d.liters, i);
      return { x, y, month: d.month, liters: d.liters };
    });

    const controlPoint = (current: any, previous: any, next: any, reverse?: boolean) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const o = {
        x: p.x,
        y: p.y
      };
      const angle = Math.atan2(n.y - o.y, n.x - o.x);
      const length = Math.sqrt(Math.pow(n.x - o.x, 2) + Math.pow(n.y - o.y, 2)) * smoothing;
      const angle_ = angle + (reverse ? Math.PI : 0);
      const x = current.x + Math.cos(angle_) * length;
      const y = current.y + Math.sin(angle_) * length;
      return [x, y];
    };

    const path = points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
      const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
      return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
    }, '');

    const areaPath = `${path} L ${points[points.length - 1].x},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`;

    return { points, path, areaPath, maxConsumption };
  }, [data, width, height]);

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl shadow-inner">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4DB5FF" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#4DB5FF" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Area Path */}
        <path d={areaPath} fill="url(#areaGradient)" className="opacity-0" style={{ animation: 'fadeIn 0.8s 0.3s ease-out forwards' }} />

        {/* Line Path */}
        <path d={path} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" className="path-animation" />

        {/* Data Points and Hover Areas */}
        {points.map((point, i) => (
          <g key={i}>
            <rect
              x={point.x - (width / (data.length - 1)) / 2}
              y={0}
              width={width / (data.length - 1)}
              height={height}
              fill="transparent"
              onMouseOver={() => setActivePoint(i)}
              onMouseOut={() => setActivePoint(null)}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={activePoint === i ? 8 : 5}
              fill="white"
              stroke="#3B82F6"
              strokeWidth="3"
              className="transition-all duration-200 opacity-0"
              style={{ animation: `fadeIn 0.5s ${0.3 + i * 0.1}s ease-out forwards` }}
            />
          </g>
        ))}

        {/* X-Axis Labels */}
        {points.map((point, i) => (
          <text key={i} x={point.x} y={height - 10} textAnchor="middle" fontSize="14" fill="#6B7280" className="font-semibold">
            {point.month}
          </text>
        ))}

        {/* Tooltip */}
        {activePoint !== null && (
          <g transform={`translate(${points[activePoint].x}, ${points[activePoint].y})`} className="pointer-events-none transition-transform duration-200">
            <rect x="-40" y="-55" width="80" height="40" rx="8" fill="rgba(27, 31, 59, 0.9)" className="drop-shadow-lg" />
            <text x="0" y="-35" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              {points[activePoint].liters}L
            </text>
            <text x="0" y="-20" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">
              {points[activePoint].month}
            </text>
            <path d="M -5 -15 L 0 -10 L 5 -15 Z" fill="rgba(27, 31, 59, 0.9)" />
          </g>
        )}
      </svg>
      <style>{`
        .path-animation {
          stroke-dasharray: 1500;
          stroke-dashoffset: 1500;
          animation: draw 1.2s 0.1s ease-out forwards;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ConsumptionChart;
