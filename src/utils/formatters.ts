export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'paid':
    case 'approved':
    case 'resolved':
    case 'closed':
    case 'checked out':
    case 'present':
    case 'in stock':
    case 'available':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    
    case 'pending':
    case 'partially paid':
    case 'partially occupied':
    case 'assigned':
    case 'in progress':
    case 'expected':
    case 'late':
    case 'low stock':
    case 'waitlisted':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      
    case 'overdue':
    case 'rejected':
    case 'full':
    case 'urgent':
    case 'absent':
    case 'suspended':
    case 'out of stock':
    case 'maintenance':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800';

    case 'checked in':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800';

    case 'on leave':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800';

    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  }
};

export const exportToCSV = (arg1: string | Record<string, any>[], arg2?: Record<string, any>[] | string) => {
  let filename = 'export.csv';
  let rows: Record<string, any>[] = [];

  if (typeof arg1 === 'string') {
    filename = arg1;
    rows = (arg2 as Record<string, any>[]) || [];
  } else {
    rows = arg1 || [];
    filename = (arg2 as string) || 'export.csv';
  }

  if (!rows || !rows.length) return;
  if (!filename.endsWith('.csv')) filename += '.csv';

  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
