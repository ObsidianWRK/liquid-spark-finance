import React, { useState } from 'react';
import SimpleGlassCard from '@/components/ui/SimpleGlassCard';
import { colors } from '@/theme/colors';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  PiggyBank,
  Wallet,
  Building
} from 'lucide-react';

export interface AccountData {
  id: string;
  accountType: string;
  accountName: string;
  balance: number;
  available?: number;
  change?: {
    amount: number;
    percentage: number;
    period: string;
  };
  isActive?: boolean;
}

interface CleanAccountCardProps {
  account: AccountData;
  onClick?: () => void;
  className?: string;
}

const CleanAccountCard = ({ account, onClick, className }: CleanAccountCardProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return <Wallet className="w-5 h-5 text-blue-400" />;
      case 'savings':
        return <PiggyBank className="w-5 h-5 text-green-400" />;
      case 'credit card':
        return <CreditCard className="w-5 h-5 text-orange-400" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
      default:
        return <Building className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBalanceColor = (balance: number, type: string) => {
    if (type.toLowerCase() === 'credit card') {
      return balance < 0 ? colors.status.error : colors.status.success;
    }
    return balance >= 0 ? colors.text.primary : colors.status.error;
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <SimpleGlassCard 
      className={`p-6 ${className || ''}`}
      interactive={!!onClick}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/[0.06]">
            {getAccountIcon(account.accountType)}
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">
              {account.accountType}
            </h3>
            <p className="text-white/60 text-xs">
              {account.accountName}
            </p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBalanceVisibility();
          }}
          className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] transition-colors"
          aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
        >
          {isBalanceVisible ? (
            <EyeOff className="w-4 h-4 text-white/70" />
          ) : (
            <Eye className="w-4 h-4 text-white/70" />
          )}
        </button>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <div className={`transition-all duration-300 ${isBalanceVisible ? '' : 'blur-sm'}`}>
          <div 
            className="text-2xl font-bold mb-1"
            style={{ color: getBalanceColor(account.balance, account.accountType) }}
          >
            {isBalanceVisible ? formatCurrency(account.balance) : '••••••'}
          </div>
          {account.available !== undefined && (
            <p className="text-white/50 text-sm">
              Available: {isBalanceVisible ? formatCurrency(account.available) : '••••••'}
            </p>
          )}
        </div>
      </div>

      {/* Change Indicator */}
      {account.change && (
        <div className="flex items-center gap-2">
          <div 
            className="flex items-center gap-1"
            style={{ 
              color: account.change.amount >= 0 ? colors.status.success : colors.status.error 
            }}
          >
            {account.change.amount >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {account.change.percentage.toFixed(1)}%
            </span>
          </div>
          <span className="text-white/50 text-sm">
            {account.change.period}
          </span>
        </div>
      )}

      {/* Active Indicator */}
      {account.isActive && (
        <div className="mt-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs text-white/60">Active Account</span>
          </div>
        </div>
      )}
    </SimpleGlassCard>
  );
};

export default CleanAccountCard; 