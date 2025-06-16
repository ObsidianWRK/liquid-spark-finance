
import React from 'react';
import GlassCard from './GlassCard';
import { Package, Truck, Plane } from 'lucide-react';

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

  const getShippingIcon = (provider?: string) => {
    switch (provider) {
      case 'UPS': return <Truck className="w-4 h-4" />;
      case 'FedEx': return <Plane className="w-4 h-4" />;
      case 'USPS': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const hasShippingInfo = transaction.trackingNumber && transaction.shippingProvider;

  return (
    <GlassCard 
      className="p-4 mb-3 glass-interactive stagger-item"
      interactive
      shimmer
    >
      <div className="transaction-layout">
        {/* Status Dot */}
        <div className="transaction-status">
          <div className={`transaction-status-dot ${getStatusColor(transaction.status)}`} />
        </div>
        
        {/* Shipping Icon */}
        <div className="transaction-icon">
          {hasShippingInfo && (
            <div className="text-white/70">
              {getShippingIcon(transaction.shippingProvider)}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="transaction-content">
          <p className="transaction-merchant truncate">
            {transaction.merchant}
          </p>
          <p className="transaction-category truncate">
            {transaction.category.name}
          </p>
        </div>
        
        {/* Amount */}
        <div className="transaction-amount">
          <p className={`transaction-amount-text ${getAmountColor(transaction.amount)}`}>
            {formatCurrency(transaction.amount)}
          </p>
          <p className="transaction-date-text">
            {formatDate(transaction.date)}
          </p>
        </div>
        
        {/* Empty Scores Area */}
        <div className="transaction-scores"></div>
      </div>
      
      {/* Shipping Info Row */}
      {hasShippingInfo && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="transaction-layout">
            <div className="transaction-status"></div>
            <div className="transaction-icon"></div>
            <div className="transaction-content">
              <span className="text-white/50 text-xs">
                Tracking: {transaction.trackingNumber}
              </span>
            </div>
            <div className="transaction-amount">
              <span className="text-white/50 text-xs">
                via {transaction.shippingProvider}
              </span>
            </div>
            <div className="transaction-scores">
              <span className={`text-xs font-medium ${getDeliveryStatusColor(transaction.deliveryStatus)}`}>
                {transaction.deliveryStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default TransactionItem;
