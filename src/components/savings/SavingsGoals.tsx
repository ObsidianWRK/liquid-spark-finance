import React, { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Award, Calendar, DollarSign, Percent, MoreHorizontal, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import GoalCard from './GoalCard';
import GoalCreator from './GoalCreator';
import SavingsInsights from './SavingsInsights';
import EmptyState from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
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
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      setLoading(true);
      const [goalsData, insightsData] = await Promise.all([
        savingsGoalsService.getGoals(),
        savingsGoalsService.getSavingsInsights()
      ]);
      setGoals(goalsData);
      setInsights(insightsData);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Failed to load savings data:', error);
      setRetryCount(prev => prev + 1);
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

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="h-8 bg-white/[0.05] rounded w-48 animate-pulse"></div>
            
            {/* Summary cards skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="h-24" />
              ))}
            </div>
            
            {/* Main content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (retryCount > 0 && goals.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <EmptyState
          emoji="⚠️"
          title="Unable to load savings data"
          description="We're having trouble loading your savings goals. Please check your connection and try again."
          action={{
            label: `Retry${retryCount > 1 ? ` (${retryCount})` : ''}`,
            onClick: loadSavingsData,
            variant: 'primary'
          }}
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Savings Goals</h1>
              <p className="text-white/60 mt-1">Track your progress towards financial milestones</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowGoalCreator(true)}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Summary Cards */}
        {goals.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Saved</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(totalSaved)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Goals</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(totalTargets)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Percent className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Progress</p>
                  <p className={cn("text-xl font-bold", getProgressColor(overallProgress))}>
                    {overallProgress.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Completed</p>
                  <p className="text-xl font-bold text-white">{completedGoals}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/[0.05] p-1 rounded-xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab('goals')}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all",
              activeTab === 'goals'
                ? "bg-white/[0.15] text-white shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/[0.08]"
            )}
          >
            Goals
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all",
              activeTab === 'insights'
                ? "bg-white/[0.15] text-white shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/[0.08]"
            )}
          >
            Insights
          </button>
        </div>

        {/* Content */}
        {activeTab === 'goals' && (
          <div>
            {goals.length === 0 ? (
              <EmptyState
                emoji="🎯"
                title="Start Your Savings Journey"
                description="Create your first savings goal to begin tracking your progress towards financial milestones. Whether it's an emergency fund, vacation, or major purchase, we'll help you get there."
                action={{
                  label: 'Create Your First Goal',
                  onClick: () => setShowGoalCreator(true),
                  variant: 'primary'
                }}
                size="lg"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    onUpdate={handleGoalUpdate}
                  />
                ))}
                
                {/* Add New Goal Card */}
                <button
                  onClick={() => setShowGoalCreator(true)}
                  className="bg-white/[0.02] hover:bg-white/[0.04] border-2 border-dashed border-white/[0.15] hover:border-white/[0.25] rounded-xl p-8 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/50 group"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/[0.05] group-hover:bg-white/[0.08] flex items-center justify-center transition-colors">
                      <Plus className="w-6 h-6 text-white/40 group-hover:text-white/60" />
                    </div>
                    <h3 className="text-lg font-semibold text-white/70 group-hover:text-white mb-2">
                      Add New Goal
                    </h3>
                    <p className="text-white/50 text-sm">
                      Set a new savings target
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <SavingsInsights insights={insights} />
        )}

        {/* Goal Creator Modal */}
        {showGoalCreator && (
          <GoalCreator
            onGoalCreated={handleGoalCreated}
            onClose={() => setShowGoalCreator(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;