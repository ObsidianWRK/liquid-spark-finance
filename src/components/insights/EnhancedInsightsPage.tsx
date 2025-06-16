import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart, Leaf, TrendingUp, TrendingDown, DollarSign, Shield, PiggyBank, Calendar, ChevronRight, Activity, Recycle, ArrowLeft } from 'lucide-react';
import EnhancedGlassCard from '../ui/EnhancedGlassCard';
import AnimatedCircularProgress from './components/AnimatedCircularProgress';
import EnhancedScoreCard from './components/EnhancedScoreCard';
import EnhancedMetricCard from './components/EnhancedMetricCard';
import { generateScoreSummary } from '@/services/scoringModel';
import { formatPercentage, getScoreColor } from '@/utils/formatters';
import { 
  usePerformanceOptimization, 
  useResponsiveBreakpoint, 
  useAnimationDelay,
  useLayoutDebug,
  usePerformanceTracking 
} from '@/hooks/usePerformanceOptimization';
import { useNavigate } from 'react-router-dom';

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

  const TrendCard = React.memo(({ title, subtitle, trend, delay = 0 }: {
    title: string;
    subtitle: string;
    trend: string;
    delay?: number;
  }) => (
    <EnhancedGlassCard 
      className="enhanced-trend-card relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300 group cursor-pointer p-4"
      liquid={liquidSettings.animated}
      liquidIntensity={liquidSettings.intensity}
      liquidDistortion={0.2}
      liquidAnimated={liquidSettings.animated}
      liquidInteractive={liquidSettings.interactive}
      style={{
        animation: `slideInScale 0.6s ease-out ${delay}ms both`
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-semibold text-white/90">{title}</h4>
            <p className="text-xs text-white/60">{subtitle}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
        </div>
        
        <div className="mt-4 h-16 flex items-end space-x-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="trend-bar flex-1 rounded-sm transition-all duration-500 relative overflow-hidden"
              style={{ 
                height: `${Math.random() * 60 + 20}%`,
                background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.4))',
                animationDelay: `${i * 50}ms`
              }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent"
                style={{ animation: liquidSettings.animated ? `trendPulse 2s infinite ${i * 0.1}s` : 'none' }}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <span className="text-sm font-medium text-white/90">{trend}</span>
        </div>
      </div>
    </EnhancedGlassCard>
  ));

  const navigate = useNavigate();

  return (
    <div className="insights-container liquid-insights-container liquid-bg-insights relative overflow-hidden px-4 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between max-w-7xl mx-auto mb-6 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors rounded-full py-2 px-3 bg-white/5 backdrop-blur-md border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-center flex-1">
          <h1 className="text-xl font-semibold text-white">Financial Health</h1>
        </div>
        <div className="w-16" />
      </div>

      {/* Enhanced floating orbs for depth */}
      <div className="liquid-orb liquid-orb-1" />
      <div className="liquid-orb liquid-orb-2" />
      <div className="liquid-orb liquid-orb-3" />
      <div className="liquid-orb liquid-orb-4" />
      
      {/* Multiple overlay layers for stunning depth */}
      <div className="absolute inset-0 liquid-overlay-insights pointer-events-none" />
      <div className="absolute inset-0 insights-gradient-overlay pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="expanded-card-title font-bold text-white mb-2">Financial Health</h1>
          <p className="text-white/70 text-lg">Track your financial wellness with AI-powered insights</p>
        </div>

        {/* Navigation Tabs */}
        <EnhancedGlassCard 
          className="flex rounded-3xl p-1 mb-8 backdrop-blur-xl border border-white/20"
          liquid={liquidSettings.animated}
          liquidIntensity={liquidSettings.intensity}
          liquidDistortion={0.3}
          liquidAnimated={false}
        >
          {['summary', 'health', 'eco', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-2xl text-sm font-semibold transition-all duration-300 ${
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
          <div className="space-y-8">
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
                    if (activeTab !== 'summary') {
                      setActiveTab('summary');
                      setTimeout(() => {
                        document.getElementById('key-metrics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    } else {
                      document.getElementById('key-metrics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                />
              </div>
              <div className="score-card-container">
                <EnhancedScoreCard
                  title="Health Score"
                  score={animatedScores.health}
                  subtitle="Wellness spending insights"
                  icon={<Heart />}
                  color={getScoreColor(scores.health)}
                  trend="stable"
                  delay={getAnimationDelay(1)}
                  liquidIntensity={liquidSettings.intensity}
                  onClick={() => setActiveTab('health')}
                />
              </div>
              <div className="score-card-container">
                <EnhancedScoreCard
                  title="Eco Score"
                  score={animatedScores.eco}
                  subtitle="Environmental impact tracking"
                  icon={<Leaf />}
                  color={getScoreColor(scores.eco)}
                  trend="up"
                  delay={getAnimationDelay(2)}
                  liquidIntensity={liquidSettings.intensity}
                  onClick={() => setActiveTab('eco')}
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div id="key-metrics">
              <h2 className="collapsed-card-title font-bold text-white mb-6">Key Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedScoreCard
                title="Health Score"
                score={animatedScores.health}
                subtitle="Wellness spending and lifestyle"
                icon={<Heart />}
                color={getScoreColor(scores.health)}
                trend="stable"
                liquidIntensity={liquidSettings.intensity}
              />
              <div className="space-y-4">
                <h3 className="collapsed-card-title font-semibold text-white mb-4">Health Insights</h3>
                <EnhancedMetricCard
                  title="Exercise Spending"
                  value="$85"
                  subtitle="this month"
                  progress={65}
                  color="#10B981"
                  icon={<Activity />}
                  delay={getAnimationDelay(0)}
                  liquidIntensity={liquidSettings.intensity}
                />
                <EnhancedMetricCard
                  title="Healthcare Budget"
                  value="$120"
                  subtitle="monthly average"
                  progress={80}
                  color="#3B82F6"
                  icon={<Shield />}
                  delay={getAnimationDelay(1)}
                  liquidIntensity={liquidSettings.intensity}
                />
              </div>
            </div>
          </div>
        )}

        {/* Eco Tab */}
        {activeTab === 'eco' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedScoreCard
                title="Eco Score"
                score={animatedScores.eco}
                subtitle="Environmental impact and sustainability"
                icon={<Leaf />}
                color={getScoreColor(scores.eco)}
                trend="up"
                liquidIntensity={liquidSettings.intensity}
              />
              <div className="space-y-4">
                <h3 className="collapsed-card-title font-semibold text-white mb-4">Eco Insights</h3>
                <EnhancedMetricCard
                  title="CO₂ Saved"
                  value={`${Math.max(0, Math.round((scores.eco - 50) * 1.5))} kg`}
                  subtitle="this month"
                  progress={Math.min(100, (scores.eco))}
                  color="#10B981"
                  icon={<Leaf />}
                  delay={getAnimationDelay(0)}
                  liquidIntensity={liquidSettings.intensity}
                />
                <EnhancedMetricCard
                  title="Recycling Rate"
                  value="72%"
                  subtitle="household waste"
                  progress={72}
                  color="#3B82F6"
                  icon={<Recycle />}
                  delay={getAnimationDelay(1)}
                  liquidIntensity={liquidSettings.intensity}
                />
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrendCard
                title="Spending Trends"
                subtitle="Last 6 months"
                trend="Trending lower"
                delay={getAnimationDelay(0)}
              />
              <TrendCard
                title="Savings Growth"
                subtitle="Monthly progress"
                trend="Trending higher"
                delay={getAnimationDelay(1)}
              />
              <TrendCard
                title="Category Analysis"
                subtitle="Top spending areas"
                trend="Food & Dining leads"
                delay={getAnimationDelay(2)}
              />
              <TrendCard
                title="Budget Performance"
                subtitle="vs. planned spending"
                trend="15% under budget"
                delay={getAnimationDelay(3)}
              />
            </div>
          </div>
        )}

        {/* Footer Summary */}
        <EnhancedGlassCard 
          className="mt-12 rounded-3xl backdrop-blur-xl border border-white/20 overflow-hidden p-6 summary-card"
          liquid={liquidSettings.animated}
          liquidIntensity={liquidSettings.intensity}
          liquidDistortion={0.3}
          liquidAnimated={liquidSettings.animated}
          style={{
            animation: `slideInScale 0.8s ease-out ${getAnimationDelay(7)}ms both`
          }}
        >
          <div className="text-center">
            <h3 className="collapsed-card-title font-semibold text-white mb-3">Overall Assessment</h3>
            <p className="text-white/80 mb-6">
              Your financial health is <span className="font-bold text-blue-300">
                {scores.financial >= 80 ? 'excellent' : scores.financial >= 60 ? 'good' : 'needs attention'}
              </span> with 
              room for improvement in emergency savings and sustainable spending.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span 
                className="px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
                style={{ background: 'rgba(16, 185, 129, 0.2)' }}
              >
                <span className="text-green-300">
                  {metrics.savingsRate > 10 ? 'Strong savings' : 'Build savings'}
                </span>
              </span>
              <span 
                className="px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
                style={{ background: 'rgba(245, 158, 11, 0.2)' }}
              >
                <span className="text-orange-300">
                  {metrics.emergencyFundMonths < 3 ? 'Build emergency fund' : 'Good emergency fund'}
                </span>
              </span>
              <span 
                className="px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
                style={{ background: 'rgba(59, 130, 246, 0.2)' }}
              >
                <span className="text-blue-300">
                  {metrics.spendingRatio < 70 ? 'Healthy spending' : 'Watch spending'}
                </span>
              </span>
            </div>
          </div>
        </EnhancedGlassCard>
      </div>
    </div>
  );
};

export default EnhancedInsightsPage; 