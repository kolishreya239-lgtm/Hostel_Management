import React, { useState } from 'react';
import {
  Wrench, CheckCircle2, Clock, AlertTriangle, Download, Plus, DollarSign
} from 'lucide-react';
import { MaintenanceRequest } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatCurrency, formatDate, getStatusBadgeClass, exportToCSV } from '../../utils/formatters';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const MaintenanceList: React.FC = () => {
  const { maintenance, updateMaintenanceStatus, createMaintenanceRequest } = useHostel();
  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    roomNo: 'A-101',
    hostelName: 'Aryabhata Hall (Boys)',
    studentName: 'Resident Scholar',
    issue: '',
    priority: 'Medium' as MaintenanceRequest['priority'],
    assignedStaffName: 'Ramesh Yadav (Electrician)',
    cost: 500
  });

  const openCount = maintenance.filter(m => m.status === 'Open').length;
  const inProgressCount = maintenance.filter(m => m.status === 'In Progress').length;
  const completedCount = maintenance.filter(m => m.status === 'Completed').length;
  const urgentCount = maintenance.filter(m => m.priority === 'Urgent').length;

  const handleStatusChange = (id: string, status: MaintenanceRequest['status']) => {
    updateMaintenanceStatus(id, status);
    showToast(`Maintenance order updated to ${status}!`, 'success');
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.issue.trim()) {
      showToast('Please state the maintenance issue.', 'danger');
      return;
    }
    const created = createMaintenanceRequest(newOrder);
    showToast(`Work order #${created.requestNo} generated!`, 'success');
    setIsAddModalOpen(false);
    setNewOrder({
      roomNo: 'A-101',
      hostelName: 'Aryabhata Hall (Boys)',
      studentName: 'Resident Scholar',
      issue: '',
      priority: 'Medium',
      assignedStaffName: 'Ramesh Yadav (Electrician)',
      cost: 500
    });
  };

  const handleExport = () => {
    const data = maintenance.map(m => ({
      'Request #': m.requestNo,
      'Room': m.roomNo,
      'Hostel': m.hostelName,
      'Issue': m.issue,
      'Priority': m.priority,
      'Technician': m.assignedStaffName,
      'Status': m.status,
      'Estimated Cost': m.cost,
      'Created Date': m.createdDate,
      'Completed Date': m.completedDate || 'Pending'
    }));
    exportToCSV(`HostelHub_Maintenance_${new Date().toISOString().split('T')[0]}`, data);
    showToast('Maintenance orders exported to CSV!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Estate & Maintenance Work Orders
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Civil works, electrician dispatch, plumbing fixtures, and facility asset servicing
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
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Open Requests</span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{openCount}</p>
          <span className="text-[10px] text-slate-400">Awaiting technician</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">In Progress</span>
          <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{inProgressCount}</p>
          <span className="text-[10px] text-slate-400">Being serviced</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Completed</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{completedCount}</p>
          <span className="text-[10px] text-slate-400">Satisfied & closed</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Urgent Priority</span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{urgentCount}</p>
          <span className="text-[10px] text-rose-500 font-bold">Fast-track response</span>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-3">Room & Hostel</th>
                <th className="py-3.5 px-3">Issue Description</th>
                <th className="py-3.5 px-3">Assigned Staff</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3 text-right">Est. Cost</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {maintenance.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {order.requestNo}
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900 dark:text-white">Room {order.roomNo}</p>
                    <p className="text-[11px] text-slate-400">{order.hostelName}</p>
                  </td>

                  <td className="py-3.5 px-3 max-w-xs">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{order.issue}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Reported: {formatDate(order.createdDate)}</p>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {order.assignedStaffName}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : order.priority === 'High'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}>
                      {order.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                    {order.cost ? formatCurrency(order.cost) : '-'}
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex space-x-1">
                      {order.status !== 'In Progress' && order.status !== 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'In Progress')}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200"
                        >
                          Start Work
                        </button>
                      )}

                      {order.status !== 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                        >
                          Complete
                        </button>
                      )}

                      {order.status === 'Completed' && (
                        <span className="text-emerald-600 font-bold text-[11px] flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Resolved
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

      {/* New Work Order Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create Maintenance Order"
          subtitle="Dispatch technicians and allocate servicing budget"
          maxWidth="md"
        >
          <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Room Number *</label>
              <input
                type="text"
                required
                value={newOrder.roomNo}
                onChange={e => setNewOrder({ ...newOrder, roomNo: e.target.value })}
                placeholder="e.g. A-101"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Description *</label>
              <input
                type="text"
                required
                value={newOrder.issue}
                onChange={e => setNewOrder({ ...newOrder, issue: e.target.value })}
                placeholder="e.g. Washroom tap replacement"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  value={newOrder.priority}
                  onChange={e => setNewOrder({ ...newOrder, priority: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Cost (INR)</label>
                <input
                  type="number"
                  value={newOrder.cost}
                  onChange={e => setNewOrder({ ...newOrder, cost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Technician</label>
              <input
                type="text"
                value={newOrder.assignedStaffName}
                onChange={e => setNewOrder({ ...newOrder, assignedStaffName: e.target.value })}
                placeholder="Technician name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
              >
                Create Work Order
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
