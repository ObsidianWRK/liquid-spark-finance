import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Heart, Leaf, DollarSign, TrendingUp, Calendar, BarChart3, ArrowLeft } from 'lucide-react';
import { SharedScoreCircle } from '@/components/shared/SharedScoreCircle';
import { Transaction, Account } from '@/types/shared';
import { formatScore, formatPercentage } from '@/shared/utils/formatters';
import { useNavigate } from 'react-router-dom';
import { generateScoreSummary } from '@/services/scoringModel';
import { mockHealthEcoService } from '@/services/mockHealthEcoService';
import { mockHistoricalService } from '@/services/mockHistoricalData';
import { cn } from '@/shared/lib/utils';
import { UnifiedCard } from '@/shared/ui/UnifiedCard';

// Lazy load heavy components for performance
const FinancialCard = lazy(() => import('./FinancialCard'));
const WellnessCard = lazy(() => import('./WellnessCard'));
const EcoCard = lazy(() => import('./EcoCard'));
const TimeSeriesChart = lazy(() => import('./TimeSeriesChart'));
const SpendingTrendsChart = lazy(() => import('./SpendingTrendsChart'));
const CategoryTrendsChart = lazy(() => import('./CategoryTrendsChart'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
  </div>
);

interface NewInsightsPageProps {
  transactions: Transaction[];
  accounts: Account[];
}

const NewInsightsPage: React.FC<NewInsightsPageProps> = ({ transactions, accounts }) => {
  const navigate = useNavigate();
  const [scores, setScores] = useState({ financial: 0, health: 0, eco: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate financial data
  const financialData = useMemo(() => {
    const monthlySpending = Math.abs(transactions
      .filter(t => t.amount < 0 && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0));
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    return {
      monthlySpending,
      totalBalance,
    };
  }, [transactions, accounts]);

  // Get wellness and eco data using the correct service methods
  const wellnessData = useMemo(() => mockHealthEcoService.getHealthScore(transactions), [transactions]);
  const ecoData = useMemo(() => mockHealthEcoService.getEcoScore(transactions), [transactions]);

  // Simulate loading and score calculation
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate scores based on actual data
        const scoreSummary = await generateScoreSummary(transactions, accounts);
        setScores({
          financial: Math.round(scoreSummary.financial),
          health: Math.round(wellnessData.score),
          eco: Math.round(ecoData.score)
        });
      } catch (error) {
        console.error('Error loading insights data:', error);
        setScores({ financial: 72, health: 75, eco: 82 });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [transactions, accounts, wellnessData.score, ecoData.score]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'eco', label: 'Eco Impact', icon: Leaf },
    { id: 'trends', label: 'Trends', icon: TrendingUp }
  ];

  if (isLoading) {
    return (
      <div className="w-full text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
          <UnifiedCard size="lg" className="text-center">
            <LoadingSpinner />
            <p className="text-white/70 mt-4">Loading your financial insights...</p>
          </UnifiedCard>
        </div>
      </div>
    );
  }

  // Calculate totals for display
  const wellnessMonthlyTotal = wellnessData.breakdown ? 
    Object.values(wellnessData.breakdown).reduce((sum: number, amount: any) => sum + (typeof amount === 'number' ? amount : 0), 0) : 0;
  
  const ecoMonthlyTotal = ecoData.breakdown ? 
    Object.values(ecoData.breakdown).reduce((sum: number, amount: any) => sum + (typeof amount === 'number' ? amount : 0), 0) : 0;

  return (
    <div className="w-full text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-surface-900/40 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </button>

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
        <UnifiedCard size="lg" className="mb-8 sm:mb-12">
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
        </UnifiedCard>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Score Overview */}
            <UnifiedCard size="lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
                Your Overall Scores
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
                <div className="text-center">
                  <SharedScoreCircle 
                    score={scores.financial} 
                    type="financial"
                    size="lg"
                    label="Financial Health"
                    showLabel={false}
                  />
                </div>
                <div className="text-center">
                  <SharedScoreCircle 
                    score={scores.health} 
                    type="health"
                    size="lg"
                    label="Wellness Score"
                    showLabel={false}
                  />
                </div>
                <div className="text-center">
                  <SharedScoreCircle 
                    score={scores.eco} 
                    type="eco"
                    size="lg"
                    label="Eco Impact"
                    showLabel={false}
                  />
                </div>
              </div>
            </UnifiedCard>

            {/* Quick Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <UnifiedCard 
                title="Financial Health" 
                metric={`${Math.round(scores.financial)}/100`}
                subtitle={`Monthly spending: $${financialData.monthlySpending.toLocaleString()}`}
                icon={DollarSign}
                iconColor="#3b82f6"
                size="lg"
              />

              <UnifiedCard 
                title="Wellness" 
                metric={`${Math.round(scores.health)}/100`}
                subtitle={`Monthly wellness: $${wellnessMonthlyTotal.toLocaleString()}`}
                icon={Heart}
                iconColor="#ef4444"
                size="lg"
              />

              <UnifiedCard 
                title="Eco Impact" 
                metric={`${Math.round(scores.eco)}/100`}
                subtitle={`Monthly eco: $${ecoMonthlyTotal.toLocaleString()}`}
                icon={Leaf}
                iconColor="#10b981"
                size="lg"
              />
            </div>
          </div>
        )}

        {/* Other tabs content with lazy loading */}
        {activeTab === 'health' && (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="space-y-6">
              <UnifiedCard size="lg">
                <h2 className="text-2xl font-bold text-white mb-4">Health & Wellness Insights</h2>
                <p className="text-white/70 mb-4">Your wellness score: {Math.round(scores.health)}/100</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wellnessData.breakdown && Object.entries(wellnessData.breakdown).map(([category, amount]) => (
                    <div key={category} className="p-3 bg-surface-900/50 rounded-lg">
                      <p className="text-white/60 text-xs capitalize">{category.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-white font-bold">${typeof amount === 'number' ? amount.toLocaleString() : '0'}</p>
                    </div>
                  ))}
                </div>
              </UnifiedCard>
            </div>
          </Suspense>
        )}

        {activeTab === 'eco' && (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="space-y-6">
              <UnifiedCard size="lg">
                <h2 className="text-2xl font-bold text-white mb-4">Eco Impact Insights</h2>
                <p className="text-white/70 mb-4">Your eco score: {Math.round(scores.eco)}/100</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ecoData.breakdown && Object.entries(ecoData.breakdown).map(([category, amount]) => (
                    <div key={category} className="p-3 bg-surface-900/50 rounded-lg">
                      <p className="text-white/60 text-xs capitalize">{category.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-white font-bold">${typeof amount === 'number' ? amount.toLocaleString() : '0'}</p>
                    </div>
                  ))}
                </div>
              </UnifiedCard>
            </div>
          </Suspense>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <UnifiedCard size="lg">
                <h2 className="text-2xl font-bold text-white mb-4">Spending Trends</h2>
                <p className="text-white/70">Historical analysis of your financial patterns over time.</p>
              </UnifiedCard>
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewInsightsPage; 