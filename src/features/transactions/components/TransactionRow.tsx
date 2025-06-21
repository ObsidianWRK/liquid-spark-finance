import React from 'react';
import { cn } from '@/shared/lib/utils';
import { TransactionStatus } from '@/types';
import { Transaction } from '@/types/transactions';
import StatusChip from './StatusChip';
import { format } from 'date-fns';

interface TransactionRowProps {
  tx: Transaction;
  className?: string;
  onClick?: (tx: Transaction) => void;
}

// Helper to format amount with currency and sign
const formatAmount = (amount: number, currency: string = 'USD') => {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return amount < 0 ? `-${formatted}` : formatted;
};

const TransactionRow: React.FC<TransactionRowProps> = ({
  tx,
  className,
  onClick,
}) => {
  // Color coding for amounts
  const amountColor = React.useMemo(() => {
    if (tx.amount < 0) return 'text-red-400';
    if (tx.amount > 0) return 'text-green-400';
    return 'text-white';
  }, [tx.amount]);

  // Merchant and category fallback – support legacy shapes
  const merchant = (tx as any).merchantName ?? (tx as any).merchant ?? '—';

  // If category is an object (legacy mock shape), use its name field; else use the string directly
  const category = (() => {
    const raw = (tx as any).category;
    if (!raw) return '—';
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'object' && 'name' in raw) return String(raw.name);
    return String(raw);
  })();

  // Date formatting (mm/dd/yyyy)
  const dateString = tx.date ? format(new Date(tx.date), 'MM/dd/yy') : '—';

  // Status handling – map existing status strings to new enum where possible
  const status: TransactionStatus = (() => {
    const rawStatus = (tx.status as string)?.toLowerCase();
    const hasTracking = Boolean(
      (tx as any).trackingNumber ?? (tx.metadata as any)?.tracking_number
    );

    // Handle shipment-related statuses first
    if (hasTracking) {
      const shippingStatus = (
        (tx as any).shippingStatus ?? (tx.metadata as any)?.shipping_status
      )?.toUpperCase();
      if (shippingStatus === 'DELIVERED') return TransactionStatus.Delivered;
      if (
        shippingStatus === 'IN_TRANSIT' ||
        shippingStatus === 'OUT_FOR_DELIVERY'
      )
        return TransactionStatus.InTransit;
    }

    // Fallback to financial transaction status
    if (rawStatus === 'pending') return TransactionStatus.Pending;
    if (
      rawStatus === 'refunded' ||
      rawStatus === 'returned' ||
      rawStatus === 'cancelled' ||
      rawStatus === 'failed'
    ) {
      return TransactionStatus.Refunded;
    }
    if (
      rawStatus === 'completed' ||
      rawStatus === 'posted' ||
      rawStatus === 'settled'
    ) {
      return TransactionStatus.Completed;
    }

    return TransactionStatus.None;
  })();

  return (
    <button
      type="button"
      data-testid="transaction-row"
      onClick={() => onClick?.(tx)}
      className={cn(
        'grid items-center gap-3 lg:gap-4',
        // icon (3rem) | merchant (auto) | date (min 6rem) | status (min 6.875rem) | amount (min 6rem)
        'grid-cols-[3rem_1fr_minmax(6rem,_1fr)_minmax(6.875rem,_1fr)_minmax(6rem,_1fr)]',
        'px-4 py-3 rounded-vueni-md transition-colors text-left',
        'hover:bg-zinc-800/60 bg-transparent',
        className
      )}
    >
      {/* Icon Placeholder */}
      <div
        className="w-10 h-10 rounded-vueni-lg bg-white/5 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-sm text-white/60">💸</span>
      </div>

      {/* Merchant & Category */}
      <div className="min-w-0">
        <p className="truncate font-medium text-white" title={merchant}>
          {merchant}
        </p>
        <p className="text-xs text-white/60 truncate" title={category}>
          {category}
        </p>
      </div>

      {/* Date */}
      <div className="text-sm text-white/70 justify-self-end">
        {dateString}
      </div>

      {/* Status */}
      <div className="justify-self-end">
        <StatusChip status={status} />
      </div>

      {/* Amount */}
      <div className={cn('text-right font-medium', amountColor)}>
        {formatAmount(tx.amount, tx.currency)}
      </div>
    </button>
  );
};

export default TransactionRow;
