
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
    <div className="relative">
      <GlassCard 
        className="p-4 mb-3 glass-interactive hover:bg-white/10 transition-all duration-300 relative"
        interactive
        onClick={() => setShowScores(!showScores)}
        onMouseEnter={() => setShowScores(true)}
        onMouseLeave={() => setShowScores(false)}
        aria-label={`Transaction: ${transaction.merchant}, ${transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}, Financial score ${scores.financial}, Health score ${scores.health}, Eco score ${scores.eco}`}
        role="button"
      >
        {/* Status Pill - Top Left */}
        <div className="absolute top-3 left-3 z-20">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
            transaction.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {transaction.status === 'completed' ? 'Completed' :
             transaction.status === 'pending' ? 'Pending' : 'Failed'}
          </div>
        </div>

        {/* Transaction Grid Layout - Fixed Height */}
        <div className="transaction-grid" style={{ minHeight: '64px', paddingTop: '20px' }}>
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
      </GlassCard>
      
      {/* Score Circles - Absolutely Positioned Outside Card */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none">
        <ScoreCircles scores={scores} isVisible={showScores} />
      </div>
    </div>
  );
};

export default TransactionWithScores;
