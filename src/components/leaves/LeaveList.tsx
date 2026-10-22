import React, { useState } from 'react';
import {
  Send, Search, Filter, Download, Plus, Printer, CheckCircle2,
  XCircle, Clock, ShieldCheck
} from 'lucide-react';
import { LeaveRequest } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusBadgeClass, exportToCSV } from '../../utils/formatters';
import { ApplyLeaveModal } from './ApplyLeaveModal';
import { printLeavePass } from '../../utils/leavePassGenerator';
import { useToast } from '../common/Toast';

export const LeaveList: React.FC = () => {
  const { leaves, students, approveLeave, rejectLeave } = useHostel();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const filteredLeaves = leaves.filter(l => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      l.studentName.toLowerCase().includes(q) ||
      l.requestNo.toLowerCase().includes(q) ||
      l.destination.toLowerCase().includes(q) ||
      l.reason.toLowerCase().includes(q);

    const matchesStatus = !statusFilter || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (leave: LeaveRequest) => {
    approveLeave(leave.id, currentUser?.name || 'Chief Warden', 'Confirmed with parent. Approved.');
    showToast(`Leave pass #${leave.requestNo} approved!`, 'success');
  };

  const handleReject = (leave: LeaveRequest) => {
    rejectLeave(leave.id, currentUser?.name || 'Chief Warden', 'Declined due to academic schedule.');
    showToast(`Leave pass #${leave.requestNo} rejected.`, 'danger');
  };

  const handleExport = () => {
    const data = filteredLeaves.map(l => ({
      'Request #': l.requestNo,
      'Student Name': l.studentName,
      'Hostel': l.hostelName,
      'Room': l.roomNo,
      'From Date': l.fromDate,
      'To Date': l.toDate,
      'Destination': l.destination,
      'Reason': l.reason,
      'Parent Contact': l.parentContact,
      'Status': l.status,
      'Approved By': l.approvedBy || '-'
    }));
    exportToCSV(`HostelHub_Leaves_${new Date().toISOString().split('T')[0]}`, data);
    showToast('Leave requests exported to CSV!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Hostel Leave & Out-Pass Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Outstation journey permissions, parent verification checks, and biometric security gate passes
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
            onClick={() => setIsApplyModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, destination, request #..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Pass #</th>
                <th className="py-3.5 px-3">Student Name</th>
                <th className="py-3.5 px-3">Room / Hostel</th>
                <th className="py-3.5 px-3">Travel Period</th>
                <th className="py-3.5 px-3">Destination & Reason</th>
                <th className="py-3.5 px-3">Parent Contact</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeaves.map(leave => {
                const stu = students.find(s => s.studentId === leave.studentId);

                return (
                  <tr key={leave.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {leave.requestNo}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{leave.studentName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{leave.studentId}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Room {leave.roomNo}</p>
                      <p className="text-[11px] text-slate-400">{leave.hostelName.split(' ')[0]}</p>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatDate(leave.fromDate)}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        to {formatDate(leave.toDate)}
                      </p>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{leave.destination}</p>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">&ldquo;{leave.reason}&rdquo;</p>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {leave.parentContact}
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        {leave.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(leave)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => handleReject(leave)}
                              className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 font-bold text-[11px] border border-rose-200 dark:border-rose-800"
                            >
                              Decline
                            </button>
                          </>
                        ) : leave.status === 'Approved' ? (
                          <button
                            onClick={() => printLeavePass(leave, stu)}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
                            title="Print Official Out-Pass"
                          >
                            <Printer className="w-3.5 h-3.5 mr-1" />
                            <span>Print Pass</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Declined</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
