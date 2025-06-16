import React from 'react';
import { cn } from '@/lib/utils';
import ShippingInfo from './ShippingInfo';

interface Transaction {
  id: string;
  merchant: string;
  category: { name: string; color: string };
  amount: number;
  date: string;
  trackingNumber?: string;
  shippingProvider?: 'UPS' | 'FedEx' | 'USPS';
  deliveryStatus?: 'In Transit' | 'Delivered' | 'Out for Delivery';
}

interface Props {
  transactions: Transaction[];
  currency?: string;
  className?: string;
}

/**
 * Apple-style transaction list – clean, spacious, grouped by day
 */
const AppleTransactionList: React.FC<Props> = ({ transactions, currency = 'USD', className }) => {
  // util helpers
  const formatAmount = (amt: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency, minimumFractionDigits: 2
  }).format(Math.abs(amt));

  const formatDateHeading = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // group by day
  const groups = transactions.reduce<Record<string, Transaction[]>>((acc, t) => {
    const key = new Date(t.date).toDateString();
    (acc[key] ||= []).push(t);
    return acc;
  }, {});

  const Item = ({ t }: { t: Transaction }) => (
    <div className="py-3 space-y-1">
      <div className="flex items-center justify-between">
        {/* Merchant + category */}
        <div className="flex items-center gap-3 min-w-0">
          {/* coloured pill */}
          <div className="w-9 h-9 rounded-full flex-shrink-0" style={{ backgroundColor: t.category.color }} />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-white">{t.merchant}</p>
            <p className="text-xs text-white/50 truncate">{t.category.name}</p>
          </div>
        </div>
        {/* Amount */}
        <div className={cn('text-sm font-medium tabular-nums', t.amount < 0 ? 'text-white' : 'text-green-400')}>
          {t.amount < 0 ? '-' : '+'}{formatAmount(t.amount)}
        </div>
      </div>
      {/* Shipping / tracking info */}
      {t.trackingNumber && t.shippingProvider && (
        <div className="pl-12 text-xs text-white/60 flex items-center gap-1">
          <ShippingInfo 
            trackingNumber={t.trackingNumber} 
            shippingProvider={t.shippingProvider} 
            deliveryStatus={t.deliveryStatus}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(groups).map(([dateKey, txns]) => (
        <div key={dateKey}>
          <h3 className="text-xs font-semibold text-white/60 mb-2 px-1 uppercase tracking-wide">
            {formatDateHeading(txns[0].date)}
          </h3>
          <div className="divide-y divide-white/10 bg-white/5 rounded-2xl px-4 py-1 backdrop-blur-md border border-white/10">
            {txns.map(t => (
              <Item key={t.id} t={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppleTransactionList; 