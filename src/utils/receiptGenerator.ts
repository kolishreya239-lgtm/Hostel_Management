import { PaymentTransaction, Student, FeeInvoice } from '../types';
import { formatCurrency, formatDate } from './formatters';

export const printPaymentReceipt = (
  payment: PaymentTransaction,
  student?: Student,
  invoice?: FeeInvoice
) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Fee Receipt - ${payment.receiptNo}</title>
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 40px;
            color: #1e293b;
            background: #fff;
          }
          .receipt-container {
            max-width: 680px;
            margin: auto;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 32px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .brand h1 {
            margin: 0;
            font-size: 24px;
            color: #1e3a8a;
            font-weight: 800;
          }
          .brand p {
            margin: 4px 0 0 0;
            font-size: 13px;
            color: #64748b;
          }
          .receipt-title {
            text-align: right;
          }
          .receipt-title h2 {
            margin: 0;
            font-size: 18px;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .receipt-badge {
            display: inline-block;
            background: #dcfce7;
            color: #15803d;
            font-weight: 700;
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 20px;
            margin-top: 6px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 28px;
            background: #f8fafc;
            padding: 16px;
            border-radius: 8px;
            font-size: 13px;
          }
          .details-grid div strong {
            color: #475569;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 28px;
          }
          th {
            background: #f1f5f9;
            text-align: left;
            padding: 12px;
            font-size: 13px;
            color: #334155;
            border-bottom: 2px solid #cbd5e1;
          }
          td {
            padding: 14px 12px;
            font-size: 14px;
            border-bottom: 1px solid #e2e8f0;
          }
          .total-row td {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            border-top: 2px solid #0f172a;
          }
          .footer-note {
            font-size: 12px;
            color: #64748b;
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 48px;
            font-size: 13px;
          }
          .sign-box {
            text-align: center;
            border-top: 1px dashed #94a3b8;
            padding-top: 8px;
            width: 180px;
          }
          @media print {
            body { padding: 0; }
            .receipt-container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="brand">
              <h1>HostelHub</h1>
              <p>Smart Management. Better Living.</p>
              <p>Tech Enclave Campus, New Delhi - 110016</p>
            </div>
            <div class="receipt-title">
              <h2>E-Receipt</h2>
              <span class="receipt-badge">PAID VERIFIED</span>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #475569;"><strong>Receipt No:</strong> ${payment.receiptNo}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #475569;"><strong>Date:</strong> ${formatDate(payment.paymentDate)}</p>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <strong>Student Name:</strong> ${payment.studentName}<br>
              <strong>Student ID:</strong> ${payment.studentId}<br>
              <strong>Room / Hostel:</strong> ${student ? `${student.roomNo} (${student.hostelName})` : 'Allocated'}<br>
              <strong>Course & Year:</strong> ${student ? `${student.course} - ${student.year}` : '-'}
            </div>
            <div>
              <strong>Payment Mode:</strong> ${payment.paymentMethod}<br>
              <strong>Transaction Ref:</strong> ${payment.transactionRef}<br>
              <strong>Category:</strong> ${payment.category}<br>
              <strong>Cashier / Issuer:</strong> ${payment.receivedBy}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice?.academicTerm || 'Autumn Term 2026'} - ${payment.category}</td>
                <td>${payment.category}</td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(payment.amount)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Net Amount Paid:</td>
                <td style="text-align: right; color: #16a34a;">${formatCurrency(payment.amount)}</td>
              </tr>
            </tbody>
          </table>

          <div class="signature-section">
            <div class="sign-box">Student Signature</div>
            <div class="sign-box">Accounts Officer Seal</div>
          </div>

          <div class="footer-note">
            <p><strong>Note:</strong> This is a computer generated official electronic fee receipt issued via HostelHub ERP System. No physical counter-signature required for validation.</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
