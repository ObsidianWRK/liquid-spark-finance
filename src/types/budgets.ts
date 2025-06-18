export interface Budget {
  id: string;
  familyId: string;
  name: string;
  description?: string;
  budgetType: BudgetType;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  currency: string;
  categories: BudgetCategory[];
  settings: BudgetSettings;
  status: BudgetStatus;
  isTemplate: boolean;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BudgetType = 
  | 'zero_based'     // Income - Expenses = 0
  | 'envelope'       // Fixed amounts per category
  | 'percentage'     // Percentage of income per category
  | 'priority'       // Priority-based allocation
  | 'goal_based'     // Budget aligned with financial goals
  | 'flexible';      // Adaptive budgeting

export type BudgetPeriod = 
  | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'custom';

export type BudgetStatus = 
  | 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryName: string;
  subcategories: BudgetSubcategory[];
  budgetedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  overageAmount: number;
  rolloverAmount: number; // From previous period
  priority: number; // 1-5, 1 being highest priority
  isFixed: boolean; // Fixed expense vs. variable
  isEssential: boolean; // Essential vs. discretionary
  alerts: CategoryAlert[];
  historicalSpending: HistoricalSpending[];
  notes?: string;
}

export interface BudgetSubcategory {
  id: string;
  name: string;
  budgetedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  transactions: string[]; // Transaction IDs
}

export interface CategoryAlert {
  id: string;
  type: 'threshold' | 'overage' | 'unusual_spending' | 'recurring_charge';
  threshold?: number; // Percentage of budget
  isActive: boolean;
  lastTriggered?: Date;
  message: string;
}

export interface HistoricalSpending {
  period: string; // YYYY-MM format
  amount: number;
  transactionCount: number;
  averageTransactionAmount: number;
}

export interface BudgetSettings {
  autoCreateCategories: boolean;
  rolloverUnspent: boolean;
  allowOverages: boolean;
  overageSource: 'emergency_fund' | 'next_period' | 'other_categories';
  alertThresholds: {
    warning: number; // Percentage (e.g., 80%)
    critical: number; // Percentage (e.g., 100%)
  };
  includeTransfers: boolean;
  includePendingTransactions: boolean;
  excludeRefunds: boolean;
  automaticAdjustments: boolean;
  syncWithGoals: boolean;
}

export interface BudgetTemplate {
  id: string;
  familyId: string;
  name: string;
  description?: string;
  budgetType: BudgetType;
  period: BudgetPeriod;
  categoryTemplates: CategoryTemplate[];
  settings: BudgetSettings;
  isPublic: boolean;
  usageCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryTemplate {
  categoryName: string;
  subcategories: string[];
  budgetedPercentage?: number; // Percentage of income
  fixedAmount?: number;
  priority: number;
  isFixed: boolean;
  isEssential: boolean;
  description?: string;
  tips?: string[];
}

export interface BudgetRecommendation {
  id: string;
  familyId: string;
  type: RecommendationType;
  category?: string;
  title: string;
  description: string;
  currentAmount: number;
  recommendedAmount: number;
  potentialSavings: number;
  confidence: number; // 0-1
  reasoning: string[];
  actionItems: string[];
  isApplied: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export type RecommendationType = 
  | 'reduce_spending' | 'increase_budget' | 'reallocate_funds' 
  | 'create_category' | 'merge_categories' | 'adjust_goals' 
  | 'emergency_fund' | 'debt_payment' | 'investment_opportunity';

export interface BudgetAnalytics {
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  performance: BudgetPerformance;
  trends: BudgetTrend[];
  insights: BudgetInsight[];
  comparisons: BudgetComparison[];
  forecasts: BudgetForecast[];
}

export interface BudgetPerformance {
  totalBudgeted: number;
  totalSpent: number;
  totalSaved: number;
  savingsRate: number;
  adherenceScore: number; // 0-100
  categoryPerformance: CategoryPerformance[];
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface CategoryPerformance {
  category: string;
  budgetedAmount: number;
  spentAmount: number;
  variance: number;
  variancePercentage: number;
  adherenceScore: number;
  trendDirection: 'improving' | 'declining' | 'stable';
}

export interface MonthlyBreakdown {
  month: string;
  budgeted: number;
  spent: number;
  saved: number;
  adherenceScore: number;
}

export interface BudgetTrend {
  category: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  changeAmount: number;
  changePercentage: number;
  significance: 'high' | 'medium' | 'low';
  timeframe: string;
}

export interface BudgetInsight {
  type: 'overspending' | 'underspending' | 'seasonal_pattern' | 'recurring_charge' | 'opportunity';
  category?: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendedAction?: string;
  potentialSavings?: number;
  confidence: number;
}

export interface BudgetComparison {
  type: 'previous_period' | 'similar_families' | 'national_average' | 'recommended_budget';
  category: string;
  yourAmount: number;
  comparisonAmount: number;
  difference: number;
  differencePercentage: number;
  insight: string;
}

export interface BudgetForecast {
  category: string;
  currentTrend: number;
  projectedSpending: number;
  projectedVariance: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface SavingsGoal {
  id: string;
  familyId: string;
  name: string;
  description?: string;
  goalType: GoalType;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: Date;
  priority: number; // 1-5
  status: GoalStatus;
  linkedAccountIds: string[];
  autoContribute: boolean;
  contributionRules: ContributionRule[];
  milestones: GoalMilestone[];
  tags: string[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalType = 
  | 'emergency_fund' | 'house_down_payment' | 'vacation' | 'car_purchase' 
  | 'wedding' | 'education' | 'retirement' | 'debt_payoff' | 'general_savings' 
  | 'home_improvement' | 'business_investment' | 'child_education' | 'healthcare';

export type GoalStatus = 
  | 'not_started' | 'in_progress' | 'on_track' | 'behind' | 'ahead' | 'completed' | 'paused';

export interface ContributionRule {
  id: string;
  type: 'fixed_amount' | 'percentage_income' | 'excess_budget' | 'windfall';
  amount?: number;
  percentage?: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  conditions?: ContributionCondition[];
  isActive: boolean;
}

export interface ContributionCondition {
  field: 'budget_surplus' | 'income_threshold' | 'expense_below' | 'date_range';
  operator: 'greater_than' | 'less_than' | 'equals' | 'between';
  value: number | string;
  value2?: number | string;
}

export interface GoalMilestone {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: Date;
  isCompleted: boolean;
  completedDate?: Date;
  reward?: string;
  description?: string;
}

export interface GoalAnalytics {
  goalId: string;
  progressPercentage: number;
  monthsToCompletion: number;
  onTrackToComplete: boolean;
  requiredMonthlyContribution: number;
  actualMonthlyContribution: number;
  projectedCompletionDate: Date;
  contributionHistory: ContributionHistory[];
  recommendations: GoalRecommendation[];
}

export interface ContributionHistory {
  date: Date;
  amount: number;
  source: 'manual' | 'automatic' | 'surplus' | 'windfall';
  balance: number;
}

export interface GoalRecommendation {
  type: 'increase_contribution' | 'adjust_timeline' | 'reallocate_funds' | 'automate_savings';
  title: string;
  description: string;
  impact: string;
  actionItems: string[];
  potentialBenefit: number;
}