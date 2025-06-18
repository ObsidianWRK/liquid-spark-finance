import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Heart, Leaf, DollarSign, TrendingUp, Calendar, BarChart3, Settings, Filter, Eye, EyeOff, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SharedScoreCircle, ScoreGroup } from './SharedScoreCircle';
import { InputSanitizer } from '@/utils/sanitize';

// Lazy load heavy components for performance
const TimeSeriesChart = lazy(() => import('@/components/insights/TimeSeriesChart'));
const SpendingTrendsChart = lazy(() => import('@/components/insights/SpendingTrendsChart'));
const CategoryTrendsChart = lazy(() => import('@/components/insights/CategoryTrendsChart'));
const FinancialCard = lazy(() => import('@/components/insights/FinancialCard'));
const ComprehensiveWellnessCard = lazy(() => import('@/components/insights/components/ComprehensiveWellnessCard'));
const ComprehensiveEcoCard = lazy(() => import('@/components/insights/components/ComprehensiveEcoCard'));

export interface Transaction {
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

export interface Account {
  id: string;
  type: string;
  nickname: string;
  balance: number;
  availableBalance: number;
  currency: string;
}

type LayoutVariant = 'standard' | 'refined' | 'enhanced' | 'optimized' | 'comprehensive';
type ViewMode = 'overview' | 'trends' | 'financial' | 'health' | 'eco';

interface LayoutConfig {
  showHeader: boolean;
  showTabs: boolean;
  showScoreCards: boolean;
  showCharts: boolean;
  showDetailedCards: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
  autoRefresh: boolean;
}

const defaultLayouts: Record<LayoutVariant, LayoutConfig> = {
  standard: {
    showHeader: true,
    showTabs: true,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: true,
    compactMode: false,
    animationsEnabled: true,
    autoRefresh: false,
  },
  refined: {
    showHeader: true,
    showTabs: true,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: true,
    compactMode: true,
    animationsEnabled: true,
    autoRefresh: false,
  },
  enhanced: {
    showHeader: true,
    showTabs: true,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: true,
    compactMode: false,
    animationsEnabled: true,
    autoRefresh: true,
  },
  optimized: {
    showHeader: false,
    showTabs: true,
    showScoreCards: true,
    showCharts: false,
    showDetailedCards: false,
    compactMode: true,
    animationsEnabled: false,
    autoRefresh: false,
  },
  comprehensive: {
    showHeader: true,
    showTabs: true,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: true,
    compactMode: false,
    animationsEnabled: true,
    autoRefresh: true,
  },
};

export interface ConfigurableInsightsPageProps {
  transactions: Transaction[];
  accounts: Account[];
  variant?: LayoutVariant;
  customLayout?: Partial<LayoutConfig>;
  className?: string;
  showSettings?: boolean;
  onExportData?: () => void;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
  </div>
);

export const ConfigurableInsightsPage = React.memo<ConfigurableInsightsPageProps>(({
  transactions,
  accounts,
  variant = 'standard',
  customLayout,
  className,
  showSettings = false,
  onExportData,
}) => {
  const [activeTab, setActiveTab] = useState<ViewMode>('overview');
  const [layout, setLayout] = useState<LayoutConfig>(() => ({
    ...defaultLayouts[variant],
    ...customLayout,
  }));
  const [scores, setScores] = useState({ financial: 0, health: 0, eco: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showLayoutSettings, setShowLayoutSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Memoized data calculations
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
    const billPaymentScore = totalTransactions > 0 ? Math.round((completedTransactions / totalTransactions) * 100) : 100;

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

  const wellnessData = useMemo(() => ({
    overallScore: scores.health,
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
  }), [scores.health]);

  const ecoData = useMemo(() => ({
    overallScore: scores.eco,
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
  }), [scores.eco]);

  // Load scores with error handling
  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true);
      try {
        // Simulate score calculation
        await new Promise(resolve => setTimeout(resolve, 500));
        setScores({
          financial: 72 + Math.floor(Math.random() * 20),
          health: 75 + Math.floor(Math.random() * 20),
          eco: 82 + Math.floor(Math.random() * 15),
        });
      } catch (error) {
        console.error('Error loading scores:', error);
        setScores({ financial: 72, health: 75, eco: 82 });
      } finally {
        setIsLoading(false);
      }
    };

    loadScores();
  }, [transactions, accounts]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!layout.autoRefresh) return;

    const interval = setInterval(() => {
      setScores(prev => ({
        financial: Math.max(0, Math.min(100, prev.financial + (Math.random() - 0.5) * 4)),
        health: Math.max(0, Math.min(100, prev.health + (Math.random() - 0.5) * 4)),
        eco: Math.max(0, Math.min(100, prev.eco + (Math.random() - 0.5) * 4)),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [layout.autoRefresh]);

  const tabs = [
    { id: 'overview' as ViewMode, label: 'Overview', icon: TrendingUp },
    { id: 'trends' as ViewMode, label: 'Trends', icon: BarChart3 },
    { id: 'financial' as ViewMode, label: 'Financial', icon: DollarSign },
    { id: 'health' as ViewMode, label: 'Health', icon: Heart },
    { id: 'eco' as ViewMode, label: 'Eco', icon: Leaf },
  ];

  const handleLayoutChange = (key: keyof LayoutConfig, value: boolean) => {
    setLayout(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <Card className={cn('w-full text-white bg-black/20 backdrop-blur-sm', className)}>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
            <span className="text-white text-lg">Loading insights...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('w-full text-white space-y-6', className)} data-testid="configurable-insights">
      {/* Header */}
      {layout.showHeader && (
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={cn(
                'font-bold text-white mb-2',
                layout.compactMode ? 'text-2xl' : 'text-3xl lg:text-4xl'
              )}>
                Financial Insights
              </h1>
              <p className="text-white/70 text-sm lg:text-base">
                Comprehensive analysis of your financial health, wellness spending, and environmental impact
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(!isVisible)}
                className="text-white/70 hover:text-white"
              >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              
              {onExportData && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onExportData}
                  className="text-white/70 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              {showSettings && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLayoutSettings(!showLayoutSettings)}
                  className="text-white/70 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Layout Settings */}
      {showLayoutSettings && (
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Layout Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Compact Mode</span>
              <Switch
                checked={layout.compactMode}
                onCheckedChange={(checked) => handleLayoutChange('compactMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Animations</span>
              <Switch
                checked={layout.animationsEnabled}
                onCheckedChange={(checked) => handleLayoutChange('animationsEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Auto Refresh</span>
              <Switch
                checked={layout.autoRefresh}
                onCheckedChange={(checked) => handleLayoutChange('autoRefresh', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Show Charts</span>
              <Switch
                checked={layout.showCharts}
                onCheckedChange={(checked) => handleLayoutChange('showCharts', checked)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      {layout.showTabs && (
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-2">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={cn(
                    'flex items-center space-x-2 transition-all duration-300',
                    activeTab === tab.id
                      ? 'bg-white/20 text-white border-white/30'
                      : 'text-white/70 hover:text-white/90 hover:bg-white/10'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Content */}
      <div className={cn('transition-all duration-300', !isVisible && 'blur-sm opacity-50')}>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Score Overview */}
            {layout.showScoreCards && (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Your Overall Scores
                </h3>
                <div className={cn(
                  'grid gap-8',
                  layout.compactMode ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'
                )}>
                  <div className="text-center">
                    <SharedScoreCircle 
                      score={scores.financial} 
                      type="financial"
                      size={layout.compactMode ? "md" : "lg"}
                      label="Financial Health"
                      showLabel={true}
                      animated={layout.animationsEnabled}
                    />
                  </div>
                  <div className="text-center">
                    <SharedScoreCircle 
                      score={scores.health} 
                      type="health"
                      size={layout.compactMode ? "md" : "lg"}
                      label="Wellness Score"
                      showLabel={true}
                      animated={layout.animationsEnabled}
                    />
                  </div>
                  <div className="text-center">
                    <SharedScoreCircle 
                      score={scores.eco} 
                      type="eco"
                      size={layout.compactMode ? "md" : "lg"}
                      label="Eco Impact"
                      showLabel={true}
                      animated={layout.animationsEnabled}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Summary Cards */}
            <div className={cn(
              'grid gap-6',
              layout.compactMode ? 'grid-cols-3' : 'grid-cols-1 lg:grid-cols-3'
            )}>
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <DollarSign className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Financial Health</h4>
                    <p className="text-white/70 text-sm">Score: {scores.financial}/100</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Monthly spending: ${financialData.monthlySpending.toLocaleString()}
                </p>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Wellness</h4>
                    <p className="text-white/70 text-sm">Score: {scores.health}/100</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Monthly wellness: ${Object.values(wellnessData.monthlySpending).reduce((sum, amount) => sum + amount, 0).toLocaleString()}
                </p>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Leaf className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Eco Impact</h4>
                    <p className="text-white/70 text-sm">Score: {scores.eco}/100</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  CO₂ saved: {ecoData.monthlyImpact.co2Saved}kg this month
                </p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'trends' && layout.showCharts && (
          <div className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <TimeSeriesChart 
                data={[]} 
                title="Score Progress Over Time (Past 12 Months)"
              />
              <SpendingTrendsChart 
                data={[]} 
                title="Monthly Financial Overview"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryTrendsChart 
                  data={[]} 
                  type="health"
                  title="Health & Wellness Spending Trends"
                />
                <CategoryTrendsChart 
                  data={[]} 
                  type="eco"
                  title="Eco & Sustainability Spending Trends"
                />
              </div>
            </Suspense>
          </div>
        )}

        {activeTab === 'financial' && layout.showDetailedCards && (
          <Suspense fallback={<LoadingSpinner />}>
            <FinancialCard data={financialData} />
          </Suspense>
        )}

        {activeTab === 'health' && layout.showDetailedCards && (
          <Suspense fallback={<LoadingSpinner />}>
            <ComprehensiveWellnessCard 
              score={wellnessData.overallScore}
              healthKitData={{}}
              spendingCategories={wellnessData.monthlySpending}
              trends={wellnessData.healthTrends}
            />
          </Suspense>
        )}

        {activeTab === 'eco' && layout.showDetailedCards && (
          <Suspense fallback={<LoadingSpinner />}>
            <ComprehensiveEcoCard 
              score={ecoData.overallScore}
              ecoMetrics={{}}
              spendingCategories={ecoData.monthlySpending}
              monthlyImpact={ecoData.monthlyImpact}
              trends={ecoData.environmentalTrends}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
});

ConfigurableInsightsPage.displayName = 'ConfigurableInsightsPage'; 