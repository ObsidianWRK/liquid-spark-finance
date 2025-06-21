import React from 'react';
import UnifiedTransactionList, {
  defaultFeatures,
} from '@/features/transactions/components/UnifiedTransactionList';
import { Transaction } from '@/types/shared';

interface TransactionWithScoresProps {
  transaction: Transaction;
  currency?: string;
}

const TransactionWithScores: React.FC<TransactionWithScoresProps> = ({ transaction, currency = 'USD' }) => (
  <UnifiedTransactionList
    transactions={[transaction]}
    currency={currency}
    features={{ ...defaultFeatures, showScores: true, groupByDate: false, showShipping: true, searchable: false, filterable: false, sortable: false }}
  />
);

export default TransactionWithScores;
