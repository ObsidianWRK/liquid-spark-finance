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
          {/* Overall Scores Section */}
          <div className="liquid-glass-card rounded-3xl p-6">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Your Overall Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgba(59, 130, 246, 0.2)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#3B82F6"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{healthScore}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Financial Health</h3>
                </div>
                <p className="text-sm text-white/60">Score: {healthScore}/100</p>
                <p className="text-xs text-white/40">Monthly spending: ${metrics.monthlySpending.toLocaleString()}</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgba(239, 68, 68, 0.2)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#EF4444"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(healthData.score / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{healthData.score}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Wellness Score</h3>
                </div>
                <p className="text-sm text-white/60">Score: {healthData.score}/100</p>
                <p className="text-xs text-white/40">Monthly wellness: $703</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgba(34, 197, 94, 0.2)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#22C55E"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(ecoData.score / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{ecoData.score}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Eco Impact</h3>
                </div>
                <p className="text-sm text-white/60">Score: {ecoData.score}/100</p>
                <p className="text-xs text-white/40">CO₂ saved: 48kg this month</p>
              </div>
            </div>
          </div>
          
          {/* Key Metrics Grid */}
          <div className="liquid-glass-card rounded-3xl p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-400" />
              Key Financial Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Monthly Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="liquid-glass-card rounded-3xl p-6">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Monthly Insights
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Total Income</p>
                    <p className="text-white/60 text-sm">This month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-bold">${metrics.monthlyIncome.toLocaleString()}</p>
                    <p className="text-green-400 text-sm">+5.2%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Total Expenses</p>
                    <p className="text-white/60 text-sm">This month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-bold">${metrics.monthlySpending.toLocaleString()}</p>
                    <p className="text-orange-400 text-sm">+2.1%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Net Savings</p>
                    <p className="text-white/60 text-sm">This month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-bold">${(metrics.monthlyIncome - metrics.monthlySpending).toLocaleString()}</p>
                    <p className="text-blue-400 text-sm">+12.8%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="liquid-glass-card rounded-3xl p-6">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-purple-400" />
                Top Spending Categories
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-white">Dining & Food</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium">$892</span>
                    <div className="text-xs text-white/60">28.5%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-white">Transportation</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium">$654</span>
                    <div className="text-xs text-white/60">21.2%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-white">Shopping</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium">$523</span>
                    <div className="text-xs text-white/60">16.8%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-white">Entertainment</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium">$387</span>
                    <div className="text-xs text-white/60">12.4%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                    <span className="text-white">Health & Fitness</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium">$245</span>
                    <div className="text-xs text-white/60">7.9%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="liquid-glass-card rounded-3xl p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              Personalized Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-400/20">
                <div className="flex items-center gap-2 mb-3">
                  <PiggyBank className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Increase Savings</span>
                </div>
                <p className="text-white/70 text-sm mb-3">
                  You're saving {Math.round(metrics.savingsRate)}% of your income. Try to reach 20% by reducing dining expenses.
                </p>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <span>Potential monthly savings: $285</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/20">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-medium">Emergency Fund</span>
                </div>
                <p className="text-white/70 text-sm mb-3">
                  Build your emergency fund to 6 months. You currently have {metrics.emergencyFundMonths.toFixed(1)} months covered.
                </p>
                <div className="flex items-center gap-2 text-orange-400 text-sm">
                  <span>Target: ${(metrics.monthlySpending * 6).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/20">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Investment Opportunity</span>
                </div>
                <p className="text-white/70 text-sm mb-3">
                  Consider investing ${Math.round((metrics.monthlyIncome - metrics.monthlySpending) * 0.7)} monthly in index funds.
                </p>
                <div className="flex items-center gap-2 text-blue-400 text-sm">
                  <span>Projected 10-year growth: $45K</span>
                </div>
              </div>
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
