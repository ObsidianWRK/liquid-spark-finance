
import React from 'react';
import { Package } from 'lucide-react';

interface TransactionMainProps {
  merchant: string;
  category: {
    name: string;
    color: string;
  };
  hasShippingInfo: boolean;
}

const TransactionMain = ({ merchant, category, hasShippingInfo }: TransactionMainProps) => {
  return (
    <div className="transaction-main">
      {hasShippingInfo && (
        <div className="text-white/70 flex-shrink-0">
          <Package className="w-4 h-4" />
        </div>
      )}
      <div className="transaction-merchant-info">
        <p className="transaction-merchant-name">
          {merchant}
        </p>
        <p className="transaction-category">
          {category.name}
        </p>
      </div>
    </div>
  );
};

export default TransactionMain;
