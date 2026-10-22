import React, { useState } from 'react';
import {
  Bell, Pin, Trash2, Plus, Search, Filter, AlertTriangle,
  Calendar, User, CheckCircle2
} from 'lucide-react';
import { Notice, NoticeCategory } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatDate } from '../../utils/formatters';
import { NoticeFormModal } from './NoticeFormModal';
import { useToast } from '../common/Toast';

export const NoticeBoard: React.FC = () => {
  const { notices, togglePinNotice, deleteNotice } = useHostel();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredNotices = notices.filter(n => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
    const matchesCat = !categoryFilter || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const regularNotices = filteredNotices.filter(n => !n.isPinned);

  const handleDelete = (id: string, title: string) => {
    deleteNotice(id);
    showToast(`Notice "${title}" removed.`, 'danger');
  };

  const handleTogglePin = (id: string) => {
    togglePinNotice(id);
    showToast('Notice pinned status updated.', 'info');
  };

  const renderNoticeCard = (notice: Notice) => {
    const isUrgent = notice.priority === 'Urgent';

    return (
      <div
        key={notice.id}
        className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
          notice.isPinned
            ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-sm'
            : isUrgent
            ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md'
        }`}
      >
        <div>
          {/* Header Badges */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                isUrgent
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
              }`}>
                {notice.category} • {notice.priority}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Audience: {notice.audience}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleTogglePin(notice.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  notice.isPinned
                    ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/60'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={notice.isPinned ? 'Unpin Notice' : 'Pin Notice'}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(notice.id, notice.title)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                title="Delete Notice"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & Body */}
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
            {notice.title}
          </h3>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {notice.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center">
            <User className="w-3.5 h-3.5 mr-1" />
            {notice.postedBy}
          </span>
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {formatDate(notice.publishedDate)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Digital Notice Board & Circulars
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish campus directives, curfew updates, festival schedules, and urgent notifications
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast Notice</span>
        </button>
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
              placeholder="Search notice titles, guidelines, keywords..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Hostel">Hostel</option>
            <option value="Mess">Mess</option>
            <option value="Academic">Academic</option>
            <option value="Emergency">Emergency</option>
            <option value="Event">Event</option>
          </select>
        </div>
      </div>

      {/* Pinned Section */}
      {pinnedNotices.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center">
            <Pin className="w-3.5 h-3.5 mr-1" />
            Pinned Circulars ({pinnedNotices.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedNotices.map(renderNoticeCard)}
          </div>
        </div>
      )}

      {/* Regular Notices */}
      <div className="space-y-3">
        {pinnedNotices.length > 0 && (
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            All Recent Notices ({regularNotices.length})
          </h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularNotices.map(renderNoticeCard)}
        </div>
      </div>

      {/* Add Notice Modal */}
      <NoticeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
