export interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: GoalCategory;
  color: string;
  icon: string;
  isCompleted: boolean;
  createdAt: string;
  contributions: Contribution[];
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'automatic' | 'roundup';
  description?: string;
}

export type GoalCategory =
  | 'Emergency Fund'
  | 'Vacation'
  | 'Home Down Payment'
  | 'Car'
  | 'Education'
  | 'Wedding'
  | 'Retirement'
  | 'General';

export interface SavingsInsight {
  type: 'progress' | 'suggestion' | 'milestone';
  title: string;
  description: string;
  actionable: boolean;
  action?: string;
}
