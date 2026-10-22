import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { Star } from 'lucide-react';

interface MessFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessFeedbackModal: React.FC<MessFeedbackModalProps> = ({ isOpen, onClose }) => {
  const { students, submitMessFeedback } = useHostel();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const currentStudent = students.find(
    s => s.studentId === currentUser?.studentId || s.email === currentUser?.email
  ) || students[0];

  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'>('Dinner');
  const [foodRating, setFoodRating] = useState(5);
  const [tasteRating, setTasteRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(4);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessFeedback({
      studentId: currentStudent.studentId,
      studentName: currentStudent.name,
      foodRating,
      tasteRating,
      qualityRating,
      cleanlinessRating,
      mealType,
      comment: comment || 'Tasty and properly balanced meal.'
    });

    showToast('Thank you! Your mess review has been recorded.', 'success');
    onClose();
  };

  const renderStarPicker = (val: number, setVal: (n: number) => void, label: string) => (
    <div className="flex items-center justify-between py-1">
      <span className="font-semibold text-slate-700 dark:text-slate-300">{label}:</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            type="button"
            key={star}
            onClick={() => setVal(star)}
            className={`p-1 transition-colors ${
              star <= val ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
            }`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Mess Quality Feedback"
      subtitle="Help the mess committee maintain nutritional standards and hygiene"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Meal Serviced *
          </label>
          <select
            value={mealType}
            onChange={e => setMealType(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            <option value="Breakfast">Breakfast (Morning)</option>
            <option value="Lunch">Lunch (Afternoon)</option>
            <option value="Snacks">Evening Snacks</option>
            <option value="Dinner">Dinner (Night Feast)</option>
          </select>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
          {renderStarPicker(foodRating, setFoodRating, 'Overall Food Score')}
          {renderStarPicker(tasteRating, setTasteRating, 'Taste & Flavour')}
          {renderStarPicker(qualityRating, setQualityRating, 'Ingredient Freshness')}
          {renderStarPicker(cleanlinessRating, setCleanlinessRating, 'Dining Hall Hygiene')}
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Student Review & Constructive Suggestions
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share feedback on seasoning, roti softness, curd freshness..."
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
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  );
};
