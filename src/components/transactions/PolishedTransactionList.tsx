import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight, Truck, Package, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
  reference?: string;
  shipping?: {
    trackingNumber: string;
    provider: 'UPS' | 'FedEx' | 'USPS';
    status: 'In Transit' | 'Delivered' | 'Out for Delivery';
    estimatedDelivery?: string;
  };
}

interface PolishedTransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  className?: string;
}

const PolishedTransactionList: React.FC<PolishedTransactionListProps> = ({
  transactions,
  onTransactionClick,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Smart date formatting
  const formatDate = (dateString: string) => {
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
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Format currency with proper signs
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  // Get shipping status icon
  const getShippingIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'Out for Delivery':
        return <Truck className="w-3 h-3 text-blue-500" />;
      case 'In Transit':
        return <Package className="w-3 h-3 text-orange-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  // Filter transactions based on search
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((groups, transaction) => {
      const dateKey = formatDate(transaction.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }, [filteredTransactions]);

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <div
      onClick={() => onTransactionClick?.(transaction)}
      className="group flex items-center gap-4 p-4 hover:bg-white/[0.02] rounded-lg transition-all duration-200 cursor-pointer"
    >
      {/* Status Indicator */}
      <div className={cn(
        'w-2 h-2 rounded-full flex-shrink-0',
        transaction.status === 'completed' && 'bg-green-500',
        transaction.status === 'pending' && 'bg-yellow-500',
        transaction.status === 'failed' && 'bg-red-500'
      )} />

      {/* Merchant & Category */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-white text-sm truncate group-hover:text-blue-300 transition-colors">
            {transaction.merchant}
          </h4>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>{transaction.category}</span>
          <span>•</span>
          <span>{transaction.time}</span>
          {transaction.paymentMethod && (
            <>
              <span>•</span>
              <span>{transaction.paymentMethod}</span>
            </>
          )}
        </div>

        {/* Shipping Information */}
        {transaction.shipping && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-white/[0.02] rounded-md">
            {getShippingIcon(transaction.shipping.status)}
            <span className="text-xs text-white/70">
              {transaction.shipping.status}
            </span>
            {transaction.shipping.estimatedDelivery && transaction.shipping.status !== 'Delivered' && (
              <>
                <span className="text-xs text-white/40">•</span>
                <span className="text-xs text-white/40">
                  ETA {new Date(transaction.shipping.estimatedDelivery).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <div className={cn(
          'font-semibold text-sm',
          transaction.amount > 0 ? 'text-green-400' : 'text-white'
        )}>
          {formatAmount(transaction.amount)}
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
    </div>
  );

  return (
    <div className={cn('bg-black text-white', className)}>
      {/* Header */}
      <div className="p-6 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Transactions</h2>
          <button className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-colors">
            <Filter className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Transaction Groups */}
      <div className="max-h-[600px] overflow-y-auto">
        {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
          <div key={date} className="border-b border-white/[0.04] last:border-b-0">
            <div className="px-6 py-3 bg-white/[0.01]">
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">
                {date}
              </h3>
            </div>
            <div className="px-2">
              {dateTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
            <Search className="w-8 h-8 text-white/40" />
          </div>
          <p className="text-white/60 mb-2">No transactions found</p>
          <p className="text-white/40 text-sm">
            {searchQuery ? 'Try adjusting your search terms' : 'Your transactions will appear here'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PolishedTransactionList; 