import React, { useMemo, useCallback } from 'react';
import { Package, Truck, Plane } from 'lucide-react';
import { Transaction } from '@/shared/types/shared';

interface TransactionItemProps {
  transaction: Transaction & {
    trackingNumber?: string;
    shippingProvider?: 'UPS' | 'FedEx' | 'USPS';
    deliveryStatus?: 'In Transit' | 'Out for Delivery' | 'Delivered';
  };
  currency: string;
}

const TransactionItem = React.memo<TransactionItemProps>(
  ({ transaction, currency }) => {
    // Memoized formatters to prevent recreation on every render
    const formatCurrency = useMemo(() => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
      });

      return (amount: number) => {
        const absAmount = Math.abs(amount);
        const formatted = formatter.format(absAmount);
        return amount < 0 ? `-${formatted}` : `+${formatted}`;
      };
    }, [currency]);

    const formatDate = useMemo(() => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return (dateString: string) => {
        const date = new Date(dateString);
        return formatter.format(date);
      };
    }, []);

    // Memoized color calculations
    const amountColor = useMemo(() => {
      if (transaction.amount > 0) return 'text-green-400';
      if (transaction.amount < 0) return 'text-white';
      return 'text-white/70';
    }, [transaction.amount]);

    const statusColor = useMemo(() => {
      switch (transaction.status) {
        case 'completed':
          return 'bg-green-400';
        case 'pending':
          return 'bg-orange-400';
        case 'failed':
          return 'bg-red-400';
        default:
          return 'bg-white/50';
      }
    }, [transaction.status]);

    const deliveryStatusColor = useMemo(() => {
      switch (transaction.deliveryStatus) {
        case 'Delivered':
          return 'text-green-400';
        case 'Out for Delivery':
          return 'text-orange-400';
        case 'In Transit':
          return 'text-blue-400';
        default:
          return 'text-white/70';
      }
    }, [transaction.deliveryStatus]);

    const shippingIcon = useMemo(() => {
      switch (transaction.shippingProvider) {
        case 'UPS':
          return <Truck className="w-4 h-4" />;
        case 'FedEx':
          return <Plane className="w-4 h-4" />;
        case 'USPS':
          return <Package className="w-4 h-4" />;
        default:
          return <Package className="w-4 h-4" />;
      }
    }, [transaction.shippingProvider]);

    const hasShippingInfo = useMemo(
      () => transaction.trackingNumber && transaction.shippingProvider,
      [transaction.trackingNumber, transaction.shippingProvider]
    );

    return (
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.05] p-3 hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-200 cursor-pointer">
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex-shrink-0">
            <div
              className={`w-2.5 h-2.5 rounded-full ${statusColor}`}
            />
          </div>

          {/* Merchant Icon/Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
              {hasShippingInfo ? (
                <div className="text-white/70">{shippingIcon}</div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">
                    {transaction.merchant.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate text-sm">
              {transaction.merchant}
            </p>
            <p className="text-white/60 text-xs mt-0.5 truncate">
              {transaction.category.name} • {formatDate(transaction.date)}
            </p>
          </div>

          {/* Amount */}
          <div className="flex-shrink-0 text-right">
            <p className={`font-semibold text-sm ${amountColor}`}>
              {formatCurrency(transaction.amount)}
            </p>
            <div className="flex items-center justify-end mt-0.5">
              <span className="text-white/50 text-xs capitalize">
                {transaction.status}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Info Row */}
        {hasShippingInfo && (
          <div className="mt-3 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">
                Tracking: {transaction.trackingNumber}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-white/50">
                  via {transaction.shippingProvider}
                </span>
                <span className={`font-medium ${deliveryStatusColor}`}>
                  {transaction.deliveryStatus}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TransactionItem.displayName = 'TransactionItem';

export default TransactionItem;
