import React, { useState, useMemo } from 'react';
import {
  Users, Search, Filter, Plus, Shield, Phone, Mail,
  Building, Clock, Edit2, Trash2, Download, UserCheck
} from 'lucide-react';
import { Staff, StaffRole } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { exportToCSV, getStatusBadgeClass } from '../../utils/formatters';
import { StaffModal } from './StaffModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';

export const StaffList: React.FC = () => {
  const { staff, deleteStaff, hostels } = useHostel();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [hostelFilter, setHostelFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.staffId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q);

      const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchesHostel = hostelFilter === 'ALL' || s.assignedHostel.includes(hostelFilter);

      return matchesSearch && matchesRole && matchesStatus && matchesHostel;
    });
  }, [staff, searchQuery, roleFilter, statusFilter, hostelFilter]);

  // Aggregate metrics
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === 'Active').length;
  const wardens = staff.filter(s => s.role === 'Warden').length;
  const security = staff.filter(s => s.role === 'Security').length;

  const handleExportCSV = () => {
    const dataToExport = filteredStaff.map(s => ({
      'Staff ID': s.staffId,
      'Full Name': s.name,
      'Designation': s.role,
      'Assigned Hostel': s.assignedHostel,
      'Phone': s.phone,
      'Email': s.email,
      'Shift': s.shift,
      'Status': s.status,
      'Joining Date': s.joiningDate
    }));
    exportToCSV(dataToExport, `HostelHub_Staff_Roster_${new Date().toISOString().split('T')[0]}`);
  };

  const getRoleColor = (role: StaffRole) => {
    switch (role) {
      case 'Warden':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300';
      case 'Security':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300';
      case 'Electrician':
      case 'Plumber':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300';
      case 'Cook':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <span>Staff & Administration Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage residential wardens, security guards, maintenance crews, and dining staff
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Roster</span>
          </button>

          <button
            onClick={() => {
              setStaffToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Staff</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Staff</span>
            <Users className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalStaff}</p>
          <span className="text-[10px] text-slate-400">Across campus</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active On Duty</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{activeStaff}</p>
          <span className="text-[10px] text-slate-400">Readily available</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Wardens</span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">{wardens}</p>
          <span className="text-[10px] text-slate-400">Residential supervision</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Security Team</span>
            <Shield className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-2">{security}</p>
          <span className="text-[10px] text-slate-400">24/7 Gate & Perimeter</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search staff by name, ID, phone, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Designations</option>
            <option value="Warden">Warden</option>
            <option value="Security">Security Guard</option>
            <option value="Cleaner">Housekeeping / Cleaner</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Cook">Mess Cook</option>
            <option value="Maintenance Staff">Maintenance Staff</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff Table / Cards */}
      {filteredStaff.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No staff members found"
          description="Try modifying your search or designation filters to find what you are looking for."
          actionLabel="Register Staff"
          onAction={() => {
            setStaffToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Assigned Hostel</th>
                  <th className="py-3.5 px-4">Shift</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStaff.map(s => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs uppercase">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
                          <p className="text-[11px] text-slate-400">{s.staffId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getRoleColor(s.role)}`}>
                        {s.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">{s.assignedHostel}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.shift}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-medium">{s.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{s.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : s.status === 'On Leave'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            setStaffToEdit(s);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStaffToDelete(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Staff Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Edit / Create Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setStaffToEdit(null);
        }}
        staffToEdit={staffToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!staffToDelete}
        title="Remove Staff Member"
        message={`Are you sure you want to remove "${staffToDelete?.name}" (${staffToDelete?.staffId}) from the staff registry?`}
        confirmLabel="Remove Staff"
        isDestructive={true}
        onConfirm={() => {
          if (staffToDelete) {
            deleteStaff(staffToDelete.id);
            setStaffToDelete(null);
          }
        }}
        onClose={() => setStaffToDelete(null)}
      />
    </div>
  );
};
