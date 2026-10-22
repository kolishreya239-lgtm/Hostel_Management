import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  currentModule: string;
  subTitle?: string;
  onNavigateHome: () => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentModule,
  subTitle,
  onNavigateHome
}) => {
  const formatModuleName = (str: string) => {
    return str
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
      <button
        onClick={onNavigateHome}
        className="flex items-center hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>HostelHub</span>
      </button>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span className="text-slate-700 dark:text-slate-200 capitalize font-semibold">
        {formatModuleName(currentModule)}
      </span>
      {subTitle && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span className="text-brand-600 dark:text-brand-400 font-medium truncate max-w-[200px]">
            {subTitle}
          </span>
        </>
      )}
    </nav>
  );
};
