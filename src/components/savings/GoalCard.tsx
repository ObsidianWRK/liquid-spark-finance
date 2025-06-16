import React, { useState } from 'react';
import { Calendar, TrendingUp, Plus, Target, Clock } from 'lucide-react';
import { SavingsGoal } from '@/types/savingsGoals';
import { savingsGoalsService } from '@/services/savingsGoalsService';

interface GoalCardProps {
  goal: SavingsGoal;
  onGoalUpdate?: () => void;
}

const GoalCard = ({ goal, onGoalUpdate }: GoalCardProps) => {
  const [showContribution, setShowContribution] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [isAddingContribution, setIsAddingContribution] = useState(false);

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const monthlyNeeded = savingsGoalsService.calculateMonthlyContribution(
    goal.targetAmount, 
    goal.currentAmount, 
    goal.targetDate
  );

  const handleAddContribution = async () => {
    const amount = parseFloat(contributionAmount);
    if (amount > 0) {
      setIsAddingContribution(true);
      try {
        await savingsGoalsService.addContribution(goal.id, {
          amount,
          date: new Date().toISOString(),
          type: 'manual',
          description: 'Manual contribution'
        });
        setContributionAmount('');
        setShowContribution(false);
        onGoalUpdate?.();
      } catch (error) {
        console.error('Failed to add contribution:', error);
      } finally {
        setIsAddingContribution(false);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = () => {
    if (progress >= 100) return '#22c55e';
    if (progress >= 75) return '#84cc16';
    if (progress >= 50) return '#eab308';
    if (progress >= 25) return '#f97316';
    return '#ef4444';
  };

  return (
    <div 
      className="liquid-glass-card p-6 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${goal.color}15 0%, transparent 50%)` 
      }}
    >
      {/* Goal Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{goal.icon}</div>
          <div>
            <h3 className="text-white font-semibold text-lg">{goal.name}</h3>
            {goal.description && (
              <p className="text-slate-400 text-sm">{goal.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowContribution(!showContribution)}
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          disabled={goal.isCompleted}
        >
          <Plus className={`w-4 h-4 text-white transition-transform ${showContribution ? 'rotate-45' : 'group-hover:scale-110'}`} />
        </button>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white font-medium">
            {formatCurrency(goal.currentAmount)}
          </span>
          <span className="text-slate-400">
            {formatCurrency(goal.targetAmount)}
          </span>
        </div>
        
        <div className="relative h-3 bg-slate-800/30 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(100, progress)}%`,
              background: `linear-gradient(90deg, ${getProgressColor()}, ${getProgressColor()}CC)`
            }}
          />
          {goal.isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓ COMPLETE</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between text-xs mt-2">
          <span 
            className="font-medium"
            style={{ color: getProgressColor() }}
          >
            {progress.toFixed(1)}% Complete
          </span>
          <span className={`${daysLeft <= 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {daysLeft > 0 ? `${daysLeft} days left` : 
             daysLeft === 0 ? 'Due today' : 
             `${Math.abs(daysLeft)} days overdue`}
          </span>
        </div>
      </div>

      {/* Goal Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Target className="w-3 h-3 text-slate-400" />
            <div className="text-white font-semibold text-sm">
              {formatCurrency(monthlyNeeded)}
            </div>
          </div>
          <div className="text-slate-400 text-xs">Monthly needed</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <div className="text-white font-semibold text-sm">
              {new Date(goal.targetDate).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
          </div>
          <div className="text-slate-400 text-xs">Target date</div>
        </div>
      </div>

      {/* Recent Contributions */}
      {goal.contributions.length > 0 && (
        <div className="mb-4">
          <div className="text-slate-400 text-xs mb-2">Recent Activity</div>
          <div className="space-y-1">
            {goal.contributions.slice(-2).map((contribution) => (
              <div key={contribution.id} className="flex justify-between text-xs">
                <span className="text-slate-300">
                  {new Date(contribution.date).toLocaleDateString()}
                </span>
                <span className="text-green-400 font-medium">
                  +{formatCurrency(contribution.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contribution Input */}
      {showContribution && !goal.isCompleted && (
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Add Contribution
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isAddingContribution}
              />
              <button
                onClick={handleAddContribution}
                disabled={!contributionAmount || parseFloat(contributionAmount) <= 0 || isAddingContribution}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                {isAddingContribution ? '...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Badge */}
      {goal.isCompleted && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <span>✓</span>
          <span>Complete</span>
        </div>
      )}

      {/* Urgency Indicator */}
      {!goal.isCompleted && daysLeft <= 30 && daysLeft > 0 && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Soon</span>
        </div>
      )}

      {!goal.isCompleted && daysLeft <= 0 && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Overdue</span>
        </div>
      )}
    </div>
  );
};

export default GoalCard; 