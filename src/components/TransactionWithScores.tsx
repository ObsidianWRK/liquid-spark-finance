
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { Heart, Leaf, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
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
}

interface TransactionWithScoresProps {
  transaction: Transaction;
  scores: TransactionScores;
  currency: string;
}

const TransactionWithScores = ({ transaction, scores, currency }: TransactionWithScoresProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(absAmount);
    
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-yellow-400 to-yellow-600"; 
    if (score >= 40) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const getScoreIcon = (type: 'financial' | 'health' | 'eco', score: number) => {
    const iconClass = "w-3 h-3";
    
    switch (type) {
      case 'financial':
        return score >= 60 ? 
          <TrendingUp className={cn(iconClass, "text-green-400")} aria-hidden="true" /> :
          <TrendingDown className={cn(iconClass, "text-red-400")} aria-hidden="true" />;
      case 'health':
        return <Heart className={cn(iconClass, score >= 60 ? "text-pink-400" : "text-gray-400")} aria-hidden="true" />;
      case 'eco':
        return <Leaf className={cn(iconClass, score >= 60 ? "text-green-400" : "text-gray-400")} aria-hidden="true" />;
    }
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <GlassCard 
      className="glass-card glass-dark hover:scale-[1.02] transition-all duration-300 p-4 mb-3 min-h-[44px]"
      interactive
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Transaction: ${transaction.merchant}, ${formatCurrency(transaction.amount)}, Financial score ${scores.financial}, Health score ${scores.health}, Eco score ${scores.eco}`}
      role="button"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusBadge(transaction.status)}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{transaction.merchant}</p>
            <p className="text-white/50 text-xs">{transaction.category.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`text-lg font-semibold ${getAmountColor(transaction.amount)}`}>
            {formatCurrency(transaction.amount)}
          </span>
          
          {/* Score Indicators */}
          <div className="flex items-center gap-1" role="group" aria-label="Transaction impact scores">
            {/* Financial Score */}
            <div 
              className={cn(
                "score-indicator bg-gradient-to-br min-w-[24px] min-h-[24px]",
                getScoreColor(scores.financial),
                isHovered && "micro-animation"
              )}
              title={`Financial Impact: ${scores.financial}/100`}
              role="img"
              aria-label={`Financial impact score: ${scores.financial} out of 100`}
            >
              {getScoreIcon('financial', scores.financial)}
            </div>
            
            {/* Health Score */}
            <div 
              className={cn(
                "score-indicator bg-gradient-to-br min-w-[24px] min-h-[24px]",
                getScoreColor(scores.health),
                isHovered && "micro-animation"
              )}
              style={{ animationDelay: '0.1s' }}
              title={`Health Impact: ${scores.health}/100`}
              role="img"
              aria-label={`Health impact score: ${scores.health} out of 100`}
            >
              {getScoreIcon('health', scores.health)}
            </div>
            
            {/* Eco Score */}
            <div 
              className={cn(
                "score-indicator bg-gradient-to-br min-w-[24px] min-h-[24px]",
                getScoreColor(scores.eco),
                isHovered && "micro-animation"
              )}
              style={{ animationDelay: '0.2s' }}
              title={`Eco Impact: ${scores.eco}/100`}
              role="img"
              aria-label={`Environmental impact score: ${scores.eco} out of 100`}
            >
              {getScoreIcon('eco', scores.eco)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Details on Hover */}
      <div className={cn(
        "mt-3 overflow-hidden transition-all duration-300",
        isHovered ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r", getScoreColor(scores.financial))} />
            <span className="text-gray-400">Financial: {scores.financial}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r", getScoreColor(scores.health))} />
            <span className="text-gray-400">Health: {scores.health}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r", getScoreColor(scores.eco))} />
            <span className="text-gray-400">Eco: {scores.eco}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default TransactionWithScores;
