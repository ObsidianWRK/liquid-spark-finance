import React, { useState, useMemo, useCallback } from 'react';
import { 
  Transaction, 
  TransactionListProps, 
  TransactionClickHandler,
  CategoryFilterHandler 
} from '@/types/shared';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
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
          container: '',
          item: 'hover:bg-white/5 border-b border-white/5',
          spacing: 'py-3 px-4'
        };
      case 'enterprise':
        return {
          container: '',
          item: 'hover:bg-white/5 border-b border-white/10',
          spacing: 'py-4 px-6'
        };
      case 'apple':
        return {
          container: '',
          item: 'hover:bg-white/5 border-b border-white/10 last:border-b-0',
          spacing: 'py-4 px-5 lg:py-3 lg:px-6'
        };
      case 'modern':
        return {
          container: '',
          item: 'hover:bg-white/5 border-b border-white/10 last:border-b-0',
          spacing: 'py-4 px-5'
        };
      default:
        return {
          container: '',
          item: 'hover:bg-white/5 border-b border-white/10 last:border-b-0',
          spacing: 'py-3 px-4'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <UnifiedCard
      variant="default"
      size="lg"
      className={cn('overflow-hidden p-0', className)}
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
                className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          )}

          {/* Category Filter */}
          {features.filterable && (
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl py-2 pl-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
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
                  'px-3 py-1 rounded-xl text-xs font-medium transition-colors',
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
      <div 
        className={cn(
          'max-h-96 md:max-h-[60vh] lg:max-h-[70vh] overflow-y-auto transaction-scroll-container', 
          variantStyles.container
        )}
        style={{
          maskImage: 'radial-gradient(white, white)',
          WebkitMaskImage: 'radial-gradient(white, white)',
          borderRadius: 'inherit'
        }}
      >
        {Object.entries(groupedTransactions).map(([date, groupTransactions]) => (
          <div key={date}>
            {/* Date Header (if grouping enabled) - Uses same grid structure as transaction rows */}
            {features.groupByDate && (
              <div className={cn(
                'sticky top-0 bg-zinc-800/60 backdrop-blur-md py-2 border-b border-white/10 z-10',
                // Use same grid layout as transaction rows for perfect alignment
                'grid items-center gap-3 lg:gap-4',
                // Mobile: Icon + Details + Amount (3 columns)
                'grid-cols-[auto,1fr,auto]',
                // Tablet: Icon + Details + Amount + Scores (4 columns when scores present)
                features.showScores ? 'md:grid-cols-[auto,1fr,auto,auto]' : 'md:grid-cols-[auto,1fr,auto]',
                // Desktop: Icon + Details + Date + Amount + Scores (5 columns)  
                features.showScores 
                  ? 'lg:grid-cols-[auto,2fr,minmax(80px,auto),auto,auto]'
                  : 'lg:grid-cols-[auto,2fr,minmax(80px,auto),auto]',
                variantStyles.spacing
              )}
              role="presentation"
            >
              {/* Date text in first column to align with transaction icons */}
              <div className="text-sm font-medium text-white/80 col-span-full">
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
    </UnifiedCard>
  );
});

OptimizedTransactionList.displayName = 'OptimizedTransactionList';

// Memoized Transaction Item Component
const TransactionItem = React.memo<{
  transaction: Transaction;
  currency: string;
  features: TransactionListProps['features'];
  styles: {
    container: string;
    item: string;
    spacing: string;
  };
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
        // Fixed grid layout with consistent column alignment
        'grid items-center cursor-pointer transition-colors gap-3 lg:gap-4',
        // Mobile: Icon + Details + Amount (3 columns)
        'grid-cols-[auto,1fr,auto]',
        // Tablet: Icon + Details + Amount + Scores (4 columns when scores present)
        features.showScores && transaction.scores ? 'md:grid-cols-[auto,1fr,auto,auto]' : 'md:grid-cols-[auto,1fr,auto]',
        // Desktop: Icon + Details + Date + Amount + Scores (5 columns)  
        features.showScores && transaction.scores 
          ? 'lg:grid-cols-[auto,2fr,minmax(80px,auto),auto,auto]'
          : 'lg:grid-cols-[auto,2fr,minmax(80px,auto),auto]',
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
      {/* Category Icon */}
      <div 
        className="w-10 h-10 lg:w-8 lg:h-8 rounded-xl flex items-center justify-center text-white font-semibold text-sm lg:text-xs flex-shrink-0"
        style={{ backgroundColor: transaction.category.color + '30' }}
      >
        {transaction.merchant.charAt(0).toUpperCase()}
      </div>

      {/* Transaction Details */}
      <div className="min-w-0">
        <div className="font-medium text-white truncate">{transaction.merchant}</div>
        <div className="flex items-center space-x-2 text-xs text-white/60">
          {features.showCategories && (
            <>
              <span className="truncate">{transaction.category.name}</span>
              {/* Show date on mobile inline with category */}
              <span className="lg:hidden">•</span>
              <span className="lg:hidden whitespace-nowrap">{formatDate(transaction.date)}</span>
            </>
          )}
          {!features.showCategories && (
            <span className="lg:hidden whitespace-nowrap">{formatDate(transaction.date)}</span>
          )}
        </div>
      </div>

      {/* Date - Desktop only, properly aligned */}
      <div className="hidden lg:flex lg:justify-end text-sm text-white/60 min-w-[80px] whitespace-nowrap">
        {formatDate(transaction.date)}
      </div>

      {/* Amount */}
      <div className={cn(
        'font-semibold text-right whitespace-nowrap',
        transaction.amount < 0 ? 'text-red-400' : 'text-green-400'
      )}>
        {transaction.amount < 0 ? '-' : '+'}{formatAmount(transaction.amount)}
      </div>

      {/* Scores - Only show when scores exist and feature is enabled */}
      {features.showScores && transaction.scores && (
        <div className="hidden md:flex space-x-1 flex-shrink-0">
          <div className="w-6 h-6 lg:w-5 lg:h-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-xs lg:text-[10px] text-green-400 font-semibold">
              {transaction.scores.health}
            </span>
          </div>
          <div className="w-6 h-6 lg:w-5 lg:h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-xs lg:text-[10px] text-blue-400 font-semibold">
              {transaction.scores.eco}
            </span>
          </div>
          <div className="w-6 h-6 lg:w-5 lg:h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-xs lg:text-[10px] text-purple-400 font-semibold">
              {transaction.scores.financial}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

TransactionItem.displayName = 'TransactionItem';

export default OptimizedTransactionList;