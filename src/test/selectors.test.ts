import { describe, test, expect } from 'vitest';
import {
  selectTotalWealth,
  selectTotalAssets,
  selectTotalLiabilities,
  selectLiquidAssets,
  selectInvestmentAssets,
  selectAccountsByType
} from '@/selectors/financialSelectors';
import { Account } from '@/types/accounts';

// Mock account data
const mockAccounts: Account[] = [
  {
    id: 'acc1',
    familyId: 'fam1',
    name: 'Chase Checking',
    accountType: 'depository',
    accountSubtype: 'checking',
    balance: 5000,
    currency: 'USD',
    isActive: true,
    isManual: false,
    syncStatus: 'active',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'acc2',
    familyId: 'fam1',
    name: 'Chase Savings',
    accountType: 'depository',
    accountSubtype: 'savings',
    balance: 15000,
    currency: 'USD',
    isActive: true,
    isManual: false,
    syncStatus: 'active',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'acc3',
    familyId: 'fam1',
    name: 'Chase Sapphire',
    accountType: 'credit',
    accountSubtype: 'credit_card',
    balance: -2500, // Negative balance for credit card debt
    currency: 'USD',
    isActive: true,
    isManual: false,
    syncStatus: 'active',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'acc4',
    familyId: 'fam1',
    name: 'Fidelity 401k',
    accountType: 'investment',
    accountSubtype: '401k',
    balance: 50000,
    currency: 'USD',
    isActive: true,
    isManual: false,
    syncStatus: 'active',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'acc5',
    familyId: 'fam1',
    name: 'Auto Loan',
    accountType: 'loan',
    accountSubtype: 'auto_loan',
    balance: -12000, // Negative balance for loan
    currency: 'USD',
    isActive: true,
    isManual: false,
    syncStatus: 'active',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'acc6',
    familyId: 'fam1',
    name: 'Old Account',
    accountType: 'depository',
    accountSubtype: 'checking',
    balance: 1000,
    currency: 'USD',
    isActive: false, // Inactive account
    isManual: false,
    syncStatus: 'inactive',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

describe('Financial Selectors', () => {
  describe('selectTotalWealth', () => {
    test('calculates net worth correctly (assets - liabilities)', () => {
      const wealth = selectTotalWealth(mockAccounts);
      // Assets: 5000 (checking) + 15000 (savings) + 50000 (401k) = 70000
      // Liabilities: 2500 (credit card) + 12000 (loan) = 14500
      // Net Worth: 70000 - 14500 = 55500
      expect(wealth).toBe(55500);
    });

    test('excludes inactive accounts', () => {
      const wealth = selectTotalWealth(mockAccounts);
      // Should not include the 1000 from inactive account
      expect(wealth).toBe(55500);
    });

    test('handles empty account array', () => {
      expect(selectTotalWealth([])).toBe(0);
    });

    test('handles accounts with undefined balance', () => {
      const accountsWithUndefined = [
        ...mockAccounts,
        {
          ...mockAccounts[0],
          id: 'acc7',
          balance: undefined as any
        }
      ];
      const wealth = selectTotalWealth(accountsWithUndefined);
      expect(wealth).toBe(55500); // Same as before, undefined account filtered out
    });

    test('handles only asset accounts', () => {
      const assetOnly = mockAccounts.filter(acc => 
        !acc.accountType.includes('credit') && !acc.accountType.includes('loan')
      );
      const wealth = selectTotalWealth(assetOnly);
      expect(wealth).toBe(70000); // No liabilities to subtract
    });

    test('handles only liability accounts', () => {
      const liabilitiesOnly = mockAccounts.filter(acc => 
        acc.accountType.includes('credit') || acc.accountType.includes('loan')
      );
      const wealth = selectTotalWealth(liabilitiesOnly);
      expect(wealth).toBe(-14500); // 0 assets - 14500 liabilities
    });
  });

  describe('selectTotalAssets', () => {
    test('calculates total assets correctly', () => {
      const assets = selectTotalAssets(mockAccounts);
      // 5000 + 15000 + 50000 = 70000 (excludes inactive)
      expect(assets).toBe(70000);
    });

    test('excludes credit and loan accounts', () => {
      const assets = selectTotalAssets(mockAccounts);
      expect(assets).toBe(70000);
    });
  });

  describe('selectTotalLiabilities', () => {
    test('calculates total liabilities as positive numbers', () => {
      const liabilities = selectTotalLiabilities(mockAccounts);
      // 2500 + 12000 = 14500
      expect(liabilities).toBe(14500);
    });

    test('includes only credit and loan accounts', () => {
      const liabilities = selectTotalLiabilities(mockAccounts);
      expect(liabilities).toBe(14500);
    });

    test('returns 0 for no liabilities', () => {
      const noLiabilities = mockAccounts.filter(acc => 
        !acc.accountType.includes('credit') && !acc.accountType.includes('loan')
      );
      expect(selectTotalLiabilities(noLiabilities)).toBe(0);
    });
  });

  describe('selectLiquidAssets', () => {
    test('calculates liquid assets (checking + savings)', () => {
      const liquid = selectLiquidAssets(mockAccounts);
      // 5000 + 15000 = 20000
      expect(liquid).toBe(20000);
    });

    test('excludes inactive accounts', () => {
      const liquid = selectLiquidAssets(mockAccounts);
      expect(liquid).toBe(20000); // Doesn't include the 1000 from inactive
    });
  });

  describe('selectInvestmentAssets', () => {
    test('calculates investment assets correctly', () => {
      const investments = selectInvestmentAssets(mockAccounts);
      // 50000 (401k)
      expect(investments).toBe(50000);
    });

    test('includes various investment types', () => {
      const extendedAccounts = [
        ...mockAccounts,
        {
          ...mockAccounts[0],
          id: 'acc7',
          name: 'IRA',
          accountType: 'investment' as const,
          accountSubtype: 'ira' as const,
          balance: 25000,
          isActive: true
        }
      ];
      const investments = selectInvestmentAssets(extendedAccounts);
      expect(investments).toBe(75000); // 50000 + 25000
    });
  });

  describe('selectAccountsByType', () => {
    test('groups accounts correctly by type', () => {
      const grouped = selectAccountsByType(mockAccounts);
      
      expect(grouped.checking).toBe(5000);
      expect(grouped.savings).toBe(15000);
      expect(grouped.creditCards).toBe(2500); // Absolute value
      expect(grouped.investments).toBe(50000);
      expect(grouped.loans).toBe(12000); // Absolute value
    });

    test('handles mixed account types', () => {
      const grouped = selectAccountsByType(mockAccounts);
      const total = grouped.checking + grouped.savings + grouped.investments;
      expect(total).toBe(70000); // Total assets
    });

    test('returns 0 for missing account types', () => {
      const checkingOnly = mockAccounts.filter(acc => 
        acc.accountSubtype === 'checking' && acc.isActive
      );
      const grouped = selectAccountsByType(checkingOnly);
      
      expect(grouped.checking).toBe(5000);
      expect(grouped.savings).toBe(0);
      expect(grouped.creditCards).toBe(0);
      expect(grouped.investments).toBe(0);
      expect(grouped.loans).toBe(0);
    });
  });
}); 