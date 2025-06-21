import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { format } from 'date-fns';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { SharedScoreCircle } from '@/components/shared/SharedScoreCircle';
import { cn } from '@/shared/lib/utils';
import { vueniTheme } from '@/theme/unified';

// Unified Transaction List that consolidates:
// - TransactionList.tsx
// - VueniUnifiedTransactionList.tsx
// - OptimizedTransactionList.tsx
// - EnterpriseTransactionView.tsx
// - TransactionMain.tsx
// - TransactionWithScores.tsx

export interface Transaction {
  id: string;
  merchant: string;
  category: {
    name: string;
    color: string;
  };
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  scores?: {
    health: number;
    eco: number;
    financial: number;
  };
  shipping?: {
    trackingNumber: string;
    provider: string;
    status: string;
  };
}

export type TransactionVariant =
  | 'default'
  | 'clean'
  | 'enterprise'
  | 'apple'
  | 'modern'
  | 'compact';
export type SortField = 'date' | 'amount' | 'merchant' | 'category';
export type SortDirection = 'asc' | 'desc';

interface TransactionFeatures {
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  groupByDate?: boolean;
  showCategories?: boolean;
  showScores?: boolean;
  showStatus?: boolean;
  exportable?: boolean;
  compactMode?: boolean;
  showShipping?: boolean;
  virtualize?: boolean;
}

interface UnifiedTransactionListProps {
  transactions: Transaction[];
  variant?: TransactionVariant;
  currency?: string;
  features?: TransactionFeatures;
  onTransactionClick?: (transaction: Transaction) => void;
  onCategoryFilter?: (category: string) => void;
  onExport?: () => void;
  className?: string;
  maxHeight?: string;
  isLoading?: boolean;
}

const ROW_HEIGHT = 72;
const VIRTUALIZE_THRESHOLD = 500;

const useAvailableHeight = () => {
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);

  useEffect(() => {
    const calculate = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        setAvailableHeight(null);
        return;
      }
      const used = 96 + 120 + 64 + 40;
      setAvailableHeight(Math.max(400, window.innerHeight - used));
    };

    calculate();
    const handle = () => calculate();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return availableHeight;
};

const SkeletonRow = () => (
  <div className="flex items-center justify-between py-3 px-4 animate-pulse">
    <div className="w-10 h-10 rounded-lg bg-white/10" />
    <div className="flex-1 ml-3 space-y-1">
      <div className="h-3 w-24 bg-white/10 rounded" />
      <div className="h-2 w-16 bg-white/10 rounded" />
    </div>
    <div className="h-3 w-16 bg-white/10 rounded" />
  </div>
);

interface RowItemSeparator {
  type: 'separator';
  dateKey: string;
  date: Date;
}

interface RowItemTransaction {
  type: 'transaction';
  tx: Transaction;
}

type RowItem = RowItemSeparator | RowItemTransaction;

interface VariantStyles {
  container: string;
  item: string;
  spacing: string;
}

interface RowRendererData {
  items: RowItem[];
  onClick?: (tx: Transaction) => void;
  features: TransactionFeatures;
  styles: VariantStyles;
}

const RowRenderer: React.FC<ListChildComponentProps<RowRendererData>> = ({ index, style, data }) => {
  const item = data.items[index];
  if (!item) return null;
  if (item.type === 'separator') {
    return (
      <div style={style} className="px-4 py-2 text-white/60 text-sm">
        {format(item.date, 'PPPP')}
      </div>
    );
  }
  return (
    <div style={style}>
      <TransactionItem
        transaction={item.tx}
        currency="USD"
        features={data.features}
        styles={data.styles}
        onClick={() => data.onClick?.(item.tx)}
      />
    </div>
  );
};

const defaultFeatures: TransactionFeatures = {
  searchable: true,
  filterable: true,
  sortable: true,
  groupByDate: true,
  showCategories: true,
  showScores: true,
  showStatus: true,
  exportable: false,
  compactMode: false,
  showShipping: false,
  virtualize: false,
};

export const UnifiedTransactionList = React.memo<UnifiedTransactionListProps>(
  ({
    transactions,
    variant = 'default',
    currency = 'USD',
    features = defaultFeatures,
    onTransactionClick,
    onCategoryFilter,
    onExport,
    className = '',
    maxHeight = '32rem',
    isLoading = false,
  }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const mergedFeatures = { ...defaultFeatures, ...features };

    // Memoized filtered and sorted transactions
    const processedTransactions = useMemo(() => {
      let filtered = transactions;

      // Search filter
      if (mergedFeatures.searchable && searchTerm) {
        filtered = filtered.filter(
          (t) =>
            t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Category filter
      if (mergedFeatures.filterable && selectedCategory !== 'all') {
        filtered = filtered.filter((t) => t.category.name === selectedCategory);
      }

      // Sort
      if (mergedFeatures.sortable) {
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortField) {
            case 'date':
              comparison =
                new Date(a.date).getTime() - new Date(b.date).getTime();
              break;
            case 'amount':
              comparison = Math.abs(a.amount) - Math.abs(b.amount);
              break;
            case 'merchant':
              comparison = a.merchant.localeCompare(b.merchant);
              break;
            case 'category':
              comparison = a.category.name.localeCompare(b.category.name);
              break;
          }

          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }

      return filtered;
    }, [
      transactions,
      searchTerm,
      selectedCategory,
      sortField,
      sortDirection,
      mergedFeatures,
    ]);

    // Memoized grouped transactions for date grouping
    const groupedTransactions = useMemo(() => {
      if (!mergedFeatures.groupByDate) return { ['']: processedTransactions };

      return processedTransactions.reduce(
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
    }, [processedTransactions, mergedFeatures.groupByDate]);

    // Memoized categories for filter dropdown
    const categories = useMemo(() => {
      const uniqueCategories = Array.from(
        new Set(transactions.map((t) => t.category.name))
      );
      return uniqueCategories;
    }, [transactions]);

    const buildRowItems = useCallback(
      (txs: Transaction[]): RowItem[] => {
        const sorted = [...txs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const items: RowItem[] = [];
        let lastDateKey = '';
        sorted.forEach((tx) => {
          const date = new Date(tx.date);
          const dateKey = format(date, 'yyyy-MM-dd');
          if (mergedFeatures.groupByDate && dateKey !== lastDateKey) {
            items.push({ type: 'separator', dateKey, date });
            lastDateKey = dateKey;
          }
          items.push({ type: 'transaction', tx });
        });
        return items;
      },
      [mergedFeatures.groupByDate]
    );

    const items = useMemo(() => buildRowItems(processedTransactions), [processedTransactions, buildRowItems]);
    const availableHeight = useAvailableHeight();
    const shouldVirtualize =
      mergedFeatures.virtualize &&
      (items.length > VIRTUALIZE_THRESHOLD ||
        (availableHeight && items.length > 20));

    // Optimized event handlers
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      },
      []
    );

    const handleCategoryChange = useCallback(
      (category: string) => {
        setSelectedCategory(category);
        onCategoryFilter?.(category);
      },
      [onCategoryFilter]
    );

    const handleTransactionClick = useCallback(
      (transaction: Transaction) => {
        onTransactionClick?.(transaction);
      },
      [onTransactionClick]
    );

    const handleSort = useCallback(
      (field: SortField) => {
        if (sortField === field) {
          setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
          setSortField(field);
          setSortDirection('desc');
        }
      },
      [sortField]
    );

    // Variant-specific styles
    const getVariantStyles = () => {
      switch (variant) {
        case 'clean':
          return {
            container: 'bg-transparent border-0',
            item: 'hover:bg-white/5 border-b border-white/5 last:border-b-0',
            spacing: 'py-3 px-4',
          };
        case 'enterprise':
          return {
            container: 'bg-slate-900/50 border border-slate-700',
            item: 'hover:bg-slate-800/50 border-b border-slate-700 last:border-b-0',
            spacing: 'py-4 px-6',
          };
        case 'apple':
          return {
            container: 'bg-white/5 backdrop-blur-md border border-white/10',
            item: 'hover:bg-white/8 border-b border-white/10 last:border-b-0',
            spacing: 'py-4 px-5',
          };
        case 'modern':
          return {
            container:
              'bg-gradient-to-b from-white/10 to-white/5 border border-white/20',
            item: 'hover:bg-white/10 border-b border-white/10 last:border-b-0',
            spacing: 'py-4 px-5',
          };
        case 'compact':
          return {
            container: 'bg-white/5 border border-white/10',
            item: 'hover:bg-white/8 border-b border-white/5 last:border-b-0',
            spacing: 'py-2 px-3',
          };
        default:
          return {
            container: 'bg-white/5 border border-white/20',
            item: 'hover:bg-white/8 border-b border-white/10 last:border-b-0',
            spacing: 'py-3 px-4',
          };
      }
    };

    const variantStyles = getVariantStyles();

    if (isLoading) {
      return (
        <UniversalCard
          variant="glass"
          className={cn('overflow-hidden', className, variantStyles.container)}
        >
          <div className="p-4 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </UniversalCard>
      );
    }

    const formatDate = (date: string) => {
      const dateObj = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (dateObj.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (dateObj.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
      }
    };

    return (
      <UniversalCard
        variant="glass"
        className={cn('overflow-hidden', className, variantStyles.container)}
      >
        {/* Header with Search and Filters */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn(
                'font-semibold text-white',
                mergedFeatures.compactMode ? 'text-base' : 'text-lg'
              )}
            >
              Transactions
            </h3>
            <div className="flex items-center gap-2">
              <div className="text-sm text-white/60">
                {processedTransactions.length} of {transactions.length}
              </div>

              {mergedFeatures.exportable && onExport && (
                <button
                  onClick={onExport}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Download className="w-4 h-4 text-white/70" />
                </button>
              )}

              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isCollapsed ? (
                  <Eye className="w-4 h-4 text-white/70" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/70" />
                )}
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              {/* Search and Filter Row */}
              <div className="flex gap-3 mb-3">
                {/* Search */}
                {mergedFeatures.searchable && (
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
                {mergedFeatures.filterable && (
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg py-2 pl-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
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
              {mergedFeatures.sortable && (
                <div className="flex gap-2">
                  {(['date', 'amount', 'merchant', 'category'] as const).map(
                    (field) => (
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
                        {sortField === field &&
                          (sortDirection === 'asc' ? (
                            <TrendingUp className="inline ml-1 w-3 h-3" />
                          ) : (
                            <TrendingDown className="inline ml-1 w-3 h-3" />
                          ))}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Transaction List */}
        {!isCollapsed && (
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {shouldVirtualize ? (
              <List
                height={
                  availableHeight ||
                  Math.min(items.length * ROW_HEIGHT, parseInt(maxHeight))
                }
                itemCount={items.length}
                itemSize={ROW_HEIGHT}
                itemData={{ items, onClick: handleTransactionClick, features: mergedFeatures, styles: variantStyles }}
                width="100%"
              >
                {RowRenderer}
              </List>
            ) : (
              Object.entries(groupedTransactions).map(([date, groupTransactions]) => (
                <div key={date}>
                  {mergedFeatures.groupByDate && date && (
                    <div className="sticky top-0 bg-white/5 backdrop-blur-md px-4 py-2 border-b border-white/10">
                      <div className="text-sm font-medium text-white/80">
                        {formatDate(date)}
                      </div>
                    </div>
                  )}
                  {groupTransactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      currency={currency}
                      features={mergedFeatures}
                      styles={variantStyles}
                      onClick={() => handleTransactionClick(transaction)}
                    />
                  ))}
                </div>
              ))
            )}

            {processedTransactions.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white/40" />
                </div>
                <div className="text-white/60 mb-2">No transactions found</div>
                <div className="text-sm text-white/40">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Your transactions will appear here'}
                </div>
              </div>
            )}
          </div>
        )}
      </UniversalCard>
    );
  }
);

UnifiedTransactionList.displayName = 'UnifiedTransactionList';

// Memoized Transaction Item Component
const TransactionItem = React.memo<{
  transaction: Transaction;
  currency: string;
  features: TransactionFeatures;
  styles: VariantStyles;
  onClick: () => void;
}>(({ transaction, currency, features, styles, onClick }) => {
  const formatAmount = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return vueniTheme.colors.semantic.financial.positive;
    if (amount < 0) return vueniTheme.colors.semantic.financial.negative;
    return vueniTheme.colors.semantic.financial.neutral;
  };

  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case 'completed':
        return vueniTheme.colors.semantic.status.success;
      case 'pending':
        return vueniTheme.colors.semantic.status.warning;
      case 'failed':
        return vueniTheme.colors.semantic.status.error;
      default:
        return vueniTheme.colors.palette.neutral;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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
        {/* Status Indicator */}
        {features.showStatus && (
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              backgroundColor: getStatusIndicatorColor(transaction.status),
            }}
          />
        )}

        {/* Category Icon */}
        <div
          className={cn(
            'rounded-lg flex items-center justify-center text-white font-semibold text-sm',
            features.compactMode ? 'w-8 h-8 text-xs' : 'w-10 h-10'
          )}
          style={{ backgroundColor: transaction.category.color + '30' }}
        >
          {(
            (transaction as any).merchant ??
            (transaction as any).merchantName ??
            '?'
          )
            .charAt(0)
            .toUpperCase()}
        </div>

        {/* Transaction Details */}
        <div className="space-y-1">
          <div
            className={cn(
              'font-medium text-white',
              features.compactMode ? 'text-sm' : 'text-base'
            )}
          >
            {transaction.merchant}
          </div>
          <div className="flex items-center space-x-2">
            {features.showCategories && (
              <span className="text-xs text-white/60">
                {transaction.category.name}
              </span>
            )}
            <span className="text-xs text-white/60">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="text-right space-y-1">
        {/* Amount */}
        <div
          className={cn(
            'font-semibold',
            features.compactMode ? 'text-sm' : 'text-base'
          )}
          style={{ color: getAmountColor(transaction.amount) }}
        >
          {formatAmount(transaction.amount)}
        </div>

        {/* Scores */}
        {features.showScores && transaction.scores && (
          <div className="flex space-x-1">
            <SharedScoreCircle
              score={transaction.scores.health}
              type="health"
              size={features.compactMode ? 'sm' : 'md'}
            />
            <SharedScoreCircle
              score={transaction.scores.eco}
              type="eco"
              size={features.compactMode ? 'sm' : 'md'}
            />
            <SharedScoreCircle
              score={transaction.scores.financial}
              type="financial"
              size={features.compactMode ? 'sm' : 'md'}
            />
          </div>
        )}
      </div>

      {features.showShipping && transaction.shipping && (
        <div className="mt-2 flex items-center justify-between text-xs text-white/60">
          <span className="font-mono truncate">
            {transaction.shipping.trackingNumber}
          </span>
          <span>
            {transaction.shipping.provider}
            {transaction.shipping.status && ` • ${transaction.shipping.status}`}
          </span>
        </div>
      )}
    </div>
  );
});

TransactionItem.displayName = 'TransactionItem';
export { TransactionItem, defaultFeatures };
export default UnifiedTransactionList;
