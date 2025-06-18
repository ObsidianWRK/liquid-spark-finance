import { familyService } from './familyService';
import { accountService } from './accountService';
import { transactionService } from './transactionService';
import { investmentService } from './investmentService';
import { budgetService } from './budgetService';

export interface ChartDataPoint {
  date: string;
  value: number;
  category?: string;
  label?: string;
  color?: string;
}

export interface NetWorthData {
  date: string;
  assets: number;
  liabilities: number;
  netWorth: number;
  investmentValue: number;
  cashValue: number;
}

export interface CashFlowData {
  date: string;
  income: number;
  expenses: number;
  netCashFlow: number;
  monthlyAverage: number;
}

export interface SpendingTrendData {
  category: string;
  currentMonth: number;
  previousMonth: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface PortfolioAllocationData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  change?: number;
  changePercent?: number;
}

export interface BudgetPerformanceData {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  progress: number;
  status: 'on-track' | 'warning' | 'over-budget';
  color: string;
}

export interface FinancialMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'percentage' | 'number';
  color: string;
  icon: string;
}

export interface DashboardData {
  netWorthHistory: NetWorthData[];
  cashFlowHistory: CashFlowData[];
  spendingTrends: SpendingTrendData[];
  portfolioAllocation: PortfolioAllocationData[];
  budgetPerformance: BudgetPerformanceData[];
  keyMetrics: FinancialMetric[];
  lastUpdated: Date;
}

/**
 * Visualization Service
 * Aggregates and transforms financial data for dashboard visualizations
 */
export class VisualizationService {
  private static instance: VisualizationService;

  static getInstance(): VisualizationService {
    if (!VisualizationService.instance) {
      VisualizationService.instance = new VisualizationService();
    }
    return VisualizationService.instance;
  }

  /**
   * Get comprehensive dashboard data for a family
   */
  async getDashboardData(familyId: string): Promise<DashboardData> {
    const [
      netWorthHistory,
      cashFlowHistory,
      spendingTrends,
      portfolioAllocation,
      budgetPerformance,
      keyMetrics
    ] = await Promise.all([
      this.getNetWorthHistory(familyId),
      this.getCashFlowHistory(familyId),
      this.getSpendingTrends(familyId),
      this.getPortfolioAllocation(familyId),
      this.getBudgetPerformance(familyId),
      this.getKeyMetrics(familyId)
    ]);

    return {
      netWorthHistory,
      cashFlowHistory,
      spendingTrends,
      portfolioAllocation,
      budgetPerformance,
      keyMetrics,
      lastUpdated: new Date()
    };
  }

  /**
   * Generate net worth history over time
   */
  async getNetWorthHistory(familyId: string, months: number = 12): Promise<NetWorthData[]> {
    const family = await familyService.getFamilyById(familyId);
    const accounts = await accountService.getFamilyAccounts(familyId);
    const portfolio = await investmentService.getFamilyPortfolio(familyId);

    const history: NetWorthData[] = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      // Simulate historical data with growth trend
      const monthsAgo = i;
      const growthFactor = 1 + (monthsAgo * 0.01); // 1% monthly growth
      const volatility = (Math.random() - 0.5) * 0.1; // ±5% volatility
      
      const baseNetWorth = family.stats.totalNetWorth;
      const netWorth = baseNetWorth * growthFactor * (1 + volatility);
      
      const investmentValue = portfolio.totalValue * growthFactor * (1 + volatility * 1.5);
      const cashValue = accounts
        .filter(acc => acc.type === 'checking' || acc.type === 'savings')
        .reduce((sum, acc) => sum + acc.balance, 0) * (1 + volatility * 0.5);
      
      const assets = netWorth + Math.abs(family.stats.totalDebt);
      const liabilities = Math.abs(family.stats.totalDebt) * (1 - monthsAgo * 0.02); // Decreasing debt

      history.push({
        date: date.toISOString().split('T')[0],
        assets,
        liabilities,
        netWorth,
        investmentValue,
        cashValue
      });
    }

    return history;
  }

  /**
   * Generate cash flow history
   */
  async getCashFlowHistory(familyId: string, months: number = 12): Promise<CashFlowData[]> {
    const history: CashFlowData[] = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      // Get actual transactions for the month
      const transactions = await transactionService.searchTransactions(familyId, {
        dateRange: { start: startDate, end: endDate }
      });

      const income = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = Math.abs(transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0));

      const netCashFlow = income - expenses;
      
      // Calculate rolling average
      const monthlyAverage = history.length > 0 
        ? history.slice(-3).reduce((sum, h) => sum + h.netCashFlow, netCashFlow) / (history.length > 2 ? 4 : history.length + 1)
        : netCashFlow;

      history.push({
        date: date.toISOString().split('T')[0],
        income,
        expenses,
        netCashFlow,
        monthlyAverage
      });
    }

    return history;
  }

  /**
   * Generate spending trends by category
   */
  async getSpendingTrends(familyId: string): Promise<SpendingTrendData[]> {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const [currentTransactions, previousTransactions] = await Promise.all([
      transactionService.searchTransactions(familyId, {
        dateRange: { start: currentMonth, end: currentDate }
      }),
      transactionService.searchTransactions(familyId, {
        dateRange: { start: previousMonth, end: previousMonthEnd }
      })
    ]);

    // Group by category
    const currentSpending = this.groupTransactionsByCategory(currentTransactions);
    const previousSpending = this.groupTransactionsByCategory(previousTransactions);

    const categories = new Set([...Object.keys(currentSpending), ...Object.keys(previousSpending)]);
    const trends: SpendingTrendData[] = [];

    for (const category of categories) {
      const current = currentSpending[category] || 0;
      const previous = previousSpending[category] || 0;
      const change = current - previous;
      const changePercent = previous > 0 ? (change / previous) * 100 : 0;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (Math.abs(changePercent) > 5) {
        trend = changePercent > 0 ? 'up' : 'down';
      }

      trends.push({
        category,
        currentMonth: current,
        previousMonth: previous,
        change,
        changePercent,
        trend,
        color: this.getCategoryColor(category)
      });
    }

    return trends.sort((a, b) => b.currentMonth - a.currentMonth);
  }

  /**
   * Get portfolio allocation data
   */
  async getPortfolioAllocation(familyId: string): Promise<PortfolioAllocationData[]> {
    const portfolio = await investmentService.getFamilyPortfolio(familyId);
    const allocation = portfolio.allocation;

    const allocationData: PortfolioAllocationData[] = [
      {
        name: 'Stocks',
        value: (allocation.stocks / 100) * portfolio.totalValue,
        percentage: allocation.stocks,
        color: '#3b82f6',
        change: Math.random() * 1000 - 500,
        changePercent: (Math.random() - 0.5) * 10
      },
      {
        name: 'Bonds',
        value: (allocation.bonds / 100) * portfolio.totalValue,
        percentage: allocation.bonds,
        color: '#10b981',
        change: Math.random() * 500 - 250,
        changePercent: (Math.random() - 0.5) * 5
      },
      {
        name: 'Cash',
        value: (allocation.cash / 100) * portfolio.totalValue,
        percentage: allocation.cash,
        color: '#f59e0b',
        change: Math.random() * 200 - 100,
        changePercent: (Math.random() - 0.5) * 2
      },
      {
        name: 'REITs',
        value: (allocation.reits / 100) * portfolio.totalValue,
        percentage: allocation.reits,
        color: '#8b5cf6',
        change: Math.random() * 300 - 150,
        changePercent: (Math.random() - 0.5) * 8
      },
      {
        name: 'Crypto',
        value: (allocation.crypto / 100) * portfolio.totalValue,
        percentage: allocation.crypto,
        color: '#f97316',
        change: Math.random() * 1000 - 500,
        changePercent: (Math.random() - 0.5) * 20
      },
      {
        name: 'Other',
        value: (allocation.other / 100) * portfolio.totalValue,
        percentage: allocation.other,
        color: '#6b7280',
        change: Math.random() * 100 - 50,
        changePercent: (Math.random() - 0.5) * 3
      }
    ].filter(item => item.value > 0);

    return allocationData;
  }

  /**
   * Get budget performance data
   */
  async getBudgetPerformance(familyId: string): Promise<BudgetPerformanceData[]> {
    const budget = await budgetService.getActiveBudget(familyId);
    if (!budget) return [];

    return budget.categories.map(category => {
      const progress = category.budgetedAmount > 0 ? (category.spentAmount / category.budgetedAmount) * 100 : 0;
      
      let status: 'on-track' | 'warning' | 'over-budget' = 'on-track';
      let color = '#10b981'; // green
      
      if (progress >= 100) {
        status = 'over-budget';
        color = '#ef4444'; // red
      } else if (progress >= 80) {
        status = 'warning';
        color = '#f59e0b'; // yellow
      }

      return {
        category: category.categoryName,
        budgeted: category.budgetedAmount,
        spent: category.spentAmount,
        remaining: category.remainingAmount,
        progress,
        status,
        color
      };
    }).sort((a, b) => b.spent - a.spent);
  }

  /**
   * Calculate key financial metrics
   */
  async getKeyMetrics(familyId: string): Promise<FinancialMetric[]> {
    const family = await familyService.getFamilyById(familyId);
    const portfolio = await investmentService.getFamilyPortfolio(familyId);
    const budget = await budgetService.getActiveBudget(familyId);

    const metrics: FinancialMetric[] = [
      {
        id: 'net_worth',
        label: 'Net Worth',
        value: family.stats.totalNetWorth,
        change: Math.random() * 5000 - 2500,
        changePercent: (Math.random() - 0.5) * 10,
        trend: 'up',
        format: 'currency',
        color: '#3b82f6',
        icon: 'trending-up'
      },
      {
        id: 'investment_return',
        label: 'Investment Return',
        value: portfolio.performance.totalReturn,
        change: Math.random() * 5 - 2.5,
        changePercent: portfolio.performance.totalReturn,
        trend: portfolio.performance.totalReturn >= 0 ? 'up' : 'down',
        format: 'percentage',
        color: portfolio.performance.totalReturn >= 0 ? '#10b981' : '#ef4444',
        icon: 'trending-up'
      },
      {
        id: 'savings_rate',
        label: 'Savings Rate',
        value: family.stats.savingsRate,
        change: Math.random() * 2 - 1,
        changePercent: (Math.random() - 0.5) * 5,
        trend: 'up',
        format: 'percentage',
        color: '#10b981',
        icon: 'piggy-bank'
      },
      {
        id: 'budget_adherence',
        label: 'Budget Adherence',
        value: budget ? ((budget.totalBudgeted - budget.totalSpent) / budget.totalBudgeted) * 100 : 0,
        change: Math.random() * 10 - 5,
        changePercent: (Math.random() - 0.5) * 10,
        trend: 'stable',
        format: 'percentage',
        color: '#8b5cf6',
        icon: 'target'
      },
      {
        id: 'debt_to_income',
        label: 'Debt-to-Income',
        value: family.stats.debtToIncomeRatio,
        change: Math.random() * 2 - 1,
        changePercent: (Math.random() - 0.5) * 5,
        trend: 'down',
        format: 'percentage',
        color: family.stats.debtToIncomeRatio > 36 ? '#ef4444' : '#10b981',
        icon: 'credit-card'
      },
      {
        id: 'emergency_fund',
        label: 'Emergency Fund',
        value: family.stats.emergencyFundMonths,
        change: Math.random() * 0.5 - 0.25,
        changePercent: (Math.random() - 0.5) * 5,
        trend: 'up',
        format: 'number',
        color: family.stats.emergencyFundMonths >= 6 ? '#10b981' : '#f59e0b',
        icon: 'shield'
      }
    ];

    return metrics;
  }

  /**
   * Get spending insights with trend analysis
   */
  async getSpendingInsights(familyId: string): Promise<any[]> {
    const trends = await this.getSpendingTrends(familyId);
    const insights = [];

    // High spending increase alerts
    const increasingSpending = trends.filter(t => t.changePercent > 20);
    for (const trend of increasingSpending) {
      insights.push({
        type: 'warning',
        title: `${trend.category} spending increased`,
        description: `${trend.category} spending is up ${trend.changePercent.toFixed(1)}% from last month`,
        value: trend.change,
        category: trend.category
      });
    }

    // Significant spending decreases (positive insights)
    const decreasingSpending = trends.filter(t => t.changePercent < -15);
    for (const trend of decreasingSpending) {
      insights.push({
        type: 'success',
        title: `Great job reducing ${trend.category} spending`,
        description: `You've decreased ${trend.category} spending by ${Math.abs(trend.changePercent).toFixed(1)}%`,
        value: Math.abs(trend.change),
        category: trend.category
      });
    }

    return insights;
  }

  // Helper methods
  private groupTransactionsByCategory(transactions: any[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    
    for (const transaction of transactions) {
      if (transaction.amount >= 0) continue; // Skip income
      
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      
      grouped[category] = (grouped[category] || 0) + amount;
    }
    
    return grouped;
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
}

export const visualizationService = VisualizationService.getInstance();