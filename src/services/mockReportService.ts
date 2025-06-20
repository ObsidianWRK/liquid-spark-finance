export interface BudgetReport {
  id: string;
  month: string;
  year: number;
  totalSpent: number;
  totalBudget: number;
  categories: Array<{
    name: string;
    spent: number;
    budget: number;
    transactions: number;
  }>;
  insights: string[];
  generatedAt: Date;
}

export interface WrappedData {
  year: number;
  totalSpent: number;
  totalSaved: number;
  topMerchants: Array<{ name: string; amount: number; visits: number }>;
  biggestPurchase: { merchant: string; amount: number; date: string };
  categoriesImproved: string[];
  savingsVsPreviousYear: number;
  financialScore: number;
}

export const mockReportService = {
  getBudgetReport: (month: string, year: number): BudgetReport => ({
    id: `report_${month}_${year}`,
    month,
    year,
    totalSpent: 2847.65,
    totalBudget: 3200.0,
    categories: [
      { name: 'Groceries', spent: 580, budget: 600, transactions: 23 },
      { name: 'Dining', spent: 420, budget: 300, transactions: 15 },
      { name: 'Transportation', spent: 180, budget: 200, transactions: 8 },
      { name: 'Shopping', spent: 650, budget: 700, transactions: 12 },
      { name: 'Entertainment', spent: 150, budget: 200, transactions: 6 },
    ],
    insights: [
      'You stayed under budget in 4 out of 5 categories!',
      'Dining expenses increased by 40% from last month',
      'Great job keeping transportation costs low',
    ],
    generatedAt: new Date(),
  }),

  getWrappedData: (year: number): WrappedData => ({
    year,
    totalSpent: 34567.89,
    totalSaved: 8900.45,
    topMerchants: [
      { name: 'Whole Foods', amount: 3456.78, visits: 89 },
      { name: 'Amazon', amount: 2890.45, visits: 34 },
      { name: 'Starbucks', amount: 1245.67, visits: 156 },
      { name: 'Target', amount: 1789.23, visits: 23 },
      { name: 'Apple Store', amount: 1234.56, visits: 4 },
    ],
    biggestPurchase: {
      merchant: 'Apple Store',
      amount: 2499.0,
      date: '2024-09-15',
    },
    categoriesImproved: ['Transportation', 'Utilities', 'Entertainment'],
    savingsVsPreviousYear: 1245.67,
    financialScore: 8.5,
  }),
};
