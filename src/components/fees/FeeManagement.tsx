import React, { useState } from 'react';
import {
  CreditCard, Search, Filter, Download, Plus, Printer,
  CheckCircle2, AlertCircle, Clock, Wallet, DollarSign
} from 'lucide-react';
import { FeeInvoice, PaymentTransaction } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatCurrency, formatDate, getStatusBadgeClass, exportToCSV } from '../../utils/formatters';
import { RecordPaymentModal } from './RecordPaymentModal';
import { printPaymentReceipt } from '../../utils/receiptGenerator';
import { useToast } from '../common/Toast';

export const FeeManagement: React.FC = () => {
  const { stats, invoices, payments, students } = useHostel();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<string | undefined>();

  // Filtered Payments
  const filteredPayments = payments.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.receiptNo.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.studentId.toLowerCase().includes(q) ||
      p.transactionRef.toLowerCase().includes(q);

    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesMethod = !methodFilter || p.paymentMethod === methodFilter;

    return matchesSearch && matchesCategory && matchesMethod;
  });

  // Filtered Invoices
  const filteredInvoices = invoices.filter(i => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      i.invoiceNo.toLowerCase().includes(q) ||
      i.studentName.toLowerCase().includes(q) ||
      i.studentId.toLowerCase().includes(q) ||
      i.roomNo.toLowerCase().includes(q);

    const matchesCategory = !categoryFilter || i.category === categoryFilter;
    const matchesStatus = !statusFilter || i.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExport = () => {
    if (activeTab === 'payments') {
      const exportData = filteredPayments.map(p => ({
        'Receipt No': p.receiptNo,
        'Student Name': p.studentName,
        'Student ID': p.studentId,
        'Fee Category': p.category,
        'Amount Paid': p.amount,
        'Payment Method': p.paymentMethod,
        'Transaction Ref': p.transactionRef,
        'Payment Date': p.paymentDate,
        'Received By': p.receivedBy
      }));
      exportToCSV(`HostelHub_Receipts_Ledger_${new Date().toISOString().split('T')[0]}`, exportData);
      showToast('Payment ledger exported to CSV!', 'info');
    } else {
      const exportData = filteredInvoices.map(i => ({
        'Invoice No': i.invoiceNo,
        'Student Name': i.studentName,
        'Student ID': i.studentId,
        'Room': i.roomNo,
        'Category': i.category,
        'Billed Amount': i.amount,
        'Paid Amount': i.paidAmount,
        'Due Date': i.dueDate,
        'Status': i.status,
        'Term': i.academicTerm
      }));
      exportToCSV(`HostelHub_Invoices_Ledger_${new Date().toISOString().split('T')[0]}`, exportData);
      showToast('Invoice statements exported to CSV!', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Hostel Fees & Payments Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time fee collection, digital receipts, semester invoicing, and cashier verification
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedInvoiceForPayment(undefined);
              setIsRecordModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* 4 Finance Stat Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Realized Collections</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatCurrency(stats.totalCollectedFees)}
          </p>
          <span className="text-[10px] text-slate-400">{payments.length} verified transactions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Pending Receivables</span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {formatCurrency(stats.pendingFees)}
          </p>
          <span className="text-[10px] text-slate-400">Current term student balance</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Invoices</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {invoices.length}
          </p>
          <span className="text-[10px] text-slate-400">{invoices.filter(i => i.status === 'Paid').length} fully settled</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Overdue Invoices</span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
            {invoices.filter(i => i.status === 'Overdue').length}
          </p>
          <span className="text-[10px] text-rose-500 font-bold">Past payment deadline</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 border-b-2 px-4 transition-all flex items-center space-x-1.5 ${
            activeTab === 'payments'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Transactions & Receipts ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 border-b-2 px-4 transition-all flex items-center space-x-1.5 ${
            activeTab === 'invoices'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Billed Invoices Roster ({invoices.length})</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID, receipt #..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Hostel Fee">Hostel Fee</option>
            <option value="Mess Fee">Mess Fee</option>
            <option value="Security Deposit">Security Deposit</option>
            <option value="Maintenance Fee">Maintenance Fee</option>
          </select>

          {activeTab === 'payments' ? (
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          ) : (
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Invoice Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          )}
        </div>
      </div>

      {/* Table: Payments Ledger */}
      {activeTab === 'payments' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Receipt #</th>
                  <th className="py-3.5 px-3">Student Name</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Payment Method</th>
                  <th className="py-3.5 px-3">Transaction Reference</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-3 text-right">Amount (INR)</th>
                  <th className="py-3.5 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPayments.map(payment => {
                  const stu = students.find(s => s.studentId === payment.studentId);
                  const inv = invoices.find(i => i.id === payment.invoiceId);

                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                        {payment.receiptNo}
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900 dark:text-white">{payment.studentName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{payment.studentId}</p>
                      </td>

                      <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                        {payment.category}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {payment.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-[11px] font-mono text-slate-500 max-w-[160px] truncate">
                        {payment.transactionRef}
                      </td>

                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {formatDate(payment.paymentDate)}
                      </td>

                      <td className="py-3.5 px-3 text-right font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => printPaymentReceipt(payment, stu, inv)}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
                          title="Print Official Digital Receipt"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" />
                          <span>Print</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Table: Invoices */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-3">Student Name</th>
                  <th className="py-3.5 px-3">Room</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Term</th>
                  <th className="py-3.5 px-3">Due Date</th>
                  <th className="py-3.5 px-3 text-right">Billed Amount</th>
                  <th className="py-3.5 px-3 text-right">Paid</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {invoice.invoiceNo}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{invoice.studentName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{invoice.studentId}</p>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      Room {invoice.roomNo}
                    </td>

                    <td className="py-3.5 px-3 font-medium">
                      {invoice.category}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500">
                      {invoice.academicTerm}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                      {formatDate(invoice.dueDate)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(invoice.amount)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(invoice.paidAmount)}
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {invoice.status !== 'Paid' ? (
                        <button
                          onClick={() => {
                            setSelectedInvoiceForPayment(invoice.id);
                            setIsRecordModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                        >
                          Collect Fee
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        preselectedInvoiceId={selectedInvoiceForPayment}
      />
    </div>
  );
};
