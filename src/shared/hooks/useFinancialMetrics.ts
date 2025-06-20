import { useMemo } from 'react';
import { Account } from '@/types/accounts';
import {
  selectTotalWealth,
  selectTotalAssets,
  selectTotalLiabilities,
  selectLiquidAssets,
  selectInvestmentAssets,
  selectAccountsByType,
} from '@/selectors/financialSelectors';

/**
 * Custom hook for accessing financial metrics
 * Provides memoized calculations for performance
 */
export const useFinancialMetrics = (accounts: Account[]) => {
  const totalWealth = useMemo(() => selectTotalWealth(accounts), [accounts]);
  const totalAssets = useMemo(() => selectTotalAssets(accounts), [accounts]);
  const totalLiabilities = useMemo(
    () => selectTotalLiabilities(accounts),
    [accounts]
  );
  const liquidAssets = useMemo(() => selectLiquidAssets(accounts), [accounts]);
  const investmentAssets = useMemo(
    () => selectInvestmentAssets(accounts),
    [accounts]
  );
  const accountsByType = useMemo(
    () => selectAccountsByType(accounts),
    [accounts]
  );

  // Additional derived metrics
  const debtToAssetRatio = useMemo(() => {
    if (totalAssets === 0) return 0;
    return (totalLiabilities / totalAssets) * 100;
  }, [totalAssets, totalLiabilities]);

  const liquidityRatio = useMemo(() => {
    if (totalAssets === 0) return 0;
    return (liquidAssets / totalAssets) * 100;
  }, [liquidAssets, totalAssets]);

  const investmentRatio = useMemo(() => {
    if (totalAssets === 0) return 0;
    return (investmentAssets / totalAssets) * 100;
  }, [investmentAssets, totalAssets]);

  return {
    // Primary metrics
    totalWealth,
    totalAssets,
    totalLiabilities,
    liquidAssets,
    investmentAssets,

    // Grouped by type
    accountsByType,

    // Ratios
    debtToAssetRatio,
    liquidityRatio,
    investmentRatio,

    // Helper values
    hasDebt: totalLiabilities > 0,
    isPositiveNetWorth: totalWealth > 0,
    hasInvestments: investmentAssets > 0,
  };
};

/**
 * Simplified hook for just total wealth
 */
export const useTotalWealth = (accounts: Account[]) => {
  return useMemo(() => selectTotalWealth(accounts), [accounts]);
};
