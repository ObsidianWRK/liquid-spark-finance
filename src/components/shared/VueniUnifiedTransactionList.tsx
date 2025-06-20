import React, { useState, useMemo, memo } from 'react';
import {
  VueniGlassCard,
  VueniButton,
  VueniStatusBadge,
} from './VueniDesignSystem';
import { SharedScoreCircle } from './SharedScoreCircle';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Eye,
  MoreVertical,
} from 'lucide-react';

export type TransactionVariant =
  | 'default'
  | 'apple'
  | 'clean'
  | 'polished'
  | 'enterprise'
  | 'mobile';

export interface VueniTransaction {
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
  description?: string;
  reference?: string;
  tags?: string[];
}

export interface VueniTransactionFeatures {
  showScores?: boolean;
  showCategories?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  compactMode?: boolean;
  animationsEnabled?: boolean;
  groupByDate?: boolean;
  virtualScrolling?: boolean;
  exportEnabled?: boolean;
}

export interface VueniUnifiedTransactionListProps {
  transactions: VueniTransaction[];
  variant?: TransactionVariant;
  features?: VueniTransactionFeatures;
  currency?: string;
  className?: string;
  onTransactionClick?: (transaction: VueniTransaction) => void;
  onTransactionAction?: (action: string, transaction: VueniTransaction) => void;
  onExportData?: () => void;
}

const defaultFeatures: VueniTransactionFeatures = {
  showScores: true,
  showCategories: true,
  searchable: true,
  filterable: true,
  compactMode: false,
  animationsEnabled: true,
  groupByDate: true,
  virtualScrolling: false,
  exportEnabled: true,
};

// Variant-specific styling configurations
const variantConfigs = {
  default: {
    containerClass: 'space-y-1',
    itemClass:
      'flex items-center gap-4 p-4 hover:bg-white/[0.02] rounded-lg transition-all duration-200 cursor-pointer',
    headerClass: 'text-xl font-semibold text-white',
    dateHeaderClass: 'text-sm font-medium text-white/60 mb-3 px-2',
  },
  apple: {
    containerClass: 'space-y-2',
    itemClass:
      'flex items-center gap-3 p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-all duration-300 cursor-pointer border border-white/[0.05]',
    headerClass: 'text-xl font-semibold text-white',
    dateHeaderClass:
      'text-sm font-medium text-white/70 mb-4 px-3 uppercase tracking-wide',
  },
  clean: {
    containerClass: 'space-y-0 divide-y divide-white/[0.05]',
    itemClass:
      'flex items-center gap-4 p-4 hover:bg-white/[0.01] transition-all duration-150 cursor-pointer first:rounded-t-lg last:rounded-b-lg',
    headerClass: 'text-lg font-medium text-white',
    dateHeaderClass: 'text-sm font-medium text-white/50 mb-2 px-4',
  },
  polished: {
    containerClass: 'space-y-3',
    itemClass:
      'flex items-center gap-4 p-5 bg-gradient-to-r from-white/[0.02] to-transparent hover:from-white/[0.04] rounded-lg border-l-2 border-transparent hover:border-blue-500/50 transition-all duration-200 cursor-pointer',
    headerClass: 'text-xl font-bold text-white',
    dateHeaderClass:
      'text-sm font-semibold text-white/60 mb-3 px-5 border-b border-white/[0.1] pb-2',
  },
  enterprise: {
    containerClass: 'space-y-0',
    itemClass:
      'flex items-center gap-6 p-4 hover:bg-white/[0.02] transition-all duration-100 cursor-pointer border-b border-white/[0.05] last:border-b-0',
    headerClass: 'text-lg font-semibold text-white tracking-tight',
    dateHeaderClass:
      'text-xs font-medium text-white/50 mb-2 px-4 uppercase tracking-wider',
  },
  mobile: {
    containerClass: 'space-y-2',
    itemClass:
      'flex items-center gap-3 p-3 bg-white/[0.04] hover:bg-white/[0.06] rounded-lg transition-all duration-200 cursor-pointer active:scale-98',
    headerClass: 'text-lg font-semibold text-white',
    dateHeaderClass: 'text-sm font-medium text-white/60 mb-3 px-3',
  },
};

const VueniTransactionItem = memo(
  ({
    transaction,
    variant = 'default',
    features = defaultFeatures,
    currency = 'USD',
    onClick,
    onAction,
  }: {
    transaction: VueniTransaction;
    variant: TransactionVariant;
    features: VueniTransactionFeatures;
    currency: string;
    onClick?: (transaction: VueniTransaction) => void;
    onAction?: (action: string, transaction: VueniTransaction) => void;
  }) => {
    const config = variantConfigs[variant];

    const formatAmount = (amount: number) => {
      const formatted = Math.abs(amount).toLocaleString('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
      });
      return amount < 0 ? `-${formatted}` : `+${formatted}`;
    };

    const getAmountColor = (amount: number) => {
      if (amount > 0) return '#10B981'; // Green for income
      if (amount < 0) return '#EF4444'; // Red for expenses
      return '#6B7280'; // Gray for neutral
    };

    const getStatusIcon = (amount: number) => {
      if (amount > 0) return <TrendingUp className="w-4 h-4" />;
      if (amount < 0) return <TrendingDown className="w-4 h-4" />;
      return <Minus className="w-4 h-4" />;
    };

    return (
      <div
        className={`group ${config.itemClass} ${features.animationsEnabled ? 'transition-all duration-200' : ''}`}
        onClick={() => onClick?.(transaction)}
      >
        {/* Status Indicator */}
        <div className="flex-shrink-0">
          <VueniStatusBadge
            status={
              transaction.status === 'completed'
                ? 'success'
                : transaction.status === 'pending'
                  ? 'warning'
                  : 'error'
            }
            variant={variant === 'enterprise' ? 'minimal' : 'default'}
          />
        </div>

        {/* Category Icon */}
        {variant !== 'clean' && (
          <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
            <div
              className="w-4 h-4 flex items-center justify-center"
              style={{
                color:
                  transaction.category.color ||
                  getAmountColor(transaction.amount),
              }}
            >
              {getStatusIcon(transaction.amount)}
            </div>
          </div>
        )}

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium text-white truncate group-hover:text-blue-300 transition-colors ${
              features.compactMode ? 'text-sm' : 'text-base'
            }`}
          >
            {transaction.merchant}
          </h4>
          <div
            className={`flex items-center gap-2 mt-1 ${features.compactMode ? 'text-xs' : 'text-sm'}`}
          >
            {features.showCategories && (
              <>
                <span className="text-white/60">
                  {transaction.category.name}
                </span>
                <span className="text-white/40">•</span>
              </>
            )}
            <span className="text-white/40">
              {new Date(transaction.date).toLocaleDateString()}
            </span>
            {transaction.reference && variant === 'enterprise' && (
              <>
                <span className="text-white/40">•</span>
                <span className="text-white/40 text-xs">
                  {transaction.reference}
                </span>
              </>
            )}
          </div>
          {transaction.description &&
            (variant === 'polished' || variant === 'enterprise') && (
              <p className="text-xs text-white/50 mt-1 truncate">
                {transaction.description}
              </p>
            )}
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <div
            className={`font-semibold ${features.compactMode ? 'text-base' : 'text-lg'}`}
            style={{ color: getAmountColor(transaction.amount) }}
          >
            {formatAmount(transaction.amount)}
          </div>
          {!features.compactMode && (
            <div className="text-xs text-white/40 mt-1 capitalize">
              {transaction.status}
            </div>
          )}
        </div>

        {/* Score Circles */}
        {features.showScores && transaction.scores && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <SharedScoreCircle
              scores={[
                { value: transaction.scores.health, type: 'health' as const },
                { value: transaction.scores.eco, type: 'eco' as const },
                {
                  value: transaction.scores.financial,
                  type: 'financial' as const,
                },
              ]}
              size={features.compactMode ? 'small' : 'medium'}
              variant={variant}
            />
          </div>
        )}

        {/* Actions */}
        {(variant === 'enterprise' || variant === 'polished') && (
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction?.('view-details', transaction);
              }}
              className="p-1 rounded hover:bg-white/[0.1] transition-colors"
            >
              <Eye className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction?.('more-options', transaction);
              }}
              className="p-1 rounded hover:bg-white/[0.1] transition-colors ml-1"
            >
              <MoreVertical className="w-4 h-4 text-white/60" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

export const VueniUnifiedTransactionList: React.FC<VueniUnifiedTransactionListProps> =
  memo(
    ({
      transactions,
      variant = 'default',
      features = defaultFeatures,
      currency = 'USD',
      className,
      onTransactionClick,
      onTransactionAction,
      onExportData,
    }) => {
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedCategory, setSelectedCategory] = useState('all');
      const [selectedStatus, setSelectedStatus] = useState('all');

      const config = variantConfigs[variant];
      const activeFeatures = { ...defaultFeatures, ...features };

      // Process and filter transactions
      const processedTransactions = useMemo(() => {
        const filtered = transactions.filter((transaction) => {
          const matchesSearch =
            !activeFeatures.searchable ||
            transaction.merchant
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            transaction.category.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          const matchesCategory =
            selectedCategory === 'all' ||
            transaction.category.name === selectedCategory;

          const matchesStatus =
            selectedStatus === 'all' || transaction.status === selectedStatus;

          return matchesSearch && matchesCategory && matchesStatus;
        });

        // Sort by date (newest first)
        return filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }, [
        transactions,
        searchQuery,
        selectedCategory,
        selectedStatus,
        activeFeatures.searchable,
      ]);

      // Group transactions by date
      const groupedTransactions = useMemo(() => {
        if (!activeFeatures.groupByDate) {
          return { 'All Transactions': processedTransactions };
        }

        return processedTransactions.reduce(
          (groups, transaction) => {
            const date = new Date(transaction.date).toDateString();
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(transaction);
            return groups;
          },
          {} as Record<string, VueniTransaction[]>
        );
      }, [processedTransactions, activeFeatures.groupByDate]);

      const formatDateHeader = (dateString: string) => {
        if (!activeFeatures.groupByDate) return dateString;

        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
          return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
          return 'Yesterday';
        } else {
          return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          });
        }
      };

      const categories = useMemo(() => {
        const cats = Array.from(
          new Set(transactions.map((t) => t.category.name))
        );
        return ['all', ...cats];
      }, [transactions]);

      const statuses = ['all', 'completed', 'pending', 'failed'];

      return (
        <VueniGlassCard
          variant={variant === 'apple' ? 'prominent' : 'default'}
          className={className}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={config.headerClass}>
              Transactions ({processedTransactions.length})
            </h2>
            <div className="flex items-center gap-3">
              {activeFeatures.exportEnabled && (
                <VueniButton variant="glass" size="sm" onClick={onExportData}>
                  <Download className="w-4 h-4" />
                </VueniButton>
              )}
              {activeFeatures.filterable && (
                <VueniButton variant="glass" size="sm">
                  <Filter className="w-4 h-4" />
                </VueniButton>
              )}
            </div>
          </div>

          {/* Filters */}
          {(activeFeatures.searchable || activeFeatures.filterable) && (
            <div className="flex flex-col gap-4 mb-6 sm:flex-row">
              {/* Search */}
              {activeFeatures.searchable && (
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              )}

              {/* Filters */}
              {activeFeatures.filterable && (
                <div className="flex gap-3">
                  {/* Category Filter */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all min-w-[140px]"
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-gray-900"
                        >
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all min-w-[120px]"
                    >
                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-gray-900"
                        >
                          {status === 'all'
                            ? 'All Status'
                            : status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transaction Groups */}
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(
              ([date, dateTransactions]) => (
                <div key={date}>
                  {activeFeatures.groupByDate && (
                    <h3 className={config.dateHeaderClass}>
                      {formatDateHeader(date)}
                    </h3>
                  )}
                  <div className={config.containerClass}>
                    {dateTransactions.map((transaction) => (
                      <VueniTransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        variant={variant}
                        features={activeFeatures}
                        currency={currency}
                        onClick={onTransactionClick}
                        onAction={onTransactionAction}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Empty State */}
          {processedTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.06] flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60 mb-2">No transactions found</p>
              <p className="text-white/40 text-sm">
                {searchQuery ||
                selectedCategory !== 'all' ||
                selectedStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Your transactions will appear here'}
              </p>
            </div>
          )}
        </VueniGlassCard>
      );
    }
  );

// Preset configurations for easy deployment
export const transactionListPresets = {
  dashboard: {
    variant: 'default' as TransactionVariant,
    features: {
      showScores: true,
      showCategories: true,
      searchable: false,
      filterable: false,
      compactMode: true,
      groupByDate: true,
      exportEnabled: false,
    },
  },
  fullFeatured: {
    variant: 'polished' as TransactionVariant,
    features: {
      showScores: true,
      showCategories: true,
      searchable: true,
      filterable: true,
      compactMode: false,
      groupByDate: true,
      exportEnabled: true,
    },
  },
  mobile: {
    variant: 'mobile' as TransactionVariant,
    features: {
      showScores: false,
      showCategories: true,
      searchable: true,
      filterable: false,
      compactMode: true,
      groupByDate: true,
      exportEnabled: false,
    },
  },
  enterprise: {
    variant: 'enterprise' as TransactionVariant,
    features: {
      showScores: true,
      showCategories: true,
      searchable: true,
      filterable: true,
      compactMode: false,
      groupByDate: false,
      exportEnabled: true,
    },
  },
};

VueniTransactionItem.displayName = 'VueniTransactionItem';
VueniUnifiedTransactionList.displayName = 'VueniUnifiedTransactionList';

export default VueniUnifiedTransactionList;
