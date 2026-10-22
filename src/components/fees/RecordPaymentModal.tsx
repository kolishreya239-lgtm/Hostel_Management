import React, { useState, useEffect } from 'react';
import { FeeCategory, PaymentMethod, FeeInvoice, PaymentTransaction } from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useToast } from '../common/Toast';
import { formatCurrency } from '../../utils/formatters';
import { printPaymentReceipt } from '../../utils/receiptGenerator';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedInvoiceId?: string;
  onSuccess?: (payment: PaymentTransaction) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedInvoiceId,
  onSuccess
}) => {
  const { students, invoices, recordPayment } = useHostel();
  const { showToast } = useToast();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [category, setCategory] = useState<FeeCategory>('Hostel Fee');
  const [amount, setAmount] = useState<number>(51000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [lastPayment, setLastPayment] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    if (preselectedInvoiceId) {
      const inv = invoices.find(i => i.id === preselectedInvoiceId);
      if (inv) {
        setSelectedInvoiceId(inv.id);
        const stu = students.find(s => s.studentId === inv.studentId);
        if (stu) setSelectedStudentId(stu.id);
        setCategory(inv.category);
        setAmount(inv.amount - inv.paidAmount);
      }
    } else if (students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
    setTransactionRef(`UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/HDFC`);
    setLastPayment(null);
  }, [preselectedInvoiceId, isOpen, students, invoices]);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Invoices for this student
  const studentInvoices = invoices.filter(
    i => i.studentId === currentStudent?.studentId && i.status !== 'Paid'
  );

  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    const inv = invoices.find(i => i.id === invId);
    if (inv) {
      setCategory(inv.category);
      setAmount(inv.amount - inv.paidAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) {
      showToast('Please select a student.', 'danger');
      return;
    }
    if (amount <= 0) {
      showToast('Please specify a positive payment amount.', 'danger');
      return;
    }

    const payment = recordPayment({
      studentId: currentStudent.studentId,
      studentName: currentStudent.name,
      invoiceId: selectedInvoiceId || undefined,
      amount: Number(amount),
      paymentDate,
      paymentMethod,
      transactionRef: transactionRef || `TXN-${Date.now()}`,
      category,
      receivedBy: 'Manoj Verma (Accounts)',
      notes
    });

    setLastPayment(payment);
    showToast(`Payment of ₹${amount.toLocaleString()} recorded! Receipt #${payment.receiptNo} generated.`, 'success');
    if (onSuccess) onSuccess(payment);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Hostel Fee Payment"
      subtitle="Issue verified fee receipt with automated invoice ledger reconciliation"
      maxWidth="xl"
    >
      {lastPayment ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
            ✓
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Payment Successfully Recorded!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Receipt No: <strong className="text-brand-600 font-mono">{lastPayment.receiptNo}</strong>
            </p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(lastPayment.amount)}
            </p>
          </div>

          <div className="flex justify-center space-x-3 pt-3">
            <button
              onClick={() => {
                const stu = students.find(s => s.studentId === lastPayment.studentId);
                const inv = invoices.find(i => i.id === lastPayment.invoiceId);
                printPaymentReceipt(lastPayment, stu, inv);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Print Official Receipt
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student Resident *
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentId}) – Room {s.roomNo || 'Unassigned'} • {s.course}
                </option>
              ))}
            </select>
          </div>

          {studentInvoices.length > 0 && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Link to Outstanding Invoice (Optional)
              </label>
              <select
                value={selectedInvoiceId}
                onChange={e => handleInvoiceChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              >
                <option value="">No invoice linked / General payment</option>
                {studentInvoices.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNo} – {inv.category} ({inv.academicTerm}) – Due: {formatCurrency(inv.amount - inv.paidAmount)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fee Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as FeeCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              >
                <option value="Hostel Fee">Hostel Fee (Room & Living)</option>
                <option value="Mess Fee">Mess & Food Service Fee</option>
                <option value="Security Deposit">Security Caution Deposit</option>
                <option value="Maintenance Fee">Maintenance Charges</option>
                <option value="Other Charges">Other / Amenity Charges</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount Paid (INR) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Channel *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Bank Transfer">Bank Transfer (NEFT / RTGS)</option>
                <option value="Card">Debit / Credit Card (POS Counter)</option>
                <option value="Cash">Physical Cash Receipt</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Transaction Reference / UTR Number
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={e => setTransactionRef(e.target.value)}
              placeholder="e.g. UPI/229048123901/HDFC or Cash Receipt No"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Internal Remarks (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Term fee installment 1 of 2"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20"
            >
              Record Payment & Issue Receipt
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
