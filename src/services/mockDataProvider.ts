import { mockData, mockAccountsEnhanced, getCompactAccountCards as baseGetCompactAccountCards } from './mockData';
import type { Account, Transaction } from '@/shared/types/shared';
import type { AccountCardDTO } from '@/shared/types/accounts';

const useMocks = (): boolean =>
  import.meta.env.VITE_USE_MOCK_ACCOUNTS === 'true' || import.meta.env.DEV;

export const getAccounts = (): Account[] => (useMocks() ? mockAccountsEnhanced : []);

export const getTransactions = (): Transaction[] =>
  useMocks() ? (mockData.transactions as Transaction[]) : [];

export const getCompactAccountCards = (): AccountCardDTO[] =>
  useMocks() ? baseGetCompactAccountCards() : [];
