import React from 'react';

interface TransactionStatusProps {
  status: 'completed' | 'pending' | 'failed';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-400';
    case 'pending':
      return 'bg-orange-400';
    case 'failed':
      return 'bg-red-400';
    default:
      return 'bg-white/50';
  }
};

const TransactionStatus = ({ status }: TransactionStatusProps) => {
  return (
    <div className="transaction-status">
      <div
        className={`w-3 h-3 rounded-vueni-pill ${getStatusColor(status)}`}
        aria-label={`Status: ${status}`}
      />
    </div>
  );
};

export default TransactionStatus;
