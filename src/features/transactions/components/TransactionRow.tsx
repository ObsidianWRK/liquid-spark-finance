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

const TransactionRow: React.FC<TransactionRowProps> = ({ tx, className, onClick }) => {
  // Color coding for amounts
  const amountColor = React.useMemo(() => {
    if (tx.amount < 0) return 'text-red-400';
    if (tx.amount > 0) return 'text-green-400';
    return 'text-white';
  }, [tx.amount]);

  // Merchant and category fallback
  const merchant = tx.merchantName || '—';
  const category = tx.category ? String(tx.category) : '—';

  // Date formatting (mm/dd/yyyy)
  const dateString = tx.date ? format(new Date(tx.date), 'MM/dd/yy') : '—';

  // Status handling – map existing status strings to new enum where possible
  const status: TransactionStatus = (() => {
    switch (tx.status as string) {
      case 'pending':
        return TransactionStatus.Pending;
      case 'posted':
      case 'cancelled':
      case 'failed':
      case 'returned':
        return TransactionStatus.Delivered;
      case 'in_transit':
      case 'inTransit':
      case 'IN_TRANSIT':
        return TransactionStatus.InTransit;
      default:
        return TransactionStatus.None;
    }
  })();

  return (
    <button
      type="button"
      data-testid="transaction-row"
      onClick={() => onClick?.(tx)}
      className={cn(
        'grid items-center gap-3 lg:gap-4',
        // icon (48px) | merchant (auto) | date (96px) | status (110px) | amount (96px)
        'grid-cols-[48px_1fr_96px_110px_96px]',
        'px-4 py-3 rounded-md transition-colors text-left',
        'hover:bg-zinc-800/60 bg-transparent',
        className
      )}
    >
      {/* Icon Placeholder */}
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center" aria-hidden="true">
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
      <div className="text-sm text-white/70 justify-self-end w-[96px]">
        {dateString}
      </div>

      {/* Status */}
      <div className="w-[110px] justify-self-end">
        <StatusChip status={status} />
      </div>

      {/* Amount */}
      <div className={cn('text-right w-[96px] font-medium', amountColor)}>
        {formatAmount(tx.amount, tx.currency)}
      </div>
    </button>
  );
};

export default TransactionRow; 