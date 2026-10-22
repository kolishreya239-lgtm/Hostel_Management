import React, { useState } from 'react';

interface DonutItem {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutItem[];
  centerLabel?: string;
  centerValue?: string | number;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  centerLabel = 'Total',
  centerValue,
  size = 180
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const displayTotal = centerValue !== undefined ? centerValue : total;

  // Calculate SVG stroke dashes
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="18"
            className="text-slate-100 dark:text-slate-800"
          />
          {total > 0 &&
            data.map((item, idx) => {
              const strokeLength = (item.value / total) * circumference;
              const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
              const strokeDashoffset = -accumulatedAngle;
              accumulatedAngle += strokeLength;
              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={idx}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? 22 : 18}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xl font-extrabold text-slate-800 dark:text-white">
            {hoveredIdx !== null ? data[hoveredIdx].value : displayTotal}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[80px] truncate">
            {hoveredIdx !== null ? data[hoveredIdx].label : centerLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col space-y-2 max-w-xs">
        {data.map((item, idx) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div
              key={idx}
              className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                hoveredIdx === idx ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center space-x-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white ml-4">
                {item.value} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
