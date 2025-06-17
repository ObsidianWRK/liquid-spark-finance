import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { colors } from '@/theme/colors';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
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

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  showFilters?: boolean;
  className?: string;
}

const ScoreCircle = ({ score, type }: { score: number; type: 'health' | 'eco' | 'financial' }) => {
  const getColor = () => {
    switch (type) {
      case 'health': return colors.accent.pink;
      case 'eco': return colors.accent.green;
      case 'financial': return colors.accent.blue;
      default: return colors.accent.blue;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'health': return 'H';
      case 'eco': return 'E';
      case 'financial': return 'F';
      default: return 'F';
    }
  };

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke={getColor()}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 12}`}
          strokeDashoffset={`${2 * Math.PI * 12 * (1 - score / 100)}`}
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
        {getLabel()}
      </span>
    </div>
  );
};

const TransactionItem = ({ 
  transaction, 
  onClick 
}: { 
  transaction: Transaction; 
  onClick?: (transaction: Transaction) => void;
}) => {
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return colors.financial.positive;
    if (amount < 0) return colors.financial.negative;
    return colors.financial.neutral;
  };

  const getStatusIcon = (amount: number) => {
    if (amount > 0) return <TrendingUp className="w-4 h-4" />;
    if (amount < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div 
      className="group flex items-center gap-4 p-4 hover:bg-white/[0.02] rounded-lg transition-all duration-200 cursor-pointer"
      onClick={() => onClick?.(transaction)}
    >
      {/* Status Indicator */}
      <div 
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ 
          backgroundColor: transaction.status === 'completed' 
            ? colors.status.success 
            : transaction.status === 'pending' 
            ? colors.status.warning 
            : colors.status.error 
        }}
      />

      {/* Category Icon Placeholder */}
      <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
        <div 
          className="w-4 h-4 flex items-center justify-center"
          style={{ color: getAmountColor(transaction.amount) }}
        >
          {getStatusIcon(transaction.amount)}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">
          {transaction.merchant}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-white/60">{transaction.category}</span>
          <span className="text-sm text-white/40">•</span>
          <span className="text-sm text-white/40">
            {new Date(transaction.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <div 
          className="text-lg font-semibold"
          style={{ color: getAmountColor(transaction.amount) }}
        >
          {formatAmount(transaction.amount)}
        </div>
        <div className="text-xs text-white/40 mt-1 capitalize">
          {transaction.status}
        </div>
      </div>

      {/* Score Circles */}
      {transaction.scores && (
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <ScoreCircle score={transaction.scores.health} type="health" />
          <ScoreCircle score={transaction.scores.eco} type="eco" />
          <ScoreCircle score={transaction.scores.financial} type="financial" />
        </div>
      )}
    </div>
  );
};

const TransactionList = ({ 
  transactions, 
  onTransactionClick,
  showFilters = true,
  className 
}: TransactionListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Group transactions by date
  const groupedTransactions = React.useMemo(() => {
    const filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.reduce((groups, transaction) => {
      const date = new Date(transaction.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }, [transactions, searchQuery, selectedCategory]);

  const formatDateHeader = (dateString: string) => {
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
        day: 'numeric'
      });
    }
  };

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(transactions.map(t => t.category)));
    return ['all', ...cats];
  }, [transactions]);

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Transactions</h2>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] transition-colors">
            <Download className="w-4 h-4 text-white/70" />
          </button>
          <button className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] transition-colors">
            <Filter className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-4 mb-6">
          {/* Search */}
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

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all min-w-[140px]"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-900">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Transaction Groups */}
      <div className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-white/60 mb-3 px-2">
              {formatDateHeader(date)}
            </h3>
            <div className="space-y-1">
              {dateTransactions.map((transaction) => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  onClick={onTransactionClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(groupedTransactions).length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.06] flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white/40" />
          </div>
          <p className="text-white/60 mb-2">No transactions found</p>
          <p className="text-white/40 text-sm">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Your transactions will appear here'
            }
          </p>
        </div>
      )}
    </Card>
  );
};

export default TransactionList; 