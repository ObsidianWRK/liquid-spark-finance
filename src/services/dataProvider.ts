import type { Account, Transaction } from '@/shared/types/shared';
import type { AccountCardDTO } from '@/shared/types/accounts';
import {
  mockAccountsEnhanced,
  mockInstitutions,
  mockData,
  getCompactAccountCards,
} from './mockData';

export interface DataProvider {
  getAccounts(): Promise<Account[]>;
  getTransactions(accountId?: string): Promise<Transaction[]>;
  getAccountCards(): Promise<AccountCardDTO[]>;
}

export class MockDataProvider implements DataProvider {
  async getAccounts() {
    return Promise.resolve(mockAccountsEnhanced as Account[]);
  }

  async getTransactions(_accountId?: string) {
    return Promise.resolve(mockData.transactions);
  }

  async getAccountCards() {
    return Promise.resolve(getCompactAccountCards());
  }

  getInstitutions() {
    return Promise.resolve(mockInstitutions);
  }
}

export class ApiDataProvider implements DataProvider {
  async getAccounts() {
    // Placeholder for real API integration
    return Promise.resolve([]);
  }

  async getTransactions(_accountId?: string) {
    return Promise.resolve([]);
  }

  async getAccountCards() {
    return Promise.resolve([]);
  }
}

export function getDataProvider(): DataProvider {
  const useMocks =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_MOCKS === 'true';
  return useMocks ? new MockDataProvider() : new ApiDataProvider();
}

const provider = getDataProvider();

export const useDataProvider = () => provider;

export async function fetchAccounts() {
  return provider.getAccounts();
}
export async function fetchAccountCards() {
  return provider.getAccountCards();
}


export async function fetchTransactions(accountId?: string) {
  return provider.getTransactions(accountId);
}

export { mockAccountsEnhanced as MOCK_ACCOUNTS, mockData as MOCK_DATA, mockInstitutions as MOCK_INSTITUTIONS };
export { getCompactAccountCards } from "./mockData";
