import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { TransactionScores } from '@/utils/transactionScoring';
import { Package, Truck, Plane } from 'lucide-react';

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

const getScoreColor = (score: number, type?: string) => {
  switch (type) {
    case 'health': return '#FF69B4'; // Pink for health
    case 'eco': return '#00FF7F'; // Green for eco  
    case 'financial': return '#00BFFF'; // Blue for financial
    default: return '#FFFFFF'; // Default white
  }
};

const ScoreCircle = ({ score, label, isVisible, delay = 0, type }: { score: number; label: string; isVisible: boolean; delay?: number; type?: string }) => {
  const color = getScoreColor(score, type);
  const circumference = 2 * Math.PI * 7;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div 
      className={`relative transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
      title={`${label}: ${score}/100`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        width: '18px',
        height: '18px'
      }}
    >
      <svg width="18" height="18" className="transform -rotate-90">
        <circle
          cx="9"
          cy="9"
          r="7"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="9"
          cy="9"
          r="7"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-[7px] font-bold"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

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

  const getDeliveryStatusColor = (status?: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-400';
      case 'Out for Delivery': return 'text-orange-400';
      case 'In Transit': return 'text-blue-400';
      default: return 'text-white/70';
    }
  };

  const getShippingIcon = (provider?: string) => {
    switch (provider) {
      case 'UPS': return <Truck className="w-4 h-4" />;
      case 'FedEx': return <Plane className="w-4 h-4" />;
      case 'USPS': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const hasShippingInfo = transaction.trackingNumber && transaction.shippingProvider;

  return (
    <GlassCard 
      className="p-4 mb-3 glass-interactive hover:bg-white/10 transition-all duration-300 ease-out cursor-pointer"
      interactive
      onClick={() => setShowScores(!showScores)}
      onMouseEnter={() => setShowScores(true)}
      onMouseLeave={() => setShowScores(false)}
      aria-label={`Transaction: ${transaction.merchant}, ${formatCurrency(transaction.amount)}, Financial score ${scores.financial}, Health score ${scores.health}, Eco score ${scores.eco}`}
      role="button"
    >
      <div className="transaction-layout">
        {/* Status Dot */}
        <div className="transaction-status">
          <div 
            className={`transaction-status-dot ${getStatusColor(transaction.status)}`}
            aria-label={`Status: ${transaction.status}`}
          />
        </div>
        
        {/* Shipping Icon */}
        <div className="transaction-icon">
          {hasShippingInfo && (
            <div className="text-white/70">
              <Package className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="transaction-content">
          <p className="transaction-merchant">
            {transaction.merchant}
          </p>
          <p className="transaction-category">
            {transaction.category.name}
          </p>
        </div>
        
        {/* Amount */}
        <div className="transaction-amount">
          <p className={`transaction-amount-text ${getAmountColor(transaction.amount)}`}>
            {formatCurrency(transaction.amount)}
          </p>
          <p className="transaction-date-text">
            {formatDate(transaction.date)}
          </p>
        </div>
        
        {/* Score Circles Area */}
        <div className="transaction-scores">
          <div 
            className={`flex items-center justify-end gap-1 transition-all duration-300 ${
              showScores ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <ScoreCircle 
              score={scores.health} 
              label="Health"
              isVisible={showScores}
              delay={0}
              type="health"
            />
            <ScoreCircle 
              score={scores.eco} 
              label="Eco"
              isVisible={showScores}
              delay={50}
              type="eco"
            />
            <ScoreCircle 
              score={scores.financial} 
              label="Financial"
              isVisible={showScores}
              delay={100}
              type="financial"
            />
          </div>
        </div>
      </div>
      
      {/* Shipping Info Row */}
      {hasShippingInfo && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-white/50">
                Tracking: 
              </div>
              <div className="text-white/70 font-mono truncate">
                {transaction.trackingNumber}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-white/50">
                via {transaction.shippingProvider}
              </div>
              <div className={`font-medium ${getDeliveryStatusColor(transaction.deliveryStatus)}`}>
                {transaction.deliveryStatus}
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default TransactionWithScores;
