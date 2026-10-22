import React, { useState } from 'react';
import { ComplaintCategory, PriorityLevel, Complaint } from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (complaint: Complaint) => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { students, submitComplaint } = useHostel();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const currentStudent = students.find(
    s => s.studentId === currentUser?.studentId || s.email === currentUser?.email
  ) || students[0];

  const [studentId, setStudentId] = useState(currentStudent?.studentId || 'STU2026001');
  const [category, setCategory] = useState<ComplaintCategory>('Electrical');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(currentStudent ? `Room ${currentStudent.roomNo || 'A-101'}` : 'Room A-101');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      showToast('Please fill in the complaint subject and description.', 'danger');
      return;
    }

    const stu = students.find(s => s.studentId === studentId) || currentStudent;

    const created = submitComplaint({
      studentId: stu.studentId,
      studentName: stu.name,
      category,
      subject,
      description,
      location,
      priority
    });

    showToast(`Complaint #${created.complaintNo} submitted! Ticket is now queued.`, 'success');
    if (onSuccess) onSuccess(created);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Support & Maintenance Request"
      subtitle="Register an issue to be addressed by hostel maintenance technicians"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Filing Resident *
          </label>
          <select
            value={studentId}
            onChange={e => {
              setStudentId(e.target.value);
              const s = students.find(stu => stu.studentId === e.target.value);
              if (s) setLocation(`Room ${s.roomNo || 'A-101'}`);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Issue Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ComplaintCategory)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="Electrical">Electrical (Fan, Light, Sockets)</option>
              <option value="Plumbing">Plumbing (Tap, Drainage, Shower)</option>
              <option value="Internet">Internet / WiFi Access Point</option>
              <option value="Cleaning">Housekeeping & Washroom Cleaning</option>
              <option value="Room">Furniture & Door Lock Repairs</option>
              <option value="Food/Mess">Mess & Catering Feedback</option>
              <option value="Security">Security & Access Control</option>
              <option value="Other">Other Miscellaneous</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Urgency / Priority *
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="Low">Low – Non-urgent</option>
              <option value="Medium">Medium – Normal (24-48 hrs)</option>
              <option value="High">High – Urgent attention required</option>
              <option value="Urgent">Emergency / Safety hazard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Exact Location / Room *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Room A-101 (Left Washroom) or 2nd Floor Corridor"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Issue Title / Subject *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Brief description of what went wrong..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Detailed Explanation *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Please provide details so the maintenance technician brings the right tools/parts..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
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
            Submit Complaint
          </button>
        </div>
      </form>
    </Modal>
  );
};
