import React, { useState } from 'react';
import { Visitor } from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useToast } from '../common/Toast';

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (visitor: Visitor) => void;
}

export const VisitorModal: React.FC<VisitorModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { students, registerVisitor } = useHostel();
  const { showToast } = useToast();

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [visitorName, setVisitorName] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [phone, setPhone] = useState('');
  const [idProof, setIdProof] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryTime, setEntryTime] = useState('11:00 AM');
  const [purpose, setPurpose] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !phone.trim() || !idProof.trim()) {
      showToast('Please provide visitor name, phone, and ID proof.', 'danger');
      return;
    }

    const stu = students.find(s => s.id === selectedStudentId) || students[0];

    const created = registerVisitor({
      visitorName,
      studentId: stu.studentId,
      studentName: stu.name,
      roomNo: stu.roomNo || 'A-101',
      relationship,
      phone,
      idProof,
      visitDate,
      entryTime,
      purpose: purpose || 'Family visit'
    });

    showToast(`Visitor pass #${created.visitorPassNo} issued for ${visitorName}!`, 'success');
    if (onSuccess) onSuccess(created);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Campus Visitor"
      subtitle="Issue authorized visitor entry badge for hostel resident scholar"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Student Being Visited *
          </label>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.studentId}) – Room {s.roomNo || 'Unassigned'}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Visitor Full Name *
            </label>
            <input
              type="text"
              required
              value={visitorName}
              onChange={e => setVisitorName(e.target.value)}
              placeholder="e.g. Rajesh Patil"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Relationship
            </label>
            <select
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Sibling">Brother / Sister</option>
              <option value="Guardian">Local Guardian</option>
              <option value="Friend">Friend / Peer</option>
              <option value="Relative">Relative</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Visitor Mobile Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98110 00000"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Government ID Proof *
            </label>
            <input
              type="text"
              required
              value={idProof}
              onChange={e => setIdProof(e.target.value)}
              placeholder="e.g. Aadhaar XXXX-8910"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Date of Visit
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={e => setVisitDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Expected Time
            </label>
            <input
              type="text"
              value={entryTime}
              onChange={e => setEntryTime(e.target.value)}
              placeholder="e.g. 11:30 AM"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Purpose of Visit
          </label>
          <input
            type="text"
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
            placeholder="e.g. Delivering luggage, festival meeting"
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
            Generate Gate Pass
          </button>
        </div>
      </form>
    </Modal>
  );
};
