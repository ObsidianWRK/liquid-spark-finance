import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Leaf, DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import FinancialCard from './FinancialCard';
import WellnessCard from './WellnessCard';
import EcoCard from './EcoCard';
import ScoreCircle from './ScoreCircle';
import TimeSeriesChart from './TimeSeriesChart';
import SpendingTrendsChart from './SpendingTrendsChart';
import CategoryTrendsChart from './CategoryTrendsChart';
import NetWorthTrendChart from './NetWorthTrendChart';
import {
  useInsightsScores,
  useHistoricalScores,
  useMonthlyFinancialData,
  useCategoryTrends,
  useNetWorthData,
} from '@/features/insights/hooks';

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

interface NewInsightsPageProps {
  transactions: Transaction[];
  accounts: Account[];
}

const NewInsightsPage: React.FC<NewInsightsPageProps> = ({ transactions, accounts }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: scores = { financial: 0, health: 0, eco: 0 }, isLoading } = useInsightsScores(transactions, accounts);
  const { data: historicalScores = [] } = useHistoricalScores();
  const { data: monthlyFinancialData = [] } = useMonthlyFinancialData();
  const { data: categoryTrends = [] } = useCategoryTrends();
  const { data: netWorthData = [] } = useNetWorthData();

  // Calculate financial metrics
  const financialData = useMemo(() => {
    const monthlyIncome = transactions
      .filter(t => t.amount > 0 && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySpending = Math.abs(transactions
      .filter(t => t.amount < 0 && new Date(t.date).getMonth() === new Date().getMonth())
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
      overallScore: scores.financial,
      monthlyIncome,
      monthlySpending,
      totalBalance,
      savingsRate,
      spendingRatio,
      emergencyFundMonths,
      debtToIncomeRatio,
      billPaymentScore,
    };
  }, [transactions, accounts, scores.financial]);

  // Sample wellness data matching screenshots
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

  // Sample eco data matching screenshots
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'trends', label: 'Trends', icon: BarChart3 },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'eco', label: 'Eco', icon: Leaf },
  ];

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
            Financial Insights
          </h1>
          <p className="text-white/70 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Comprehensive analysis of your financial health, wellness spending, and environmental impact
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="liquid-glass-fallback rounded-2xl p-2 mb-8 sm:mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                      : 'text-white/70 hover:text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8 sm:space-y-12">
            {/* Score Overview */}
            <div className="liquid-glass-fallback rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">
                Your Overall Scores
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
                <div className="text-center">
                  <ScoreCircle 
                    score={scores.financial} 
                    size="large"
                    label="Financial Health"
                    color="#3b82f6"
                  />
                </div>
                <div className="text-center">
                  <ScoreCircle 
                    score={scores.health} 
                    size="large"
                    label="Wellness Score"
                    color="#ef4444"
                  />
                </div>
                <div className="text-center">
                  <ScoreCircle 
                    score={scores.eco} 
                    size="large"
                    label="Eco Impact"
                    color="#10b981"
                  />
                </div>
              </div>
            </div>

            {/* Net Worth Trend Chart */}
            <NetWorthTrendChart 
              data={netWorthData} 
              title="Net Worth Growth & 2-Year Projection"
            />

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="liquid-glass-fallback rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Financial Health</h4>
                    <p className="text-white/70 text-sm">Score: {scores.financial}/100</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Monthly spending: ${financialData.monthlySpending.toLocaleString()}
                </p>
              </div>

              <div className="liquid-glass-fallback rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-xl bg-red-500/20">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Wellness</h4>
                    <p className="text-white/70 text-sm">Score: {scores.health}/100</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Monthly wellness: ${Object.values(wellnessData.monthlySpending).reduce((sum, amount) => sum + amount, 0).toLocaleString()}
                </p>
              </div>

              <div className="liquid-glass-fallback rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Leaf className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Eco Impact</h4>
                    <p className="text-white/70 text-sm">Score: {scores.eco}/100</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  CO₂ saved: {ecoData.monthlyImpact.co2Saved}kg this month
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8 sm:space-y-12">
            {/* Net Worth Trend - Featured prominently in trends */}
            <NetWorthTrendChart 
              data={netWorthData} 
              title="Net Worth Growth & Future Projections (3 Years Historical + 2 Years Projected)"
            />

            {/* Historical Scores Chart */}
            <TimeSeriesChart 
              data={historicalScores} 
              title="Score Progress Over Time (Past 12 Months)"
            />

            {/* Financial Trends */}
            <SpendingTrendsChart 
              data={monthlyFinancialData} 
              title="Monthly Financial Overview"
            />

            {/* Category Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CategoryTrendsChart 
                data={categoryTrends} 
                type="health"
                title="Health & Wellness Spending Trends"
              />
              <CategoryTrendsChart 
                data={categoryTrends} 
                type="eco"
                title="Eco & Sustainability Spending Trends"
              />
            </div>
          </div>
        )}

        {activeTab === 'financial' && <FinancialCard data={financialData} />}
        {activeTab === 'health' && <WellnessCard data={wellnessData} />}
        {activeTab === 'eco' && <EcoCard data={ecoData} />}
      </div>
    </div>
  );
};

export default NewInsightsPage; 