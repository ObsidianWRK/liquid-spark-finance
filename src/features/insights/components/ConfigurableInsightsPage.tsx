import React, {
  useState,
  useEffect,
  useMemo,
  Suspense,
  lazy,
  useCallback,
} from 'react';
import {
  Heart,
  Leaf,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Settings,
  Filter,
  Eye,
  EyeOff,
  Download,
  Zap,
  Target,
  Activity,
  Shield,
  PiggyBank,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Switch } from '@/shared/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { cn } from '@/shared/lib/utils';
import {
  SharedScoreCircle,
  ScoreGroup,
} from '@/components/shared/SharedScoreCircle';
import { formatPercentage, getScoreColor } from '@/shared/utils/formatters';
import { UniversalCard as UnifiedCard } from '@/shared/ui/UniversalCard';
import { UniversalMetricCard } from './UniversalMetricCard';
import { UniversalScoreCard } from './UniversalScoreCard';

// Lazy load heavy components for performance
const TimeSeriesChart = lazy(
  () => import('@/features/insights/components/TimeSeriesChart')
);
const SpendingTrendsChart = lazy(
  () => import('@/features/insights/components/SpendingTrendsChart')
);
const CategoryTrendsChart = lazy(
  () => import('@/features/insights/components/CategoryTrendsChart')
);
const FinancialCard = lazy(
  () => import('@/features/insights/components/FinancialCard')
);
const WellnessCard = lazy(
  () => import('@/features/insights/components/WellnessCard')
);
const EcoCard = lazy(() => import('@/features/insights/components/EcoCard'));
const AnimatedCircularProgress = lazy(
  () => import('@/shared/ui/charts/AnimatedCircularProgress')
);

// Configurable Insights Page that consolidates:
// - VueniUnifiedInsightsPage.tsx
// - ConfigurableInsightsPage.tsx (old)
// - NewInsightsPage.tsx
// - SimpleInsightsPage.tsx
// - RefinedInsightsPage.tsx
// - OptimizedRefinedInsightsPage.tsx

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
  accountType?: string;
}

export type InsightsVariant =
  | 'standard'
  | 'refined'
  | 'enhanced'
  | 'optimized'
  | 'comprehensive'
  | 'mobile'
  | 'dashboard';
export type ViewMode =
  | 'overview'
  | 'trends'
  | 'financial'
  | 'health'
  | 'eco'
  | 'detailed';

interface LayoutConfig {
  showHeader: boolean;
  showTabs: boolean;
  showScoreCards: boolean;
  showCharts: boolean;
  showDetailedCards: boolean;
  showMetrics: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  showSettings: boolean;
  enableExport: boolean;
  enableFilters: boolean;
}

const variantLayouts: Record<InsightsVariant, LayoutConfig> = {
  standard: {
    showHeader: true,
    showTabs: true,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: true,
    showMetrics: true,
    compactMode: false,
    animationsEnabled: true,
    autoRefresh: false,
    refreshInterval: 30000,
    showSettings: false,
    enableExport: false,
    enableFilters: false,
  },
  refined: {
    showHeader: true,
    showTabs: true,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: true,
    showMetrics: true,
    compactMode: true,
    animationsEnabled: true,
    autoRefresh: false,
    refreshInterval: 30000,
    showSettings: true,
    enableExport: true,
    enableFilters: true,
  },
  enhanced: {
    showHeader: true,
    showTabs: true,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: true,
    showMetrics: true,
    compactMode: false,
    animationsEnabled: true,
    autoRefresh: true,
    refreshInterval: 30000,
    showSettings: true,
    enableExport: true,
    enableFilters: true,
  },
  optimized: {
    showHeader: false,
    showTabs: true,
    showScoreCards: true,
    showCharts: false,
    showDetailedCards: false,
    showMetrics: true,
    compactMode: true,
    animationsEnabled: false,
    autoRefresh: false,
    refreshInterval: 60000,
    showSettings: false,
    enableExport: false,
    enableFilters: false,
  },
  comprehensive: {
    showHeader: true,
    showTabs: true,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: true,
    showMetrics: true,
    compactMode: false,
    animationsEnabled: true,
    autoRefresh: true,
    refreshInterval: 15000,
    showSettings: true,
    enableExport: true,
    enableFilters: true,
  },
  mobile: {
    showHeader: false,
    showTabs: true,
    showScoreCards: true,
    showCharts: false,
    showDetailedCards: true,
    showMetrics: false,
    compactMode: true,
    animationsEnabled: true,
    autoRefresh: false,
    refreshInterval: 60000,
    showSettings: false,
    enableExport: false,
    enableFilters: false,
  },
  dashboard: {
    showHeader: true,
    showTabs: false,
    showScoreCards: true,
    showCharts: true,
    showDetailedCards: false,
    showMetrics: true,
    compactMode: false,
    animationsEnabled: true,
    autoRefresh: true,
    refreshInterval: 10000,
    showSettings: false,
    enableExport: true,
    enableFilters: false,
  },
};

export interface ConfigurableInsightsPageProps {
  transactions: Transaction[];
  accounts: Account[];
  variant?: InsightsVariant;
  customLayout?: Partial<LayoutConfig>;
  className?: string;
  onExportData?: () => void;
  defaultTab?: ViewMode;
  enableFeatureFlags?: boolean;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-vueni-pill h-8 w-8 border-b-2 border-white/50"></div>
  </div>
);

// Enhanced Score Card Component
const EnhancedScoreDisplay = ({
  scores,
  layout,
  animationsEnabled,
}: {
  scores: { credit: number; eco: number; wellness: number };
  layout: LayoutConfig;
  animationsEnabled: boolean;
}) => {
  if (layout.compactMode) {
    return (
      <div className="flex justify-center gap-6">
        <ScoreGroup
          scores={scores}
          size="md"
          showLabels={true}
          animated={animationsEnabled}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {Object.entries(scores).map(([type, score]) => (
        <div key={type} className="text-center">
          <SharedScoreCircle
            score={score}
            type={type as any}
            size="lg"
            label={
              type === 'wellness'
                ? 'Wellness Score'
                : type === 'eco'
                  ? 'Eco Impact'
                  : 'Financial Health'
            }
            showLabel={true}
            animated={animationsEnabled}
          />
        </div>
      ))}
    </div>
  );
};

// Quick Metrics Component using Universal Cards
const QuickMetrics = ({
  financialData,
  wellnessData,
  ecoData,
  layout,
}: {
  financialData: {
    monthlySpending: number;
    spendingRatio: number;
    savingsRate: number;
  };
  wellnessData: {
    monthlySpending: Record<string, number>;
  };
  ecoData: {
    monthlyImpact: {
      co2Saved: number;
    };
  };
  layout: LayoutConfig;
}) => {
  const monthlySpending = financialData?.monthlySpending ?? 0;
  const spendingRatio = financialData?.spendingRatio ?? 0;
  const savingsRate = financialData?.savingsRate ?? 0;

  const wellnessTotal = wellnessData?.monthlySpending
    ? Object.values(wellnessData.monthlySpending).reduce(
        (sum: number, amount: number) => sum + (amount || 0),
        0
      )
    : 0;

  const co2Saved = ecoData?.monthlyImpact?.co2Saved ?? 0;

  const metrics = [
    {
      icon: DollarSign,
      label: 'Monthly Spending',
      value: `$${monthlySpending.toLocaleString()}`,
      change: spendingRatio,
      color: '#3B82F6',
    },
    {
      icon: Heart,
      label: 'Wellness Investment',
      value: `$${wellnessTotal.toLocaleString()}`,
      change: 12,
      color: '#EF4444',
    },
    {
      icon: Leaf,
      label: 'CO₂ Saved',
      value: `${co2Saved}kg`,
      change: 8,
      color: '#10B981',
    },
    {
      icon: PiggyBank,
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: savingsRate > 20 ? 5 : -3,
      color: '#8B5CF6',
    },
  ];

  return (
    <div
      className={
        layout.compactMode
          ? 'grid grid-cols-2 lg:grid-cols-4 gap-3'
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }
    >
      {metrics.map((metric, index) => (
        <UniversalMetricCard
          key={index}
          title={metric.label}
          value={metric.value}
          subtitle="This month"
          color={metric.color}
          icon={<metric.icon />}
          size={layout.compactMode ? 'sm' : 'md'}
          variant="default"
          trend={
            metric.change > 0 ? 'up' : metric.change < 0 ? 'down' : 'stable'
          }
          animationsEnabled={layout.animationsEnabled}
          delay={index * 100}
        />
      ))}
    </div>
  );
};

export const ConfigurableInsightsPage =
  React.memo<ConfigurableInsightsPageProps>(
    ({
      transactions,
      accounts,
      variant = 'standard',
      customLayout,
      className,
      onExportData,
      defaultTab = 'overview',
      enableFeatureFlags = false,
    }) => {
      const [activeTab, setActiveTab] = useState<ViewMode>(defaultTab);
      const [layout, setLayout] = useState<LayoutConfig>(() => ({
        ...variantLayouts[variant],
        ...customLayout,
      }));
      const [scores, setScores] = useState({ credit: 0, wellness: 0, eco: 0 }); // WHY: Fixed property names to match interface
      const [isLoading, setIsLoading] = useState(true);
      const [showLayoutSettings, setShowLayoutSettings] = useState(false);
      const [isVisible, setIsVisible] = useState(true);

      // Memoized data calculations with proper net worth and formatting
      const financialData = useMemo(() => {
        const monthlyIncome = transactions
          .filter(
            (t) =>
              t.amount > 0 &&
              new Date(t.date).getMonth() === new Date().getMonth()
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

        // Proper net worth calculation (assets - liabilities)
        const totalAssets = accounts
          .filter((acc) => {
            const accountType = acc.accountType?.toLowerCase() || '';
            return (
              !accountType.includes('credit') &&
              !accountType.includes('loan') &&
              acc.balance > 0
            );
          })
          .reduce((sum, acc) => sum + Math.max(0, acc.balance), 0);

        const totalLiabilities = accounts
          .filter((acc) => {
            const accountType = acc.accountType?.toLowerCase() || '';
            return (
              accountType.includes('credit') ||
              accountType.includes('loan') ||
              acc.balance < 0
            );
          })
          .reduce((sum, acc) => sum + Math.abs(Math.min(0, acc.balance)), 0);

        const totalBalance = Math.round(totalAssets - totalLiabilities); // True net worth, rounded

        const spendingRatio =
          monthlyIncome > 0
            ? Math.round((monthlySpending / monthlyIncome) * 100)
            : 0;
        const emergencyFundMonths =
          monthlySpending > 0
            ? Math.round((totalAssets / monthlySpending) * 10) / 10
            : 0;
        const savingsRate =
          monthlyIncome > 0
            ? Math.round(
                ((monthlyIncome - monthlySpending) / monthlyIncome) * 100
              )
            : 0;

        const creditCardDebt = Math.abs(
          accounts
            .filter((acc) => acc.type === 'Credit Card' && acc.balance < 0)
            .reduce((sum, acc) => sum + acc.balance, 0)
        );
        const debtToIncomeRatio =
          monthlyIncome > 0
            ? Math.round((creditCardDebt / (monthlyIncome * 12)) * 100)
            : 0;

        const completedTransactions = transactions.filter(
          (t) => t.status === 'completed'
        ).length;
        const totalTransactions = transactions.length;
        const billPaymentScore =
          totalTransactions > 0
            ? Math.round((completedTransactions / totalTransactions) * 100)
            : 100;

        return {
          overallScore: Math.round(scores.financial || 75), // Rounded score
          monthlyIncome: Math.round(monthlyIncome),
          monthlySpending: Math.round(monthlySpending),
          totalBalance,
          savingsRate,
          spendingRatio,
          emergencyFundMonths,
          debtToIncomeRatio,
          billPaymentScore,
        };
      }, [transactions, accounts, scores.financial]);

      const wellnessData = useMemo(
        () => ({
          overallScore: scores.health,
          monthlySpending: {
            fitness: 85,
            nutrition: 38,
            healthcare: 340,
            wellness: 75,
            supplements: 45,
            mentalHealth: 120,
          },
          healthTrends: {
            exercise: 'up' as const,
            nutrition: 'stable' as const,
            sleep: 'stable' as const,
            stress: 'down' as const,
          },
        }),
        [scores.health]
      );

      const ecoData = useMemo(
        () => ({
          overallScore: scores.eco,
          monthlyImpact: {
            co2Saved: 48,
            treesEquivalent: 2,
            waterSaved: 384,
            energySaved: 256,
          },
          monthlySpending: {
            sustainableFood: 127,
            renewableEnergy: 85,
            ecoTransport: 45,
            greenProducts: 120,
            carbonOffset: 25,
            conservation: 60,
          },
          environmentalTrends: {
            carbonFootprint: 'down' as const,
            sustainability: 'up' as const,
            renewable: 'up' as const,
            waste: 'stable' as const,
          },
        }),
        [scores.eco]
      );

      // Load scores with error handling
      useEffect(() => {
        const loadScores = async () => {
          setIsLoading(true);
          try {
            // Simulate score calculation
            await new Promise((resolve) => setTimeout(resolve, 500));
            setScores({
              credit: 72 + Math.floor(Math.random() * 20), // WHY: Fixed property name to match interface
              wellness: 75 + Math.floor(Math.random() * 20), // WHY: Fixed property name to match interface
              eco: 82 + Math.floor(Math.random() * 15),
            });
          } catch (error) {
            console.error('Error loading scores:', error);
            setScores({ credit: 72, wellness: 75, eco: 82 }); // WHY: Fixed property names to match interface
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
          setScores((prev) => ({
            credit: Math.max(
              0,
              Math.min(100, prev.credit + (Math.random() - 0.5) * 4)
            ), // WHY: Fixed property name
            wellness: Math.max(
              0,
              Math.min(100, prev.wellness + (Math.random() - 0.5) * 4)
            ), // WHY: Fixed property name
            eco: Math.max(
              0,
              Math.min(100, prev.eco + (Math.random() - 0.5) * 4)
            ),
          }));
        }, layout.refreshInterval);

        return () => clearInterval(interval);
      }, [layout.autoRefresh, layout.refreshInterval]);

      const tabs = [
        { id: 'overview' as ViewMode, label: 'Overview', icon: TrendingUp },
        { id: 'trends' as ViewMode, label: 'Trends', icon: BarChart3 },
        { id: 'financial' as ViewMode, label: 'Financial', icon: DollarSign },
        { id: 'health' as ViewMode, label: 'Health', icon: Heart },
        { id: 'eco' as ViewMode, label: 'Eco', icon: Leaf },
        { id: 'detailed' as ViewMode, label: 'Detailed', icon: Activity },
      ];

      const handleLayoutChange = useCallback(
        (key: keyof LayoutConfig, value: boolean | number) => {
          setLayout((prev) => ({ ...prev, [key]: value }));
        },
        []
      );

      if (isLoading) {
        return (
          <UnifiedCard
            variant="default"
            className={cn('w-full text-white', className)}
          >
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-vueni-pill h-8 w-8 border-b-2 border-white/50"></div>
                <span className="text-white text-lg">Loading insights...</span>
              </div>
            </div>
          </UnifiedCard>
        );
      }

      return (
        <div
          className={cn('w-full text-white space-y-6', className)}
          data-testid="configurable-insights"
        >
          {/* Header */}
          {layout.showHeader && (
            <UnifiedCard variant="default" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1
                    className={cn(
                      'font-bold text-white mb-2',
                      layout.compactMode ? 'text-xl' : 'text-3xl lg:text-4xl'
                    )}
                  >
                    Financial Insights
                  </h1>
                  <p className="text-white/70 text-sm lg:text-base">
                    {variant === 'comprehensive'
                      ? 'Complete analysis of your financial ecosystem'
                      : variant === 'enhanced'
                        ? 'Advanced insights with real-time monitoring'
                        : variant === 'refined'
                          ? 'Streamlined view of your financial health'
                          : variant === 'mobile'
                            ? 'Your finances at a glance'
                            : 'Comprehensive analysis of your financial health, wellness spending, and environmental impact'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-white/70 hover:text-white"
                  >
                    {isVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>

                  {layout.enableExport && onExportData && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onExportData}
                      className="text-white/70 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}

                  {layout.showSettings && enableFeatureFlags && (
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
            </UnifiedCard>
          )}

          {/* Layout Settings */}
          {showLayoutSettings && enableFeatureFlags && (
            <UnifiedCard variant="default" className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Layout Settings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Compact Mode</span>
                  <Switch
                    checked={layout.compactMode}
                    onCheckedChange={(checked) =>
                      handleLayoutChange('compactMode', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Animations</span>
                  <Switch
                    checked={layout.animationsEnabled}
                    onCheckedChange={(checked) =>
                      handleLayoutChange('animationsEnabled', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Auto Refresh</span>
                  <Switch
                    checked={layout.autoRefresh}
                    onCheckedChange={(checked) =>
                      handleLayoutChange('autoRefresh', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Show Charts</span>
                  <Switch
                    checked={layout.showCharts}
                    onCheckedChange={(checked) =>
                      handleLayoutChange('showCharts', checked)
                    }
                  />
                </div>
              </div>
            </UnifiedCard>
          )}

          {/* Tab Navigation */}
          {layout.showTabs && (
            <UnifiedCard variant="default" className="p-2">
              <div className="flex flex-wrap justify-center gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      className={cn(
                        'flex items-center space-x-2 transition-all duration-300',
                        layout.compactMode
                          ? 'px-3 py-2 text-xs'
                          : 'px-4 py-2 text-sm',
                        activeTab === tab.id
                          ? 'bg-white/20 text-white border-white/30'
                          : 'text-white/70 hover:text-white/90 hover:bg-white/10'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-4 h-4',
                          layout.compactMode && 'w-3 h-3'
                        )}
                      />
                      <span>{tab.label}</span>
                    </Button>
                  );
                })}
              </div>
            </UnifiedCard>
          )}

          {/* Content */}
          <div
            className={cn(
              'transition-all duration-300',
              !isVisible && 'blur-sm opacity-50'
            )}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Score Overview */}
                {layout.showScoreCards && (
                  <UnifiedCard variant="default" className="p-6">
                    <h3
                      className={cn(
                        'font-bold text-white mb-6 text-center',
                        layout.compactMode ? 'text-lg' : 'text-xl'
                      )}
                    >
                      Your Overall Scores
                    </h3>
                    <EnhancedScoreDisplay
                      scores={scores}
                      layout={layout}
                      animationsEnabled={layout.animationsEnabled}
                    />
                  </UnifiedCard>
                )}

                {/* Quick Metrics */}
                {layout.showMetrics && (
                  <QuickMetrics
                    financialData={financialData}
                    wellnessData={wellnessData}
                    ecoData={ecoData}
                    layout={layout}
                  />
                )}
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
                <WellnessCard data={wellnessData} />
              </Suspense>
            )}

            {activeTab === 'eco' && layout.showDetailedCards && (
              <Suspense fallback={<LoadingSpinner />}>
                <EcoCard data={ecoData} />
              </Suspense>
            )}

            {activeTab === 'detailed' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Suspense fallback={<LoadingSpinner />}>
                  <FinancialCard data={financialData} />
                  <WellnessCard data={wellnessData} />
                  <EcoCard data={ecoData} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      );
    }
  );

ConfigurableInsightsPage.displayName = 'ConfigurableInsightsPage';

// Export preset configurations
export const insightsPresets = {
  dashboard: {
    variant: 'dashboard' as InsightsVariant,
    defaultTab: 'overview' as ViewMode,
  },
  mobile: {
    variant: 'mobile' as InsightsVariant,
    defaultTab: 'overview' as ViewMode,
  },
  detailed: {
    variant: 'comprehensive' as InsightsVariant,
    defaultTab: 'detailed' as ViewMode,
  },
  minimal: {
    variant: 'optimized' as InsightsVariant,
    defaultTab: 'overview' as ViewMode,
  },
  analytics: {
    variant: 'enhanced' as InsightsVariant,
    defaultTab: 'trends' as ViewMode,
  },
} as const;
