import React, { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Award, Calendar, DollarSign, Percent, MoreHorizontal, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import GoalCard from './GoalCard';
import GoalCreator from './GoalCreator';
import SavingsInsights from './SavingsInsights';
import { savingsGoalsService } from '@/features/savingsGoalsService';
import { SavingsGoal, SavingsInsight } from '@/types/savingsGoals';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { UnifiedCard } from '@/shared/ui/UnifiedCard';
import { formatCurrency } from '@/utils/formatters';

interface SavingsGoalsProps {
  compact?: boolean;
}

const SavingsGoals = ({ compact = false }: SavingsGoalsProps) => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [insights, setInsights] = useState<SavingsInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const [activeTab, setActiveTab] = useState<'goals' | 'insights'>('goals');
  const navigate = useNavigate();

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      const [goalsData, insightsData] = await Promise.all([
        savingsGoalsService.getGoals(),
        savingsGoalsService.getSavingsInsights()
      ]);
      setGoals(goalsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load savings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalCreated = (newGoal: SavingsGoal) => {
    setGoals([...goals, newGoal]);
    setShowGoalCreator(false);
    loadSavingsData(); // Refresh insights
  };

  const handleGoalUpdate = () => {
    loadSavingsData();
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const overallProgress = totalTargets > 0 ? (totalSaved / totalTargets) * 100 : 0;

  const formatProgress = (current: number, target: number) => {
    return target > 0 ? ((current / target) * 100).toFixed(1) : '0';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-400';
    if (percentage >= 75) return 'text-lime-400';
    if (percentage >= 50) return 'text-yellow-400';
    if (percentage >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-white/[0.05] rounded w-48"></div>
            <div className="h-32 bg-white/[0.02] rounded-xl border border-white/[0.08]"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-48 bg-white/[0.02] rounded-xl border border-white/[0.08]"></div>
              <div className="h-48 bg-white/[0.02] rounded-xl border border-white/[0.08]"></div>
              <div className="h-48 bg-white/[0.02] rounded-xl border border-white/[0.08]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact mode for dashboard widget
  if (compact) {
    return (
      <UnifiedCard
        title="Savings Goals"
        icon={Target}
        iconColor="text-green-400"
        variant="default"
        size="lg"
        className="text-white"
      >
        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-white/[0.02] rounded-xl border border-white/[0.08] animate-pulse"></div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-6">
            <Target className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-400 mb-2">No goals yet</p>
            <button
              onClick={() => navigate('/savings')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create your first goal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.slice(0, 3).map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <UnifiedCard
                  key={goal.id}
                  title={goal.name}
                  subtitle={goal.category}
                  metric={formatCurrency(goal.currentAmount, { currency: 'USD' })}
                  delta={{
                    value: Math.round(progress),
                    format: 'percentage',
                    label: 'complete'
                  }}
                  icon={goal.icon}
                  progress={{
                    value: goal.currentAmount,
                    max: goal.targetAmount,
                    color: progress >= 100 ? '#22c55e' : progress >= 75 ? '#84cc16' : progress >= 50 ? '#eab308' : '#ef4444',
                    showLabel: false
                  }}
                  badge={daysLeft <= 0 && !goal.isCompleted ? {
                    text: 'Overdue',
                    variant: 'error'
                  } : undefined}
                  size="sm"
                  className="hover:bg-white/[0.03] transition-all cursor-pointer"
                  onClick={() => navigate('/savings')}
                />
              );
            })}
            
            <div className="pt-3 border-t border-white/[0.06]">
              <button
                onClick={() => navigate('/savings')}
                className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors text-center"
              >
                View All Goals →
              </button>
            </div>
          </div>
        )}
      </UnifiedCard>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white transition-colors mb-4 hover:bg-white/[0.05]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
              <Target className="w-8 h-8 text-green-400" />
              <span>Savings Goals</span>
            </h1>
            <p className="text-gray-400 mt-2">Track your progress and build wealth systematically</p>
          </div>
          
          <button
            onClick={() => setShowGoalCreator(true)}
            className="px-6 py-3 bg-white/[0.05] border border-white/[0.12] rounded-xl font-medium hover:bg-white/[0.08] transition-all flex items-center space-x-2 text-white backdrop-blur-md"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Overview Stats using UnifiedCard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <UnifiedCard
            title="Total Saved"
            subtitle="Across all goals"
            metric={formatCurrency(totalSaved, { currency: 'USD' })}
            delta={{
              value: parseFloat(formatProgress(totalSaved, totalTargets)),
              format: 'percentage',
              label: 'of target'
            }}
            icon={DollarSign}
            iconColor="text-green-400"
            variant="default"
            size="lg"
          />

          <UnifiedCard
            title="Total Targets"
            subtitle="Goal amounts"
            metric={formatCurrency(totalTargets, { currency: 'USD' })}
            delta={{
              value: goals.length,
              format: 'number',
              label: 'active goals'
            }}
            icon={Target}
            iconColor="text-blue-400"
            variant="default"
            size="lg"
          />

          <UnifiedCard
            title="Completed"
            subtitle="Goals achieved"
            metric={completedGoals.toString()}
            delta={{
              value: Math.round(goals.length > 0 ? (completedGoals / goals.length) * 100 : 0),
              format: 'percentage',
              label: 'success rate'
            }}
            icon={Award}
            iconColor="text-purple-400"
            variant="default"
            size="lg"
          />

          <UnifiedCard
            title="Overall Progress"
            subtitle="Average completion"
            metric={`${Math.round(overallProgress)}%`}
            progress={{
              value: overallProgress,
              max: 100,
              color: overallProgress >= 80 ? '#22c55e' : overallProgress >= 60 ? '#84cc16' : overallProgress >= 40 ? '#eab308' : overallProgress >= 20 ? '#f97316' : '#ef4444',
              showLabel: false
            }}
            icon={Percent}
            iconColor="text-orange-400"
            variant="default"
            size="lg"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/[0.05] p-1 rounded-xl">
          {[
            { id: 'goals', label: 'My Goals', icon: Target },
            { id: 'insights', label: 'Insights', icon: TrendingUp }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'goals' | 'insights')}
                className={cn(
                  'flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all flex items-center justify-center space-x-2',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'goals' && (
          <div>
            {goals.length === 0 ? (
              <UnifiedCard
                title="No Savings Goals Yet"
                subtitle="Start your financial journey by creating your first savings goal"
                icon={Target}
                iconColor="text-gray-400"
                variant="default"
                size="lg"
                className="text-center py-12"
              >
                <div className="space-y-4">
                  <p className="text-gray-400 max-w-md mx-auto">
                    Whether it's an emergency fund, vacation, or major purchase, we'll help you get there.
                  </p>
                  <button
                    onClick={() => setShowGoalCreator(true)}
                    className="px-6 py-3 bg-white/[0.05] border border-white/[0.12] rounded-xl font-medium hover:bg-white/[0.08] transition-all flex items-center space-x-2 mx-auto text-white backdrop-blur-md"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Goal</span>
                  </button>
                </div>
              </UnifiedCard>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
                {goals.map((goal) => {
                  const progress = parseFloat(formatProgress(goal.currentAmount, goal.targetAmount));
                  const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <UnifiedCard
                      key={goal.id}
                      title={goal.name}
                      subtitle={goal.category}
                      metric={formatCurrency(goal.currentAmount, { currency: 'USD' })}
                      delta={{
                        value: goal.targetAmount - goal.currentAmount,
                        format: 'currency',
                        label: 'remaining'
                      }}
                      icon={goal.icon}
                      progress={{
                        value: goal.currentAmount,
                        max: goal.targetAmount,
                        color: progress >= 100 ? '#22c55e' : progress >= 75 ? '#84cc16' : progress >= 50 ? '#eab308' : progress >= 25 ? '#f97316' : '#ef4444',
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
                      className="hover:bg-white/[0.03] transition-all relative overflow-hidden"
                    >
                      {/* Additional Goal Details */}
                      <div className="mt-4 space-y-3">
                        {/* Target Amount */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/60">Target</span>
                          <span className="text-white font-medium">{formatCurrency(goal.targetAmount, { currency: 'USD' })}</span>
                        </div>
                        
                        {/* Due Date */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/60">Due Date</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-white/60" />
                            <span className="text-white/80">
                              {new Date(goal.targetDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        {!goal.isCompleted && (
                          <button className="w-full mt-4 py-2 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white/80 hover:bg-white/[0.08] hover:text-white transition-all text-sm font-medium">
                            Add Contribution
                          </button>
                        )}
                      </div>
                    </UnifiedCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {insights.length === 0 ? (
              <UnifiedCard
                title="No Insights Available"
                subtitle="Create some goals to get personalized insights and recommendations"
                icon={TrendingUp}
                iconColor="text-gray-400"
                variant="default"
                size="lg"
                className="text-center py-12"
              />
            ) : (
              <SavingsInsights insights={insights} />
            )}
          </div>
        )}
      </div>

      {/* Goal Creator Modal */}
      {showGoalCreator && (
        <GoalCreator
          onClose={() => setShowGoalCreator(false)}
          onGoalCreated={handleGoalCreated}
        />
      )}
    </div>
  );
};

export default SavingsGoals;