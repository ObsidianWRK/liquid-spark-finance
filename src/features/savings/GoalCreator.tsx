import React, { useState } from 'react';
import { X, Target, Calendar, DollarSign } from 'lucide-react';
import { GoalCategory } from './types';
import { useCreateSavingsGoal } from './hooks';

interface GoalCreatorProps {
  onClose: () => void;
}

const GoalCreator = ({ onClose }: GoalCreatorProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    category: 'General' as GoalCategory,
  });
  const createGoal = useCreateSavingsGoal();

  const goalCategories = [
    { value: 'Emergency Fund', label: 'Emergency Fund', icon: '🛡️', color: '#ef4444' },
    { value: 'Vacation', label: 'Vacation', icon: '✈️', color: '#10b981' },
    { value: 'Home Down Payment', label: 'Home Down Payment', icon: '🏠', color: '#3b82f6' },
    { value: 'Car', label: 'Car', icon: '🚗', color: '#8b5cf6' },
    { value: 'Education', label: 'Education', icon: '🎓', color: '#f59e0b' },
    { value: 'Wedding', label: 'Wedding', icon: '💍', color: '#ec4899' },
    { value: 'Retirement', label: 'Retirement', icon: '🏖️', color: '#06b6d4' },
    { value: 'General', label: 'General Savings', icon: '💰', color: '#64748b' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.targetDate) return;

    const cat = goalCategories.find((c) => c.value === formData.category);
    await createGoal.mutateAsync({
      name: formData.name,
      description: formData.description || undefined,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      targetDate: formData.targetDate,
      category: formData.category,
      color: cat?.color || '#64748b',
      icon: cat?.icon || '💰',
    });
    onClose();
  };

  const handleChange = (field: string, val: string) => setFormData((p) => ({ ...p, [field]: val }));
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="liquid-glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Create Savings Goal</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category selector */}
          <div>
            <label className="text-white font-medium mb-3 block">Goal Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goalCategories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleChange('category', c.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.category === c.value ? 'border-indigo-500 bg-indigo-500/20' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className="text-white text-xs text-center">{c.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-white font-medium mb-2 block">Goal Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Emergency Fund"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Target amount */}
          <div>
            <label className="text-white font-medium mb-2 block">Target Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => handleChange('targetAmount', e.target.value)}
                placeholder="5000"
                min="1"
                step="0.01"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Target date */}
          <div>
            <label className="text-white font-medium mb-2 block">Target Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => handleChange('targetDate', e.target.value)}
                min={minDate}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800/50 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createGoal.isPending || !formData.name || !formData.targetAmount || !formData.targetDate}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createGoal.isPending ? 'Creating…' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalCreator;