import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  onClick
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      border: 'hover:border-blue-300 dark:hover:border-blue-700',
      badge: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      badge: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-300 dark:hover:border-amber-700',
      badge: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60'
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-300 dark:hover:border-purple-700',
      badge: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60'
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      border: 'hover:border-rose-300 dark:hover:border-rose-700',
      badge: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60'
    },
    slate: {
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
      border: 'hover:border-slate-300 dark:hover:border-slate-700',
      badge: 'text-slate-600 bg-slate-50 dark:bg-slate-950/60'
    }
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md ' + colorStyles.border : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110 ${colorStyles.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h4>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
      )}
    </div>
  );
};
