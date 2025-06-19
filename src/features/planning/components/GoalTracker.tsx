import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
  ArrowUp,
  ArrowDown,
  Pause,
  Play
} from 'lucide-react';
import { FinancialGoal, GoalCategory } from '@/types/financialPlanning';
import { financialPlanningService } from '@/features/planning/api/financialPlanningService';
import { cn } from '@/shared/lib/utils';

interface GoalTrackerProps {
  familyId: string;
  compact?: boolean;
}

const GoalTracker = ({ familyId, compact = false }: GoalTrackerProps) => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('active');
  const [sortBy, setSortBy] = useState<'priority' | 'progress' | 'deadline' | 'amount'>('priority');
  const [loading, setLoading] = useState(true);
  const [showNewGoal, setShowNewGoal] = useState(false);

  useEffect(() => {
    loadGoals();
  }, [familyId]);

  const loadGoals = async () => {
    setLoading(true);
    try {
      // Create demo goals for now
      const demoGoals = await createDemoGoals();
      setGoals(demoGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDemoGoals = async (): Promise<FinancialGoal[]> => {
    return [
      {
        id: 'goal_1',
        familyId,
        title: 'Emergency Fund',
        description: '6 months of living expenses',
        category: 'emergency_fund',
        targetAmount: 30000,
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
        priority: 1,
        monthlyContribution: 2000,
        autoContribute: true,
        status: 'active',
        progress: {
          currentAmount: 18000,
          percentComplete: 60,
          monthlyContribution: 2000,
          projectedCompletionDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
          onTrack: true
        },
        tags: ['safety', 'high-priority'],
        createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'goal_2',
        familyId,
        title: 'Home Down Payment',
        description: '20% down payment for $500k home',
        category: 'house_down_payment',
        targetAmount: 100000,
        targetDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000),
        priority: 2,
        monthlyContribution: 2500,
        autoContribute: true,
        status: 'active',
        progress: {
          currentAmount: 35000,
          percentComplete: 35,
          monthlyContribution: 2500,
          projectedCompletionDate: new Date(Date.now() + 26 * 30 * 24 * 60 * 60 * 1000),
          onTrack: true
        },
        tags: ['home', 'long-term'],
        createdAt: new Date(Date.now() - 14 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'goal_3',
        familyId,
        title: 'Vacation Fund',
        description: 'Family trip to Japan',
        category: 'vacation',
        targetAmount: 15000,
        targetDate: new Date(Date.now() + 15 * 30 * 24 * 60 * 60 * 1000),
        priority: 3,
        monthlyContribution: 800,
        autoContribute: true,
        status: 'active',
        progress: {
          currentAmount: 6400,
          percentComplete: 43,
          monthlyContribution: 800,
          projectedCompletionDate: new Date(Date.now() + 11 * 30 * 24 * 60 * 60 * 1000),
          onTrack: true
        },
        tags: ['travel', 'family'],
        createdAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'goal_4',
        familyId,
        title: 'New Car',
        description: 'Save for Tesla Model Y',
        category: 'car_purchase',
        targetAmount: 60000,
        targetDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000),
        priority: 4,
        monthlyContribution: 1200,
        autoContribute: false,
        status: 'paused',
        progress: {
          currentAmount: 12000,
          percentComplete: 20,
          monthlyContribution: 0,
          projectedCompletionDate: new Date(Date.now() + 40 * 30 * 24 * 60 * 60 * 1000),
          onTrack: false
        },
        tags: ['transportation'],
        createdAt: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return a.priority - b.priority;
      case 'progress':
        return b.progress.percentComplete - a.progress.percentComplete;
      case 'deadline':
        return a.targetDate.getTime() - b.targetDate.getTime();
      case 'amount':
        return b.targetAmount - a.targetAmount;
      default:
        return 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressColor = (progress: number, onTrack: boolean) => {
    if (progress >= 100) return 'from-green-500 to-green-600';
    if (!onTrack) return 'from-red-500 to-red-600';
    if (progress >= 75) return 'from-blue-500 to-blue-600';
    if (progress >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  const getStatusIcon = (goal: FinancialGoal) => {
    if (goal.status === 'completed') return CheckCircle;
    if (goal.status === 'paused') return Pause;
    if (goal.progress.onTrack) return Clock;
    return AlertTriangle;
  };

  const getStatusColor = (goal: FinancialGoal) => {
    if (goal.status === 'completed') return 'text-green-400';
    if (goal.status === 'paused') return 'text-gray-400';
    if (goal.progress.onTrack) return 'text-blue-400';
    return 'text-orange-400';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 bg-white/[0.05] rounded w-48"></div>
              <div className="h-4 bg-white/[0.05] rounded w-16"></div>
            </div>
            <div className="h-2 bg-white/[0.05] rounded w-full mb-3"></div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-white/[0.05] rounded w-24"></div>
              <div className="h-4 bg-white/[0.05] rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", compact && "space-y-4")}>
      {/* Header */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Target className="w-7 h-7 text-blue-400" />
              Goal Tracker
            </h2>
            <p className="text-white/60 mt-1">
              Monitor progress on your financial goals
            </p>
          </div>

          <button
            onClick={() => setShowNewGoal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['all', 'active', 'completed', 'paused'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={cn(
                "px-3 py-1 rounded-lg text-sm transition-colors capitalize",
                filter === status
                  ? "bg-blue-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm py-1 px-3"
        >
          <option value="priority">Priority</option>
          <option value="progress">Progress</option>
          <option value="deadline">Deadline</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {sortedGoals.length === 0 ? (
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-8 text-center">
            <Target className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">No Goals Found</h3>
            <p className="text-white/60 mb-4">
              {filter === 'all' 
                ? 'Start by creating your first financial goal'
                : `No ${filter} goals found`
              }
            </p>
            <button
              onClick={() => setShowNewGoal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          sortedGoals.map((goal) => {
            const StatusIcon = getStatusIcon(goal);
            
            return (
              <div
                key={goal.id}
                className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                      <div className="flex items-center gap-1">
                        <StatusIcon className={cn("w-4 h-4", getStatusColor(goal))} />
                        <span className={cn("text-xs", getStatusColor(goal))}>
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mt-1">{goal.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-1 rounded hover:bg-white/[0.05] transition-colors">
                      <Edit3 className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-1 rounded hover:bg-white/[0.05] transition-colors">
                      {goal.status === 'paused' ? (
                        <Play className="w-4 h-4 text-green-400" />
                      ) : (
                        <Pause className="w-4 h-4 text-yellow-400" />
                      )}
                    </button>
                    <button className="p-1 rounded hover:bg-white/[0.05] transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/80">
                      {formatCurrency(goal.progress.currentAmount)} of {formatCurrency(goal.targetAmount)}
                    </span>
                    <span className="text-white/60">
                      {Math.round(goal.progress.percentComplete)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.05] rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-500 bg-gradient-to-r",
                        getProgressColor(goal.progress.percentComplete, goal.progress.onTrack)
                      )}
                      style={{ width: `${Math.min(goal.progress.percentComplete, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Goal Stats */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-white/60 text-xs">Monthly</p>
                    <p className="font-semibold text-white">
                      {formatCurrency(goal.monthlyContribution || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Due Date</p>
                    <p className="font-semibold text-white">
                      {formatDate(goal.targetDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Priority</p>
                    <p className="font-semibold text-white">
                      {goal.priority === 1 ? 'High' : goal.priority === 2 ? 'Medium' : 'Low'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Remaining</p>
                    <p className="font-semibold text-white">
                      {formatCurrency(goal.targetAmount - goal.progress.currentAmount)}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    {goal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-white/[0.05] rounded-lg text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors">
                      Add Funds
                    </button>
                    <button className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors">
                      Adjust Target
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {!compact && goals.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">
                {goals.filter(g => g.status === 'active').length}
              </p>
              <p className="text-white/60 text-sm">Active Goals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.progress.currentAmount, 0))}
              </p>
              <p className="text-white/60 text-sm">Total Saved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0))}
              </p>
              <p className="text-white/60 text-sm">Monthly Contributions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.round(goals.reduce((sum, goal) => sum + goal.progress.percentComplete, 0) / goals.length)}%
              </p>
              <p className="text-white/60 text-sm">Avg Progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;