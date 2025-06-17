import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/services/mockData';
import { Transaction } from './types';

const queryKeys = {
  list: ['transactions', 'list'] as const,
};

export const useTransactions = () =>
  useQuery<Transaction[]>({
    queryKey: queryKeys.list,
    queryFn: () => Promise.resolve(mockData.transactions),
  });