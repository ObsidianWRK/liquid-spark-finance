import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart, Leaf, TrendingUp, TrendingDown, DollarSign, Shield, PiggyBank, Calendar, ChevronRight, Activity, Recycle } from 'lucide-react';
import EnhancedGlassCard from '../ui/EnhancedGlassCard';
import AnimatedCircularProgress from './components/AnimatedCircularProgress';
import EnhancedScoreCard from './components/EnhancedScoreCard';
import EnhancedMetricCard from './components/EnhancedMetricCard';
import ComprehensiveWellnessCard from './ComprehensiveWellnessCard';
import ComprehensiveEcoCard from './ComprehensiveEcoCard';
import { generateScoreSummary } from '@/services/scoringModel';
import { formatPercentage, getScoreColor } from '@/utils/formatters';
import { 
  usePerformanceOptimization, 
  useResponsiveBreakpoint, 
  useAnimationDelay,
  useLayoutDebug,
  usePerformanceTracking 
} from '@/hooks/usePerformanceOptimization';

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

const EnhancedInsightsPage = ({ transactions, accounts }: InsightsPageProps) => {
  const [animatedScores, setAnimatedScores] = useState<ScoreData>({ financial: 0, health: 0, eco: 0 });
  const [activeTab, setActiveTab] = useState('summary');
  const [scores, setScores] = useState<ScoreData>({ financial: 0, health: 0, eco: 0 });

  // Performance and responsive hooks
  const { liquidSettings } = usePerformanceOptimization();
  const breakpoint = useResponsiveBreakpoint();
  const { getAnimationDelay } = useAnimationDelay();
  
  // Debug and performance tracking (development only)
  useLayoutDebug('EnhancedInsightsPage');
  usePerformanceTracking('EnhancedInsightsPage');

  // Sample wellness data based on screenshot
  const wellnessData = useMemo(() => ({
    overallScore: 75,
    monthlySpending: {
      fitness: 85,
      nutrition: 38,
      healthcare: 340,
      wellness: 75,
      supplements: 45,
      mentalHealth: 120
    },
    healthTrends: {
      exercise: 'up' as const,
      nutrition: 'stable' as const,
      sleep: 'stable' as const,
      stress: 'down' as const
    }
  }), []);

  // Sample eco data based on screenshot  
  const ecoData = useMemo(() => ({
    overallScore: 82,
    monthlyImpact: {
      co2Saved: 48,
      treesEquivalent: 2,
      waterSaved: 384,
      energySaved: 256
    },
    monthlySpending: {
      sustainableFood: 127,
      renewableEnergy: 85,
      ecoTransport: 45,
      greenProducts: 120,
      carbonOffset: 25,
      conservation: 60
    },
    environmentalTrends: {
      carbonFootprint: 'down' as const,
      sustainability: 'up' as const,
      renewable: 'up' as const,
      waste: 'stable' as const
    }
  }), []);

  // Calculate comprehensive financial metrics (from current InsightsPage logic)
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

  useEffect(() => {
    generateScoreSummary(transactions, accounts).then(setScores).catch(console.error);
  }, [transactions, accounts]);

  // Enhanced animation with proper state management
  useEffect(() => {
    // Ensure DOM is ready before animating
    const timer = setTimeout(() => {
      setAnimatedScores(scores);
    }, 100); // Reduced delay for better UX
    
    return () => clearTimeout(timer);
  }, [scores]);

  // Trend calculation helper
  const getTrend = useCallback((value: number, threshold: { good: number; excellent: number }) => {
    if (value >= threshold.excellent) return 'up';
    if (value >= threshold.good) return 'stable';
    return 'down';
  }, []);

  return (
    <div className="insights-container liquid-insights-container liquid-bg-insights relative overflow-hidden">
      {/* Enhanced floating orbs for depth */}
      <div className="liquid-orb liquid-orb-1" />
      <div className="liquid-orb liquid-orb-2" />
      <div className="liquid-orb liquid-orb-3" />
      <div className="liquid-orb liquid-orb-4" />
      
      {/* Multiple overlay layers for stunning depth */}
      <div className="absolute inset-0 liquid-overlay-insights pointer-events-none" />
      <div className="absolute inset-0 insights-gradient-overlay pointer-events-none" />
      
      <div className="insights-content responsive-padding-sm">
        {/* Header */}
        <div className="insights-header">
          <h1 className="insights-title">Financial Health</h1>
          <p className="insights-subtitle">Track your financial wellness with AI-powered insights</p>
        </div>

        {/* Navigation Tabs */}
        <EnhancedGlassCard 
          className="tab-navigation backdrop-blur-xl border border-white/20"
          liquid={liquidSettings.animated}
          liquidIntensity={liquidSettings.intensity}
          liquidDistortion={0.3}
          liquidAnimated={false}
        >
          {['summary', 'health', 'eco', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button transition-all duration-300 ${
                activeTab === tab
                  ? 'text-white shadow-lg backdrop-blur-sm border border-white/30'
                  : 'text-white/70 hover:text-white/90'
              }`}
              style={activeTab === tab ? {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
              } : {}}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </EnhancedGlassCard>

        {activeTab === 'summary' && (
          <div className="responsive-spacing-lg">
            {/* Main Score Cards with responsive grid */}
            <div className="main-cards-grid">
              <div className="score-card-container">
                <EnhancedScoreCard
                  title="Financial Score"
                  score={animatedScores.financial}
                  subtitle="Based on spending and savings patterns"
                  icon={<DollarSign />}
                  color={getScoreColor(scores.financial)}
                  trend={getTrend(scores.financial, { good: 60, excellent: 75 })}
                  delay={getAnimationDelay(0)}
                  liquidIntensity={liquidSettings.intensity}
                  onClick={() => {
                    document.getElementById('key-metrics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                />
              </div>
              <div className="score-card-container">
                <EnhancedScoreCard
                  title="Health Score"
                  score={wellnessData.overallScore}
                  subtitle="Wellness spending insights"
                  icon={<Heart />}
                  color={getScoreColor(wellnessData.overallScore)}
                  trend="stable"
                  delay={getAnimationDelay(1)}
                  liquidIntensity={liquidSettings.intensity}
                  onClick={() => setActiveTab('health')}
                />
              </div>
              <div className="score-card-container">
                <EnhancedScoreCard
                  title="Eco Score"
                  score={ecoData.overallScore}
                  subtitle="Environmental impact tracking"
                  icon={<Leaf />}
                  color={getScoreColor(ecoData.overallScore)}
                  trend="up"
                  delay={getAnimationDelay(2)}
                  liquidIntensity={liquidSettings.intensity}
                  onClick={() => setActiveTab('eco')}
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div id="key-metrics">
              <h2 className="responsive-text-lg font-bold text-white mb-4 sm:mb-6">Key Metrics</h2>
              <div className="metrics-grid">
                <EnhancedMetricCard
                  title="Spending Ratio"
                  value={`${formatPercentage(metrics.spendingRatio)}%`}
                  subtitle="of income spent"
                  progress={metrics.spendingRatio}
                  color="#F59E0B"
                  icon={<DollarSign />}
                  delay={getAnimationDelay(3)}
                  liquidIntensity={liquidSettings.intensity}
                />
                <EnhancedMetricCard
                  title="Emergency Fund"
                  value={`${formatPercentage(metrics.emergencyFundMonths)}`}
                  subtitle="months covered"
                  progress={(metrics.emergencyFundMonths / 6) * 100}
                  color="#10B981"
                  icon={<Shield />}
                  delay={getAnimationDelay(4)}
                  liquidIntensity={liquidSettings.intensity}
                />
                <EnhancedMetricCard
                  title="Savings Rate"
                  value={`${formatPercentage(metrics.savingsRate)}%`}
                  subtitle="of income saved"
                  progress={metrics.savingsRate}
                  color="#3B82F6"
                  icon={<PiggyBank />}
                  delay={getAnimationDelay(5)}
                  liquidIntensity={liquidSettings.intensity}
                />
                <EnhancedMetricCard
                  title="Payment Score"
                  value={`${formatPercentage(metrics.billPaymentScore)}%`}
                  subtitle="on-time payments"
                  progress={metrics.billPaymentScore}
                  color="#10B981"
                  icon={<Calendar />}
                  delay={getAnimationDelay(6)}
                  liquidIntensity={liquidSettings.intensity}
                />
              </div>
            </div>
          </div>
        )}

        {/* Health Tab - Comprehensive Wellness */}
        {activeTab === 'health' && (
          <div className="responsive-spacing-md">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 w-full">
              <ComprehensiveWellnessCard data={wellnessData} />
            </div>
          </div>
        )}

        {/* Eco Tab - Comprehensive Environmental Impact */}
        {activeTab === 'eco' && (
          <div className="responsive-spacing-md">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 w-full">
              <ComprehensiveEcoCard data={ecoData} />
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="responsive-spacing-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <EnhancedGlassCard className="responsive-padding-md">
                <h3 className="responsive-text-base font-semibold text-white mb-4">Financial Trends</h3>
                <div className="responsive-spacing-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 responsive-text-sm">Monthly Spending</span>
                    <span className="text-green-400 responsive-text-sm">↓ 12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 responsive-text-sm">Savings Rate</span>
                    <span className="text-blue-400 responsive-text-sm">↑ 8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 responsive-text-sm">Investment Growth</span>
                    <span className="text-green-400 responsive-text-sm">↑ 15%</span>
                  </div>
                </div>
              </EnhancedGlassCard>
              <EnhancedGlassCard className="responsive-padding-md">
                <h3 className="responsive-text-base font-semibold text-white mb-4">Category Analysis</h3>
                <div className="responsive-spacing-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 responsive-text-sm">Food & Dining</span>
                    <span className="text-red-400 responsive-text-sm">↑ 5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 responsive-text-sm">Transportation</span>
                    <span className="text-green-400 responsive-text-sm">↓ 18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 responsive-text-sm">Healthcare</span>
                    <span className="text-white/70 responsive-text-sm">— 0%</span>
                  </div>
                </div>
              </EnhancedGlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedInsightsPage; 