
import React from 'react';
import GlassCard from './GlassCard';
import { Package, Truck } from 'lucide-react';

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
  trackingNumber?: string;
  shippingProvider?: 'UPS' | 'FedEx' | 'USPS';
  deliveryStatus?: 'In Transit' | 'Out for Delivery' | 'Delivered';
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

  const getDeliveryStatusColor = (status?: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-400';
      case 'Out for Delivery': return 'text-orange-400';
      case 'In Transit': return 'text-blue-400';
      default: return 'text-white/70';
    }
  };

  const hasShippingInfo = transaction.trackingNumber && transaction.shippingProvider;

  return (
    <GlassCard 
      className="transaction-card p-5 glass-interactive stagger-item"
      interactive
    >
      {/* Transaction Grid Layout */}
      <div className="transaction-grid">
        {/* Status */}
        <div className="transaction-status">
          <div 
            className={`w-3 h-3 rounded-full ${getStatusColor(transaction.status)}`}
          />
        </div>
        
        {/* Main content */}
        <div className="transaction-main">
          {hasShippingInfo && (
            <div className="text-white/70 flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
          )}
          <div className="transaction-merchant-info">
            <p className="transaction-merchant-name">{transaction.merchant}</p>
            <p className="transaction-category">{transaction.category.name}</p>
          </div>
        </div>
        
        {/* Amount */}
        <div className="transaction-amount">
          <p className={`transaction-amount-value ${getAmountColor(transaction.amount)}`}>
            {formatCurrency(transaction.amount)}
          </p>
          <p className="transaction-date">{formatDate(transaction.date)}</p>
        </div>
        
        {/* Shipping info */}
        {hasShippingInfo && (
          <div className="transaction-shipping">
            <span className="text-white/50">Tracking: </span>
            <span className="text-white/90 font-mono text-sm">{transaction.trackingNumber}</span>
            <br />
            <span className="text-white/50">via {transaction.shippingProvider} </span>
            <span className={`font-medium ${getDeliveryStatusColor(transaction.deliveryStatus)}`}>
              {transaction.deliveryStatus}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default TransactionItem;
