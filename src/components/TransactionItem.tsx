
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

  const getShippingIcon = (provider?: string) => {
    return provider ? <Package className="w-4 h-4" /> : <Truck className="w-4 h-4" />;
  };

  const isShippingTransaction = transaction.category.name === 'Shipping';

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
          <div className="flex items-center space-x-2">
            {isShippingTransaction && (
              <div className="text-white/70">
                {getShippingIcon(transaction.shippingProvider)}
              </div>
            )}
            <div>
              <p className="text-white font-medium text-sm">{transaction.merchant}</p>
              <p className="text-white/50 text-xs">{transaction.category.name}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`font-bold text-sm ${getAmountColor(transaction.amount)}`}>
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-white/50 text-xs">{formatDate(transaction.date)}</p>
        </div>
      </div>
      
      {isShippingTransaction && transaction.trackingNumber && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-white/50">Tracking: </span>
              <span className="text-white/90 font-mono">{transaction.trackingNumber}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`font-medium ${getDeliveryStatusColor(transaction.deliveryStatus)}`}>
                {transaction.deliveryStatus}
              </span>
            </div>
          </div>
          {transaction.shippingProvider && (
            <div className="mt-1">
              <span className="text-white/50 text-xs">via {transaction.shippingProvider}</span>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};

export default TransactionItem;
