import React, { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Award, Calendar, DollarSign, Percent, MoreHorizontal, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import GoalCard from './GoalCard';
import GoalCreator from './GoalCreator';
import SavingsInsights from './SavingsInsights';
import { savingsGoalsService } from '@/services/savingsGoalsService';
import { SavingsGoal, SavingsInsight } from '@/types/savingsGoals';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const SavingsGoals = () => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-lime-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="liquid-glass-button flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white transition-colors mb-4"
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
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-all flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Total Saved</h3>
                <p className="text-sm text-gray-400">Across all goals</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(totalSaved)}
            </div>
            <div className="text-sm text-green-400">
              {formatProgress(totalSaved, totalTargets)}% of target
            </div>
          </div>

          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Total Targets</h3>
                <p className="text-sm text-gray-400">Goal amounts</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(totalTargets)}
            </div>
            <div className="text-sm text-blue-400">
              {goals.length} active goals
            </div>
          </div>

          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Completed</h3>
                <p className="text-sm text-gray-400">Goals achieved</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {completedGoals}
            </div>
            <div className="text-sm text-purple-400">
              {goals.length > 0 ? ((completedGoals / goals.length) * 100).toFixed(0) : 0}% success rate
            </div>
          </div>

          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Percent className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Overall Progress</h3>
                <p className="text-sm text-gray-400">Average completion</p>
              </div>
            </div>
            <div className={cn('text-2xl font-bold mb-1', getProgressColor(overallProgress))}>
              {overallProgress.toFixed(0)}%
            </div>
            <div className="w-full bg-white/[0.1] rounded-full h-2">
              <div 
                className={cn('h-2 rounded-full transition-all duration-500', getProgressBarColor(overallProgress))}
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
          </div>
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
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2',
                  activeTab === tab.id
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
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
              <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-12 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No Savings Goals Yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start your financial journey by creating your first savings goal. Whether it's an emergency fund, vacation, or major purchase, we'll help you get there.
                </p>
                <button
                  onClick={() => setShowGoalCreator(true)}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-all flex items-center space-x-2 mx-auto shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Goal</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {goals.map((goal) => {
                  const progress = parseFloat(formatProgress(goal.currentAmount, goal.targetAmount));
                  const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={goal.id} className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{goal.icon}</div>
                          <div>
                            <h3 className="font-semibold text-white">{goal.name}</h3>
                            <p className="text-sm text-gray-400">{goal.category}</p>
                          </div>
                        </div>
                        {goal.isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Progress</span>
                            <span className={cn('text-sm font-medium', getProgressColor(progress))}>
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-white/[0.1] rounded-full h-2">
                            <div 
                              className={cn('h-2 rounded-full transition-all duration-500', getProgressBarColor(progress))}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Amount Details */}
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-lg font-bold text-white">
                              {formatCurrency(goal.currentAmount)}
                            </div>
                            <div className="text-sm text-gray-400">
                              of {formatCurrency(goal.targetAmount)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              {formatCurrency(goal.targetAmount - goal.currentAmount)} left
                            </div>
                          </div>
                        </div>

                        {/* Time Details */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className={cn(
                              'text-sm',
                              daysLeft < 30 ? 'text-orange-400' : daysLeft < 90 ? 'text-yellow-400' : 'text-gray-400'
                            )}>
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {insights.length === 0 ? (
              <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No Insights Available</h3>
                <p className="text-gray-400">Create some goals to get personalized insights and recommendations.</p>
              </div>
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