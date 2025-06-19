import React, { useState, useEffect, useCallback } from 'react';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  Plus,
  Settings,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { budgetService } from '@/services/budgetService';
import { Budget, BudgetCategory, SavingsGoal } from '@/types/budgets';
import { cn } from '@/lib/utils';
import { mockData } from '@/services/mockData';
import { TransactionCategory } from '@/types/transactions';

interface BudgetTrackerProps {
  familyId: string;
  className?: string;
}

const BudgetTracker = ({ familyId, className }: BudgetTrackerProps) => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'categories' | 'goals' | 'analytics'>('overview');

  const loadBudgetData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [budgetData, goalsData] = await Promise.all([
        budgetService.getActiveBudget(familyId),
        budgetService.getFamilySavingsGoals(familyId) // WHY: Use budgetService which returns the correct SavingsGoal type
      ]);
      
      // -----------------------------------------------------------
      // Populate budget spent amounts using available mock transactions
      // -----------------------------------------------------------
      const populateSpentFromMock = (budgetToPopulate: Budget | null) => {
        if (!budgetToPopulate) return budgetToPopulate;

        const expenses = mockData.transactions.filter(t => t.amount < 0);

        // Helper to map mock category labels -> internal TransactionCategory keys
        const mapCategory = (label: string): TransactionCategory => {
          const l = label.toLowerCase();
          if (['grocery', 'groceries', 'dining', 'coffee', 'food'].some(k => l.includes(k))) return 'food';
          if (['electronics', 'shopping', 'amazon', 'nike', 'best buy', 'home depot', 'home improvement', 'walmart', 'target', 'ebay'].some(k => l.includes(k))) return 'shopping';
          if (['gas', 'uber', 'lyft', 'transportation'].some(k => l.includes(k))) return 'transportation';
          if (['entertainment', 'netflix', 'spotify', 'apple music', 'movie', 'concert', 'gym'].some(k => l.includes(k))) return 'entertainment';
          if (['health', 'pharmacy', 'cvs', 'healthcare', 'gym'].some(k => l.includes(k))) return 'healthcare';
          if (['utilities', 'electric', 'water', 'internet', 'phone'].some(k => l.includes(k))) return 'utilities';
          if (['debt', 'loan', 'payment', 'mortgage'].some(k => l.includes(k))) return 'debt_payments';
          if (['saving', 'investment', '401', 'ira'].some(k => l.includes(k))) return 'savings';
          if (['housing', 'rent', 'property'].some(k => l.includes(k))) return 'housing';
          return 'other';
        };

        // Reset spent before recalculation to avoid double-counting on reloads
        budgetToPopulate.categories.forEach(cat => {
          cat.spentAmount = 0;
          cat.remainingAmount = cat.budgetedAmount;
          cat.overageAmount = 0;
        });

        // Accumulate expenses per category
        expenses.forEach(txn => {
          const catKey = mapCategory(txn.category.name || 'other');
          const category = budgetToPopulate.categories.find(c => c.categoryName === catKey);
          if (category) {
            const amount = Math.abs(txn.amount);
            category.spentAmount += amount;
            category.remainingAmount = Math.max(category.budgetedAmount - category.spentAmount, 0);
            category.overageAmount = Math.max(category.spentAmount - category.budgetedAmount, 0);
          }
        });

        // Recalculate totals
        budgetToPopulate.totalSpent = budgetToPopulate.categories.reduce((sum, c) => sum + c.spentAmount, 0);
        budgetToPopulate.totalRemaining = Math.max(budgetToPopulate.totalBudgeted - budgetToPopulate.totalSpent, 0);

        return budgetToPopulate;
      };

      const enrichedBudget = populateSpentFromMock(budgetData);

      // -----------------------------------------------------------
      // Enrich savings goals with mock progress based on contribution schedule
      // -----------------------------------------------------------
      const populateGoalsProgress = (goals: SavingsGoal[]): SavingsGoal[] => {
        return goals.map(goal => {
          const targetDate = goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate);
          const monthsTotal = Math.max(1, Math.ceil((targetDate.getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)) + 12); // fallback 12 months horizon

          // Estimate months elapsed since 1 year ago (for demo)
          const monthsElapsed = Math.min(12, 12 - Math.ceil(monthsTotal / 12));

          const estimatedAmount = goal.monthlyContribution * monthsElapsed;
          const currentAmount = Math.min(estimatedAmount, goal.targetAmount);

          return {
            ...goal,
            currentAmount,
            status: currentAmount >= goal.targetAmount ? 'completed' : 'in_progress'
          };
        });
      };

      const enrichedGoals = populateGoalsProgress(goalsData);

      setBudget(enrichedBudget);
      setGoals(enrichedGoals);
    } catch (err) {
      setError('Failed to load budget data');
      console.error('Budget loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [familyId]);

  useEffect(() => {
    loadBudgetData();
  }, [loadBudgetData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getCategoryProgress = (category: BudgetCategory) => {
    if (category.budgetedAmount === 0) return 0;
    return Math.min((category.spentAmount / category.budgetedAmount) * 100, 100);
  };

  const getCategoryStatus = (category: BudgetCategory) => {
    const progress = getCategoryProgress(category);
    if (progress >= 100) return 'overspent';
    if (progress >= 80) return 'warning';
    if (progress >= 50) return 'on-track';
    return 'under-budget';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overspent':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'on-track':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'under-budget':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getGoalProgress = (goal: SavingsGoal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getGoalStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'on_track':
      case 'ahead':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'behind':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-white/[0.05] rounded w-32"></div>
              <div className="h-6 bg-white/[0.05] rounded w-24"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-white/[0.05] rounded w-full"></div>
              <div className="h-4 bg-white/[0.05] rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Budget Summary */}
      {budget && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <PieChart className="w-6 h-6 text-blue-400" />
            {budget.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-white/60 text-sm mb-2">Total Budget</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(budget.totalBudgeted)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-white/60 text-sm mb-2">Spent</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(budget.totalSpent)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-white/60 text-sm mb-2">Remaining</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(budget.totalRemaining)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-white/60 text-sm mb-2">Savings Rate</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatPercentage((budget.totalRemaining / budget.totalBudgeted) * 100)}
              </p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Budget Progress</span>
              <span>{formatPercentage((budget.totalSpent / budget.totalBudgeted) * 100)}</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-3">
              <div 
                className={cn(
                  "h-3 rounded-full transition-all duration-300",
                  budget.totalSpent > budget.totalBudgeted ? "bg-red-500" : "bg-blue-500"
                )}
                style={{ width: `${Math.min((budget.totalSpent / budget.totalBudgeted) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Top Categories */}
      {budget && budget.categories.length > 0 && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Top Spending Categories
          </h3>
          
          <div className="space-y-4">
            {budget.categories
              .sort((a, b) => b.spentAmount - a.spentAmount)
              .slice(0, 5)
              .map((category) => {
                const progress = getCategoryProgress(category);
                const status = getCategoryStatus(category);
                
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Target className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white capitalize truncate">{category.categoryName.replace('_', ' ')}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-1 bg-white/[0.05] rounded-full h-2">
                            <div 
                              className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                progress >= 100 ? "bg-red-500" : 
                                progress >= 80 ? "bg-yellow-500" : "bg-green-500"
                              )}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-xl border font-medium",
                            getStatusColor(status)
                          )}>
                            {formatPercentage(progress)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-white">{formatCurrency(category.spentAmount)}</p>
                      <p className="text-white/60 text-sm">of {formatCurrency(category.budgetedAmount)}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Savings Goals */}
      {goals.length > 0 && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <Target className="w-5 h-5 text-green-400" />
            Savings Goals
          </h3>
          
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => {
              const progress = getGoalProgress(goal);
              
              return (
                <div key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
                      {getGoalStatusIcon(goal.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{goal.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 bg-white/[0.05] rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-green-500 transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-green-400 font-medium">
                          {formatPercentage(progress)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-white">{formatCurrency(goal.currentAmount)}</p>
                    <p className="text-white/60 text-sm">of {formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Budget Categories</h3>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {budget && budget.categories.map((category) => {
        const progress = getCategoryProgress(category);
        const status = getCategoryStatus(category);
        
        return (
          <div
            key={category.id}
            className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white capitalize">{category.categoryName.replace('_', ' ')}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    {category.isEssential && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                        Essential
                      </span>
                    )}
                    {category.isFixed && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Fixed
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-white">{formatCurrency(category.spentAmount)}</p>
                <p className="text-white/60 text-sm">of {formatCurrency(category.budgetedAmount)}</p>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-lg border font-medium inline-block mt-1",
                  getStatusColor(status)
                )}>
                  {formatPercentage(progress)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Spent</span>
                <span>Remaining: {formatCurrency(category.remainingAmount)}</span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-3">
                <div 
                  className={cn(
                    "h-3 rounded-full transition-all duration-300",
                    progress >= 100 ? "bg-red-500" : 
                    progress >= 80 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Overage Warning */}
            {category.overageAmount > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-400 font-medium">Over Budget</p>
                  <p className="text-red-300 text-sm">Exceeded by {formatCurrency(category.overageAmount)}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Savings Goals</h3>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {goals.map((goal) => {
        const progress = getGoalProgress(goal);
        
        // Safely handle targetDate - ensure it's a Date object
        const targetDate = goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate);
        const monthsRemaining = Math.ceil((targetDate.getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000));
        
        return (
          <div
            key={goal.id}
            className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  {getGoalStatusIcon(goal.status)}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{goal.name}</h4>
                  <p className="text-white/60 text-sm">{goal.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 capitalize">
                      {goal.goalType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-white/60">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {monthsRemaining > 0 ? `${monthsRemaining} months left` : 'Overdue'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-white">{formatCurrency(goal.currentAmount)}</p>
                <p className="text-white/60 text-sm">of {formatCurrency(goal.targetAmount)}</p>
                <p className="text-green-400 text-sm font-medium mt-1">{formatPercentage(progress)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Progress</span>
                <span>Monthly: {formatCurrency(goal.monthlyContribution)}</span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Goal Details */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-white/60">Target Date:</span>
                <span className="text-white">{targetDate.toLocaleDateString()}</span>
              </div>
              {goal.autoContribute && (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Auto-contribute
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white/[0.02] rounded-xl p-1 border border-white/[0.08]">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'categories', label: 'Categories', icon: BarChart3 },
          { id: 'goals', label: 'Goals', icon: Target },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedView(id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all",
              selectedView === id
                ? "bg-blue-500 text-white"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'categories' && renderCategories()}
      {selectedView === 'goals' && renderGoals()}
      {selectedView === 'analytics' && renderOverview()} {/* Reuse overview for now */}
    </div>
  );
};

export default BudgetTracker;