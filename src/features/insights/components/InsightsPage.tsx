import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Heart, Leaf, DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { SharedScoreCircle } from '@/components/shared/SharedScoreCircle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Transaction, Account } from '@/types/shared';
import { formatScore, formatPercentage } from '@/shared/utils/formatters';
import { generateScoreSummary } from '@/features/scoringModel';
import { mockHealthEcoService } from '@/features/mockHealthEcoService';
import { UnifiedCard } from '@/shared/ui/UnifiedCard';

// Lazy load heavy components for performance
const FinancialCard = lazy(() => import('./FinancialCard'));
const WellnessCard = lazy(() => import('./WellnessCard'));
const EcoCard = lazy(() => import('./EcoCard'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
  </div>
);

interface InsightsPageProps {
  transactions: Transaction[];
  accounts: Account[];
}

const InsightsPage: React.FC<InsightsPageProps> = ({ transactions, accounts }) => {
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

  // Get wellness and eco data
  const wellnessData = useMemo(() => mockHealthEcoService.getHealthScore(transactions), [transactions]);
  const ecoData = useMemo(() => mockHealthEcoService.getEcoScore(transactions), [transactions]);

  // Load scores
  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true);
      try {
        const scoreSummary = await generateScoreSummary(transactions, accounts);
        setScores({
          financial: Math.round(scoreSummary.financial),
          health: Math.round(wellnessData.score),
          eco: Math.round(ecoData.score)
        });
      } catch (error) {
        console.error('Error loading scores:', error);
        setScores({ financial: 72, health: 75, eco: 82 });
      } finally {
        setIsLoading(false);
      }
    };

    loadScores();
  }, [transactions, accounts, wellnessData.score, ecoData.score]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <UnifiedCard size="lg" className="text-center">
          <LoadingSpinner />
          <p className="text-white/70 mt-4">Loading your financial insights...</p>
        </UnifiedCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Financial Insights</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 p-1 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
          <TabsTrigger 
            value="overview" 
            className="text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white"
          >
            Health
          </TabsTrigger>
          <TabsTrigger 
            value="eco" 
            className="text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white"
          >
            Eco Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-8">
            {/* Score Overview */}
            <UnifiedCard size="lg">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Your Overall Scores
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UnifiedCard 
                title="Monthly Spending" 
                metric={`$${financialData.monthlySpending.toLocaleString()}`}
                subtitle="This month"
                icon={DollarSign}
                iconColor="#3b82f6"
                size="lg"
              />

              <UnifiedCard 
                title="Total Balance" 
                metric={`$${financialData.totalBalance.toLocaleString()}`}
                subtitle="All accounts"
                icon={TrendingUp}
                iconColor="#10b981"
                size="lg"
              />

              <UnifiedCard 
                title="Health Score" 
                metric={`${Math.round(scores.health)}/100`}
                subtitle="Wellness tracking"
                icon={Heart}
                iconColor="#ef4444"
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <Suspense fallback={<LoadingSpinner />}>
            <UnifiedCard size="lg">
              <h2 className="text-2xl font-bold text-white mb-4">Health & Wellness Insights</h2>
              <p className="text-white/70 mb-4">Your wellness score: {Math.round(scores.health)}/100</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wellnessData.breakdown && Object.entries(wellnessData.breakdown).map(([category, amount]) => (
                  <div key={category} className="p-3 bg-white/[0.03] rounded-lg">
                    <p className="text-white/60 text-xs capitalize">{category.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-white font-bold">${typeof amount === 'number' ? amount.toLocaleString() : '0'}</p>
                  </div>
                ))}
              </div>
            </UnifiedCard>
          </Suspense>
        </TabsContent>

        <TabsContent value="eco">
          <Suspense fallback={<LoadingSpinner />}>
            <UnifiedCard size="lg">
              <h2 className="text-2xl font-bold text-white mb-4">Eco Impact Insights</h2>
              <p className="text-white/70 mb-4">Your eco score: {Math.round(scores.eco)}/100</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ecoData.breakdown && Object.entries(ecoData.breakdown).map(([category, amount]) => (
                  <div key={category} className="p-3 bg-white/[0.03] rounded-lg">
                    <p className="text-white/60 text-xs capitalize">{category.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-white font-bold">${typeof amount === 'number' ? amount.toLocaleString() : '0'}</p>
                  </div>
                ))}
              </div>
            </UnifiedCard>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsPage;
