
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { TransactionScores } from '@/utils/transactionScoring';
import TransactionStatus from './transactions/TransactionStatus';
import TransactionMain from './transactions/TransactionMain';
import TransactionAmount from './transactions/TransactionAmount';
import ShippingInfo from './transactions/ShippingInfo';
import ScoreCircles from './transactions/ScoreCircles';

interface Transaction {
  id: string;
  merchant: string;
  category: {
    name: string;
    color: string;
  };
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  trackingNumber?: string;
  shippingProvider?: 'UPS' | 'FedEx' | 'USPS';
  deliveryStatus?: 'In Transit' | 'Out for Delivery' | 'Delivered';
}

interface TransactionWithScoresProps {
  transaction: Transaction;
  scores: TransactionScores;
  currency: string;
}

const TransactionWithScores = ({ transaction, scores, currency }: TransactionWithScoresProps) => {
  const [showScores, setShowScores] = useState(false);

  const hasShippingInfo = transaction.trackingNumber && transaction.shippingProvider;

  return (
    <div className="relative mb-3">
      <GlassCard 
        className={`transaction-card p-5 glass-interactive transition-all duration-300 ease-out relative ${
          showScores ? 'pr-32' : 'pr-5'
        }`}
        interactive
        onClick={() => setShowScores(!showScores)}
        onMouseEnter={() => setShowScores(true)}
        onMouseLeave={() => setShowScores(false)}
        aria-label={`Transaction: ${transaction.merchant}, ${transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}, Financial score ${scores.financial}, Health score ${scores.health}, Eco score ${scores.eco}`}
        role="button"
        style={{
          borderRadius: showScores ? '20px 32px 32px 20px' : '20px',
          transform: showScores ? 'scale(1.01)' : 'scale(1)',
        }}
      >
        {/* Transaction Grid Layout */}
        <div className="transaction-grid">
          <TransactionStatus status={transaction.status} />
          
          <TransactionMain 
            merchant={transaction.merchant}
            category={transaction.category}
            hasShippingInfo={!!hasShippingInfo}
          />
          
          <TransactionAmount 
            amount={transaction.amount}
            date={transaction.date}
            currency={currency}
          />
          
          {hasShippingInfo && (
            <ShippingInfo 
              trackingNumber={transaction.trackingNumber!}
              shippingProvider={transaction.shippingProvider!}
              deliveryStatus={transaction.deliveryStatus}
            />
          )}
        </div>

        {/* Score Circles - Inside Card on Right */}
        <div className={`absolute right-6 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out ${
          showScores ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}>
          <ScoreCircles scores={scores} isVisible={showScores} />
        </div>
      </GlassCard>
    </div>
  );
};

export default TransactionWithScores;
