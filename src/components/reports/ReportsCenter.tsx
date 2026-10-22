import React, { useState, useMemo } from 'react';
import {
  FileText, Download, Printer, Filter, Calendar, Building,
  Users, BedDouble, Receipt, AlertCircle, Clock, Wrench,
  ShieldCheck, Package, Utensils, CheckCircle, Search
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { exportToCSV, formatCurrency, formatDate } from '../../utils/formatters';

type ReportType =
  | 'STUDENTS'
  | 'ADMISSIONS'
  | 'OCCUPANCY'
  | 'COLLECTIONS'
  | 'DEFAULTERS'
  | 'ATTENDANCE'
  | 'COMPLAINTS'
  | 'MAINTENANCE'
  | 'LEAVES'
  | 'VISITORS'
  | 'INVENTORY'
  | 'MESS';

interface ReportMeta {
  id: ReportType;
  title: string;
  category: string;
  icon: React.ElementType;
  description: string;
}

const REPORTS_LIST: ReportMeta[] = [
  { id: 'STUDENTS', title: 'Student Resident Directory', category: 'Enrollment', icon: Users, description: 'Complete roster of active residents, courses, assigned rooms & emergency contacts' },
  { id: 'ADMISSIONS', title: 'Admissions Pipeline Audit', category: 'Enrollment', icon: FileText, description: 'Application status, verified KYC, waitlist records and intake preferences' },
  { id: 'OCCUPANCY', title: 'Room & Bed Occupancy Matrix', category: 'Facilities', icon: BedDouble, description: 'Block-wise capacity, active occupants, vacancy slots, and occupancy percentages' },
  { id: 'COLLECTIONS', title: 'Fee Collections & Receipts', category: 'Financial', icon: Receipt, description: 'All settled invoices, payment modes, transaction reference codes and timestamp' },
  { id: 'DEFAULTERS', title: 'Outstanding Fee Defaulters', category: 'Financial', icon: AlertCircle, description: 'Unpaid and overdue balances, pending deadlines, and resident contact numbers' },
  { id: 'ATTENDANCE', title: 'Daily Roll-Call Attendance', category: 'Residential', icon: Clock, description: 'Daily curfew check-ins, leaves, absent tags and attendance rates' },
  { id: 'COMPLAINTS', title: 'Complaints & Grievances Audit', category: 'Service', icon: AlertCircle, description: 'Reported resident issues, technician assignments, turnaround times and statuses' },
  { id: 'MAINTENANCE', title: 'Estate Maintenance & Repairs', category: 'Facilities', icon: Wrench, description: 'Campus repair work orders, technician logs, completed repairs and expenditure' },
  { id: 'LEAVES', title: 'Outstation Leave & Gate Passes', category: 'Residential', icon: ShieldCheck, description: 'Approved leave permits, travel destinations, parent confirmations and return dates' },
  { id: 'VISITORS', title: 'Security Gate Visitor Log', category: 'Security', icon: ShieldCheck, description: 'Guest visitor passes, Aadhaar IDs, visited student, check-in and check-out logs' },
  { id: 'INVENTORY', title: 'Asset & Stock Inventory', category: 'Facilities', icon: Package, description: 'Furniture, bedding, electrical assets, damage logs, stock values and thresholds' },
  { id: 'MESS', title: 'Mess Dining Quality & Reviews', category: 'Dining', icon: Utensils, description: 'Student ratings, food hygiene scores, taste reviews and meal breakdown' },
];

export const ReportsCenter: React.FC = () => {
  const {
    students,
    admissions,
    rooms,
    hostels,
    invoices,
    payments,
    attendance,
    complaints,
    maintenance,
    leaves,
    visitors,
    inventory,
    messFeedbacks
  } = useHostel();

  const [activeReport, setActiveReport] = useState<ReportType>('STUDENTS');
  const [selectedHostel, setSelectedHostel] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Generate Report Data based on active report and filters
  const reportData = useMemo(() => {
    switch (activeReport) {
      case 'STUDENTS': {
        return students
          .filter(s => selectedHostel === 'ALL' || s.hostelName?.includes(selectedHostel))
          .map(s => ({
            'Student ID': s.studentId,
            'Roll No': s.rollNo,
            'Full Name': s.name,
            'Gender': s.gender,
            'Course': s.course,
            'Year': s.year,
            'Hostel': s.hostelName || 'Unassigned',
            'Room': s.roomNo ? `Room ${s.roomNo}` : 'None',
            'Bed': s.bedNo || 'None',
            'Phone': s.phone,
            'Guardian Phone': s.guardianPhone,
            'Status': s.status
          }));
      }

      case 'ADMISSIONS': {
        return admissions.map(a => {
          const hostel = hostels.find(h => h.id === a.preferredHostelId);
          return {
            'App No': a.applicationNo,
            'Applicant Name': a.fullName,
            'Course': a.course,
            'Preferred Block': hostel ? hostel.name : 'Aryabhata Boys Hostel',
            'Room Type': a.preferredRoomType,
            'Applied Date': formatDate(a.appliedDate),
            'Status': a.status
          };
        });
      }

      case 'OCCUPANCY': {
        return rooms
          .filter(r => selectedHostel === 'ALL' || r.hostelName.includes(selectedHostel))
          .map(r => ({
            'Hostel Block': r.hostelName,
            'Floor': `Floor ${r.floorNumber}`,
            'Room No': r.roomNumber,
            'Room Type': r.type,
            'Capacity': r.capacity,
            'Occupied': r.occupiedBeds,
            'Available': r.availableBeds,
            'Occupancy %': `${Math.round((r.occupiedBeds / r.capacity) * 100)}%`,
            'AC Room': r.hasAC ? 'Yes' : 'No',
            'Monthly Rate': formatCurrency(r.monthlyFee),
            'Status': r.status
          }));
      }

      case 'COLLECTIONS': {
        return payments.map(p => ({
          'Receipt No': p.receiptNo,
          'Student Name': p.studentName,
          'Amount Paid': formatCurrency(p.amount),
          'Payment Mode': p.paymentMethod,
          'Transaction Ref': p.transactionRef,
          'Payment Date': formatDate(p.paymentDate),
          'Collected By': p.receivedBy
        }));
      }

      case 'DEFAULTERS': {
        return invoices
          .filter(inv => inv.status === 'Overdue' || (inv.status === 'Partially Paid' && (inv.amount - inv.paidAmount) > 0))
          .map(inv => ({
            'Invoice No': inv.invoiceNo,
            'Student Name': inv.studentName,
            'Room': inv.roomNo,
            'Fee Category': inv.category,
            'Total Due': formatCurrency(inv.amount),
            'Balance Due': formatCurrency(inv.amount - inv.paidAmount),
            'Due Date': formatDate(inv.dueDate),
            'Status': inv.status
          }));
      }

      case 'ATTENDANCE': {
        return attendance.map(att => {
          const student = students.find(s => s.studentId === att.studentId);
          const hostel = hostels.find(h => h.id === att.hostelId);
          return {
            'Date': formatDate(att.date),
            'Roll No': student?.rollNo || 'N/A',
            'Student Name': att.studentName,
            'Hostel': hostel?.name || 'Aryabhata Boys Hostel',
            'Room': att.roomNo,
            'Status': att.status,
            'Recorded By': att.markedBy
          };
        });
      }

      case 'COMPLAINTS': {
        return complaints.map(c => ({
          'Ticket No': c.complaintNo,
          'Student': c.studentName,
          'Category': c.category,
          'Title': c.subject,
          'Location': c.location,
          'Priority': c.priority,
          'Assigned Staff': c.assignedStaffName || 'Unassigned',
          'Status': c.status,
          'Reported Date': formatDate(c.createdAt)
        }));
      }

      case 'MAINTENANCE': {
        return maintenance.map(m => ({
          'Request No': m.requestNo,
          'Hostel': m.hostelName,
          'Room': m.roomNo,
          'Issue': m.issue,
          'Priority': m.priority,
          'Assigned To': m.assignedStaffName,
          'Estimated Cost': m.cost ? formatCurrency(m.cost) : '₹0',
          'Status': m.status,
          'Reported Date': formatDate(m.createdDate)
        }));
      }

      case 'LEAVES': {
        return leaves.map(l => ({
          'Gate Pass': l.requestNo,
          'Student Name': l.studentName,
          'Room': l.roomNo,
          'Departure': formatDate(l.fromDate),
          'Return': formatDate(l.toDate),
          'Destination': l.destination,
          'Parent Contact': l.parentContact,
          'Status': l.status,
          'Approved By': l.approvedBy || 'Pending'
        }));
      }

      case 'VISITORS': {
        return visitors.map(v => ({
          'Pass No': v.visitorPassNo,
          'Visitor Name': v.visitorName,
          'Visited Student': v.studentName,
          'Room': v.roomNo,
          'Relationship': v.relationship,
          'Phone': v.phone,
          'Date': formatDate(v.visitDate),
          'Check In': v.entryTime,
          'Check Out': v.exitTime || 'Still In Campus',
          'Status': v.status
        }));
      }

      case 'INVENTORY': {
        return inventory.map(item => ({
          'Asset Code': item.itemCode,
          'Item Name': item.name,
          'Category': item.category,
          'Total Stock': item.totalQuantity,
          'Available': item.availableQuantity,
          'Damaged': item.damagedQuantity,
          'Location': item.location,
          'Unit Cost': formatCurrency(item.cost),
          'Status': item.status
        }));
      }

      case 'MESS': {
        return messFeedbacks.map(f => ({
          'Date': formatDate(f.date),
          'Student': f.studentName,
          'Meal': f.mealType,
          'Overall Rating': `${f.foodRating}/5`,
          'Taste Rating': `${f.tasteRating}/5`,
          'Cleanliness': `${f.cleanlinessRating}/5`,
          'Comment': f.comment
        }));
      }

      default:
        return [];
    }
  }, [
    activeReport, selectedHostel, students, admissions, rooms,
    invoices, payments, attendance, complaints, maintenance,
    leaves, visitors, inventory, messFeedbacks
  ]);

  // Filter report data by global search query
  const filteredData = useMemo(() => {
    if (!searchFilter.trim()) return reportData;
    const q = searchFilter.toLowerCase();
    return reportData.filter(row =>
      Object.values(row).some(val => String(val).toLowerCase().includes(q))
    );
  }, [reportData, searchFilter]);

  const activeMeta = REPORTS_LIST.find(r => r.id === activeReport)!;

  const handleExportCSV = () => {
    exportToCSV(
      filteredData,
      `HostelHub_${activeReport}_Report_${new Date().toISOString().split('T')[0]}`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <span>Audit & Compliance Reports Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate, preview, print, and export 12 official operational, administrative and financial audits
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Audit</span>
          </button>
        </div>
      </div>

      {/* Reports Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {REPORTS_LIST.map(rep => {
          const Icon = rep.icon;
          const isActive = rep.id === activeReport;

          return (
            <button
              key={rep.id}
              onClick={() => {
                setActiveReport(rep.id);
                setSearchFilter('');
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-brand-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-500'}`} />
                <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {rep.category}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{rep.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Report Header & Filters Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                {activeMeta.category} Report
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">
                {filteredData.length} records generated
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {activeMeta.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeMeta.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Hostel Filter (if applicable) */}
            {['STUDENTS', 'OCCUPANCY', 'ATTENDANCE'].includes(activeReport) && (
              <select
                value={selectedHostel}
                onChange={e => setSelectedHostel(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Residential Blocks</option>
                {hostels.map(h => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            )}

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter table content..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Live Report Preview Table */}
        {filteredData.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">No records match the current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  {Object.keys(filteredData[0]).map((headerKey, idx) => (
                    <th key={idx} className="py-3 px-3.5 whitespace-nowrap">
                      {headerKey}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {Object.values(row).map((cellVal, cellIdx) => (
                      <td key={cellIdx} className="py-2.5 px-3.5 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                        {String(cellVal)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
