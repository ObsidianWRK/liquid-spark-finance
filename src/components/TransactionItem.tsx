
import React from 'react';
import GlassCard from './GlassCard';

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

interface TransactionItemProps {
  transaction: Transaction;
  currency: string;
}

const TransactionItem = ({ transaction, currency }: TransactionItemProps) => {
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(absAmount);
    
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-green-400';
    if (amount < 0) return 'text-white';
    return 'text-white/70';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-400';
      case 'pending': return 'bg-orange-400';
      case 'failed': return 'bg-red-400';
      default: return 'bg-white/50';
    }
  };

  return (
    <GlassCard 
      className="p-4 mb-3 glass-interactive stagger-item"
      interactive
      shimmer
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className={`w-2 h-2 rounded-full ${getStatusColor(transaction.status)}`}
          />
          <div>
            <p className="text-white font-medium text-sm">{transaction.merchant}</p>
            <p className="text-white/50 text-xs">{transaction.category.name}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`font-bold text-sm ${getAmountColor(transaction.amount)}`}>
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-white/50 text-xs">{formatDate(transaction.date)}</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default TransactionItem;
