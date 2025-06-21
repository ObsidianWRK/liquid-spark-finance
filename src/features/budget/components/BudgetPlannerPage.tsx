import React, { useEffect, useState } from 'react';
import { budgetService } from '@/features/budget/api/budgetService';
import { Budget, SavingsGoal } from '@/types/budgets';
import BudgetTracker from './BudgetTracker';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import {
  Plus,
  Trash2,
  TrendingUp,
  Target,
  BarChart3,
  ArrowLeft,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { BackButton } from '@/shared/components/ui/BackButton';

const BudgetPlannerPage = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'budget' | 'goals' | 'analytics'>(
    'budget'
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const familyId = 'demo_family';
      const [activeBudget, familyGoals] = await Promise.all([
        budgetService.getActiveBudget(familyId),
        budgetService.getFamilySavingsGoals(familyId),
      ]);

      setBudget(activeBudget);
      setGoals(familyGoals);
    } catch (error) {
      console.error('Failed to load budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amt);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/[0.05] rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6"
              >
                <div className="h-6 bg-white/[0.05] rounded w-32 mb-2"></div>
                <div className="h-8 bg-white/[0.05] rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Back Button */}
      <BackButton
        fallbackPath="/"
        variant="default"
        label="Back to Dashboard"
        className="mb-6"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <span className="truncate">Budget & Goals Manager</span>
          </h1>
          <p className="text-white/60 mt-2">
            Track spending, manage budgets, and achieve your financial goals
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
            <Target className="w-4 h-4" />
            New Goal
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
            <Plus className="w-4 h-4" />
            New Budget
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {budget && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <UniversalCard className="p-4 sm:p-6 rounded-2xl card-hover">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <p className="text-white/60 text-sm">Monthly Budget</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(budget.totalBudgeted)}
            </p>
          </UniversalCard>

          <UniversalCard className="p-4 sm:p-6 rounded-2xl card-hover">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <p className="text-white/60 text-sm">Total Spent</p>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(budget.totalSpent)}
            </p>
            <p className="text-sm text-white/60 mt-1">
              {((budget.totalSpent / budget.totalBudgeted) * 100).toFixed(1)}%
              of budget
            </p>
          </UniversalCard>

          <UniversalCard className="p-4 sm:p-6 rounded-2xl card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <p className="text-white/60 text-sm">Remaining</p>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(budget.totalRemaining)}
            </p>
            <p className="text-sm text-white/60 mt-1">
              {((budget.totalRemaining / budget.totalBudgeted) * 100).toFixed(
                1
              )}
              % available
            </p>
          </UniversalCard>

          <UniversalCard className="p-4 sm:p-6 rounded-2xl card-hover">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-white/60 text-sm">Active Goals</p>
            </div>
            <p className="text-2xl font-bold text-white">{goals.length}</p>
            <p className="text-sm text-white/60 mt-1">
              {
                goals.filter(
                  (g) => g.status === 'on_track' || g.status === 'ahead'
                ).length
              }{' '}
              on track
            </p>
          </UniversalCard>
        </div>
      )}

      {/* Budget Status Alert */}
      {budget && budget.totalSpent > budget.totalBudgeted && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <div>
            <p className="text-red-400 font-medium">Budget Exceeded</p>
            <p className="text-red-300 text-sm">
              You've spent{' '}
              {formatCurrency(budget.totalSpent - budget.totalBudgeted)} over
              your monthly budget. Consider reviewing your spending categories.
            </p>
          </div>
        </div>
      )}

      {/* Budget Tracker Component */}
      <BudgetTracker familyId="demo_family" />
    </div>
  );
};

export default BudgetPlannerPage;
