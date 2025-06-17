import { useQuery } from '@tanstack/react-query';
import { creditScoreService } from '@/services/creditScoreService';
import { CreditScore, CreditTip } from './types';

const queryKeys = {
  score: ['credit', 'score'] as const,
  tips: ['credit', 'tips'] as const,
};

export const useCreditScore = () =>
  useQuery<CreditScore>({
    queryKey: queryKeys.score,
    queryFn: () => creditScoreService.getCurrentScore(),
  });

export const useCreditTips = () =>
  useQuery<CreditTip[]>({
    queryKey: queryKeys.tips,
    queryFn: () => creditScoreService.getCreditTips(),
  }); 