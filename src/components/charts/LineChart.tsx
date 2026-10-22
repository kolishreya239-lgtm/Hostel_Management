import React, { useState } from 'react';

interface Point {
  label: string;
  value: number;
}

interface LineChartProps {
  data: Point[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  strokeColor?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  valuePrefix = '',
  valueSuffix = '',
  strokeColor = '#2563eb'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const paddingX = 40;
  const paddingY = 30;
  const chartHeight = height - paddingY * 2;
  const chartWidth = width - paddingX * 2;

  const maxValue = Math.max(...data.map(d => d.value), 10);
  const minValue = 0;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((d.value - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`;

  return (
    <div className="w-full select-none">
      <div className="relative" style={{ height: `${height}px` }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#lineGrad)" />

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 6 : 4}
                fill={strokeColor}
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute z-20 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-8"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100}%`
            }}
          >
            {points[hoveredIdx].label}: {valuePrefix}{points[hoveredIdx].value.toLocaleString()}{valueSuffix}
          </div>
        )}
      </div>

      {/* X Labels */}
      <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 px-4">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};
