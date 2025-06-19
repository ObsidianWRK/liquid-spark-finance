
import React from 'react';

interface TransactionAmountProps {
  amount: number;
  date: string;
  currency: string;
}

const TransactionAmount = ({ amount, date, currency }: TransactionAmountProps) => {
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

  return (
    <div className="transaction-amount">
      <p className={`transaction-amount-value ${getAmountColor(amount)}`}>
        {formatCurrency(amount)}
      </p>
      <p className="transaction-date">{formatDate(date)}</p>
    </div>
  );
};

export default TransactionAmount;
