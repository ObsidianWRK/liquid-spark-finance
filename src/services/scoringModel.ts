import { calculateHealthScore, fetchHealthMetrics } from './healthKitService';
import { calculateEcoScore } from './ecoScoreService';

interface Transaction {
  id: string;
  merchant?: string;
  category?: { name: string; };
  amount: number;
  date: string;
  status?: 'completed' | 'pending' | 'failed';
}

interface Account {
  id: string;
  type: string;
  balance: number;
}

export interface ScoreSummary {
  financial: number;
  health: number;
  eco: number;
}

export const calculateFinancialScore = (transactions: Transaction[], accounts: Account[]): number => {
  const now = new Date();
  const month = now.getMonth();

  const monthlyIncome = transactions
    .filter(t => t.amount > 0 && new Date(t.date).getMonth() === month)
    .reduce((s, t) => s + t.amount, 0);

  const monthlySpending = Math.abs(
    transactions
      .filter(t => t.amount < 0 && new Date(t.date).getMonth() === month)
      .reduce((s, t) => s + t.amount, 0)
  );

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const spendingRatio = monthlyIncome > 0 ? (monthlySpending / monthlyIncome) * 100 : 0;
  const emergencyFundMonths = monthlySpending > 0 ? totalBalance / monthlySpending : 0;

  // Weighted score
  const spendScore = Math.max(0, 100 - spendingRatio); // lower spend better
  const emergencyScore = Math.min(100, (emergencyFundMonths / 6) * 100);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0;
  const savingsScore = Math.min(100, savingsRate);

  return Math.round(spendScore * 0.4 + emergencyScore * 0.3 + savingsScore * 0.3);
};

export const generateScoreSummary = async (
  transactions: Transaction[],
  accounts: Account[]
): Promise<ScoreSummary> => {
  const financial = calculateFinancialScore(transactions, accounts);

  const healthMetrics = await fetchHealthMetrics();
  const health = calculateHealthScore(healthMetrics).totalScore;

  const eco = calculateEcoScore(transactions).score;

  return { financial, health, eco };
}; 