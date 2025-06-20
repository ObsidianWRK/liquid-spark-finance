export interface BudgetCategory {
  id: string;
  name: string;
  budget: number; // Monthly budget allotted
  spent: number; // Amount spent so far in the current period
  recurring?: boolean; // Whether the budget recurs every period
  color?: string; // Optional: UI accent colour
}

export interface BudgetPeriodSummary {
  month: string; // e.g. "Jan 2025"
  categories: BudgetCategory[];
  totalBudget: number;
  totalSpent: number;
}
