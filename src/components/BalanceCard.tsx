
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

interface BalanceCardProps {
  accountType: string;
  nickname: string;
  balance: number;
  availableBalance: number;
  currency: string;
  trend: 'up' | 'down';
  trendPercentage: number;
}

const BalanceCard = ({
  accountType,
  nickname,
  balance,
  availableBalance,
  currency,
  trend,
  trendPercentage
}: BalanceCardProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <GlassCard 
      variant="elevated" 
      className="p-6 mb-6 stagger-item"
      shimmer
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white/70 text-sm font-medium">{accountType}</p>
          <p className="text-white/50 text-xs">{nickname}</p>
        </div>
        <button
          onClick={toggleBalanceVisibility}
          className="glass-interactive glass-capsule p-2 hover:bg-white/10"
        >
          {isBalanceVisible ? (
            <EyeOff className="w-4 h-4 text-white/70" />
          ) : (
            <Eye className="w-4 h-4 text-white/70" />
          )}
        </button>
      </div>

      <div className="mb-4">
        <div className={`transition-all duration-300 ${isBalanceVisible ? 'balance-reveal' : 'balance-blur'}`}>
          <h1 className="text-4xl font-bold text-white mb-1">
            {formatCurrency(balance)}
          </h1>
          <p className="text-white/50 text-sm">
            Available: {formatCurrency(availableBalance)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium">{trendPercentage}%</span>
        </div>
        <span className="text-white/50 text-sm">vs last month</span>
      </div>
    </GlassCard>
  );
};

export default BalanceCard;
