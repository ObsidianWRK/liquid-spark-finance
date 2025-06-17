import { useQuery } from '@tanstack/react-query';
import { generateScoreSummary } from '@/services/scoringModel';
import { mockHealthEcoService } from '@/services/mockHealthEcoService';
import { mockHistoricalService } from '@/services/mockHistoricalData';
import type { Transaction } from '@/components/insights/NewInsightsPage';
import type { Account } from '@/components/insights/NewInsightsPage';

const queryKeys = {
  scores: ['insights', 'scores'] as const,
  historicalScores: ['insights', 'historicalScores'] as const,
  monthlyFinancial: ['insights', 'monthlyFinancial'] as const,
  categoryTrends: ['insights', 'categoryTrends'] as const,
  netWorth: ['insights', 'netWorth'] as const,
};

export interface InsightsScores {
  financial: number;
  health: number;
  eco: number;
}

export const useInsightsScores = (transactions: Transaction[], accounts: Account[]) =>
  useQuery<InsightsScores>({
    queryKey: [...queryKeys.scores, transactions.length, accounts.length],
    queryFn: async () => {
      const financial = (await generateScoreSummary(transactions, accounts)).financial;
      const health = mockHealthEcoService.getHealthScore(transactions).score;
      const eco = mockHealthEcoService.getEcoScore(transactions).score;
      return { financial, health, eco };
    },
  });

export const useHistoricalScores = () =>
  useQuery({
    queryKey: queryKeys.historicalScores,
    queryFn: () => mockHistoricalService.getHistoricalScores(),
  });

export const useMonthlyFinancialData = () =>
  useQuery({
    queryKey: queryKeys.monthlyFinancial,
    queryFn: () => mockHistoricalService.getMonthlyFinancialData(),
  });

export const useCategoryTrends = () =>
  useQuery({
    queryKey: queryKeys.categoryTrends,
    queryFn: () => mockHistoricalService.getCategoryTrends(),
  });

export const useNetWorthData = () =>
  useQuery({
    queryKey: queryKeys.netWorth,
    queryFn: () => mockHistoricalService.getNetWorthData(),
  }); 