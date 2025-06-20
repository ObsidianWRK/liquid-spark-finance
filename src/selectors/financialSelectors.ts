import { Account } from '@/types/accounts';

/**
 * Centralized financial selectors for consistent calculations across the app
 */

/**
 * Calculate total wealth (net worth) from accounts
 * Assets - Liabilities = Net Worth
 *
 * @param accounts Array of user accounts
 * @returns Total net worth value
 */
export const selectTotalWealth = (accounts: Account[]): number => {
  // Filter out inactive accounts
  const activeAccounts = accounts.filter(
    (account) => account.isActive !== false && account.balance !== undefined
  );

  // Calculate total assets (non-credit accounts)
  const totalAssets = activeAccounts
    .filter((account) => {
      const type = account.accountType?.toLowerCase() || '';
      return !type.includes('credit') && !type.includes('loan');
    })
    .reduce((sum, account) => sum + (account.balance || 0), 0);

  // Calculate total liabilities (credit cards and loans)
  const totalLiabilities = activeAccounts
    .filter((account) => {
      const type = account.accountType?.toLowerCase() || '';
      return type.includes('credit') || type.includes('loan');
    })
    .reduce((sum, account) => {
      // Credit cards typically have negative balances when there's debt
      // Convert to positive for liability calculation
      return sum + Math.abs(account.balance || 0);
    }, 0);

  return totalAssets - totalLiabilities;
};

/**
 * Calculate total assets from accounts
 * @param accounts Array of user accounts
 * @returns Total assets value
 */
export const selectTotalAssets = (accounts: Account[]): number => {
  return accounts
    .filter((account) => {
      if (account.isActive === false) return false;
      const type = account.accountType?.toLowerCase() || '';
      return !type.includes('credit') && !type.includes('loan');
    })
    .reduce((sum, account) => sum + (account.balance || 0), 0);
};

/**
 * Calculate total liabilities from accounts
 * @param accounts Array of user accounts
 * @returns Total liabilities value (as positive number)
 */
export const selectTotalLiabilities = (accounts: Account[]): number => {
  return accounts
    .filter((account) => {
      if (account.isActive === false) return false;
      const type = account.accountType?.toLowerCase() || '';
      return type.includes('credit') || type.includes('loan');
    })
    .reduce((sum, account) => sum + Math.abs(account.balance || 0), 0);
};

/**
 * Calculate liquid assets (checking + savings)
 * @param accounts Array of user accounts
 * @returns Total liquid assets
 */
export const selectLiquidAssets = (accounts: Account[]): number => {
  return accounts
    .filter((account) => {
      if (account.isActive === false) return false;
      const type = account.accountType?.toLowerCase() || '';
      return type.includes('checking') || type.includes('savings');
    })
    .reduce((sum, account) => sum + (account.balance || 0), 0);
};

/**
 * Calculate investment assets
 * @param accounts Array of user accounts
 * @returns Total investment value
 */
export const selectInvestmentAssets = (accounts: Account[]): number => {
  return accounts
    .filter((account) => {
      if (account.isActive === false) return false;
      const type = account.accountType?.toLowerCase() || '';
      return (
        type.includes('investment') ||
        type.includes('retirement') ||
        type.includes('401k') ||
        type.includes('ira')
      );
    })
    .reduce((sum, account) => sum + (account.balance || 0), 0);
};

/**
 * Group accounts by type with totals
 * @param accounts Array of user accounts
 * @returns Grouped account totals
 */
export const selectAccountsByType = (accounts: Account[]) => {
  const activeAccounts = accounts.filter(
    (account) => account.isActive !== false
  );

  return {
    checking: activeAccounts
      .filter((acc) =>
        (acc.accountType || '').toLowerCase().includes('checking')
      )
      .reduce((sum, acc) => sum + (acc.balance || 0), 0),

    savings: activeAccounts
      .filter((acc) =>
        (acc.accountType || '').toLowerCase().includes('savings')
      )
      .reduce((sum, acc) => sum + (acc.balance || 0), 0),

    creditCards: activeAccounts
      .filter((acc) => (acc.accountType || '').toLowerCase().includes('credit'))
      .reduce((sum, acc) => sum + Math.abs(acc.balance || 0), 0),

    investments: activeAccounts
      .filter((acc) => {
        const type = (acc.accountType || '').toLowerCase();
        return type.includes('investment') || type.includes('retirement');
      })
      .reduce((sum, acc) => sum + (acc.balance || 0), 0),

    loans: activeAccounts
      .filter((acc) => (acc.accountType || '').toLowerCase().includes('loan'))
      .reduce((sum, acc) => sum + Math.abs(acc.balance || 0), 0),
  };
};
