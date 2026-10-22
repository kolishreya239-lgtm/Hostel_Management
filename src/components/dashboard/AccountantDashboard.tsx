import React from 'react';
import {
  CreditCard, ArrowUpRight, CheckCircle2, AlertCircle, FileText,
  Download, Printer, DollarSign, Wallet, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { StatCard } from '../common/StatCard';
import { DonutChart } from '../charts/DonutChart';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { printPaymentReceipt } from '../../utils/receiptGenerator';

interface AccountantDashboardProps {
  onNavigate: (module: string) => void;
  onOpenRecordPayment: () => void;
  onOpenInvoiceModal: () => void;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({
  onNavigate,
  onOpenRecordPayment,
  onOpenInvoiceModal
}) => {
  const { stats, invoices, payments, students } = useHostel();

  const overdueInvoices = invoices.filter(i => i.status === 'Overdue');
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

  // Today's collections
  const todayDate = '2026-09-27';
  const todayPayments = payments.filter(p => p.paymentDate === todayDate);
  const todayAmount = todayPayments.reduce((sum, p) => sum + p.amount, 0);

  // Payment methods chart data
  const methodCounts: Record<string, number> = {};
  payments.forEach(p => {
    methodCounts[p.paymentMethod] = (methodCounts[p.paymentMethod] || 0) + p.amount;
  });

  const paymentMethodsData = [
    { label: 'UPI / GPay', value: methodCounts['UPI'] || 123000, color: '#10b981' },
    { label: 'Bank Transfer / NEFT', value: methodCounts['Bank Transfer'] || 123000, color: '#3b82f6' },
    { label: 'Credit/Debit Card', value: methodCounts['Card'] || 99000, color: '#8b5cf6' },
    { label: 'Cash Counters', value: methodCounts['Cash'] || 54000, color: '#f59e0b' },
  ];

  // Fee Status Breakdown
  const paidCount = invoices.filter(i => i.status === 'Paid').length;
  const pendingCount = invoices.filter(i => i.status === 'Pending').length;
  const overdueCount = overdueInvoices.length;

  const feeStatusData = [
    { label: 'Paid Invoices', value: paidCount, color: '#10b981' },
    { label: 'Pending Dues', value: pendingCount, color: '#f59e0b' },
    { label: 'Overdue Dues', value: overdueCount, color: '#ef4444' },
  ];

  // Monthly Revenue Line Chart
  const revenueHistory = [
    { label: 'May', value: 120000 },
    { label: 'Jun', value: 350000 },
    { label: 'Jul', value: 890000 },
    { label: 'Aug', value: 1240000 },
    { label: 'Sep', value: 750000 },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-purple-200 border border-white/15 mb-2">
            Finance & Accounts Secretariat
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hostel Fee & Revenue Accounts
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Realized cash flow, invoice ledger, and digital transaction verification.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onOpenRecordPayment}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Financial Report</span>
          </button>
        </div>
      </div>

      {/* 4 Finance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Realized Revenue"
          value={formatCurrency(stats.totalCollectedFees)}
          subtitle="Annual payments received"
          icon={Wallet}
          colorScheme="purple"
          trend={{ value: '+14.2% YoY', isPositive: true }}
          onClick={() => onNavigate('fees')}
        />
        <StatCard
          title="Current Month Collections"
          value="₹7,50,000"
          subtitle="September 2026 inflow"
          icon={CreditCard}
          colorScheme="emerald"
          onClick={() => onNavigate('fees')}
        />
        <StatCard
          title="Pending Student Dues"
          value={formatCurrency(stats.pendingFees)}
          subtitle="Active invoice balances"
          icon={AlertCircle}
          colorScheme="amber"
          onClick={() => onNavigate('fees')}
        />
        <StatCard
          title="Overdue Receivables"
          value={formatCurrency(overdueAmount)}
          subtitle={`${overdueInvoices.length} overdue invoices`}
          icon={AlertCircle}
          colorScheme="rose"
          onClick={() => onNavigate('fees')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue by Payment Channel
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                UPI vs Netbanking vs POS Cards
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Verified Gateway
            </span>
          </div>
          <DonutChart
            data={paymentMethodsData}
            centerLabel="INR Total"
            centerValue={formatCurrency(stats.totalCollectedFees)}
            size={180}
          />
        </div>

        {/* Monthly Revenue Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Fee Intake Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Collections trajectory across the semester
              </p>
            </div>
          </div>
          <LineChart
            data={revenueHistory}
            height={220}
            valuePrefix="₹"
            strokeColor="#8b5cf6"
          />
        </div>
      </div>

      {/* Recent Transactions Table with Print Receipt */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Fee Transactions & Receipts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click &ldquo;Print Receipt&rdquo; to test instant digital voucher generation
            </p>
          </div>
          <button
            onClick={() => onNavigate('fees')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Full Fee Ledger &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-3">Receipt No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.slice(0, 5).map(pay => {
                const stu = students.find(s => s.studentId === pay.studentId);
                return (
                  <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {pay.receiptNo}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {pay.studentName}
                      <span className="block text-[10px] text-slate-400">{pay.studentId}</span>
                    </td>
                    <td className="py-3 px-3">{pay.category}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{formatDate(pay.paymentDate)}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(pay.amount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => printPaymentReceipt(pay, stu)}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        Print
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
