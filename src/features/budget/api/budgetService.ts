import { 
  Budget, 
  BudgetCategory, 
  BudgetTemplate, 
  BudgetRecommendation, 
  BudgetAnalytics,
  BudgetPerformance,
  BudgetType,
  BudgetPeriod,
  BudgetStatus,
  SavingsGoal,
  GoalAnalytics,
  GoalRecommendation
} from '@/types/budgets';
import { TransactionCategory } from '@/types/transactions';
import { transactionService } from './transactionService';
import { secureStorage } from '@/shared/utils/crypto';

/**
 * Advanced Budgeting & Goal Management Service
 * Handles budget creation, tracking, analytics, and goal management
 */
class BudgetService {
  private static instance: BudgetService;
  private storageKey = 'vueni:budgets:v2';
  private budgets: Map<string, Budget> = new Map();
  private templates: Map<string, BudgetTemplate> = new Map();
  private goals: Map<string, SavingsGoal> = new Map();
  private recommendations: Map<string, BudgetRecommendation[]> = new Map();

  // Legacy support
  private legacyCategories: Array<{ id: string; name: string; type: string }> = [];

  // Default budget category allocations (based on 50/30/20 rule and expert recommendations)
  private defaultCategoryAllocations: Record<TransactionCategory, {
    percentage: number;
    isEssential: boolean;
    isFixed: boolean;
    priority: number;
  }> = {
    housing: { percentage: 30, isEssential: true, isFixed: true, priority: 1 },
    transportation: { percentage: 15, isEssential: true, isFixed: false, priority: 2 },
    food: { percentage: 12, isEssential: true, isFixed: false, priority: 3 },
    utilities: { percentage: 8, isEssential: true, isFixed: false, priority: 4 },
    insurance: { percentage: 5, isEssential: true, isFixed: true, priority: 5 },
    healthcare: { percentage: 5, isEssential: true, isFixed: false, priority: 6 },
    debt_payments: { percentage: 10, isEssential: true, isFixed: true, priority: 1 },
    savings: { percentage: 20, isEssential: true, isFixed: false, priority: 2 },
    entertainment: { percentage: 5, isEssential: false, isFixed: false, priority: 8 },
    personal_care: { percentage: 3, isEssential: false, isFixed: false, priority: 9 },
    shopping: { percentage: 5, isEssential: false, isFixed: false, priority: 10 },
    education: { percentage: 2, isEssential: false, isFixed: false, priority: 7 },
    gifts_donations: { percentage: 2, isEssential: false, isFixed: false, priority: 11 },
    business: { percentage: 0, isEssential: false, isFixed: false, priority: 12 },
    taxes: { percentage: 0, isEssential: true, isFixed: true, priority: 1 },
    investments: { percentage: 0, isEssential: false, isFixed: false, priority: 3 },
    fees: { percentage: 1, isEssential: false, isFixed: false, priority: 13 },
    transfers: { percentage: 0, isEssential: false, isFixed: false, priority: 14 },
    other: { percentage: 2, isEssential: false, isFixed: false, priority: 15 },
    income: { percentage: 0, isEssential: false, isFixed: false, priority: 16 }
  };

  private constructor() {
    this.loadFromStorage();
    this.seedDemoData();
  }

  public static getInstance() {
    if (!BudgetService.instance) {
      BudgetService.instance = new BudgetService();
    }
    return BudgetService.instance;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = secureStorage.getItem(this.storageKey);
      if (data) {
        // Load new budget data
        const budgetData = data;
        if (budgetData.budgets) {
          budgetData.budgets.forEach((budget: any) => {
            // Convert date strings back to Date objects
            budget.startDate = new Date(budget.startDate);
            budget.endDate = new Date(budget.endDate);
            budget.createdAt = new Date(budget.createdAt);
            budget.updatedAt = new Date(budget.updatedAt);
            
            this.budgets.set(budget.id, budget);
          });
        }
        if (budgetData.goals) {
          budgetData.goals.forEach((goal: any) => {
            // Convert date strings back to Date objects
            goal.targetDate = new Date(goal.targetDate);
            goal.createdAt = new Date(goal.createdAt);
            goal.updatedAt = new Date(goal.updatedAt);
            
            // Convert milestone dates
            if (goal.milestones) {
              goal.milestones.forEach((milestone: any) => {
                milestone.targetDate = new Date(milestone.targetDate);
                if (milestone.completedDate) {
                  milestone.completedDate = new Date(milestone.completedDate);
                }
              });
            }
            
            this.goals.set(goal.id, goal);
          });
        }
      } else {
        // Check for legacy data
        const legacyData = secureStorage.getItem('vueni:budgets:v1');
        if (legacyData) {
          this.legacyCategories = legacyData as any[];
        }
      }
    } catch (e) {
      console.error('Failed to parse budget data from localStorage', e);
    }
  }

  private async seedDemoData() {
    // Create demo budget if none exists
    if (this.budgets.size === 0) {
      const demoBudget = await this.createBudget({
        familyId: 'demo_family',
        name: 'Monthly Budget - December 2024',
        description: 'Comprehensive family budget with smart categorization',
        budgetType: 'percentage',
        period: 'monthly',
        startDate: new Date(2024, 11, 1), // December 1, 2024
        endDate: new Date(2024, 11, 31), // December 31, 2024
        totalBudgeted: 6000,
        currency: 'USD',
        settings: {
          autoCreateCategories: true,
          rolloverUnspent: true,
          allowOverages: true,
          overageSource: 'other_categories',
          alertThresholds: { warning: 80, critical: 100 },
          includeTransfers: false,
          includePendingTransactions: true,
          excludeRefunds: true,
          automaticAdjustments: false,
          syncWithGoals: true
        },
        status: 'active',
        isTemplate: false
      });

      // Create demo goals
      await this.createSavingsGoal({
        familyId: 'demo_family',
        name: 'Emergency Fund',
        description: '6 months of expenses for financial security',
        goalType: 'emergency_fund',
        targetAmount: 18000,
        monthlyContribution: 500,
        targetDate: new Date(2025, 11, 31),
        priority: 1,
        linkedAccountIds: [],
        autoContribute: true,
        contributionRules: [{
          id: 'rule_1',
          type: 'fixed_amount',
          amount: 500,
          frequency: 'monthly',
          isActive: true
        }],
        milestones: [
          {
            id: 'milestone_1',
            name: '25% Complete',
            targetAmount: 4500,
            targetDate: new Date(2025, 2, 31),
            isCompleted: false,
            description: 'First milestone - $4,500 saved'
          },
          {
            id: 'milestone_2',
            name: '50% Complete',
            targetAmount: 9000,
            targetDate: new Date(2025, 5, 30),
            isCompleted: false,
            description: 'Halfway point - $9,000 saved'
          }
        ],
        tags: ['emergency', 'security', 'priority'],
        isArchived: false
      });

      await this.createSavingsGoal({
        familyId: 'demo_family',
        name: 'Vacation Fund',
        description: 'Summer vacation to Europe',
        goalType: 'vacation',
        targetAmount: 8000,
        monthlyContribution: 300,
        targetDate: new Date(2025, 5, 1),
        priority: 2,
        linkedAccountIds: [],
        autoContribute: false,
        contributionRules: [],
        milestones: [],
        tags: ['vacation', 'travel', 'family'],
        isArchived: false
      });
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    const data = {
      budgets: Array.from(this.budgets.values()),
      goals: Array.from(this.goals.values()),
      templates: Array.from(this.templates.values())
    };
    secureStorage.setItem(this.storageKey, data);
  }

  /**
   * Create a new budget
   */
  async createBudget(data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent' | 'totalRemaining' | 'categories'>): Promise<Budget> {
    const budget: Budget = {
      id: this.generateBudgetId(),
      ...data,
      totalSpent: 0,
      totalRemaining: data.totalBudgeted,
      categories: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create default categories based on budget type
    budget.categories = await this.createDefaultCategories(budget);

    this.budgets.set(budget.id, budget);
    this.persist();
    return budget;
  }

  /**
   * Create savings goal
   */
  async createSavingsGoal(data: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount' | 'status'>): Promise<SavingsGoal> {
    const goal: SavingsGoal = {
      id: this.generateGoalId(),
      ...data,
      currentAmount: 0,
      status: 'not_started',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.goals.set(goal.id, goal);
    this.persist();
    return goal;
  }

  /**
   * Get family's budgets
   */
  async getFamilyBudgets(familyId: string): Promise<Budget[]> {
    return Array.from(this.budgets.values())
      .filter(budget => budget.familyId === familyId)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  /**
   * Get active budget for family
   */
  async getActiveBudget(familyId: string): Promise<Budget | null> {
    const budgets = await this.getFamilyBudgets(familyId);
    return budgets.find(budget => budget.status === 'active') || null;
  }

  /**
   * Get family's savings goals
   */
  async getFamilySavingsGoals(familyId: string): Promise<SavingsGoal[]> {
    return Array.from(this.goals.values())
      .filter(goal => goal.familyId === familyId && !goal.isArchived)
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Legacy support - list categories for compatibility
   */
  async listCategories(): Promise<any[]> {
    // Try to get from active budget first
    const activeBudget = await this.getActiveBudget('demo_family');
    if (activeBudget) {
      return activeBudget.categories.map(cat => ({
        id: cat.id,
        name: cat.categoryName,
        budget: cat.budgetedAmount,
        spent: cat.spentAmount,
        color: this.getCategoryColor(cat.categoryName),
        recurring: true
      }));
    }

    // Fallback to legacy categories
    if (this.legacyCategories.length > 0) {
      return this.legacyCategories;
    }

    // Default demo categories
    return [
      { id: '1', name: 'Groceries', budget: 600, spent: 450, color: '#4ade80', recurring: true },
      { id: '2', name: 'Dining', budget: 300, spent: 220, color: '#38bdf8', recurring: true },
      { id: '3', name: 'Transportation', budget: 200, spent: 145, color: '#f97316', recurring: true },
      { id: '4', name: 'Entertainment', budget: 200, spent: 165, color: '#a855f7', recurring: true },
      { id: '5', name: 'Savings & Investments', budget: 500, spent: 500, color: '#facc15', recurring: true }
    ];
  }

  // Private helper methods
  private async createDefaultCategories(budget: Budget): Promise<BudgetCategory[]> {
    const categories: BudgetCategory[] = [];
    const allocations = this.defaultCategoryAllocations;

    for (const [categoryName, allocation] of Object.entries(allocations)) {
      if (allocation.percentage > 0) {
        const budgetedAmount = (budget.totalBudgeted * allocation.percentage) / 100;
        
        categories.push({
          id: this.generateCategoryId(),
          budgetId: budget.id,
          categoryName: categoryName as TransactionCategory,
          subcategories: [],
          budgetedAmount,
          spentAmount: 0,
          remainingAmount: budgetedAmount,
          overageAmount: 0,
          rolloverAmount: 0,
          priority: allocation.priority,
          isFixed: allocation.isFixed,
          isEssential: allocation.isEssential,
          alerts: [],
          historicalSpending: []
        });
      }
    }

    return categories.sort((a, b) => a.priority - b.priority);
  }

  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      housing: '#3b82f6',
      transportation: '#f97316',
      food: '#10b981',
      utilities: '#8b5cf6',
      insurance: '#06b6d4',
      healthcare: '#ef4444',
      debt_payments: '#dc2626',
      savings: '#22c55e',
      entertainment: '#a855f7',
      personal_care: '#ec4899',
      shopping: '#f59e0b',
      education: '#6366f1',
      gifts_donations: '#84cc16',
      other: '#6b7280'
    };
    return colors[category] || '#6b7280';
  }

  private generateBudgetId(): string {
    return `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCategoryId(): string {
    return `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateGoalId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const budgetService = BudgetService.getInstance(); 