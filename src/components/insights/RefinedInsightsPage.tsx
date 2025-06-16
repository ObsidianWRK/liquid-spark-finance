import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart, Leaf, TrendingUp, TrendingDown, DollarSign, Shield, PiggyBank, Calendar, ChevronRight, Activity, Zap, Target } from 'lucide-react';
import EnhancedGlassCard from '../ui/EnhancedGlassCard';
import AnimatedCircularProgress from './components/AnimatedCircularProgress';
import RefinedScoreCard from './components/RefinedScoreCard';
import RefinedMetricCard from './components/RefinedMetricCard';
import ComprehensiveWellnessCard from './components/ComprehensiveWellnessCard';
import ComprehensiveEcoCard from './components/ComprehensiveEcoCard';
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

  // Generate comprehensive health and eco data
  const comprehensiveHealthData = useMemo(() => ({
    healthKitData: {
      stepCount: 8542,
      activeEnergyBurned: 387,
      exerciseTime: 45,
      distanceWalkingRunning: 6.2,
      flightsClimbed: 12,
      heartRate: 72,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      bodyMass: 165,
      height: 70,
      bmi: 23.6,
      dietaryCalories: 2150,
      dietaryProtein: 85,
      dietaryWater: 2.1,
      sleepAnalysis: 7.5,
      mindfulMinutes: 15,
      stressLevel: 3
    },
    spendingCategories: {
      fitness: Math.round(transactions.filter(t => t.merchant.toLowerCase().includes('gym') || t.merchant.toLowerCase().includes('fitness')).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 85),
      nutrition: Math.round(transactions.filter(t => t.category?.name === 'Groceries').reduce((sum, t) => sum + Math.abs(t.amount), 0) * 0.3 || 120),
      healthcare: Math.round(transactions.filter(t => t.merchant.toLowerCase().includes('health') || t.merchant.toLowerCase().includes('medical')).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 340),
      wellness: Math.round(transactions.filter(t => t.merchant.toLowerCase().includes('spa') || t.merchant.toLowerCase().includes('massage')).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 75),
      supplements: 45,
      mentalHealth: 120
    },
    trends: {
      exercise: (metrics.savingsRate > 15 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
      nutrition: 'up' as 'up' | 'down' | 'stable',
      sleep: 'stable' as 'up' | 'down' | 'stable',
      stress: (metrics.debtToIncomeRatio < 20 ? 'down' : 'stable') as 'up' | 'down' | 'stable'
    }
  }), [transactions, metrics]);

  const comprehensiveEcoData = useMemo(() => ({
    ecoMetrics: {
      totalCO2Emissions: 12.5,
      transportationCO2: 4.2,
      electricityUsage: 875,
      renewableEnergyPercentage: 65,
      recyclingRate: 72,
      organicFoodPercentage: 42,
      sustainableBrandsPurchases: 156,
      ESGInvestments: 12500,
      treesPlanted: 8,
      wasteGenerated: 28
    },
    spendingCategories: {
      sustainableFood: Math.round(transactions.filter(t => t.merchant.toLowerCase().includes('whole foods') || t.merchant.toLowerCase().includes('organic')).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 180),
      renewableEnergy: 85,
      ecoTransport: Math.round(transactions.filter(t => t.merchant.toLowerCase().includes('tesla') || t.merchant.toLowerCase().includes('electric')).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 45),
      greenProducts: 120,
      carbonOffset: 25,
      conservation: 60
    },
    monthlyImpact: {
      co2Saved: Math.max(0, Math.round((scores.eco - 50) * 1.5)),
      treesEquivalent: Math.max(0, Math.round((scores.eco - 50) / 20)),
      waterSaved: Math.max(0, Math.round((scores.eco - 50) * 12)),
      energySaved: Math.max(0, Math.round((scores.eco - 50) * 8))
    },
    trends: {
      carbonFootprint: (scores.eco > 70 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
      sustainability: 'up' as 'up' | 'down' | 'stable',
      renewable: 'up' as 'up' | 'down' | 'stable',
      waste: 'down' as 'up' | 'down' | 'stable'
    }
  }), [transactions, scores.eco]);

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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Financial Insights
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
            Professional analysis of your financial health with sophisticated visual intelligence
          </p>
        </div>

        {/* Main Score Cards */}
        <div className="main-cards-grid">
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
          
          <ComprehensiveWellnessCard
            score={animatedScores.health}
            healthKitData={comprehensiveHealthData.healthKitData}
            spendingCategories={comprehensiveHealthData.spendingCategories}
            trends={comprehensiveHealthData.trends}
          />
          
          <ComprehensiveEcoCard
            score={animatedScores.eco}
            ecoMetrics={comprehensiveEcoData.ecoMetrics}
            spendingCategories={comprehensiveEcoData.spendingCategories}
            monthlyImpact={comprehensiveEcoData.monthlyImpact}
            trends={comprehensiveEcoData.trends}
          />
        </div>

        {/* Financial Metrics Grid - Enhanced Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

        {/* Professional Insights Grid - Enhanced Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="liquid-glass-card p-4 sm:p-6">
            <RefinedTrendCard
              title="Performance Trends"
              subtitle="Monthly financial trajectory"
              trend="Improving steadily"
              delay={1400}
            />
          </div>

          <div className="liquid-glass-card p-4 sm:p-6">
            <RefinedTrendCard
              title="Goal Progress"
              subtitle="Tracking financial milestones"
              trend="On target"
              delay={1600}
            />
          </div>

          <div className="liquid-glass-card p-4 sm:p-6 md:col-span-2 lg:col-span-1">
            <RefinedTrendCard
              title="Risk Assessment"
              subtitle="Financial stability outlook"
              trend="Low risk profile"
              delay={1800}
            />
          </div>
        </div>

        {/* Professional Summary Section - Enhanced Responsive */}
        <div className="liquid-glass-card p-6 sm:p-8" style={{ animation: `slideInScale 0.8s ease-out 2000ms both` }}>
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Financial Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span>Strengths</span>
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm sm:text-base">
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
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                  <span>Opportunities</span>
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm sm:text-base">
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