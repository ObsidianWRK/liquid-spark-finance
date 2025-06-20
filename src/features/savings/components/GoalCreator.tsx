import React, { useState } from 'react';
import { X, Target, Calendar, DollarSign } from 'lucide-react';
import { savingsGoalsService } from '@/features/savings/api/savingsGoalsService';
import { SavingsGoal, GoalCategory } from '@/types/savingsGoals';

interface GoalCreatorProps {
  onGoalCreated: (goal: SavingsGoal) => void;
  onClose: () => void;
}

const GoalCreator = ({ onGoalCreated, onClose }: GoalCreatorProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    category: 'General' as GoalCategory,
  });
  const [isCreating, setIsCreating] = useState(false);

  const goalCategories: {
    value: GoalCategory;
    label: string;
    icon: string;
    color: string;
  }[] = [
    {
      value: 'Emergency Fund',
      label: 'Emergency Fund',
      icon: '🛡️',
      color: '#ef4444',
    },
    { value: 'Vacation', label: 'Vacation', icon: '✈️', color: '#10b981' },
    {
      value: 'Home Down Payment',
      label: 'Home Down Payment',
      icon: '🏠',
      color: '#3b82f6',
    },
    { value: 'Car', label: 'Car', icon: '🚗', color: '#8b5cf6' },
    { value: 'Education', label: 'Education', icon: '🎓', color: '#f59e0b' },
    { value: 'Wedding', label: 'Wedding', icon: '💍', color: '#ec4899' },
    { value: 'Retirement', label: 'Retirement', icon: '🏖️', color: '#06b6d4' },
    {
      value: 'General',
      label: 'General Savings',
      icon: '💰',
      color: '#64748b',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.targetAmount || !formData.targetDate) {
      return;
    }

    setIsCreating(true);
    try {
      const selectedCategory = goalCategories.find(
        (cat) => cat.value === formData.category
      );

      const newGoal = await savingsGoalsService.createGoal({
        name: formData.name,
        description: formData.description || undefined,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        targetDate: formData.targetDate,
        category: formData.category,
        color: selectedCategory?.color || '#64748b',
        icon: selectedCategory?.icon || '💰',
      });

      onGoalCreated(newGoal);
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="liquid-glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">
              Create Savings Goal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Category */}
          <div>
            <label className="text-white font-medium mb-3 block">
              Goal Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goalCategories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleInputChange('category', category.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.category === category.value
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-white text-xs text-center">
                    {category.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Name */}
          <div>
            <label className="text-white font-medium mb-2 block">
              Goal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Emergency Fund, Vacation to Japan"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-white font-medium mb-2 block">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add details about your goal..."
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="text-white font-medium mb-2 block">
              Target Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) =>
                  handleInputChange('targetAmount', e.target.value)
                }
                placeholder="5000"
                min="1"
                step="0.01"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label className="text-white font-medium mb-2 block">
              Target Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  handleInputChange('targetDate', e.target.value)
                }
                min={minDate}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Summary */}
          {formData.name && formData.targetAmount && formData.targetDate && (
            <div className="bg-slate-800/30 rounded-lg p-4">
              <div className="text-white font-medium mb-2">Goal Summary</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Goal:</span>
                  <span className="text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Amount:</span>
                  <span className="text-white">
                    ${parseFloat(formData.targetAmount || '0').toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Date:</span>
                  <span className="text-white">
                    {new Date(formData.targetDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Days to Goal:</span>
                  <span className="text-white">
                    {Math.ceil(
                      (new Date(formData.targetDate).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800/50 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700/50 transition-all"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !formData.name ||
                !formData.targetAmount ||
                !formData.targetDate ||
                isCreating
              }
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalCreator;
