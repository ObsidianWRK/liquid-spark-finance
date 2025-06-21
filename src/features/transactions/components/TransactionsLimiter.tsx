import React, { useState } from 'react';
import { Transaction } from '@/types/transactions';

interface TransactionsLimiterProps {
  transactions: Transaction[];
  initialLimit?: number;
  rowHeight?: number;
}

const TransactionsLimiter = ({
  transactions,
  initialLimit = 5,
  rowHeight = 20,
}: TransactionsLimiterProps) => {
  const [limit, setLimit] = useState(initialLimit);
  const visible = transactions.slice(0, limit);
  const showMore = limit < transactions.length;

  return (
    <div>
      {visible.map((tx) => (
        <div
          key={tx.id}
          className="pfm-row"
          style={{ height: rowHeight }}
          data-testid="pfm-row"
        >
          {tx.merchant ?? tx.description}
        </div>
      ))}
      {showMore && (
        <button onClick={() => setLimit(transactions.length)} data-testid="show-more">
          Show More
        </button>
      )}
    </div>
  );
};

export default TransactionsLimiter;
