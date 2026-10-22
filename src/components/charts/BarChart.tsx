import React, { useState } from 'react';

interface BarData {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  showGrid?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 220,
  valuePrefix = '',
  valueSuffix = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), 10);
  const chartHeight = height - 40;

  return (
    <div className="w-full select-none">
      <div className="relative flex items-end justify-between gap-2 pt-6" style={{ height: `${chartHeight}px` }}>
        {/* Subtle Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-slate-300 dark:border-slate-700 w-full" />
          <div className="border-b border-slate-300 dark:border-slate-700 w-full" />
          <div className="border-b border-slate-300 dark:border-slate-700 w-full" />
        </div>

        {data.map((item, idx) => {
          const barHeightPct = Math.round((item.value / maxValue) * 100);
          const isHovered = hoveredIdx === idx;
          const barColor = item.color || '#3b82f6';

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 z-20 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transform -translate-x-1/2 left-1/2 border border-slate-700">
                  {item.label}: {valuePrefix}{item.value.toLocaleString()}{valueSuffix}
                </div>
              )}

              {/* Bar */}
              <div
                className="w-full max-w-[42px] rounded-t-lg transition-all duration-300 transform group-hover:brightness-110"
                style={{
                  height: `${barHeightPct}%`,
                  backgroundColor: barColor,
                  minHeight: '6px'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-Axis labels */}
      <div className="flex justify-between gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400 truncate"
            title={item.label}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
