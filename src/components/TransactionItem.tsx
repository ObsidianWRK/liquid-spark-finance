import React from 'react';
import {
  TransactionItem as UnifiedTransactionItem,
  defaultFeatures,
} from '@/features/transactions/components/UnifiedTransactionList';
import { Transaction } from '@/shared/types/shared';

interface TransactionItemProps {
  transaction: Transaction & {
    trackingNumber?: string;
    shippingProvider?: 'UPS' | 'FedEx' | 'USPS';
    deliveryStatus?: 'In Transit' | 'Out for Delivery' | 'Delivered';
  };
  currency: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, currency }) => (
  <UnifiedTransactionItem
    transaction={{
      ...transaction,
      shipping: transaction.trackingNumber
        ? {
            trackingNumber: transaction.trackingNumber,
            provider: transaction.shippingProvider || '',
            status: transaction.deliveryStatus || '',
          }
        : undefined,
    }}
    currency={currency}
    features={{ ...defaultFeatures, showShipping: true }}
    styles={{ container: '', item: '', spacing: '' }}
    onClick={() => {}}
  />
);

TransactionItem.displayName = 'TransactionItem';

export default TransactionItem;
