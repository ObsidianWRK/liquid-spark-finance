import React from 'react';
import TransactionItem from './TransactionItem';
import TransactionWithScores from './TransactionWithScores';
import { calculateTransactionScores } from '@/utils/transactionScoring';
import { Transaction } from '@/types/shared';

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  enhanced?: boolean;
}

const TransactionList = ({ transactions, currency, enhanced = false }: TransactionListProps) => {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

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

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
        <div key={date}>
          <h3 className="text-white/70 text-sm font-medium mb-3 px-4">
            {formatDateHeader(date)}
          </h3>
          <div className="space-y-3 px-4">
            {dateTransactions.map((transaction, index) => {
              const TransactionComponent = enhanced ? (
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
              );

              return (
                <div key={transaction.id} className={index > 0 ? "mt-3" : ""}>
                  {TransactionComponent}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
