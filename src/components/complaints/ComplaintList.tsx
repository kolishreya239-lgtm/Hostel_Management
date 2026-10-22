import React, { useState } from 'react';
import {
  AlertTriangle, Search, Filter, Plus, CheckCircle2, Clock,
  User, Wrench, Download, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Complaint, ComplaintStatus, ComplaintCategory, PriorityLevel } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { getStatusBadgeClass, exportToCSV } from '../../utils/formatters';
import { ComplaintModal } from './ComplaintModal';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const ComplaintList: React.FC = () => {
  const { complaints, staff, assignComplaint, updateComplaintStatus } = useHostel();
  const { currentRole } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Assign staff state
  const [assignStaffId, setAssignStaffId] = useState('');
  const [resolutionText, setResolutionText] = useState('');

  const filteredComplaints = complaints.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.complaintNo.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q);

    const matchesCategory = !categoryFilter || c.category === categoryFilter;
    const matchesPriority = !priorityFilter || c.priority === priorityFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !assignStaffId) return;
    const stf = staff.find(s => s.id === assignStaffId);
    if (stf) {
      assignComplaint(selectedComplaint.id, stf.id, `${stf.name} (${stf.role})`);
      showToast(`Assigned complaint #${selectedComplaint.complaintNo} to ${stf.name}!`, 'success');
      setSelectedComplaint(null);
    }
  };

  const handleStatusChange = (status: ComplaintStatus) => {
    if (!selectedComplaint) return;
    updateComplaintStatus(selectedComplaint.id, status, resolutionText);
    showToast(`Status updated to "${status}" for #${selectedComplaint.complaintNo}`, 'success');
    setSelectedComplaint(null);
    setResolutionText('');
  };

  const handleExport = () => {
    const data = filteredComplaints.map(c => ({
      'Complaint #': c.complaintNo,
      'Student Name': c.studentName,
      'Category': c.category,
      'Subject': c.subject,
      'Location': c.location,
      'Priority': c.priority,
      'Status': c.status,
      'Assigned To': c.assignedStaffName || 'Unassigned',
      'Created At': c.createdAt
    }));
    exportToCSV(`HostelHub_Complaints_${new Date().toISOString().split('T')[0]}`, data);
    showToast('Complaints ledger exported to CSV!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Complaints & Maintenance Helpdesk
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track student grievances, assign electrical/plumbing staff, and manage turnaround SLAs
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
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>File New Complaint</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search complaint, student, room..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Internet">Internet / WiFi</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Room">Room & Furniture</option>
            <option value="Food/Mess">Food / Mess</option>
            <option value="Security">Security</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Ticket #</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Subject & Location</th>
                <th className="py-3.5 px-3">Filed By</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3">Assigned Staff</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComplaints.map(comp => (
                <tr key={comp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {comp.complaintNo}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {comp.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900 dark:text-white">{comp.subject}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{comp.location} • {comp.createdAt}</p>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {comp.studentName}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      comp.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : comp.priority === 'High'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}>
                      {comp.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    {comp.assignedStaffName ? (
                      <span className="font-semibold text-brand-700 dark:text-brand-300">
                        {comp.assignedStaffName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(comp.status)}`}>
                      {comp.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedComplaint(comp);
                        setAssignStaffId(comp.assignedStaffId || (staff[0]?.id || ''));
                      }}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
                    >
                      Update / Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Action Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Manage Ticket #${selectedComplaint.complaintNo}`}
          subtitle={`Subject: ${selectedComplaint.subject}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                <strong>Description:</strong> {selectedComplaint.description}
              </p>
              <p className="text-slate-500">
                <strong>Location:</strong> {selectedComplaint.location} • <strong>Filed by:</strong> {selectedComplaint.studentName}
              </p>
            </div>

            {/* Assign Staff section */}
            <form onSubmit={handleAssign} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Assign Maintenance Technician:
              </label>
              <div className="flex space-x-2">
                <select
                  value={assignStaffId}
                  onChange={e => setAssignStaffId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {staff.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role}) – Phone: {st.phone}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold"
                >
                  Assign
                </button>
              </div>
            </form>

            {/* Status Transition Buttons */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                Advance Ticket Lifecycle Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('Assigned')}
                  className="p-2 rounded-xl font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-center"
                >
                  Assigned
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('In Progress')}
                  className="p-2 rounded-xl font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-center"
                >
                  In Progress
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('Resolved')}
                  className="p-2 rounded-xl font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-center"
                >
                  Mark Resolved
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('Closed')}
                  className="p-2 rounded-xl font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 text-center"
                >
                  Close Ticket
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Complaint Modal */}
      <ComplaintModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};
