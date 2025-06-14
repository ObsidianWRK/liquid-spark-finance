
import React from 'react';
import TransactionItem from './TransactionItem';
import TransactionWithScores from './TransactionWithScores';
import { calculateTransactionScores } from '@/utils/transactionScoring';

interface Transaction {
  id: string;
  merchant: string;
  category: {
    name: string;
    color: string;
  };
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

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
          <div className="space-y-2">
            {dateTransactions.map((transaction) => {
              if (enhanced) {
                const scores = calculateTransactionScores(transaction);
                return (
                  <TransactionWithScores
                    key={transaction.id}
                    transaction={transaction}
                    scores={scores}
                    currency={currency}
                  />
                );
              } else {
                return (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    currency={currency}
                  />
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
