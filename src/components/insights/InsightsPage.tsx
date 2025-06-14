
import React, { useMemo } from 'react';
import HealthScore from './HealthScore';
import MetricCard from './MetricCard';
import { 
  DollarSign, 
  Shield, 
  TrendingUp, 
  PiggyBank, 
  Calendar, 
  PieChart 
} from 'lucide-react';

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

interface InsightsPageProps {
  transactions: Transaction[];
  accounts: Account[];
}

const InsightsPage = ({ transactions, accounts }: InsightsPageProps) => {
  // Calculate financial health metrics
  const metrics = useMemo(() => {
    const monthlyIncome = transactions
      .filter(t => t.amount > 0 && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySpending = Math.abs(transactions
      .filter(t => t.amount < 0 && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0));

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const monthlyExpenses = monthlySpending;
    
    // Calculate individual metrics
    const spendingRatio = monthlyIncome > 0 ? (monthlySpending / monthlyIncome) * 100 : 0;
    const emergencyFundMonths = monthlyExpenses > 0 ? totalBalance / monthlyExpenses : 0;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0;
    
    // Simplified debt calculation (assuming credit card with negative balance)
    const creditCardDebt = Math.abs(accounts
      .filter(acc => acc.type === 'Credit Card' && acc.balance < 0)
      .reduce((sum, acc) => sum + acc.balance, 0));
    const debtToIncomeRatio = monthlyIncome > 0 ? (creditCardDebt / (monthlyIncome * 12)) * 100 : 0;
    
    // Bill payment score (simplified - based on completed transactions)
    const completedTransactions = transactions.filter(t => t.status === 'completed').length;
    const totalTransactions = transactions.length;
    const billPaymentScore = totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 100;
    
    return {
      spendingRatio,
      emergencyFundMonths,
      savingsRate,
      debtToIncomeRatio,
      billPaymentScore,
      monthlyIncome,
      monthlySpending,
      totalBalance
    };
  }, [transactions, accounts]);

  // Calculate overall health score
  const healthScore = useMemo(() => {
    const weights = {
      spendingRatio: 0.25,
      emergencyFund: 0.20,
      debtRatio: 0.20,
      savingsRate: 0.15,
      billPayment: 0.10,
      investments: 0.10
    };

    // Normalize metrics to 0-100 scale
    const spendingScore = Math.max(0, 100 - metrics.spendingRatio);
    const emergencyScore = Math.min(100, (metrics.emergencyFundMonths / 6) * 100);
    const debtScore = Math.max(0, 100 - metrics.debtToIncomeRatio);
    const savingsScore = Math.min(100, metrics.savingsRate);
    const billScore = metrics.billPaymentScore;
    const investmentScore = 70; // Placeholder

    const totalScore = (
      spendingScore * weights.spendingRatio +
      emergencyScore * weights.emergencyFund +
      debtScore * weights.debtRatio +
      savingsScore * weights.savingsRate +
      billScore * weights.billPayment +
      investmentScore * weights.investments
    );

    return Math.round(totalScore);
  }, [metrics]);

  return (
    <div className="space-y-6">
      <HealthScore 
        score={healthScore}
        category="Financial Health"
        lastUpdated={new Date()}
      />
      
      <div>
        <h3 className="text-white text-lg font-bold mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Spending Ratio"
            value={`${Math.round(metrics.spendingRatio)}%`}
            subtitle="of income spent"
            trend={metrics.spendingRatio > 80 ? 'up' : metrics.spendingRatio < 60 ? 'down' : 'stable'}
            color="#FF9500"
            icon={<DollarSign className="w-4 h-4" />}
            index={0}
          >
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, metrics.spendingRatio)}%` }}
              />
            </div>
          </MetricCard>

          <MetricCard
            title="Emergency Fund"
            value={`${metrics.emergencyFundMonths.toFixed(1)}`}
            subtitle="months covered"
            trend={metrics.emergencyFundMonths >= 6 ? 'up' : 'down'}
            color="#34C759"
            icon={<Shield className="w-4 h-4" />}
            index={1}
          >
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (metrics.emergencyFundMonths / 6) * 100)}%` }}
              />
            </div>
          </MetricCard>

          <MetricCard
            title="Debt-to-Income"
            value={`${Math.round(metrics.debtToIncomeRatio)}%`}
            subtitle="annual income"
            trend={metrics.debtToIncomeRatio < 20 ? 'down' : 'up'}
            color="#FF3B30"
            icon={<TrendingUp className="w-4 h-4" />}
            index={2}
          >
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, metrics.debtToIncomeRatio)}%` }}
              />
            </div>
          </MetricCard>

          <MetricCard
            title="Savings Rate"
            value={`${Math.round(metrics.savingsRate)}%`}
            subtitle="of income saved"
            trend={metrics.savingsRate > 10 ? 'up' : 'down'}
            color="#007AFF"
            icon={<PiggyBank className="w-4 h-4" />}
            index={3}
          >
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, metrics.savingsRate)}%` }}
              />
            </div>
          </MetricCard>

          <MetricCard
            title="Bill Payment Score"
            value={`${Math.round(metrics.billPaymentScore)}%`}
            subtitle="on-time payments"
            trend={metrics.billPaymentScore > 95 ? 'up' : 'stable'}
            color="#34C759"
            icon={<Calendar className="w-4 h-4" />}
            index={4}
          >
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.billPaymentScore}%` }}
              />
            </div>
          </MetricCard>

          <MetricCard
            title="Investment Diversity"
            value="70%"
            subtitle="portfolio balance"
            trend="stable"
            color="#AF52DE"
            icon={<PieChart className="w-4 h-4" />}
            index={5}
          >
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: '70%' }}
              />
            </div>
          </MetricCard>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
