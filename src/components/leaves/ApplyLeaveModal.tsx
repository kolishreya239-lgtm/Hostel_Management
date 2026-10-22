import React, { useState } from 'react';
import { LeaveRequest } from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (leave: LeaveRequest) => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { students, applyLeave } = useHostel();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const currentStudent = students.find(
    s => s.studentId === currentUser?.studentId || s.email === currentUser?.email
  ) || students[0];

  const [studentId, setStudentId] = useState(currentStudent?.studentId || 'STU2026001');
  const [fromDate, setFromDate] = useState('2026-10-02');
  const [toDate, setToDate] = useState('2026-10-05');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [parentContact, setParentContact] = useState(currentStudent?.guardianPhone || '+91 98101 23456');
  const [emergencyContact, setEmergencyContact] = useState(currentStudent?.emergencyContact || '+91 98101 23456');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !destination.trim()) {
      showToast('Please specify the destination and reason for leave.', 'danger');
      return;
    }

    const stu = students.find(s => s.studentId === studentId) || currentStudent;

    const created = applyLeave({
      studentId: stu.studentId,
      studentName: stu.name,
      roomNo: stu.roomNo || 'A-101',
      hostelName: stu.hostelName,
      fromDate,
      toDate,
      reason,
      destination,
      parentContact,
      emergencyContact
    });

    showToast(`Leave application #${created.requestNo} submitted to Warden!`, 'success');
    if (onSuccess) onSuccess(created);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Hostel Outstation Leave"
      subtitle="Request security out-pass authorization from the floor warden"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Applicant Scholar *
          </label>
          <select
            value={studentId}
            onChange={e => {
              setStudentId(e.target.value);
              const s = students.find(stu => stu.studentId === e.target.value);
              if (s) {
                setParentContact(s.guardianPhone);
                setEmergencyContact(s.emergencyContact);
              }
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            {students.map(s => (
              <option key={s.id} value={s.studentId}>
                {s.name} ({s.studentId}) – Room {s.roomNo}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Departure Date *
            </label>
            <input
              type="date"
              required
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Return by Date *
            </label>
            <input
              type="date"
              required
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Destination / Travel City *
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="e.g. Hometown (Noida, UP) or Hackathon at IIT Delhi"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Detailed Reason for Leave *
          </label>
          <textarea
            rows={2}
            required
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="State the academic, medical or family reason..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Parent Contact Phone *
            </label>
            <input
              type="text"
              required
              value={parentContact}
              onChange={e => setParentContact(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Emergency Phone *
            </label>
            <input
              type="text"
              required
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
          >
            Submit Leave Request
          </button>
        </div>
      </form>
    </Modal>
  );
};
