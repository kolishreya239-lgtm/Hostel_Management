import React, { useState } from 'react';
import { Notice, NoticeCategory, PriorityLevel, NoticeAudience } from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (notice: Notice) => void;
}

export const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addNotice } = useHostel();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('General');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [audience, setAudience] = useState<NoticeAudience>('All Students');
  const [isPinned, setIsPinned] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide notice title and message content.', 'danger');
      return;
    }

    const created = addNotice({
      title,
      description,
      category,
      priority,
      audience,
      postedBy: currentUser?.name || 'Chief Warden Office',
      isPinned
    });

    showToast(`Notice published to ${audience}!`, 'success');
    if (onSuccess) onSuccess(created);
    onClose();
    setTitle('');
    setDescription('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Broadcast Digital Notice"
      subtitle="Publish administrative circular to students and residential staff"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Notice Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Night Curfew Timings & Biometric Verification"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as NoticeCategory)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="General">General</option>
              <option value="Hostel">Hostel Rules</option>
              <option value="Mess">Mess & Catering</option>
              <option value="Academic">Academic</option>
              <option value="Emergency">Emergency</option>
              <option value="Event">Event & Festival</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent Alert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Target Audience
          </label>
          <select
            value={audience}
            onChange={e => setAudience(e.target.value as NoticeAudience)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <option value="All Students">All Students & Residents</option>
            <option value="Boys Hostel">Boys Hostel Blocks Only</option>
            <option value="Girls Hostel">Girls Hostel Blocks Only</option>
            <option value="Staff Only">Maintenance Staff Only</option>
            <option value="Wardens">Wardens Council</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Notice Body / Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Type circular details, timings, guidelines..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="pinNotice"
            checked={isPinned}
            onChange={e => setIsPinned(e.target.checked)}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="pinNotice" className="font-semibold text-slate-700 dark:text-slate-300">
            Pin this notice to top of resident dashboard
          </label>
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
            Publish Notice
          </button>
        </div>
      </form>
    </Modal>
  );
};
