import React, { useState } from 'react';
import {
  Utensils, Star, Edit2, MessageSquarePlus, Clock, Heart,
  CheckCircle2, Flame, ThumbsUp
} from 'lucide-react';
import { MessDailyMenu } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import { MessFeedbackModal } from './MessFeedbackModal';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const MessMenu: React.FC = () => {
  const { messMenu, messFeedbacks, updateMessDayMenu } = useHostel();
  const { currentRole } = useAuth();
  const { showToast } = useToast();

  const daysList: MessDailyMenu['day'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Default active tab to current day
  const currentDayIndex = new Date().getDay(); // 0 is Sunday
  const currentDayName = currentDayIndex === 0 ? 'Sunday' : daysList[currentDayIndex - 1];

  const [activeDay, setActiveDay] = useState<MessDailyMenu['day']>(currentDayName);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<MessDailyMenu | null>(null);

  const selectedMenu = messMenu.find(m => m.day === activeDay) || messMenu[0];

  // Compute average ratings
  const totalReviews = messFeedbacks.length;
  const avgFood = totalReviews > 0 ? (messFeedbacks.reduce((s, f) => s + f.foodRating, 0) / totalReviews).toFixed(1) : '4.6';
  const avgTaste = totalReviews > 0 ? (messFeedbacks.reduce((s, f) => s + f.tasteRating, 0) / totalReviews).toFixed(1) : '4.7';
  const avgHygiene = totalReviews > 0 ? (messFeedbacks.reduce((s, f) => s + f.cleanlinessRating, 0) / totalReviews).toFixed(1) : '4.8';

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDay) {
      updateMessDayMenu(editingDay.day, editingDay);
      showToast(`Mess menu for ${editingDay.day} updated!`, 'success');
      setEditingDay(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Mess Management & Weekly Dining Menu
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Four daily hygienic meals, dietitian approved nutrition, and student meal feedback monitoring
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1.5"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Rate Today&rsquo;s Food</span>
          </button>

          {(currentRole === 'admin' || currentRole === 'warden') && (
            <button
              onClick={() => setEditingDay(selectedMenu)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit {activeDay} Menu</span>
            </button>
          )}
        </div>
      </div>

      {/* Average Ratings Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Star className="w-7 h-7 fill-current" />
          </div>
          <div>
            <span className="text-xs text-amber-100 font-semibold block">Overall Rating</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold">{avgFood}</span>
              <span className="text-xs text-amber-100">/ 5.0</span>
            </div>
            <span className="text-[10px] text-amber-100">{totalReviews} student reviews</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs text-slate-400 font-medium block">Taste & Flavours</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{avgTaste} / 5</p>
          <span className="text-[10px] text-emerald-600 font-bold">Chef verified</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs text-slate-400 font-medium block">Kitchen Hygiene</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{avgHygiene} / 5</p>
          <span className="text-[10px] text-blue-600 font-bold">FSSAI certified audit</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs text-slate-400 font-medium block">Daily Meal Turnout</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">1,180 / 1,250</p>
          <span className="text-[10px] text-purple-600 font-bold">94.4% participation</span>
        </div>
      </div>

      {/* Weekday Selector Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {daysList.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDay === day
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-300'
            }`}
          >
            {day}
            {day === currentDayName && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-white/20 text-white">
                Today
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Today's 4 Meals Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Breakfast */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                Morning Meal
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                07:30 - 09:30 AM
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Breakfast</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {selectedMenu.breakfast}
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Freshly prepared • Tea & Milk served
          </div>
        </div>

        {/* Lunch */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                Afternoon Feast
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                12:30 - 02:30 PM
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lunch</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {selectedMenu.lunch}
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Balanced diet • Unlimited salad & curd
          </div>
        </div>

        {/* Snacks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                High Tea
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                05:00 - 06:15 PM
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Evening Snacks</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {selectedMenu.snacks}
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Ginger tea & Filter coffee
          </div>
        </div>

        {/* Dinner */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                Night Feast
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                08:00 - 10:00 PM
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dinner</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {selectedMenu.dinner}
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Dessert included • Hot phulkas
          </div>
        </div>
      </div>

      {/* Student Feedback Reviews Stream */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Scholar Food Reviews & Taste Logs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live feedback received from mess digital suggestion kiosks
            </p>
          </div>
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            + Add Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {messFeedbacks.map(fb => (
            <div
              key={fb.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  {fb.studentName}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  {fb.mealType}
                </span>
              </div>

              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < fb.foodRating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                  ({fb.foodRating}/5)
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 italic">
                &ldquo;{fb.comment}&rdquo;
              </p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between text-[10px] text-slate-400">
                <span>Taste: {fb.tasteRating}/5 • Hygiene: {fb.cleanlinessRating}/5</span>
                <span>{formatDate(fb.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Menu Modal */}
      {editingDay && (
        <Modal
          isOpen={!!editingDay}
          onClose={() => setEditingDay(null)}
          title={`Edit Mess Menu – ${editingDay.day}`}
          subtitle="Update scheduled dishes and dining options"
          maxWidth="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Breakfast Menu *
              </label>
              <input
                type="text"
                required
                value={editingDay.breakfast}
                onChange={e => setEditingDay({ ...editingDay, breakfast: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lunch Menu *
              </label>
              <input
                type="text"
                required
                value={editingDay.lunch}
                onChange={e => setEditingDay({ ...editingDay, lunch: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Snacks Menu *
              </label>
              <input
                type="text"
                required
                value={editingDay.snacks}
                onChange={e => setEditingDay({ ...editingDay, snacks: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dinner Menu *
              </label>
              <input
                type="text"
                required
                value={editingDay.dinner}
                onChange={e => setEditingDay({ ...editingDay, dinner: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingDay(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
              >
                Save Menu Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Student Feedback Modal */}
      <MessFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
};
