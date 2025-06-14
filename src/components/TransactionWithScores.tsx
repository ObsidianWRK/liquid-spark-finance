
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { Heart, Leaf, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransactionScores } from '@/utils/transactionScoring';

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

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(absAmount);
    
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-green-400';
    if (amount < 0) return 'text-white';
    return 'text-white/70';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-400';
      case 'pending': return 'bg-orange-400';
      case 'failed': return 'bg-red-400';
      default: return 'bg-white/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#34C759'; // Green
    if (score >= 60) return '#FF9500'; // Orange
    return '#FF3B30'; // Red
  };

  const getDeliveryStatusColor = (status?: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-400';
      case 'Out for Delivery': return 'text-orange-400';
      case 'In Transit': return 'text-blue-400';
      default: return 'text-white/70';
    }
  };

  const ScoreCircle = ({ score, label, size = 32 }: { score: number; label: string; size?: number }) => {
    const color = getScoreColor(score);
    const circumference = 2 * Math.PI * 14;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center space-y-1" title={`${label}: ${score}/100`}>
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r="14"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r="14"
              stroke={color}
              strokeWidth="3"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{
                filter: `drop-shadow(0 0 4px ${color}40)`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="text-xs font-bold"
              style={{ color }}
            >
              {score}
            </span>
          </div>
        </div>
        <span className="text-xs text-white/50 font-medium">{label}</span>
      </div>
    );
  };

  const hasShippingInfo = transaction.trackingNumber && transaction.shippingProvider;

  return (
    <GlassCard 
      className="p-4 mb-3 glass-interactive hover:bg-white/10 transition-all duration-300 relative"
      interactive
      onClick={() => setShowScores(!showScores)}
      onMouseEnter={() => setShowScores(true)}
      onMouseLeave={() => setShowScores(false)}
      aria-label={`Transaction: ${transaction.merchant}, ${formatCurrency(transaction.amount)}, Financial score ${scores.financial}, Health score ${scores.health}, Eco score ${scores.eco}`}
      role="button"
    >
      {/* Transaction Grid Layout */}
      <div className="transaction-grid">
        {/* Status Dot */}
        <div className="transaction-status">
          <div 
            className={`w-3 h-3 rounded-full ${getStatusColor(transaction.status)}`}
            aria-label={`Status: ${transaction.status}`}
          />
        </div>
        
        {/* Main Content */}
        <div className="transaction-main">
          {hasShippingInfo && (
            <div className="text-white/70 flex-shrink-0">
              <Package className="w-4 h-4" />
            </div>
          )}
          <div className="transaction-merchant-info">
            <p className="transaction-merchant-name">
              {transaction.merchant}
            </p>
            <p className="transaction-category">
              {transaction.category.name}
            </p>
          </div>
        </div>
        
        {/* Amount */}
        <div className="transaction-amount">
          <p className={`transaction-amount-value ${getAmountColor(transaction.amount)}`}>
            {formatCurrency(transaction.amount)}
          </p>
          <p className="transaction-date">{formatDate(transaction.date)}</p>
        </div>
        
        {/* Shipping Info */}
        {hasShippingInfo && (
          <div className="transaction-shipping">
            <span>Tracking: </span>
            <span className="text-white/90 font-mono">{transaction.trackingNumber}</span>
            <span> via {transaction.shippingProvider} </span>
            <span className={`font-medium ${getDeliveryStatusColor(transaction.deliveryStatus)}`}>
              {transaction.deliveryStatus}
            </span>
          </div>
        )}
      </div>
      
      {/* Score Circles - Absolutely Positioned */}
      <div className={`score-circles-container ${showScores ? 'score-circles-visible' : 'score-circles-hidden'}`}>
        <ScoreCircle 
          score={scores.health} 
          label="Health"
          size={28}
        />
        <ScoreCircle 
          score={scores.eco} 
          label="Eco"
          size={28}
        />
        <ScoreCircle 
          score={scores.financial} 
          label="Financial"
          size={28}
        />
      </div>
    </GlassCard>
  );
};

export default TransactionWithScores;
