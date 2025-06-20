import { useState, useEffect } from 'react';
import { accountService } from '@/features/accounts/api/accountService';
import { AccountCardDTO } from '@/shared/types/accounts';
import { Transaction } from '@/shared/types/transactions';

export const useAccountOverview = (accountId: string | undefined) => {
  const [account, setAccount] = useState<AccountCardDTO | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!accountId) {
        setError(new Error('Account ID is missing.'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Create realistic mock data based on actual account IDs from mockData
        let mockAccount: AccountCardDTO;

        switch (accountId) {
          case 'acc_001':
            mockAccount = {
              id: accountId,
              accountType: 'Checking',
              accountName: 'Main Checking',
              currentBalance: 12450.0,
              availableBalance: 11200.0,
              currency: 'USD',
              institution: {
                name: 'Chase Bank',
                logo: 'https://logos.clearbit.com/chase.com',
                color: '#117A65',
              },
              last4: '1234',
              interestApy: 0.01,
              category: 'CHECKING',
              alerts: [],
            };
            break;

          case 'acc_002':
            mockAccount = {
              id: accountId,
              accountType: 'Savings',
              accountName: 'Emergency Fund',
              currentBalance: 25780.5,
              availableBalance: 25780.5,
              currency: 'USD',
              institution: {
                name: 'Bank of America',
                logo: 'https://logos.clearbit.com/bankofamerica.com',
                color: '#E51B23',
              },
              last4: '5678',
              interestApy: 2.15,
              category: 'SAVINGS',
              alerts: [],
            };
            break;

          case 'acc_003':
            mockAccount = {
              id: accountId,
              accountType: 'Credit Card',
              accountName: 'Rewards Card',
              currentBalance: -1245.3,
              availableBalance: 8754.7,
              currency: 'USD',
              institution: {
                name: 'Wells Fargo',
                logo: 'https://logos.clearbit.com/wellsfargo.com',
                color: '#D71E2B',
              },
              last4: '9012',
              category: 'CREDIT',
              creditLimit: 10000,
              alerts: [],
            };
            break;

          case 'acc_004':
            mockAccount = {
              id: accountId,
              accountType: 'Investment',
              accountName: 'Investment Portfolio',
              currentBalance: 45600.25,
              availableBalance: 45600.25,
              currency: 'USD',
              institution: {
                name: 'Schwab',
                logo: 'https://logos.clearbit.com/schwab.com',
                color: '#00A0DF',
              },
              last4: '3456',
              category: 'INVESTMENT',
              alerts: [],
            };
            break;

          case 'acc_005':
            mockAccount = {
              id: accountId,
              accountType: 'Checking',
              accountName: 'Business Checking',
              currentBalance: 8920.14,
              availableBalance: 8920.14,
              currency: 'USD',
              institution: {
                name: 'JPMorgan Chase',
                logo: 'https://logos.clearbit.com/chase.com',
                color: '#117A65',
              },
              last4: '7890',
              category: 'CHECKING',
              alerts: [],
            };
            break;

          case 'acc_006':
            mockAccount = {
              id: accountId,
              accountType: 'Investment',
              accountName: '401(k) Retirement',
              currentBalance: 174250.67,
              availableBalance: 174250.67,
              currency: 'USD',
              institution: {
                name: 'Fidelity',
                logo: 'https://logos.clearbit.com/fidelity.com',
                color: '#00653A',
              },
              last4: '4567',
              category: 'INVESTMENT',
              alerts: [],
            };
            break;

          case 'acc_007':
            mockAccount = {
              id: accountId,
              accountType: 'Investment',
              accountName: 'Traditional IRA',
              currentBalance: 62340.22,
              availableBalance: 62340.22,
              currency: 'USD',
              institution: {
                name: 'Vanguard',
                logo: 'https://logos.clearbit.com/vanguard.com',
                color: '#B41E3B',
              },
              last4: '8901',
              category: 'INVESTMENT',
              alerts: [],
            };
            break;

          case 'acc_008':
            mockAccount = {
              id: accountId,
              accountType: 'Savings',
              accountName: 'Health Savings',
              currentBalance: 12450.11,
              availableBalance: 12450.11,
              currency: 'USD',
              institution: {
                name: 'HSA Bank',
                logo: 'https://logos.clearbit.com/hsabank.com',
                color: '#4A90E2',
              },
              last4: '2345',
              category: 'SAVINGS',
              alerts: [],
            };
            break;

          // Add support for the original fixture IDs as well
          case 'acc_chase_checking_001':
            mockAccount = {
              id: accountId,
              accountType: 'Checking',
              accountName: 'Chase Total Checking',
              currentBalance: 4250.75,
              availableBalance: 4250.75,
              currency: 'USD',
              institution: {
                name: 'Chase Bank',
                logo: 'https://logos.clearbit.com/chase.com',
                color: '#004879',
              },
              last4: '4521',
              interestApy: 0.01,
              category: 'CHECKING',
              alerts: [],
            };
            break;

          case 'acc_bofa_savings_001':
            mockAccount = {
              id: accountId,
              accountType: 'Savings',
              accountName: 'Advantage Savings',
              currentBalance: 15750.42,
              availableBalance: 15750.42,
              currency: 'USD',
              institution: {
                name: 'Bank of America',
                logo: 'https://logos.clearbit.com/bankofamerica.com',
                color: '#E31837',
              },
              last4: '8932',
              interestApy: 1.5,
              category: 'SAVINGS',
              alerts: [],
            };
            break;

          case 'acc_wells_credit_001':
            mockAccount = {
              id: accountId,
              accountType: 'Credit Card',
              accountName: 'Cash Wise Visa',
              currentBalance: -1285.63,
              availableBalance: 3714.37,
              currency: 'USD',
              institution: {
                name: 'Wells Fargo',
                logo: 'https://logos.clearbit.com/wellsfargo.com',
                color: '#D50032',
              },
              last4: '1847',
              category: 'CREDIT',
              creditLimit: 5000.0,
              alerts: [],
            };
            break;

          case 'acc_schwab_investment_001':
            mockAccount = {
              id: accountId,
              accountType: 'Investment',
              accountName: 'Brokerage Account',
              currentBalance: 42850.19,
              availableBalance: 1250.0,
              currency: 'USD',
              institution: {
                name: 'Charles Schwab',
                logo: 'https://logos.clearbit.com/schwab.com',
                color: '#00A0DF',
              },
              last4: '7409',
              category: 'INVESTMENT',
              alerts: [],
            };
            break;

          case 'acc_citi_credit_001':
            mockAccount = {
              id: accountId,
              accountType: 'Credit Card',
              accountName: 'Double Cash Card',
              currentBalance: -567.23,
              availableBalance: 2432.77,
              currency: 'USD',
              institution: {
                name: 'Citibank',
                logo: 'https://logos.clearbit.com/citibank.com',
                color: '#DC143C',
              },
              last4: '2156',
              category: 'CREDIT',
              creditLimit: 3000.0,
              alerts: [],
            };
            break;

          default:
            // Fallback for any unknown account ID
            mockAccount = {
              id: accountId,
              accountType: 'Checking',
              accountName: 'Unknown Account',
              currentBalance: 1000.0,
              availableBalance: 1000.0,
              currency: 'USD',
              institution: {
                name: 'Unknown Bank',
                color: '#6366f1',
              },
              last4: '0000',
              category: 'CHECKING',
              alerts: [],
            };
        }

        const mockTransactions: Transaction[] = [
          {
            id: '1',
            accountId: accountId,
            familyId: 'demo_family',
            amount: -85.32,
            currency: 'USD',
            date: new Date('2024-12-10'),
            merchantName: 'Starbucks',
            description: 'Coffee purchase',
            category: 'food',
            paymentChannel: 'online',
            transactionType: 'purchase',
            status: 'completed',
            isPending: false,
            isRecurring: false,
            metadata: {},
            tags: [],
            excludeFromBudget: false,
            isTransfer: false,
            createdAt: new Date('2024-12-10'),
            updatedAt: new Date('2024-12-10'),
          },
          {
            id: '2',
            accountId: accountId,
            familyId: 'demo_family',
            amount: -45.67,
            currency: 'USD',
            date: new Date('2024-12-09'),
            merchantName: 'Target',
            description: 'Grocery shopping',
            category: 'shopping',
            paymentChannel: 'in_store',
            transactionType: 'purchase',
            status: 'completed',
            isPending: false,
            isRecurring: false,
            metadata: {},
            tags: [],
            excludeFromBudget: false,
            isTransfer: false,
            createdAt: new Date('2024-12-09'),
            updatedAt: new Date('2024-12-09'),
          },
          {
            id: '3',
            accountId: accountId,
            familyId: 'demo_family',
            amount: -12.99,
            currency: 'USD',
            date: new Date('2024-12-08'),
            merchantName: 'Netflix',
            description: 'Monthly subscription',
            category: 'entertainment',
            paymentChannel: 'online',
            transactionType: 'purchase',
            status: 'completed',
            isPending: false,
            isRecurring: true,
            metadata: {},
            tags: ['subscription'],
            excludeFromBudget: false,
            isTransfer: false,
            createdAt: new Date('2024-12-08'),
            updatedAt: new Date('2024-12-08'),
          },
        ];

        const mockBalanceHistory = [
          { balance: mockAccount.currentBalance, date: new Date() },
          {
            balance: mockAccount.currentBalance + 100,
            date: new Date(Date.now() - 86400000),
          },
          {
            balance: mockAccount.currentBalance - 50,
            date: new Date(Date.now() - 172800000),
          },
          {
            balance: mockAccount.currentBalance + 200,
            date: new Date(Date.now() - 259200000),
          },
          {
            balance: mockAccount.currentBalance - 75,
            date: new Date(Date.now() - 345600000),
          },
        ];

        setAccount(mockAccount);
        setTransactions(mockTransactions);
        setBalanceHistory(mockBalanceHistory);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to load account overview data.')
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accountId]);

  return { account, transactions, balanceHistory, loading, error };
};
