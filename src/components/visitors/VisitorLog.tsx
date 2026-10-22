import React, { useState } from 'react';
import {
  UserCheck, Search, Filter, Download, Plus, Clock,
  ArrowRight, ShieldCheck, CheckCircle2, LogIn, LogOut
} from 'lucide-react';
import { Visitor } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatDate, getStatusBadgeClass, exportToCSV } from '../../utils/formatters';
import { VisitorModal } from './VisitorModal';
import { useToast } from '../common/Toast';

export const VisitorLog: React.FC = () => {
  const { visitors, checkInVisitor, checkOutVisitor } = useHostel();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const filteredVisitors = visitors.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.visitorName.toLowerCase().includes(q) ||
      v.studentName.toLowerCase().includes(q) ||
      v.visitorPassNo.toLowerCase().includes(q) ||
      v.phone.toLowerCase().includes(q);

    const matchesStatus = !statusFilter || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCheckIn = (v: Visitor) => {
    checkInVisitor(v.id);
    showToast(`Visitor ${v.visitorName} checked in at main gate.`, 'success');
  };

  const handleCheckOut = (v: Visitor) => {
    checkOutVisitor(v.id);
    showToast(`Visitor ${v.visitorName} checked out successfully.`, 'info');
  };

  const handleExport = () => {
    const data = filteredVisitors.map(v => ({
      'Pass #': v.visitorPassNo,
      'Visitor Name': v.visitorName,
      'Resident Scholar': v.studentName,
      'Room': v.roomNo,
      'Relationship': v.relationship,
      'Phone': v.phone,
      'ID Proof': v.idProof,
      'Date': v.visitDate,
      'Entry Time': v.entryTime,
      'Exit Time': v.exitTime || 'On Campus',
      'Purpose': v.purpose,
      'Status': v.status
    }));
    exportToCSV(`HostelHub_Visitors_${new Date().toISOString().split('T')[0]}`, data);
    showToast('Visitor logs exported to CSV!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Campus Visitors & Security Gate Log
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor incoming guests, parents, ID verification logs, and automated Check-In/Check-Out timestamps
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
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Visitor</span>
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
              placeholder="Search visitor name, resident scholar, pass #..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Expected">Expected</option>
            <option value="Checked In">Checked In (On Campus)</option>
            <option value="Checked Out">Checked Out</option>
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
                <th className="py-3.5 px-3">Visitor Name</th>
                <th className="py-3.5 px-3">Resident Scholar</th>
                <th className="py-3.5 px-3">ID Proof & Phone</th>
                <th className="py-3.5 px-3">Visit Date</th>
                <th className="py-3.5 px-3">Entry / Exit</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVisitors.map(vis => (
                <tr key={vis.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {vis.visitorPassNo}
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900 dark:text-white">{vis.visitorName}</p>
                    <span className="text-[11px] text-slate-400 font-medium">Rel: {vis.relationship}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{vis.studentName}</p>
                    <p className="text-[11px] text-slate-400">Room {vis.roomNo}</p>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-mono text-slate-700 dark:text-slate-300">{vis.idProof}</p>
                    <p className="text-[11px] text-slate-400">{vis.phone}</p>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {formatDate(vis.visitDate)}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="text-emerald-600 font-bold block">In: {vis.entryTime}</span>
                    <span className="text-slate-400 text-[11px] block">
                      Out: {vis.exitTime || 'Still inside'}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(vis.status)}`}>
                      {vis.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex space-x-1">
                      {vis.status === 'Expected' && (
                        <button
                          onClick={() => handleCheckIn(vis)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center space-x-1"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Check In</span>
                        </button>
                      )}

                      {vis.status === 'Checked In' && (
                        <button
                          onClick={() => handleCheckOut(vis)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm flex items-center space-x-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                      )}

                      {vis.status === 'Checked Out' && (
                        <span className="text-[11px] font-bold text-slate-400 italic">
                          Visit Concluded
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Registration Modal */}
      <VisitorModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
