import React, { useState } from 'react';
import {
  ArrowLeft,
  DollarSign,
  Percent,
  Plus,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoalCard from './GoalCard';
import GoalCreator from './GoalCreator';
import SavingsInsights from './SavingsInsights';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  useSavingsGoals,
  useSavingsInsights,
} from './hooks';

const SavingsGoals: React.FC = () => {
  const navigate = useNavigate();
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const [activeTab, setActiveTab] = useState<'goals' | 'insights'>('goals');

  const {
    data: goals = [],
    isLoading,
    isError,
    refetch,
  } = useSavingsGoals();

  const { data: insights = [] } = useSavingsInsights();

  // Derived aggregates
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTargets = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const overallProgress = totalTargets > 0 ? (totalSaved / totalTargets) * 100 : 0;

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amt);

  const getProgressColor = (pct: number) => {
    if (pct >= 100) return 'text-green-400';
    if (pct >= 75) return 'text-lime-400';
    if (pct >= 50) return 'text-yellow-400';
    if (pct >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (pct: number) => {
    if (pct >= 100) return 'bg-green-500';
    if (pct >= 75) return 'bg-lime-500';
    if (pct >= 50) return 'bg-yellow-500';
    if (pct >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="h-8 bg-white/5 rounded w-48 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error / empty state
  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <EmptyState
          emoji="⚠️"
          title="Unable to load savings data"
          description="Check your connection and retry."
          action={{ label: 'Retry', onClick: () => refetch() }}
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
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
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
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Summary Cards */}
        {goals.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl border border-white/10 p-4">
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
            <div className="bg-white/5 rounded-xl border border-white/10 p-4">
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
            <div className="bg-white/5 rounded-xl border border-white/10 p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Percent className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Progress</p>
                  <p className={cn('text-xl font-bold', getProgressColor(overallProgress))}>{overallProgress.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Completed Goals</p>
                  <p className="text-xl font-bold text-white">{completedGoals}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('goals')}
            className={cn('px-4 py-2 rounded-lg', activeTab === 'goals' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white')}
          >
            Goals
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={cn('px-4 py-2 rounded-lg', activeTab === 'insights' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white')}
          >
            Insights
          </button>
        </div>

        {/* Goals Grid */}
        {activeTab === 'goals' && (
          <>  {/* fragment */}
            {goals.length === 0 ? (
              <EmptyState
                emoji="💡"
                title="No savings goals yet"
                description="Create your first goal to start saving"
                action={{ label: 'Create goal', onClick: () => setShowGoalCreator(true) }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Insights */}
        {activeTab === 'insights' && <SavingsInsights insights={insights} />}
      </div>

      {showGoalCreator && (
        <GoalCreator onClose={() => setShowGoalCreator(false)} />
      )}
    </div>
  );
};

export default SavingsGoals;