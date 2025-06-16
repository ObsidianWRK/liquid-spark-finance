import React, { useMemo, useState } from 'react';
import HealthScore from './HealthScore';
import EcoScore from './EcoScore';
import MetricCard from './MetricCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockHealthEcoService } from '@/services/mockHealthEcoService';
import { 
  DollarSign, 
  Shield, 
  TrendingUp, 
  PiggyBank, 
  Calendar, 
  PieChart,
  Heart,
  Leaf
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
  const [activeTab, setActiveTab] = useState('overview');

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
    
    const spendingRatio = monthlyIncome > 0 ? (monthlySpending / monthlyIncome) * 100 : 0;
    const emergencyFundMonths = monthlyExpenses > 0 ? totalBalance / monthlyExpenses : 0;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0;
    
    const creditCardDebt = Math.abs(accounts
      .filter(acc => acc.type === 'Credit Card' && acc.balance < 0)
      .reduce((sum, acc) => sum + acc.balance, 0));
    const debtToIncomeRatio = monthlyIncome > 0 ? (creditCardDebt / (monthlyIncome * 12)) * 100 : 0;
    
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

    const spendingScore = Math.max(0, 100 - metrics.spendingRatio);
    const emergencyScore = Math.min(100, (metrics.emergencyFundMonths / 6) * 100);
    const debtScore = Math.max(0, 100 - metrics.debtToIncomeRatio);
    const savingsScore = Math.min(100, metrics.savingsRate);
    const billScore = metrics.billPaymentScore;
    const investmentScore = 70;

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

  // Get health and eco data
  const healthData = useMemo(() => mockHealthEcoService.getHealthScore(transactions), [transactions]);
  const ecoData = useMemo(() => mockHealthEcoService.getEcoScore(transactions), [transactions]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Financial Insights</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="liquid-glass-card grid w-full grid-cols-3 mb-6 p-1 rounded-2xl">
          <TabsTrigger 
            value="overview" 
            className="liquid-glass-menu-item text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="liquid-glass-menu-item text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
          >
            Health
          </TabsTrigger>
          <TabsTrigger 
            value="eco" 
            className="liquid-glass-menu-item text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
          >
            Eco Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Health and Eco Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthScore 
              score={healthData.score} 
              trends={healthData.trends} 
            />
            <EcoScore 
              score={ecoData.score}
              metrics={ecoData.metrics}
              monthlyImpact={ecoData.monthlyImpact}
            />
          </div>

          {/* Financial Health Score */}
          <div className="liquid-glass-card rounded-3xl p-6">
            <HealthScore 
              score={healthScore}
              trends={{
                exercise: Math.round(metrics.savingsRate),
                nutrition: Math.round(100 - metrics.spendingRatio),
                sleep: Math.round(metrics.billPaymentScore),
                stress: Math.round(100 - metrics.debtToIncomeRatio)
              }}
            />
          </div>
          
          {/* Key Metrics Grid */}
          <div className="liquid-glass-card rounded-3xl p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-400" />
              Key Financial Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard
                title="Spending Ratio"
                value={`${Math.round(metrics.spendingRatio)}%`}
                subtitle="of income spent"
                trend={metrics.spendingRatio > 80 ? 'up' : metrics.spendingRatio < 60 ? 'down' : 'stable'}
                color="#FF9500"
                icon={DollarSign}
                index={0}
              >
                <div className="w-full bg-white/10 rounded-full h-2 mt-3">
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
                icon={Shield}
                index={1}
              >
                <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (metrics.emergencyFundMonths / 6) * 100)}%` }}
                  />
                </div>
              </MetricCard>

              <MetricCard
                title="Savings Rate"
                value={`${Math.round(metrics.savingsRate)}%`}
                subtitle="of income saved"
                trend={metrics.savingsRate > 10 ? 'up' : 'down'}
                color="#007AFF"
                icon={PiggyBank}
                index={2}
              >
                <div className="w-full bg-white/10 rounded-full h-2 mt-3">
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
                icon={Calendar}
                index={3}
              >
                <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${metrics.billPaymentScore}%` }}
                  />
                </div>
              </MetricCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="liquid-glass-card rounded-3xl p-6">
              <HealthScore 
                score={healthData.score} 
                trends={healthData.trends} 
              />
            </div>
            <div className="liquid-glass-card rounded-3xl p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-pink-400" />
                Health Insights
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <MetricCard
                  title="Fitness Spending"
                  value="$85"
                  subtitle="this month"
                  trend="up"
                  color="#34C759"
                  icon={TrendingUp}
                  index={0}
                />
                <MetricCard
                  title="Healthcare Budget"
                  value="$120"
                  subtitle="preventive care"
                  trend="stable"
                  color="#007AFF"
                  icon={Shield}
                  index={1}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="eco" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="liquid-glass-card rounded-3xl p-6">
              <EcoScore 
                score={ecoData.score}
                metrics={ecoData.metrics}
                monthlyImpact={ecoData.monthlyImpact}
              />
            </div>
            <div className="liquid-glass-card rounded-3xl p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2 mb-6">
                <Leaf className="w-6 h-6 text-green-400" />
                Eco Insights
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <MetricCard
                  title="Sustainable Brands"
                  value="42%"
                  subtitle="of total spending"
                  trend="up"
                  color="#34C759"
                  icon={Leaf}
                  index={0}
                />
                <MetricCard
                  title="Carbon Offset"
                  value="$25"
                  subtitle="monthly investment"
                  trend="stable"
                  color="#007AFF"
                  icon={PieChart}
                  index={1}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsPage;
