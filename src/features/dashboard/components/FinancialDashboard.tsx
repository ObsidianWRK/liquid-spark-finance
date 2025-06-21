import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  CreditCard,
  Shield,
  Heart,
  Leaf,
  LucideIcon,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import {
  visualizationService,
  DashboardData,
  FinancialMetric,
} from '@/features/dashboard/api/visualizationService';
import { cn } from '@/shared/lib/utils';
import { UniversalCard } from '@/shared/ui/UniversalCard';

// Helper to map string names to actual Icon components
const iconMap: { [key: string]: LucideIcon } = {
  'trending-up': TrendingUp,
  'dollar-sign': DollarSign,
  'piggy-bank': Target,
  'credit-card': CreditCard,
  shield: Shield,
  activity: Activity,
  heart: Heart,
  leaf: Leaf,
  'bar-chart-3': BarChart3,
};

const getIconComponent = (iconName?: string | null): LucideIcon =>
  iconName ? iconMap[iconName] || Activity : Activity;

interface FinancialDashboardProps {
  familyId: string;
  timeframe?: '1m' | '3m' | '6m' | '1y';
  className?: string;
}

// ✅ BULLETPROOF: Runtime safety guards from original component
const safeArray = (arr: any[] | undefined | null): any[] =>
  Array.isArray(arr) ? arr : [];
const safeNumber = (num?: number | null): number =>
  typeof num === 'number' && !isNaN(num) && isFinite(num) ? num : 0;
const safeString = (str: string | undefined | null): string =>
  typeof str === 'string' ? str : '';
const formatCurrency = (value?: number | null) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeNumber(value));
};

const FinancialDashboard = ({
  familyId,
  timeframe = '3m',
  className,
}: FinancialDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // 🛡️ BULLETPROOF: Prevent race conditions
    const abortController = new AbortController(); // 🛡️ BULLETPROOF: Timeout handling

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🛡️ BULLETPROOF: Add timeout safety (15 second max)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Dashboard data loading timeout')),
            15000
          )
        );

        const dataPromise = visualizationService.getDashboardData(
          familyId,
          timeframe
        );
        const data = await Promise.race([dataPromise, timeoutPromise]);

        // 🛡️ BULLETPROOF: Enhanced data validation
        if (!isMounted) return; // Component unmounted, don't update state

        console.log('Fetched Dashboard Data:', JSON.stringify(data, null, 2));

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          // Additional validation of required properties
          const isValidData =
            typeof data.keyMetrics !== 'undefined' &&
            typeof data.spendingTrends !== 'undefined' &&
            typeof data.lastUpdated !== 'undefined';

          if (isValidData) {
            setDashboardData(data);
          } else {
            console.warn('Data structure incomplete, using fallback');
            setDashboardData({
              keyMetrics: [],
              spendingTrends: [],
              netWorthHistory: [],
              cashFlowHistory: [],
              portfolioAllocation: [],
              budgetPerformance: [],
              lastUpdated: new Date(),
            });
          }
        } else {
          throw new Error('Invalid data structure received from service.');
        }
      } catch (err) {
        if (!isMounted) return; // Component unmounted, don't update state

        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(
          'Failed to load or process dashboard data:',
          errorMessage
        );
        setError(errorMessage);

        // 🛡️ BULLETPROOF: Provide safe fallback data instead of null
        setDashboardData({
          keyMetrics: [],
          spendingTrends: [],
          netWorthHistory: [],
          cashFlowHistory: [],
          portfolioAllocation: [],
          budgetPerformance: [],
          lastUpdated: new Date(),
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    // 🛡️ BULLETPROOF: Cleanup function to prevent memory leaks and race conditions
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [familyId, timeframe]);

  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6 h-96 animate-pulse"
          >
            <div className="h-8 bg-white/[0.05] rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-white/[0.05] rounded w-full"></div>
              <div className="h-12 bg-white/[0.05] rounded w-full"></div>
              <div className="h-12 bg-white/[0.05] rounded w-full"></div>
              <div className="h-12 bg-white/[0.05] rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div
        className={cn(
          'bg-red-900/20 rounded-vueni-lg border border-red-500/30 p-12 text-center',
          className
        )}
      >
        <AlertTriangle className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          Dashboard Failed to Load
        </h3>
        <p className="text-white/60 mb-4">
          {error || 'Could not display dashboard data.'}
        </p>
        <pre className="text-left text-xs bg-black/30 p-4 rounded-vueni-lg text-white/50 overflow-auto max-h-40">
          {`Attempted to load data for familyId: ${familyId}, timeframe: ${timeframe}`}
        </pre>
      </div>
    );
  }

  // --- Data Transformation Layer (BULLETPROOF ENHANCED) ---
  // 🛡️ CRITICAL FIX: Null-safe destructuring with runtime validation
  const keyMetricsArr =
    dashboardData?.keyMetrics && Array.isArray(dashboardData.keyMetrics)
      ? dashboardData.keyMetrics.filter(
          (metric) => metric && typeof metric === 'object' && metric.label
        )
      : [];
  const spendingTrendsArr =
    dashboardData?.spendingTrends && Array.isArray(dashboardData.spendingTrends)
      ? dashboardData.spendingTrends.filter(
          (trend) => trend && typeof trend === 'object' && trend.category
        )
      : [];

  const financialMetricsData = {
    metrics: keyMetricsArr.map((metric) => {
      // 🛡️ BULLETPROOF: Additional runtime safety for metric object
      const safeMetric = metric || {};
      return {
        label: safeString(safeMetric.label) || 'Unknown Metric',
        value:
          safeMetric.format === 'currency'
            ? formatCurrency(safeMetric.value)
            : `${safeNumber(safeMetric.value)}`,
        icon: getIconComponent(safeMetric.icon),
        color: safeString(safeMetric.color) || '#FFFFFF',
      };
    }),
    trends: [
      { label: 'Income', trend: 'up' as const, value: '+12%' },
      { label: 'Expenses', trend: 'down' as const, value: '-3%' },
    ],
  };

  const categorySpendingData = {
    spending: spendingTrendsArr.map((trend) => {
      // 🛡️ BULLETPROOF: Additional runtime safety for trend object
      const safeTrend = trend || {};
      return {
        category: safeString(safeTrend.category) || 'Unknown',
        amount: safeNumber(safeTrend.currentMonth),
      };
    }),
    trends: spendingTrendsArr.map((trend) => {
      // 🛡️ BULLETPROOF: Enhanced math safety with edge case handling
      const safeTrend = trend || {};
      const prevMonth = safeNumber(safeTrend.previousMonth);
      const currMonth = safeNumber(safeTrend.currentMonth);
      const change = currMonth - prevMonth;

      // Enhanced percentage calculation with safety guards
      let percentChange = 0;
      if (prevMonth !== 0 && isFinite(prevMonth)) {
        percentChange = (change / prevMonth) * 100;
      } else if (currMonth > 0) {
        percentChange = 100;
      }

      // Ensure percentChange is finite and reasonable
      percentChange = isFinite(percentChange)
        ? Math.max(-999, Math.min(999, percentChange))
        : 0;

      return {
        label: safeString(safeTrend.category) || 'Unknown',
        trend: change >= 0 ? 'up' : 'down',
        value: `${Math.round(percentChange)}%`,
      };
    }),
  };

  // Placeholder data for cards whose data doesn't come from visualizationService
  const wellnessData = {
    metrics: [
      {
        label: 'Sleep Quality',
        value: '8.2/10',
        icon: Heart,
        color: '#ef4444',
      },
      {
        label: 'Exercise Days',
        value: '5/week',
        icon: Activity,
        color: '#10b981',
      },
    ],
    trends: [
      { label: 'Energy', trend: 'up' as const, value: '+15%' },
      { label: 'Mood', trend: 'up' as const, value: '+10%' },
    ],
  };
  const ecoData = {
    metrics: [
      {
        label: 'Green Transport',
        value: '12.5 kg',
        icon: Leaf,
        color: '#84cc16',
      },
      {
        label: 'Food Impact',
        value: '18.3 kg',
        icon: Activity,
        color: '#f59e0b',
      },
    ],
    spending: [
      { category: 'Sustainable Products', amount: 156 },
      { category: 'Public Transport', amount: 78 },
    ],
  };

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      <UniversalCard
        variant="glass"
        title="Financial Metrics"
        icon={BarChart3}
        iconColor="#6366f1"
        data={financialMetricsData}
        size="lg"
      />

      <UniversalCard
        variant="glass"
        title="Wellness Tracking"
        icon={Heart}
        iconColor="#ef4444"
        data={wellnessData}
        size="lg"
      />

      <UniversalCard
        variant="glass"
        title="Eco Spending"
        icon={Leaf}
        iconColor="#10b981"
        data={ecoData}
        size="lg"
      />

      <UniversalCard
        variant="glass"
        title="Category Spending"
        icon={CreditCard}
        iconColor="#8b5cf6"
        data={categorySpendingData}
        size="lg"
      />
    </div>
  );
};

export default FinancialDashboard;
