
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Account {
  id: string;
  type: string;
  nickname: string;
  balance: number;
  availableBalance: number;
  currency: string;
}

interface AccountCardProps {
  account: Account;
  recentTransactions?: Array<{
    id: string;
    merchant: string;
    amount: number;
    date: string;
  }>;
}

const AccountCard = ({ account, recentTransactions = [] }: AccountCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <GlassCard 
      className="p-5 glass-interactive stagger-item"
      interactive
      shimmer
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg">{account.type}</h3>
          <p className="text-white/50 text-sm">{account.nickname}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-lg">
            {formatCurrency(account.balance)}
          </p>
          <p className="text-white/50 text-xs">
            Available: {formatCurrency(account.availableBalance)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-white/70 text-xs">Active</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/50" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/50" />
        )}
      </div>

      {/* Expanded Content */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? 'max-h-96 mt-4' : 'max-h-0'
      }`}>
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-white/70 text-sm font-medium mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2">
                <span className="text-white/70 text-sm">{transaction.merchant}</span>
                <span className={`text-sm font-medium ${
                  transaction.amount > 0 ? 'text-green-400' : 'text-white'
                }`}>
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default AccountCard;
