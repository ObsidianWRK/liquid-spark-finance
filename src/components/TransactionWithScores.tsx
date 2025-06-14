
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
    <GlassCard 
      className="p-4 mb-3 glass-interactive hover:bg-white/10 transition-all duration-300 relative"
      interactive
      onClick={() => setShowScores(!showScores)}
      onMouseEnter={() => setShowScores(true)}
      onMouseLeave={() => setShowScores(false)}
      aria-label={`Transaction: ${transaction.merchant}, ${transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}, Financial score ${scores.financial}, Health score ${scores.health}, Eco score ${scores.eco}`}
      role="button"
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
      
      {/* Score Circles - Absolutely Positioned Outside Grid */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <ScoreCircles scores={scores} isVisible={showScores} />
      </div>
    </GlassCard>
  );
};

export default TransactionWithScores;
