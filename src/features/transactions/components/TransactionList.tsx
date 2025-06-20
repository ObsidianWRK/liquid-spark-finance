// TransactionList Revamp – unified, responsive, virtualized list
// IMPORTANT: This file has been completely rewritten to satisfy the TransactionList Revamp spec.

import React, { memo, useMemo } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { cn } from '@/shared/lib/utils';
import TransactionRow from './TransactionRow';
import DateSeparator from './DateSeparator';
import { Transaction } from '@/types/transactions';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onTransactionClick?: (tx: Transaction) => void;
  className?: string;
}

// Internal flattened item representation (row or separator)
interface RowItemSeparator {
  type: 'separator';
  dateKey: string;
  date: Date;
}
interface RowItemTransaction {
  type: 'transaction';
  tx: Transaction;
}

type RowItem = RowItemSeparator | RowItemTransaction;

const ROW_HEIGHT = 72; // px – consistent row & separator height
const VIRTUALIZE_THRESHOLD = 500;

const SkeletonRow = () => (
  <div
    className={cn(
      'grid items-center gap-3 lg:gap-4',
      'grid-cols-[48px_1fr_96px_110px_96px]',
      'px-4 py-3 animate-pulse'
    )}
  >
    <div className="w-10 h-10 rounded-lg bg-white/10" />
    <div className="space-y-1">
      <div className="h-3 w-24 bg-white/10 rounded" />
      <div className="h-2 w-16 bg-white/10 rounded" />
    </div>
    <div className="h-3 w-16 bg-white/10 rounded" />
    <div className="h-5 w-20 bg-white/10 rounded" />
    <div className="h-3 w-20 bg-white/10 rounded" />
  </div>
);

const buildRowItems = (transactions: Transaction[]): RowItem[] => {
  // Sort transactions by date desc
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const items: RowItem[] = [];
  let lastDateKey = '';
  sorted.forEach((tx) => {
    const date = new Date(tx.date);
    const dateKey = format(date, 'yyyy-MM-dd');
    if (dateKey !== lastDateKey) {
      items.push({ type: 'separator', dateKey, date });
      lastDateKey = dateKey;
    }
    items.push({ type: 'transaction', tx });
  });
  return items;
};

interface RowRendererData {
  items: RowItem[];
  onTransactionClick?: (tx: Transaction) => void;
}

const RowRenderer: React.FC<ListChildComponentProps<RowRendererData>> = ({
  index,
  style,
  data,
}) => {
  const item = data.items[index];
  if (!item) return null;
  if (item.type === 'separator') {
    return (
      <div style={style}>
        <DateSeparator date={item.date} />
      </div>
    );
  }
  return (
    <div style={style}>
      <TransactionRow tx={item.tx} onClick={data.onTransactionClick} />
    </div>
  );
};

export const TransactionList: React.FC<TransactionListProps> = memo(
  ({ transactions, isLoading = false, onTransactionClick, className }) => {
    const items = useMemo(() => buildRowItems(transactions), [transactions]);

    // Loading state skeletons
    if (isLoading) {
      return (
        <div
          className={cn('space-y-2', className)}
          data-testid="transaction-list-loading"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRow key={`sk-${i}`} />
          ))}
        </div>
      );
    }

    // Empty state
    if (transactions.length === 0) {
      return (
        <div
          className="text-center py-12 text-white/60"
          data-testid="transaction-list-empty"
        >
          No transactions to display.
        </div>
      );
    }

    // Decide whether to virtualize
    const shouldVirtualize = transactions.length > VIRTUALIZE_THRESHOLD;

    if (shouldVirtualize) {
      const height = Math.min(window.innerHeight * 0.7, ROW_HEIGHT * 12);
      return (
        <List
          height={height}
          itemCount={items.length}
          itemSize={ROW_HEIGHT}
          itemData={{ items, onTransactionClick }}
          width="100%"
          overscanCount={8}
          className={cn('transaction-scroll-container', className)}
          data-testid="transaction-virtualized-list"
        >
          {RowRenderer}
        </List>
      );
    }

    // Non-virtualized list
    return (
      <div
        className={cn('space-y-1 transaction-scroll-container', className)}
        data-testid="transaction-list"
      >
        {items.map((item, idx) =>
          item.type === 'separator' ? (
            <DateSeparator key={item.dateKey} date={item.date} />
          ) : (
            <TransactionRow
              key={item.tx.id || idx}
              tx={item.tx}
              onClick={onTransactionClick}
            />
          )
        )}
      </div>
    );
  }
);

TransactionList.displayName = 'TransactionList';

export default TransactionList;
