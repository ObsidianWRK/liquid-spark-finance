import { Transaction, Account, InsightMetric } from '@/shared/types/shared';
import { vueniTheme } from '@/theme/unified';

// Optimized utility functions with memoization and performance improvements
// Consolidates helper functions scattered across multiple files

export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Memoized currency formatter
export const formatCurrency = memoize(
  (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
);

// Memoized date formatter
export const formatDate = memoize(
  (date: string, format: 'short' | 'long' | 'relative' = 'short') => {
    const dateObj = new Date(date);

    switch (format) {
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'relative': {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - dateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }
      default:
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
    }
  }
);

// Optimized transaction calculations
export const calculateTransactionMetrics = memoize(
  (transactions: Transaction[], timeframe: string = '30d') => {
    const now = new Date();
    const days = parseInt(timeframe.replace('d', ''));
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filteredTransactions = transactions.filter(
      (t) => new Date(t.date) >= cutoffDate
    );

    const totalSpent = filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalIncome = filteredTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const avgTransaction =
      filteredTransactions.length > 0
        ? totalSpent / filteredTransactions.filter((t) => t.amount < 0).length
        : 0;

    const transactionCount = filteredTransactions.length;

    // Category breakdown
    const categoryTotals = filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce(
        (acc, t) => {
          const category = t.category.name;
          acc[category] = (acc[category] || 0) + Math.abs(t.amount);
          return acc;
        },
        {} as Record<string, number>
      );

    const topCategory = Object.entries(categoryTotals).sort(
      ([, a]: [string, number], [, b]: [string, number]) => b - a
    )[0];

    return {
      totalSpent,
      totalIncome,
      avgTransaction,
      transactionCount,
      topCategory: topCategory
        ? { name: topCategory[0], amount: topCategory[1] }
        : null,
      categoryTotals,
    };
  }
);

// Optimized account calculations
export const calculateAccountMetrics = memoize((accounts: Account[]) => {
  const totalAssets = accounts
    .filter((acc) => !acc.type.toLowerCase().includes('credit'))
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalDebt = accounts
    .filter((acc) => acc.type.toLowerCase().includes('credit'))
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  const netWorth = totalAssets - totalDebt;

  const activeAccounts = accounts.filter((acc) => acc.isActive !== false);

  return {
    totalAssets,
    totalDebt,
    netWorth,
    accountCount: accounts.length,
    activeAccountCount: activeAccounts.length,
  };
});

// Performance optimized array operations
export const groupTransactionsByDate = memoize(
  (transactions: Transaction[]) => {
    return transactions.reduce(
      (groups, transaction) => {
        const date = new Date(transaction.date).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
      },
      {} as Record<string, Transaction[]>
    );
  }
);

export const groupTransactionsByCategory = memoize(
  (transactions: Transaction[]) => {
    return transactions.reduce(
      (groups, transaction) => {
        const category = transaction.category.name;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(transaction);
        return groups;
      },
      {} as Record<string, Transaction[]>
    );
  }
);

// Optimized search and filter
export const filterTransactions = memoize(
  (
    transactions: Transaction[],
    searchTerm: string,
    category: string,
    dateRange?: { start: Date; end: Date }
  ) => {
    return transactions.filter((transaction) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          transaction.merchant.toLowerCase().includes(searchLower) ||
          transaction.category.name.toLowerCase().includes(searchLower) ||
          (transaction.description &&
            transaction.description.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (category && category !== 'all') {
        if (transaction.category.name !== category) return false;
      }

      // Date range filter
      if (dateRange) {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate < dateRange.start ||
          transactionDate > dateRange.end
        )
          return false;
      }

      return true;
    });
  }
);

// Optimized sorting
export const sortTransactions = memoize(
  (
    transactions: Transaction[],
    field: 'date' | 'amount' | 'merchant',
    direction: 'asc' | 'desc'
  ) => {
    return [...transactions].sort((a, b) => {
      let comparison = 0;

      switch (field) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'merchant':
          comparison = a.merchant.localeCompare(b.merchant);
          break;
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }
);

// Color utilities
export const getTransactionColor = memoize((amount: number) => {
  return amount < 0
    ? vueniTheme.colors.palette.danger
    : vueniTheme.colors.palette.success; // red for expenses, green for income
});

export const getCategoryColor = memoize((category: string) => {
  // Generate consistent colors for categories using unified theme
  const colors = [
    vueniTheme.colors.palette.primary,
    vueniTheme.colors.palette.danger,
    vueniTheme.colors.palette.success,
    vueniTheme.colors.palette.warning,
    vueniTheme.colors.semantic.chart.investments,
    vueniTheme.colors.palette.neutral,
  ];

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
});

// Performance monitoring utilities
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// React performance utilities
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

// Optimized component update check
export const shouldComponentUpdate = (
  prevProps: unknown,
  nextProps: unknown
): boolean => {
  return !shallowEqual(prevProps, nextProps);
};

export default {
  formatCurrency,
  formatDate,
  calculateTransactionMetrics,
  calculateAccountMetrics,
  groupTransactionsByDate,
  groupTransactionsByCategory,
  filterTransactions,
  sortTransactions,
  getTransactionColor,
  getCategoryColor,
  debounce,
  throttle,
  shallowEqual,
  shouldComponentUpdate,
  memoize,
};
