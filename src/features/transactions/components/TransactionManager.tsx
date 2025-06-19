import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus,
  Edit3,
  Trash2,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Tag,
  Settings,
  CheckSquare,
  Square,
  MoreHorizontal,
  TrendingUp,
  ArrowLeftRight,
  AlertCircle
} from 'lucide-react';
import { Transaction, TransactionCategory } from '@/types/transactions';
import { transactionService } from '@/services/transactionService';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface TransactionManagerProps {
  familyId: string;
  accountId?: string;
  compact?: boolean;
}

const TransactionManager = ({ familyId, accountId, compact = false }: TransactionManagerProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<TransactionCategory[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'merchant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  // Load transactions on component mount and when filters change
  useEffect(() => {
    loadTransactions();
  }, [familyId, accountId, searchQuery, selectedCategories, dateRange]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const filters: { 
        category?: string; 
        minAmount?: number; 
        maxAmount?: number; 
        dateRange?: { start: Date; end: Date };
        accountId?: string;
      } = {
        query: searchQuery || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        accountIds: accountId ? [accountId] : undefined,
        dateRange: dateRange || undefined,
        excludeTransfers: false
      };

      const [transactionData, analyticsData] = await Promise.all([
        transactionService.searchTransactions(familyId, filters),
        transactionService.generateAnalytics(familyId, 'month')
      ]);

      setTransactions(transactionData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'merchant':
          comparison = (a.merchantName || '').localeCompare(b.merchantName || '');
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [transactions, sortBy, sortOrder]);

  const handleSelectTransaction = useCallback((transactionId: string, selected: boolean) => {
    const newSelected = new Set(selectedTransactions);
    if (selected) {
      newSelected.add(transactionId);
    } else {
      newSelected.delete(transactionId);
    }
    setSelectedTransactions(newSelected);
    setShowBulkActions(newSelected.size > 0);
  }, [selectedTransactions]);

  const handleSelectAll = useCallback(() => {
    if (selectedTransactions.size === transactions.length) {
      setSelectedTransactions(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedTransactions(new Set(transactions.map(t => t.id)));
      setShowBulkActions(true);
    }
  }, [selectedTransactions.size, transactions]);

  const handleBulkUpdate = async (updates: { transactionIds: string[]; changes: Partial<Transaction> }) => {
    try {
      await transactionService.bulkUpdateTransactions(
        Array.from(selectedTransactions),
        updates.changes
      );
      await loadTransactions();
      setSelectedTransactions(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Bulk update failed:', error);
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.isTransfer) {
      return <ArrowLeftRight className="w-4 h-4 text-blue-400" />;
    }
    if (transaction.amount > 0) {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    }
    return <DollarSign className="w-4 h-4 text-white/70" />;
  };

  const getCategoryColor = (category: TransactionCategory) => {
    const colors: Record<TransactionCategory, string> = {
      income: 'bg-green-500/20 text-green-400 border-green-500/30',
      housing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      transportation: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      food: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      utilities: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      insurance: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      healthcare: 'bg-red-500/20 text-red-400 border-red-500/30',
      savings: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      debt_payments: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      entertainment: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      personal_care: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      shopping: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      education: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      gifts_donations: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      business: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      taxes: 'bg-red-600/20 text-red-300 border-red-600/30',
      investments: 'bg-green-600/20 text-green-300 border-green-600/30',
      fees: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      transfers: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      other: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[category] || colors.other;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/[0.05] rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/[0.05] rounded w-32"></div>
                  <div className="h-3 bg-white/[0.05] rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-white/[0.05] rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      {!compact && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <DollarSign className="w-7 h-7 text-blue-400" />
                Transactions
              </h2>
              <p className="text-white/60 mt-1">
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                {analytics && (
                  <span className="ml-2">
                    • ${Math.abs(analytics.totalExpenses).toLocaleString()} spent this month
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "liquid-glass-button px-4 py-2 rounded-xl transition-all flex items-center gap-2",
                  showFilters ? "bg-blue-500/20 text-blue-400" : "text-white/80 hover:text-white"
                )}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button className="liquid-glass-button px-4 py-2 rounded-xl text-white/80 hover:text-white transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>

              <button className="liquid-glass-button px-4 py-2 rounded-xl text-white/80 hover:text-white transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search transactions, merchants, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Categories</label>
                  <select
                    multiple
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm"
                  >
                    {Object.values(['income', 'housing', 'food', 'transportation', 'entertainment']).map(category => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Date Range</label>
                  <select className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm py-2 px-3">
                    <option value="">All Time</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Amount Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm py-2 px-3"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm py-2 px-3"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch id="exclude-transfers" />
                  <label htmlFor="exclude-transfers" className="text-sm text-white/80">
                    Exclude Transfers
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="pending-only" />
                  <label htmlFor="pending-only" className="text-sm text-white/80">
                    Pending Only
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Sort Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  {selectedTransactions.size === transactions.length ? (
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                  ) : selectedTransactions.size > 0 ? (
                    <Square className="w-4 h-4 text-blue-400 opacity-60" />
                  ) : (
                    <Square className="w-4 h-4 text-white/60" />
                  )}
                </button>
                {selectedTransactions.size > 0 && (
                  <span className="text-sm text-white/80">
                    {selectedTransactions.size} selected
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm py-1 px-2"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="merchant">Merchant</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded hover:bg-white/[0.05] transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-400 font-medium">
              {selectedTransactions.size} transaction{selectedTransactions.size !== 1 ? 's' : ''} selected
            </span>
            
            <div className="flex items-center gap-3">
              <select
                onChange={(e) => e.target.value && handleBulkUpdate({ changes: { category: e.target.value } })}
                className="bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm py-2 px-3"
              >
                <option value="">Set Category...</option>
                {Object.values(['income', 'housing', 'food', 'transportation', 'entertainment']).map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => handleBulkUpdate({ changes: { excludeFromBudget: true } })}
                className="px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/80 hover:text-white text-sm transition-colors"
              >
                Exclude from Budget
              </button>
              
              <button
                onClick={() => setSelectedTransactions(new Set())}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {sortedTransactions.length === 0 ? (
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-12 text-center">
            <DollarSign className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
            <p className="text-white/60">
              {searchQuery || selectedCategories.length > 0 
                ? 'Try adjusting your search or filters'
                : 'Your transactions will appear here once you link accounts'
              }
            </p>
          </div>
        ) : (
          sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={cn(
                "bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 hover:bg-white/[0.03] transition-all duration-300 backdrop-blur-md",
                selectedTransactions.has(transaction.id) && "ring-2 ring-blue-500/50 bg-blue-500/5"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Selection Checkbox */}
                <button
                  onClick={() => handleSelectTransaction(transaction.id, !selectedTransactions.has(transaction.id))}
                  className="flex-shrink-0"
                >
                  {selectedTransactions.has(transaction.id) ? (
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Square className="w-4 h-4 text-white/40 hover:text-white/60" />
                  )}
                </button>

                {/* Transaction Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center">
                    {getTransactionIcon(transaction)}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-white truncate">
                        {transaction.merchantName || transaction.description}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-lg border font-medium",
                          getCategoryColor(transaction.category)
                        )}>
                          {transaction.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-white/60">
                          {formatDate(transaction.date)}
                        </span>
                        {transaction.isTransfer && (
                          <span className="text-xs text-blue-400 flex items-center gap-1">
                            <ArrowLeftRight className="w-3 h-3" />
                            Transfer
                          </span>
                        )}
                        {transaction.isPending && (
                          <span className="text-xs text-orange-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-4">
                      <p className={cn(
                        "font-bold text-sm",
                        transaction.amount > 0 ? "text-green-400" : "text-white"
                      )}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      {transaction.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <Tag className="w-3 h-3 text-white/40" />
                          <span className="text-xs text-white/60">
                            {transaction.tags.slice(0, 2).join(', ')}
                            {transaction.tags.length > 2 && '...'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Menu */}
                    <div className="flex-shrink-0 ml-2">
                      <button className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>

                  {/* Transaction Description */}
                  {transaction.description !== transaction.merchantName && (
                    <p className="text-xs text-white/60 mt-2 truncate">
                      {transaction.description}
                    </p>
                  )}

                  {/* Notes */}
                  {transaction.notes && (
                    <p className="text-xs text-white/50 mt-1 italic">
                      {transaction.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionManager;