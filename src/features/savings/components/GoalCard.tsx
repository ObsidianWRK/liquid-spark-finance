import React, { useState } from 'react';
import { Calendar, TrendingUp, Plus, Target, Clock } from 'lucide-react';
import { SavingsGoal } from '@/types/savingsGoals';
import { savingsGoalsService } from '@/services/savingsGoalsService';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
import { formatCurrency } from '@/utils/formatters';

interface GoalCardProps {
  goal: SavingsGoal;
  onGoalUpdate?: () => void;
}

const GoalCard = React.memo<GoalCardProps>(({ goal, onGoalUpdate }) => {
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

  const getProgressColor = () => {
    if (progress >= 100) return '#22c55e';
    if (progress >= 75) return '#84cc16';
    if (progress >= 50) return '#eab308';
    if (progress >= 25) return '#f97316';
    return '#ef4444';
  };

  return (
    <UnifiedCard
      title={goal.name}
      subtitle={goal.description || goal.category}
      metric={formatCurrency(goal.currentAmount)}
      delta={{
        value: goal.targetAmount - goal.currentAmount,
        format: 'currency',
        label: 'remaining'
      }}
      icon={goal.icon}
      progress={{
        value: goal.currentAmount,
        max: goal.targetAmount,
        color: getProgressColor(),
        showLabel: true
      }}
      badge={goal.isCompleted ? {
        text: 'Complete',
        variant: 'success'
      } : daysLeft <= 0 ? {
        text: 'Overdue',
        variant: 'error'
      } : daysLeft <= 30 ? {
        text: `${daysLeft} days left`,
        variant: 'warning'
      } : undefined}
      variant="default"
      size="lg"
      interactive={true}
      className="relative overflow-hidden hover:bg-white/[0.03] transition-all"
    >
      {/* Goal Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Target className="w-3 h-3 text-white/60" />
            <div className="text-white font-semibold text-sm">
              {formatCurrency(monthlyNeeded)}
            </div>
          </div>
          <div className="text-white/60 text-xs">Monthly needed</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Calendar className="w-3 h-3 text-white/60" />
            <div className="text-white font-semibold text-sm">
              {new Date(goal.targetDate).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
          </div>
          <div className="text-white/60 text-xs">Target date</div>
        </div>
      </div>

      {/* Recent Contributions */}
      {goal.contributions.length > 0 && (
        <div className="mb-4">
          <div className="text-white/60 text-xs mb-2">Recent Activity</div>
          <div className="space-y-1">
            {goal.contributions.slice(-2).map((contribution) => (
              <div key={contribution.id} className="flex justify-between text-xs">
                <span className="text-white/80">
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

      {/* Add Contribution Button */}
      {!goal.isCompleted && (
        <div className="border-t border-white/[0.06] pt-4">
          {!showContribution ? (
            <button
              onClick={() => setShowContribution(true)}
              className="w-full py-2 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white/80 hover:bg-white/[0.08] hover:text-white transition-all text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contribution</span>
            </button>
          ) : (
            <div className="space-y-3">
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
                    className="flex-1 bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    disabled={isAddingContribution}
                  />
                  <button
                    onClick={handleAddContribution}
                    disabled={!contributionAmount || parseFloat(contributionAmount) <= 0 || isAddingContribution}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isAddingContribution ? '...' : 'Add'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowContribution(false)}
                className="w-full py-1 text-white/60 hover:text-white/80 transition-colors text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </UnifiedCard>
  );
});

GoalCard.displayName = 'GoalCard';

export default GoalCard; 