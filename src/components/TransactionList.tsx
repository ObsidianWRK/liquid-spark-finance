import React from 'react';
import TransactionItem from './TransactionItem';
import TransactionWithScores from './TransactionWithScores';
import { calculateTransactionScores } from '@/shared/utils/transactionScoring';
import { Transaction } from '@/shared/types/shared';
import { UnifiedCard } from '@/shared/ui/UnifiedCard';
import { Receipt, Calendar } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  enhanced?: boolean;
  isLoading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
}

const TransactionList = ({
  transactions,
  currency,
  enhanced = false,
  isLoading = false,
  onTransactionClick,
}: TransactionListProps) => {
  // Group transactions by date
  const groupedTransactions = transactions.reduce(
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
        day: 'numeric',
      });
    }
  };

  if (isLoading) {
    return (
      <UnifiedCard
        title="Recent Transactions"
        icon={Receipt}
        iconColor="#60a5fa"
        variant="default"
        className="h-full"
      >
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white/[0.02] rounded-xl border border-white/[0.08] animate-pulse"
            ></div>
          ))}
        </div>
      </UnifiedCard>
    );
  }

  if (transactions.length === 0) {
    return (
      <UnifiedCard
        title="Recent Transactions"
        icon={Receipt}
        iconColor="#60a5fa"
        variant="default"
        className="h-full"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="w-12 h-12 text-white/40 mb-4" />
          <p className="text-white/60 text-center">No transactions yet</p>
          <p className="text-white/40 text-sm text-center mt-1">
            Your transactions will appear here
          </p>
        </div>
      </UnifiedCard>
    );
  }

  return (
    <UnifiedCard
      title="Recent Transactions"
      subtitle={`${transactions.length} transactions`}
      icon={Receipt}
      iconColor="#60a5fa"
      variant="default"
      className="h-full"
    >
      <div className="space-y-6 max-h-[500px] overflow-y-auto">
        {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
          <div key={date}>
            <h3 className="text-white/70 text-sm font-medium mb-3 px-1">
              {formatDateHeader(date)}
            </h3>
            <div className="space-y-3">
                             {dateTransactions.map((transaction: Transaction, index: number) => (
                 <div 
                   key={transaction.id} 
                   className={index > 0 ? 'mt-3' : ''}
                   onClick={() => onTransactionClick?.(transaction)}
                 >
                  {enhanced ? (
                    <TransactionWithScores
                      transaction={transaction}
                      scores={calculateTransactionScores(transaction)}
                      currency={currency}
                    />
                  ) : (
                    <TransactionItem
                      transaction={transaction}
                      currency={currency}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </UnifiedCard>
  );
};

export default TransactionList;
