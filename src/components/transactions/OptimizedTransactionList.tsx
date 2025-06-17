import React, { useState, useMemo, useCallback } from 'react';
import { 
  Transaction, 
  TransactionListProps, 
  TransactionClickHandler,
  CategoryFilterHandler 
} from '@/types/shared';
import { UniversalCard } from '@/components/ui/UniversalCard';
import { Search, Filter, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Optimized Transaction List - Consolidates:
// - TransactionList.tsx
// - VueniUnifiedTransactionList.tsx  
// - EnterpriseTransactionView.tsx
// - TransactionMain.tsx
// - Multiple transaction item components
// Performance optimized with React.memo, useMemo, useCallback

export const OptimizedTransactionList = React.memo<TransactionListProps>(({
  transactions,
  variant = 'default',
  currency = 'USD',
  features = {},
  onTransactionClick,
  onCategoryFilter,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'merchant'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Memoized filtered and sorted transactions
  const processedTransactions = useMemo(() => {
    let filtered = transactions;

    // Search filter
    if (features.searchable && searchTerm) {
      filtered = filtered.filter(t => 
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter  
    if (features.filterable && selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category.name === selectedCategory);
    }

    // Sort
    if (features.sortable) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
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
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [transactions, searchTerm, selectedCategory, sortField, sortDirection, features]);

  // Memoized grouped transactions for date grouping
  const groupedTransactions = useMemo(() => {
    if (!features.groupByDate) return { ['']: processedTransactions };

    return processedTransactions.reduce((groups, transaction) => {
      const date = new Date(transaction.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }, [processedTransactions, features.groupByDate]);

  // Memoized categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(transactions.map(t => t.category.name))
    );
    return uniqueCategories;
  }, [transactions]);

  // Optimized event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    onCategoryFilter?.(category);
  }, [onCategoryFilter]);

  const handleTransactionClick = useCallback((transaction: Transaction) => {
    onTransactionClick?.(transaction);
  }, [onTransactionClick]);

  const handleSort = useCallback((field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField]);

  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'clean':
        return {
          container: 'bg-transparent',
          item: 'hover:bg-white/5 border-b border-white/5',
          spacing: 'py-3 px-4'
        };
      case 'enterprise':
        return {
          container: 'bg-slate-900 border border-slate-700',
          item: 'hover:bg-slate-800 border-b border-slate-700',
          spacing: 'py-4 px-6'
        };
      case 'apple':
        return {
          container: 'bg-white/5 backdrop-blur-md',
          item: 'hover:bg-white/8 border-b border-white/10 last:border-b-0',
          spacing: 'py-4 px-5'
        };
      case 'modern':
        return {
          container: 'bg-gradient-to-b from-white/10 to-white/5',
          item: 'hover:bg-white/10 border-b border-white/10 last:border-b-0',
          spacing: 'py-4 px-5'
        };
      default:
        return {
          container: 'bg-white/5',
          item: 'hover:bg-white/8 border-b border-white/10 last:border-b-0',
          spacing: 'py-3 px-4'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <UniversalCard 
      variant="glass" 
      className={cn('overflow-hidden', className)}
    >
      {/* Header with Search and Filters */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Recent Transactions
          </h3>
          <div className="text-sm text-white/60">
            {processedTransactions.length} of {transactions.length}
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex gap-3">
          {/* Search */}
          {features.searchable && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          )}

          {/* Category Filter */}
          {features.filterable && (
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg py-2 pl-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Sort Options */}
        {features.sortable && (
          <div className="flex gap-2 mt-3">
            {(['date', 'amount', 'merchant'] as const).map(field => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                  sortField === field
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-white/10 text-white/60 hover:text-white/80'
                )}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (
                  sortDirection === 'asc' ? 
                    <TrendingUp className="inline ml-1 w-3 h-3" /> :
                    <TrendingDown className="inline ml-1 w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className={cn('max-h-96 overflow-y-auto', variantStyles.container)}>
        {Object.entries(groupedTransactions).map(([date, groupTransactions]) => (
          <div key={date}>
            {/* Date Header (if grouping enabled) */}
            {features.groupByDate && (
              <div className="sticky top-0 bg-white/5 backdrop-blur-md px-4 py-2 border-b border-white/10">
                <div className="text-sm font-medium text-white/80">
                  {date === new Date().toDateString() ? 'Today' : 
                   date === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' :
                   new Date(date).toLocaleDateString()}
                </div>
              </div>
            )}

            {/* Transactions in Group */}
            {groupTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                currency={currency}
                features={features}
                styles={variantStyles}
                onClick={() => handleTransactionClick(transaction)}
              />
            ))}
          </div>
        ))}

        {/* Empty State */}
        {processedTransactions.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-white/60 mb-2">No transactions found</div>
            <div className="text-sm text-white/40">
              {searchTerm ? 'Try adjusting your search' : 'No transactions to display'}
            </div>
          </div>
        )}
      </div>
    </UniversalCard>
  );
});

OptimizedTransactionList.displayName = 'OptimizedTransactionList';

// Memoized Transaction Item Component
const TransactionItem = React.memo<{
  transaction: Transaction;
  currency: string;
  features: TransactionListProps['features'];
  styles: ReturnType<typeof getVariantStyles>;
  onClick: () => void;
}>(({ transaction, currency, features, styles, onClick }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(Math.abs(amount));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between cursor-pointer transition-colors',
        styles.item,
        styles.spacing
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Left Side */}
      <div className="flex items-center space-x-3">
        {/* Category Icon */}
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
          style={{ backgroundColor: transaction.category.color + '30' }}
        >
          {transaction.merchant.charAt(0).toUpperCase()}
        </div>

        {/* Transaction Details */}
        <div className="space-y-1">
          <div className="font-medium text-white">{transaction.merchant}</div>
          <div className="flex items-center space-x-2">
            {features.showCategories && (
              <span className="text-xs text-white/60">{transaction.category.name}</span>
            )}
            <span className="text-xs text-white/60">{formatDate(transaction.date)}</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="text-right space-y-1">
        {/* Amount */}
        <div className={cn(
          'font-semibold',
          transaction.amount < 0 ? 'text-red-400' : 'text-green-400'
        )}>
          {transaction.amount < 0 ? '-' : '+'}{formatAmount(transaction.amount)}
        </div>

        {/* Scores */}
        {features.showScores && transaction.scores && (
          <div className="flex space-x-1">
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-xs text-green-400 font-semibold">
                {transaction.scores.health}
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-xs text-blue-400 font-semibold">
                {transaction.scores.eco}
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-xs text-purple-400 font-semibold">
                {transaction.scores.financial}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

TransactionItem.displayName = 'TransactionItem';

export default OptimizedTransactionList;