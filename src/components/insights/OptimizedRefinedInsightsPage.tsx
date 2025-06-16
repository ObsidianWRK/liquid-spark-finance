import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Heart, Leaf, TrendingUp, TrendingDown, DollarSign, Shield, PiggyBank, Calendar, ChevronRight, Activity, Zap, Target, BarChart3 } from 'lucide-react';
import EnhancedGlassCard from '../ui/EnhancedGlassCard';
import AnimatedCircularProgress from './components/AnimatedCircularProgress';
import RefinedScoreCard from './components/RefinedScoreCard';
import RefinedMetricCard from './components/RefinedMetricCard';
import RefinedTrendCard from './components/RefinedTrendCard';
import ComprehensiveWellnessCard from './components/ComprehensiveWellnessCard';
import ComprehensiveEcoCard from './components/ComprehensiveEcoCard';
import { mockHealthEcoService } from '@/services/mockHealthEcoService';
import { formatPercentage, getScoreColor } from '@/utils/formatters';
import { usePerformanceMonitor, useOptimizedMemo } from '@/utils/performanceOptimizer';

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

// Performance detector
const usePerformanceDetector = () => {
  return useMemo(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : isMobile;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return { isMobile, isLowEnd, prefersReducedMotion };
  }, []);
};

// Optimized metric calculation
const useOptimizedMetrics = (transactions: Transaction[], accounts: Account[]) => {
  return useMemo<FinancialMetrics>(() => {
    const currentMonth = new Date().getMonth();
    
    const monthlyIncome = transactions
      .filter(t => t.amount > 0 && new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySpending = Math.abs(transactions
      .filter(t => t.amount < 0 && new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0));

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    const spendingRatio = monthlyIncome > 0 ? (monthlySpending / monthlyIncome) * 100 : 0;
    const emergencyFundMonths = monthlySpending > 0 ? totalBalance / monthlySpending : 0;
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
};

const OptimizedRefinedInsightsPage = memo(({ transactions, accounts }: InsightsPageProps) => {
  const performance = usePerformanceDetector();
  const [animatedScores, setAnimatedScores] = useState<ScoreData>({ financial: 0, health: 0, eco: 0 });
  const metrics = useOptimizedMetrics(transactions, accounts);

  // Calculate scores with performance optimization
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

    // Use simplified scores for performance on low-end devices
    const healthScore = performance.isLowEnd ? 75 : mockHealthEcoService.getHealthScore(transactions).score;
    const ecoScore = performance.isLowEnd ? 68 : mockHealthEcoService.getEcoScore(transactions).score;

    return {
      financial: financialScore,
      health: healthScore,
      eco: ecoScore
    };
  }, [metrics, transactions, performance.isLowEnd]);

  // Animate scores with performance consideration
  useEffect(() => {
    const delay = performance.isMobile ? 500 : 300;
    const timer = setTimeout(() => {
      setAnimatedScores(scores);
    }, delay);
    return () => clearTimeout(timer);
  }, [scores, performance.isMobile]);

  // Trend calculation helper
  const getTrend = useCallback((value: number, threshold: { good: number; excellent: number }) => {
    if (value >= threshold.excellent) return 'up';
    if (value >= threshold.good) return 'stable';
    return 'down';
  }, []);

  // Performance-based liquid glass settings
  const liquidSettings = useMemo(() => {
    if (performance.isLowEnd) {
      return { intensity: 0.15, animated: false, interactive: false };
    }
    if (performance.isMobile) {
      return { intensity: 0.25, animated: false, interactive: true };
    }
    return { intensity: 0.35, animated: !performance.prefersReducedMotion, interactive: true };
  }, [performance]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Simplified background for performance */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/5 to-slate-800/5" />
      
      {/* Conditional decorative elements */}
      {!performance.isLowEnd && (
        <>
          <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-slate-700/5 rounded-full blur-3xl animate-pulse" />
          <div className="fixed bottom-1/3 right-1/3 w-40 h-40 bg-indigo-900/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-slideInScale">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Financial Insights
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
            Optimized analysis of your financial health
          </p>
        </div>

        {/* Main Score Cards */}
        <div className="main-cards-grid">
          <RefinedScoreCard
            title="Financial Health"
            score={animatedScores.financial}
            subtitle="Overall financial wellness score"
            icon={<DollarSign />}
            color="#6366f1"
            trend={getTrend(animatedScores.financial, { good: 60, excellent: 80 })}
            delay={0}
            liquidIntensity={liquidSettings.intensity}
          />
          
          <RefinedScoreCard
            title="Health Score"
            score={animatedScores.health}
            subtitle="Wellness and lifestyle"
            icon={<Heart />}
            color="#22c55e"
            trend="stable"
            delay={200}
            liquidIntensity={liquidSettings.intensity}
          />
          
          <RefinedScoreCard
            title="Eco Score"
            score={animatedScores.eco}
            subtitle="Environmental impact"
            icon={<Leaf />}
            color="#10b981"
            trend="up"
            delay={400}
            liquidIntensity={liquidSettings.intensity}
          />
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <RefinedMetricCard
            title="Monthly Spending"
            value={`$${metrics.monthlySpending.toLocaleString()}`}
            subtitle="Current month expenses"
            progress={Math.min(100, metrics.spendingRatio)}
            color="#64748b"
            icon={<DollarSign />}
            trend={metrics.spendingRatio > 80 ? 'down' : metrics.spendingRatio < 60 ? 'up' : 'stable'}
            trendValue={`${formatPercentage(metrics.spendingRatio)}`}
            delay={600}
            liquidIntensity={liquidSettings.intensity}
          />

          <RefinedMetricCard
            title="Emergency Fund"
            value={metrics.emergencyFundMonths.toFixed(1)}
            subtitle="Months covered"
            progress={Math.min(100, (metrics.emergencyFundMonths / 6) * 100)}
            color="#8b5cf6"
            icon={<Shield />}
            trend={metrics.emergencyFundMonths >= 6 ? 'up' : 'stable'}
            trendValue={`${formatPercentage((metrics.emergencyFundMonths / 6) * 100)}`}
            delay={800}
            liquidIntensity={liquidSettings.intensity}
          />

          <RefinedMetricCard
            title="Savings Rate"
            value={`${formatPercentage(metrics.savingsRate)}`}
            subtitle="Income saved monthly"
            progress={Math.min(100, metrics.savingsRate)}
            color="#06b6d4"
            icon={<PiggyBank />}
            trend={metrics.savingsRate > 20 ? 'up' : 'stable'}
            trendValue={`+${formatPercentage(metrics.savingsRate)}`}
            delay={1000}
            liquidIntensity={liquidSettings.intensity}
          />

          <RefinedMetricCard
            title="Payment Score"
            value={Math.round(metrics.billPaymentScore)}
            subtitle="On-time reliability"
            progress={metrics.billPaymentScore}
            color="#f59e0b"
            icon={<Calendar />}
            trend="up"
            trendValue={`${Math.round(metrics.billPaymentScore)}%`}
            delay={1200}
            liquidIntensity={liquidSettings.intensity}
          />
        </div>

        {/* Trend Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <RefinedTrendCard
            title="Performance Trends"
            subtitle="Monthly trajectory"
            trend="Improving steadily"
            delay={1400}
            icon={<TrendingUp className="w-5 h-5" />}
            liquidIntensity={liquidSettings.intensity}
            interactive={!performance.isLowEnd}
          />

          <RefinedTrendCard
            title="Goal Progress"
            subtitle="Financial milestones"
            trend="On target"
            delay={1600}
            icon={<Target className="w-5 h-5" />}
            liquidIntensity={liquidSettings.intensity}
            interactive={!performance.isLowEnd}
          />

          <RefinedTrendCard
            title="Risk Assessment"
            subtitle="Stability outlook"
            trend="Low risk profile"
            delay={1800}
            icon={<BarChart3 className="w-5 h-5" />}
            liquidIntensity={liquidSettings.intensity}
            interactive={!performance.isLowEnd}
          />
        </div>

        {/* Summary */}
        <div className="liquid-glass-card p-6 sm:p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Financial Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Strengths</span>
                </h3>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Payment reliability: {Math.round(metrics.billPaymentScore)}%</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Balance: ${metrics.totalBalance.toLocaleString()}</span>
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
                    <span>Emergency fund: {metrics.emergencyFundMonths.toFixed(1)} months</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Savings rate: {formatPercentage(metrics.savingsRate)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

OptimizedRefinedInsightsPage.displayName = 'OptimizedRefinedInsightsPage';

export default OptimizedRefinedInsightsPage; 