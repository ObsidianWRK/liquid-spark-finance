import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart, Leaf, TrendingUp, TrendingDown, DollarSign, Shield, PiggyBank, Calendar, ChevronRight, Activity, Zap, Target } from 'lucide-react';
import EnhancedGlassCard from '../ui/EnhancedGlassCard';
import AnimatedCircularProgress from './components/AnimatedCircularProgress';
import RefinedScoreCard from './components/RefinedScoreCard';
import RefinedMetricCard from './components/RefinedMetricCard';
import { mockHealthEcoService } from '@/services/mockHealthEcoService';
import { formatPercentage, getScoreColor } from '@/utils/formatters';

// Enhanced TypeScript interfaces
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

interface ScoreData {
  financial: number;
  health: number;
  eco: number;
}

interface FinancialMetrics {
  spendingRatio: number;
  emergencyFundMonths: number;
  savingsRate: number;
  billPaymentScore: number;
  debtToIncomeRatio: number;
  monthlyIncome: number;
  monthlySpending: number;
  totalBalance: number;
}

const RefinedInsightsPage = ({ transactions, accounts }: InsightsPageProps) => {
  const [animatedScores, setAnimatedScores] = useState<ScoreData>({ financial: 0, health: 0, eco: 0 });
  const [activeTab, setActiveTab] = useState('summary');

  // Calculate comprehensive financial metrics (maintaining existing logic)
  const metrics = useMemo<FinancialMetrics>(() => {
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

  // Calculate scores using existing logic
  const scores = useMemo<ScoreData>(() => {
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

    const financialScore = Math.round(
      spendingScore * weights.spendingRatio +
      emergencyScore * weights.emergencyFund +
      debtScore * weights.debtRatio +
      savingsScore * weights.savingsRate +
      billScore * weights.billPayment +
      investmentScore * weights.investments
    );

    const healthData = mockHealthEcoService.getHealthScore(transactions);
    const ecoData = mockHealthEcoService.getEcoScore(transactions);

    return {
      financial: financialScore,
      health: healthData.score,
      eco: ecoData.score
    };
  }, [metrics, transactions]);

  // Animate scores on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(scores);
    }, 300);
    return () => clearTimeout(timer);
  }, [scores]);

  // Trend calculation helper
  const getTrend = useCallback((value: number, threshold: { good: number; excellent: number }) => {
    if (value >= threshold.excellent) return 'up';
    if (value >= threshold.good) return 'stable';
    return 'down';
  }, []);

  const RefinedTrendCard = React.memo(({ title, subtitle, trend, delay = 0 }: {
    title: string;
    subtitle: string;
    trend: string;
    delay?: number;
  }) => (
    <EnhancedGlassCard 
      className="refined-trend-card relative overflow-hidden rounded-2xl backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 group cursor-pointer p-4 bg-slate-900/20"
      liquid={true}
      liquidIntensity={0.15}
      liquidDistortion={0.1}
      liquidAnimated={false}
      liquidInteractive={true}
      style={{
        animation: `slideInScale 0.6s ease-out ${delay}ms both`
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
        
        <div className="mt-4 h-16 flex items-end space-x-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="trend-bar flex-1 rounded-sm transition-all duration-500 relative overflow-hidden"
              style={{ 
                height: `${Math.random() * 60 + 20}%`,
                background: 'linear-gradient(180deg, rgba(100, 116, 139, 0.8), rgba(100, 116, 139, 0.4))',
                animationDelay: `${i * 50}ms`
              }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-t from-transparent via-slate-400/20 to-transparent"
                style={{ animation: `trendPulse 2s infinite ${i * 0.1}s` }}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <span className="text-sm font-medium text-slate-300">{trend}</span>
        </div>
      </div>
    </EnhancedGlassCard>
  ));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Subtle background effects matching the main app */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/10 to-slate-800/5" />
      
      {/* Minimal floating orbs for consistency */}
      <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-slate-700/5 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/3 right-1/3 w-40 h-40 bg-indigo-900/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-slideInScale">
          <h1 className="text-4xl font-bold text-white">
            Financial Insights
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Professional analysis of your financial health with sophisticated visual intelligence
          </p>
        </div>

        {/* Main Score Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RefinedScoreCard
            title="Financial Health"
            score={animatedScores.financial}
            subtitle="Overall financial wellness score"
            icon={<DollarSign />}
            color="#6366f1" // Indigo-500
            trend={getTrend(animatedScores.financial, { good: 60, excellent: 80 })}
            delay={0}
            liquidIntensity={0.2}
          />
          
          <RefinedScoreCard
            title="Wellness Score"
            score={animatedScores.health}
            subtitle="Health-conscious spending habits"
            icon={<Heart />}
            color="#22c55e" // Green-500
            trend={getTrend(animatedScores.health, { good: 65, excellent: 85 })}
            delay={200}
            liquidIntensity={0.2}
          />
          
          <RefinedScoreCard
            title="Eco Impact"
            score={animatedScores.eco}
            subtitle="Environmental responsibility"
            icon={<Leaf />}
            color="#10b981" // Emerald-500
            trend={getTrend(animatedScores.eco, { good: 70, excellent: 90 })}
            delay={400}
            liquidIntensity={0.2}
          />
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RefinedMetricCard
            title="Monthly Spending"
            value={`$${metrics.monthlySpending.toLocaleString()}`}
            subtitle="Current month expenses"
            progress={Math.min(100, metrics.spendingRatio)}
            color="#64748b" // Slate-500
            icon={<DollarSign />}
            trend={metrics.spendingRatio > 80 ? 'down' : metrics.spendingRatio < 60 ? 'up' : 'stable'}
            trendValue={`${formatPercentage(metrics.spendingRatio)}`}
            delay={600}
            liquidIntensity={0.15}
          />

          <RefinedMetricCard
            title="Emergency Fund"
            value={metrics.emergencyFundMonths.toFixed(1)}
            subtitle="Months of expenses covered"
            progress={Math.min(100, (metrics.emergencyFundMonths / 6) * 100)}
            color="#8b5cf6" // Violet-500
            icon={<Shield />}
            trend={metrics.emergencyFundMonths >= 6 ? 'up' : metrics.emergencyFundMonths >= 3 ? 'stable' : 'down'}
            trendValue={`${formatPercentage((metrics.emergencyFundMonths / 6) * 100)}`}
            delay={800}
            liquidIntensity={0.15}
          />

          <RefinedMetricCard
            title="Savings Rate"
            value={`${formatPercentage(metrics.savingsRate)}`}
            subtitle="Income saved monthly"
            progress={Math.min(100, metrics.savingsRate)}
            color="#06b6d4" // Cyan-500
            icon={<PiggyBank />}
            trend={metrics.savingsRate > 20 ? 'up' : metrics.savingsRate > 10 ? 'stable' : 'down'}
            trendValue={metrics.savingsRate > 0 ? '+' + formatPercentage(metrics.savingsRate) : formatPercentage(metrics.savingsRate)}
            delay={1000}
            liquidIntensity={0.15}
          />

          <RefinedMetricCard
            title="Payment Score"
            value={Math.round(metrics.billPaymentScore)}
            subtitle="On-time payment reliability"
            progress={metrics.billPaymentScore}
            color="#f59e0b" // Amber-500
            icon={<Calendar />}
            trend={metrics.billPaymentScore >= 95 ? 'up' : metrics.billPaymentScore >= 85 ? 'stable' : 'down'}
            trendValue={`${Math.round(metrics.billPaymentScore)}%`}
            delay={1200}
            liquidIntensity={0.15}
          />
        </div>

        {/* Professional Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass-card p-6">
            <RefinedTrendCard
              title="Performance Trends"
              subtitle="Monthly financial trajectory"
              trend="Improving steadily"
              delay={1400}
            />
          </div>

          <div className="liquid-glass-card p-6">
            <RefinedTrendCard
              title="Goal Progress"
              subtitle="Tracking financial milestones"
              trend="On target"
              delay={1600}
            />
          </div>

          <div className="liquid-glass-card p-6">
            <RefinedTrendCard
              title="Risk Assessment"
              subtitle="Financial stability outlook"
              trend="Low risk profile"
              delay={1800}
            />
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="liquid-glass-card p-8" style={{ animation: `slideInScale 0.8s ease-out 2000ms both` }}>
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Target className="w-8 h-8 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Strengths</span>
                </h3>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Consistent payment history with {Math.round(metrics.billPaymentScore)}% reliability</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Total balance of ${metrics.totalBalance.toLocaleString()} demonstrates financial stability</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Savings rate of {formatPercentage(metrics.savingsRate)} shows disciplined approach</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <span>Opportunities</span>
                </h3>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Emergency fund covers {metrics.emergencyFundMonths.toFixed(1)} months of expenses</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Consider optimizing spending ratio of {formatPercentage(metrics.spendingRatio)}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Debt-to-income ratio at {formatPercentage(metrics.debtToIncomeRatio)} offers room for improvement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefinedInsightsPage; 