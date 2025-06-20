import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Heart,
  Leaf,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  PiggyBank,
  Calendar,
  ChevronRight,
  Activity,
  Recycle,
} from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { UniversalMetricCard } from './UniversalMetricCard';
import { UniversalScoreCard } from './UniversalScoreCard';
import { formatPercentage, getScoreColor } from '@/shared/utils/formatters';
import { usePerformanceOptimization } from '@/shared/hooks/usePerformanceOptimization';
import { useBreakpoint } from '@/shared/hooks/useBreakpoint';
import { useFinancialMetrics } from '@/shared/hooks/useFinancialMetrics';
import { generateScoreSummary } from '@/services/scoringModel';
import { mockHealthEcoService } from '@/services/mockHealthEcoService';
import { calculateEcoScore } from '@/services/ecoScoreService';
import ComprehensiveWellnessCard from './components/ComprehensiveWellnessCard';
import ComprehensiveEcoCard from './components/ComprehensiveEcoCard';
import { Transaction, Account } from '@/shared/types/shared';

// Enhanced TypeScript interfaces
export type InsightsVariant = 'base' | 'configurable' | 'unified';
export type ViewMode =
  | 'overview'
  | 'trends'
  | 'financial'
  | 'health'
  | 'eco'
  | 'detailed';

interface BaseInsightsPageProps {
  transactions: Transaction[];
  accounts: Account[];
  variant?: InsightsVariant;
  showHeader?: boolean;
  showTabs?: boolean;
  compactMode?: boolean;
  animationsEnabled?: boolean;
  liquidIntensity?: number;
  defaultTab?: ViewMode;
  className?: string;
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

const BaseInsightsPage = ({
  transactions,
  accounts,
  variant = 'base',
  showHeader = true,
  showTabs = true,
  compactMode = false,
  animationsEnabled = true,
  liquidIntensity = 0.6,
  defaultTab = 'overview',
  className = '',
}: BaseInsightsPageProps) => {
  const [animatedScores, setAnimatedScores] = useState<ScoreData>({
    financial: 0,
    health: 0,
    eco: 0,
  });
  const [activeTab, setActiveTab] = useState<ViewMode>(defaultTab);
  const [scores, setScores] = useState<ScoreData>({
    financial: 0,
    health: 0,
    eco: 0,
  });

  // Performance and responsive hooks
  const { liquidSettings } = usePerformanceOptimization();
  const breakpoint = useBreakpoint();
  const getAnimationDelay = (index: number) => index * 100;

  // Debug and performance tracking (development only)
  // useLayoutDebug('BaseInsightsPage');
  // usePerformanceTracking('BaseInsightsPage');

  // Use shared financial metrics hook
  const financialMetrics = useFinancialMetrics(accounts);

  // Get real wellness data from service
  const wellnessData = useMemo(() => {
    const healthData = mockHealthEcoService.getHealthScore(transactions);
    return {
      overallScore: healthData.score,
      monthlySpending: {
        fitness: Math.round(
          transactions
            .filter(
              (t) =>
                t.category?.name === 'Fitness' || t.merchant?.includes('Gym')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        nutrition: Math.round(
          transactions
            .filter(
              (t) =>
                t.category?.name === 'Food' && t.merchant?.includes('Organic')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        healthcare: Math.round(
          transactions
            .filter((t) => t.category?.name === 'Healthcare')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        wellness: Math.round(
          transactions
            .filter(
              (t) => t.merchant?.includes('Spa') || t.merchant?.includes('Yoga')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        supplements: Math.round(
          transactions
            .filter(
              (t) =>
                t.merchant?.includes('Vitamin') || t.merchant?.includes('CVS')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        mentalHealth: Math.round(
          transactions
            .filter(
              (t) =>
                t.merchant?.includes('Therapy') ||
                t.merchant?.includes('Counseling')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
      },
      healthTrends: {
        exercise:
          healthData.trends.exercise > 70
            ? ('up' as const)
            : healthData.trends.exercise > 50
              ? ('stable' as const)
              : ('down' as const),
        nutrition:
          healthData.trends.nutrition > 70
            ? ('up' as const)
            : healthData.trends.nutrition > 50
              ? ('stable' as const)
              : ('down' as const),
        sleep:
          healthData.trends.sleep > 70
            ? ('up' as const)
            : healthData.trends.sleep > 50
              ? ('stable' as const)
              : ('down' as const),
        stress:
          healthData.trends.stress > 70
            ? ('down' as const)
            : healthData.trends.stress > 50
              ? ('stable' as const)
              : ('up' as const),
      },
    };
  }, [transactions]);

  // Get real eco data from service
  const ecoData = useMemo(() => {
    const ecoBreakdown = calculateEcoScore(transactions);
    const ecoHealthData = mockHealthEcoService.getEcoScore(transactions);

    return {
      overallScore: ecoBreakdown.score,
      monthlyImpact: {
        co2Saved: Math.round(Math.max(0, (ecoBreakdown.score - 50) * 1.5)),
        treesEquivalent: Math.round(
          Math.max(0, (ecoBreakdown.score - 50) * 0.1)
        ),
        waterSaved: Math.round(Math.max(0, (ecoBreakdown.score - 50) * 10)),
        energySaved: Math.round(Math.max(0, (ecoBreakdown.score - 50) * 8)),
      },
      monthlySpending: {
        sustainableFood: Math.round(
          transactions
            .filter((t) =>
              ['Whole Foods', 'Trader Joe'].some((m) => t.merchant?.includes(m))
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        renewableEnergy: Math.round(
          transactions
            .filter(
              (t) =>
                t.merchant?.includes('Solar') || t.merchant?.includes('Tesla')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        ecoTransport: Math.round(
          transactions
            .filter(
              (t) =>
                t.merchant?.includes('Electric') || t.merchant?.includes('Bike')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        greenProducts: Math.round(
          transactions
            .filter((t) =>
              ['Patagonia', 'REI'].some((m) => t.merchant?.includes(m))
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        carbonOffset: Math.round(
          transactions
            .filter(
              (t) =>
                t.merchant?.includes('Carbon') || t.merchant?.includes('Offset')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
        conservation: Math.round(
          transactions
            .filter(
              (t) =>
                t.merchant?.includes('Conservation') ||
                t.merchant?.includes('WWF')
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        ),
      },
      environmentalTrends: {
        carbonFootprint:
          ecoBreakdown.totalKgCO2e < 200
            ? ('down' as const)
            : ecoBreakdown.totalKgCO2e < 400
              ? ('stable' as const)
              : ('up' as const),
        sustainability:
          ecoBreakdown.sustainableSpendRatio > 20
            ? ('up' as const)
            : ecoBreakdown.sustainableSpendRatio > 10
              ? ('stable' as const)
              : ('down' as const),
        renewable: 'up' as const,
        waste: 'stable' as const,
      },
    };
  }, [transactions]);

  // Calculate comprehensive financial metrics
  const metrics = useMemo<FinancialMetrics>(() => {
    const monthlyIncome = transactions
      .filter(
        (t) =>
          t.amount > 0 && new Date(t.date).getMonth() === new Date().getMonth()
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySpending = Math.abs(
      transactions
        .filter(
          (t) =>
            t.amount < 0 &&
            new Date(t.date).getMonth() === new Date().getMonth()
        )
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const totalBalance = financialMetrics.totalWealth;
    const monthlyExpenses = monthlySpending;

    const spendingRatio =
      monthlyIncome > 0 ? (monthlySpending / monthlyIncome) * 100 : 0;
    const emergencyFundMonths =
      monthlyExpenses > 0 ? financialMetrics.liquidAssets / monthlyExpenses : 0;
    const savingsRate =
      monthlyIncome > 0
        ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100
        : 0;

    const debtToIncomeRatio = financialMetrics.debtToAssetRatio;

    const completedTransactions = transactions.filter(
      (t) => t.status === 'completed'
    ).length;
    const totalTransactions = transactions.length;
    const billPaymentScore =
      totalTransactions > 0
        ? Math.round((completedTransactions / totalTransactions) * 100)
        : 100;

    return {
      spendingRatio,
      emergencyFundMonths,
      savingsRate,
      debtToIncomeRatio,
      billPaymentScore,
      monthlyIncome,
      monthlySpending,
      totalBalance,
    };
  }, [transactions, financialMetrics]);

  useEffect(() => {
    generateScoreSummary(transactions, accounts)
      .then(setScores)
      .catch(console.error);
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
  const getTrend = useCallback(
    (value: number, threshold: { good: number; excellent: number }) => {
      if (value >= threshold.excellent) return 'up';
      if (value >= threshold.good) return 'stable';
      return 'down';
    },
    []
  );

  const containerClasses = compactMode
    ? 'relative overflow-hidden p-4'
    : 'relative overflow-hidden';

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Enhanced floating orbs for depth */}
      {animationsEnabled && (
        <>
          <div className="liquid-orb liquid-orb-1" />
          <div className="liquid-orb liquid-orb-2" />
          <div className="liquid-orb liquid-orb-3" />
          <div className="liquid-orb liquid-orb-4" />
        </>
      )}

      {/* Multiple overlay layers for stunning depth */}
      <div className="absolute inset-0 liquid-overlay-insights pointer-events-none" />
      <div className="absolute inset-0 insights-gradient-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {showHeader && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Financial Health</h1>
            <p className="text-lg text-white/70 mt-2">
              Track your financial wellness with AI-powered insights
            </p>
          </div>
        )}

        {/* Navigation Tabs */}
        {showTabs && (
          <UniversalCard
            variant="glass"
            className="backdrop-blur-xl border border-white/20 mb-8"
          >
            <div className="flex flex-wrap gap-2 p-2">
              {['overview', 'health', 'eco', 'trends'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as ViewMode)}
                  className={`tab-button transition-all duration-300 px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === tab
                      ? 'text-white shadow-lg backdrop-blur-sm border border-white/30 bg-white/20'
                      : 'text-white/70 hover:text-white/90 hover:bg-white/10'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </UniversalCard>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Main Score Cards with responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="score-card-container">
                <UniversalScoreCard
                  title="Financial Score"
                  score={animatedScores.financial}
                  subtitle="Based on spending and savings patterns"
                  icon={<DollarSign />}
                  color={getScoreColor(scores.financial)}
                  trend={getTrend(scores.financial, {
                    good: 60,
                    excellent: 75,
                  })}
                  delay={getAnimationDelay(0)}
                  size="md"
                  animationsEnabled={animationsEnabled}
                  onClick={() => {
                    document
                      .getElementById('key-metrics')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                />
              </div>
              <div className="score-card-container">
                <UniversalScoreCard
                  title="Health Score"
                  score={wellnessData.overallScore}
                  subtitle="Wellness spending insights"
                  icon={<Heart />}
                  color={getScoreColor(wellnessData.overallScore)}
                  trend="stable"
                  delay={getAnimationDelay(1)}
                  size="md"
                  animationsEnabled={animationsEnabled}
                  onClick={() => setActiveTab('health')}
                />
              </div>
              <div className="score-card-container">
                <UniversalScoreCard
                  title="Eco Score"
                  score={ecoData.overallScore}
                  subtitle="Environmental impact tracking"
                  icon={<Leaf />}
                  color={getScoreColor(ecoData.overallScore)}
                  trend="up"
                  delay={getAnimationDelay(2)}
                  size="md"
                  animationsEnabled={animationsEnabled}
                  onClick={() => setActiveTab('eco')}
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div id="key-metrics">
              <h2 className="text-2xl font-bold text-white mb-6">
                Key Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <UniversalMetricCard
                  title="Spending Ratio"
                  value={`${formatPercentage(metrics.spendingRatio)}%`}
                  subtitle="of income spent"
                  progress={metrics.spendingRatio}
                  color="#F59E0B"
                  icon={<DollarSign />}
                  delay={getAnimationDelay(3)}
                  size="md"
                  animationsEnabled={animationsEnabled}
                />
                <UniversalMetricCard
                  title="Emergency Fund"
                  value={`${formatPercentage(metrics.emergencyFundMonths)}`}
                  subtitle="months covered"
                  progress={(metrics.emergencyFundMonths / 6) * 100}
                  color="#10B981"
                  icon={<Shield />}
                  delay={getAnimationDelay(4)}
                  size="md"
                  animationsEnabled={animationsEnabled}
                />
                <UniversalMetricCard
                  title="Savings Rate"
                  value={`${formatPercentage(metrics.savingsRate)}%`}
                  subtitle="of income saved"
                  progress={metrics.savingsRate}
                  color="#3B82F6"
                  icon={<PiggyBank />}
                  delay={getAnimationDelay(5)}
                  size="md"
                  animationsEnabled={animationsEnabled}
                />
                <UniversalMetricCard
                  title="Payment Score"
                  value={`${formatPercentage(metrics.billPaymentScore)}%`}
                  subtitle="on-time payments"
                  progress={metrics.billPaymentScore}
                  color="#10B981"
                  icon={<Calendar />}
                  delay={getAnimationDelay(6)}
                  size="md"
                  animationsEnabled={animationsEnabled}
                />
              </div>
            </div>
          </div>
        )}

        {/* Health Tab - Comprehensive Wellness */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <ComprehensiveWellnessCard
                score={wellnessData.overallScore}
                healthKitData={{}}
                spendingCategories={wellnessData.monthlySpending}
                trends={wellnessData.healthTrends}
              />
            </div>
          </div>
        )}

        {/* Eco Tab - Comprehensive Environmental Impact */}
        {activeTab === 'eco' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <ComprehensiveEcoCard
                score={ecoData.overallScore}
                ecoMetrics={{}}
                spendingCategories={ecoData.monthlySpending}
                monthlyImpact={ecoData.monthlyImpact}
                trends={ecoData.environmentalTrends}
              />
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UniversalCard variant="glass" className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Financial Trends
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Monthly Spending</span>
                    <span className="text-green-400 font-medium">↓ 12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Savings Rate</span>
                    <span className="text-blue-400 font-medium">↑ 8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Investment Growth</span>
                    <span className="text-green-400 font-medium">↑ 15%</span>
                  </div>
                </div>
              </UniversalCard>
              <UniversalCard variant="glass" className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Category Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Food & Dining</span>
                    <span className="text-red-400 font-medium">↑ 5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Transportation</span>
                    <span className="text-green-400 font-medium">↓ 18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Healthcare</span>
                    <span className="text-white/80 font-medium">— 0%</span>
                  </div>
                </div>
              </UniversalCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseInsightsPage;
