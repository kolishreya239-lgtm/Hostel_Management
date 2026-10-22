import React, { useState, useEffect } from 'react';
import { Staff, StaffRole } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { Modal } from '../common/Modal';
import { UserCheck, Shield, Phone, Mail, Building, Clock, CheckCircle } from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: Staff | null;
}

const ROLES: StaffRole[] = [
  'Warden',
  'Security',
  'Cleaner',
  'Electrician',
  'Plumber',
  'Cook',
  'Maintenance Staff'
];

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  staffToEdit
}) => {
  const { hostels, addStaff, updateStaff } = useHostel();

  const [formData, setFormData] = useState({
    name: '',
    role: 'Warden' as StaffRole,
    phone: '',
    email: '',
    assignedHostel: hostels[0]?.name || 'Aryabhata Boys Hostel (Block A)',
    shift: 'Morning' as 'Morning' | 'Evening' | 'Night' | 'Full-day',
    status: 'Active' as 'Active' | 'On Leave' | 'Inactive',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (staffToEdit) {
      setFormData({
        name: staffToEdit.name,
        role: staffToEdit.role,
        phone: staffToEdit.phone,
        email: staffToEdit.email,
        assignedHostel: staffToEdit.assignedHostel,
        shift: staffToEdit.shift,
        status: staffToEdit.status,
        joiningDate: staffToEdit.joiningDate
      });
    } else {
      setFormData({
        name: '',
        role: 'Warden',
        phone: '',
        email: '',
        assignedHostel: hostels[0]?.name || 'Aryabhata Boys Hostel (Block A)',
        shift: 'Morning',
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [staffToEdit, isOpen, hostels]);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Staff name is required';
    if (!formData.phone.trim()) err.phone = 'Contact number is required';
    if (!formData.email.trim()) err.email = 'Email address is required';
    else if (!formData.email.includes('@')) err.email = 'Enter a valid email address';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (staffToEdit) {
      updateStaff(staffToEdit.id, formData);
    } else {
      addStaff(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staffToEdit ? `Edit Staff — ${staffToEdit.name}` : 'Register New Staff Member'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Designation / Role *
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as StaffRole })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Duty Shift *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={formData.shift}
                onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Morning">Morning Shift (06:00 - 14:00)</option>
                <option value="Evening">Evening Shift (14:00 - 22:00)</option>
                <option value="Night">Night Shift (22:00 - 06:00)</option>
                <option value="Full-day">Full-day (09:00 - 18:00)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                  errors.phone ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="ramesh@hostelhub.ac.in"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                  errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Hostel / Campus Block *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={formData.assignedHostel}
                onChange={e => setFormData({ ...formData, assignedHostel: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {hostels.map(h => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
                <option value="All Hostels (Campus-wide)">All Hostels (Campus-wide)</option>
                <option value="Central Mess & Dining">Central Mess & Dining</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Current Employment Status *
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive / Relieved</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Date of Joining
          </label>
          <input
            type="date"
            value={formData.joiningDate}
            onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{staffToEdit ? 'Save Changes' : 'Register Staff'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
