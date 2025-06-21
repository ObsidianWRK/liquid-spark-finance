import React from 'react';
import {
  UnifiedTransactionList,
  defaultFeatures,
} from '@/features/transactions/components/UnifiedTransactionList';
import { Transaction } from '@/shared/types/shared';

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  enhanced?: boolean;
  isLoading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currency,
  enhanced = false,
  isLoading = false,
  onTransactionClick,
}) => (
  <UnifiedTransactionList
    transactions={transactions}
    currency={currency}
    features={{ ...defaultFeatures, showScores: enhanced, showShipping: enhanced }}
    isLoading={isLoading}
    onTransactionClick={onTransactionClick}
  />
);

export default TransactionList;
