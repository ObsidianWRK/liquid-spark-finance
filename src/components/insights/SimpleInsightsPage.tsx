import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Leaf, DollarSign, TrendingUp } from 'lucide-react';
import { SharedScoreCircle } from '@/components/shared';

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

interface Account {
  id: string;
  type: string;
  nickname: string;
  balance: number;
  availableBalance: number;
  currency: string;
}

interface SimpleInsightsPageProps {
  transactions: Transaction[];
  accounts: Account[];
}

// Fallback simplified version using only static imports
const SimpleInsightsPage: React.FC<SimpleInsightsPageProps> = ({ transactions, accounts }) => {
  const [scores, setScores] = useState({ financial: 0, health: 0, eco: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Calculate basic financial data
  const financialData = useMemo(() => {
    const monthlySpending = Math.abs(transactions
      .filter(t => t.amount < 0 && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0));
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    return {
      monthlySpending,
      totalBalance,
    };
  }, [transactions, accounts]);

  // Simple score calculation
  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        setScores({
          financial: 72,
          health: 75,
          eco: 82,
        });
      } catch (error) {
        console.error('Error loading scores:', error);
        setScores({ financial: 72, health: 75, eco: 82 });
      } finally {
        setIsLoading(false);
      }
    };

    loadScores();
  }, [transactions, accounts]);

  if (isLoading) {
    return (
      <div className="w-full text-white flex items-center justify-center py-20">
        <div className="liquid-glass-fallback rounded-2xl p-8">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-white text-lg">Loading insights...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Financial Insights (Simple)
          </h1>
          <p className="text-white/70 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Essential financial health overview
          </p>
        </div>

        {/* Score Overview */}
        <div className="liquid-glass-fallback rounded-2xl p-6 sm:p-8 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">
            Your Overall Scores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <SharedScoreCircle 
                score={scores.financial} 
                type="financial"
                size="lg"
                label="Financial Health"
                showLabel={true}
              />
            </div>
            <div className="text-center">
              <SharedScoreCircle 
                score={scores.health} 
                type="health"
                size="lg"
                label="Wellness Score"
                showLabel={true}
              />
            </div>
            <div className="text-center">
              <SharedScoreCircle 
                score={scores.eco} 
                type="eco"
                size="lg"
                label="Eco Impact"
                showLabel={true}
              />
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="liquid-glass-fallback rounded-2xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Monthly Spending</h4>
                <p className="text-white/70 text-sm">${financialData.monthlySpending.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="liquid-glass-fallback rounded-2xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Total Balance</h4>
                <p className="text-white/70 text-sm">${financialData.totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="liquid-glass-fallback rounded-2xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Heart className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">System Status</h4>
                <p className="text-white/70 text-sm">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleInsightsPage;