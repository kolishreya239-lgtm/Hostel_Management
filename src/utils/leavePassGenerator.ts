import { LeaveRequest, Student } from '../types';
import { formatDate } from './formatters';

export const printLeavePass = (leave: LeaveRequest, student?: Student) => {
  const printWindow = window.open('', '_blank', 'width=750,height=850');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hostel Out-Pass - ${leave.requestNo}</title>
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 30px;
            color: #0f172a;
            background: #fff;
          }
          .pass-container {
            max-width: 650px;
            margin: auto;
            border: 2px dashed #3b82f6;
            border-radius: 12px;
            padding: 28px;
            background: #fdfdfd;
          }
          .top-banner {
            text-align: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .top-banner h1 {
            margin: 0;
            font-size: 22px;
            color: #1e3a8a;
            text-transform: uppercase;
          }
          .top-banner p {
            margin: 4px 0 0;
            font-size: 13px;
            color: #64748b;
          }
          .badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 6px 16px;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 13px;
            margin-top: 10px;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .info-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
          }
          .info-table td.label {
            font-weight: 600;
            color: #475569;
            width: 35%;
            background: #f8fafc;
          }
          .dates-box {
            display: flex;
            justify-content: space-around;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: center;
          }
          .dates-box h4 {
            margin: 0 0 6px 0;
            color: #1e40af;
            font-size: 12px;
            text-transform: uppercase;
          }
          .dates-box p {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
          }
          .sign-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
          }
          .sign-box {
            border-top: 1px solid #94a3b8;
            padding-top: 8px;
            color: #475569;
          }
          @media print {
            body { padding: 0; }
            .pass-container { border: 2px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="pass-container">
          <div class="top-banner">
            <h1>HostelHub – Official Gate Out-Pass</h1>
            <p>Smart Student Residence Security Authorization</p>
            <div class="badge">APPROVED OUT-STATION PASS</div>
            <p style="margin-top: 8px; font-size: 12px; font-weight: 600;">Pass No: ${leave.requestNo}</p>
          </div>

          <div class="dates-box">
            <div>
              <h4>Valid From (Departure)</h4>
              <p>${formatDate(leave.fromDate)}</p>
            </div>
            <div>
              <h4>Valid Until (Return by)</h4>
              <p>${formatDate(leave.toDate)} 09:00 PM</p>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <td class="label">Resident Student:</td>
              <td><strong>${leave.studentName}</strong> (ID: ${leave.studentId})</td>
            </tr>
            <tr>
              <td class="label">Hostel & Room:</td>
              <td>${leave.hostelName} | Room ${leave.roomNo}</td>
            </tr>
            <tr>
              <td class="label">Course & Roll No:</td>
              <td>${student ? `${student.course} | Roll: ${student.rollNo}` : 'Resident Scholar'}</td>
            </tr>
            <tr>
              <td class="label">Destination / City:</td>
              <td>${leave.destination}</td>
            </tr>
            <tr>
              <td class="label">Reason for Leave:</td>
              <td>${leave.reason}</td>
            </tr>
            <tr>
              <td class="label">Parent / Guardian Contact:</td>
              <td>${leave.parentContact}</td>
            </tr>
            <tr>
              <td class="label">Emergency Contact:</td>
              <td>${leave.emergencyContact}</td>
            </tr>
            <tr>
              <td class="label">Warden Approval:</td>
              <td>${leave.approvedBy || 'Warden Office'} (${leave.actionRemarks || 'Approved'})</td>
            </tr>
          </table>

          <div class="sign-grid">
            <div class="sign-box">Resident Scholar</div>
            <div class="sign-box">Hostel Warden Seal</div>
            <div class="sign-box">Main Security Gate Check</div>
          </div>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px;">
            Carry this printed or digital pass along with Student Identity Card at main campus security checkpoint.
          </p>
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
