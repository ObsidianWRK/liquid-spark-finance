import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Activity, TrendingUp, Brain, BarChart3, Settings, Download, RefreshCw, Calendar } from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { cn } from '@/shared/lib/utils';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { analyticsService } from '../api/analyticsService';
import { AnalyticsDashboardData, AnalyticsTimeframe } from '@/shared/types/analytics';

// Note: Chart components and specialized widgets will be implemented in Phase 3

export interface AnalyticsPageProps {
  familyId?: string;
  className?: string;
}

const LoadingFallback = () => (
  <UniversalCard variant="glass" className="p-6">
    <div className="flex items-center justify-center space-x-3">
      <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
      <span className="text-white/70">Loading analytics...</span>
    </div>
  </UniversalCard>
);

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ 
  familyId = 'demo_family',
  className 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // State management
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  // Analytics timeframe configuration
  const analyticsTimeframe: AnalyticsTimeframe = useMemo(() => {
    const end = new Date();
    const start = new Date();
    
    switch (timeframe) {
      case '1d':
        start.setDate(end.getDate() - 1);
        break;
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case '365d':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }
    
    return {
      start,
      end,
      period: timeframe as AnalyticsTimeframe['period']
    };
  }, [timeframe]);

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await analyticsService.getAnalyticsData(familyId, analyticsTimeframe);
        
        if (response.errors && response.errors.length > 0) {
          console.warn('Analytics data loaded with warnings:', response.errors);
        }
        
        setDashboardData(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data';
        setError(errorMessage);
        console.error('Analytics loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [familyId, analyticsTimeframe]);

  // Handle tab changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Handle export functionality
  const handleExportData = async () => {
    try {
      const blob = new Blob([JSON.stringify(dashboardData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vueni-analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setLoading(true);
    setDashboardData(null);
  };

  if (loading) {
    return (
      <div className={cn("max-w-7xl mx-auto p-4 sm:p-6 space-y-6", className)}>
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics Dashboard</h1>
          <LoadingFallback />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("max-w-7xl mx-auto p-4 sm:p-6", className)}>
        <UniversalCard variant="glass" className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Analytics Error</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline" className="text-white">
            Try Again
          </Button>
        </UniversalCard>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={cn("max-w-7xl mx-auto p-4 sm:p-6", className)}>
        <UniversalCard variant="glass" className="p-6 text-center">
          <p className="text-white/70">No analytics data available</p>
        </UniversalCard>
      </div>
    );
  }

  return (
    <div className={cn("max-w-7xl mx-auto p-4 sm:p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-white/60">
            Comprehensive health, wealth, and transaction insights with correlations
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Range Selector */}
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full sm:w-32 bg-white/[0.02] border-white/[0.08] text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/[0.08]">
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="365d">1 Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              size="sm"
              className="text-white border-white/[0.08] hover:bg-white/[0.05]"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button 
              onClick={handleExportData}
              variant="outline" 
              size="sm"
              className="text-white border-white/[0.08] hover:bg-white/[0.05]"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Data Quality Badge */}
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs",
            dashboardData.dataQuality.overall >= 90 ? "border-green-400/20 text-green-400" :
            dashboardData.dataQuality.overall >= 70 ? "border-yellow-400/20 text-yellow-400" :
            "border-red-400/20 text-red-400"
          )}
        >
          Data Quality: {dashboardData.dataQuality.overall}%
        </Badge>
        <span className="text-xs text-white/40">
          Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
        </span>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-white/[0.02] border border-white/[0.08] p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/[0.05]">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="correlations" className="data-[state=active]:bg-white/[0.05]">
            <Brain className="w-4 h-4 mr-2" />
            Correlations
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-white/[0.05]">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trends
          </TabsTrigger>
          {!isMobile && (
            <TabsTrigger value="realtime" className="data-[state=active]:bg-white/[0.05]">
              <Activity className="w-4 h-4 mr-2" />
              Real-time
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Score Summary Grid */}
          <ScoreSummaryGrid 
            scores={dashboardData.overallScores}
            trends={{
              health: dashboardData.health.weeklyTrends.stress === 'falling' ? 'up' : 'down',
              wealth: dashboardData.wealth.monthlyTrends.netWorth === 'growing' ? 'up' : 'down',
              sustainability: dashboardData.transactions.spendingTrends.eco === 'improving' ? 'up' : 'down',
              correlation: 'up'
            }}
          />

          {/* Key Correlations */}
          <CorrelationInsights 
            correlations={dashboardData.correlations}
            maxVisible={isMobile ? 2 : 3}
          />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Trends */}
            <UniversalCard variant="glass" className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Health Trends
                </h3>
              </div>
              <Suspense fallback={<LoadingFallback />}>
                <HealthTrendsChart 
                  data={dashboardData.health}
                  height={isMobile ? 200 : 300}
                />
              </Suspense>
            </UniversalCard>

            {/* Wealth Trends */}
            <UniversalCard variant="glass" className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Wealth Trends
                </h3>
              </div>
              <Suspense fallback={<LoadingFallback />}>
                <WealthTrendsChart 
                  data={dashboardData.wealth}
                  height={isMobile ? 200 : 300}
                />
              </Suspense>
            </UniversalCard>
          </div>

          {/* Smart Insights */}
          <SmartInsights insights={dashboardData.insights} />
        </TabsContent>

        {/* Correlations Tab */}
        <TabsContent value="correlations" className="space-y-6">
          <CorrelationInsights 
            correlations={dashboardData.correlations}
            detailed={true}
          />
          
          {!isMobile && (
            <Suspense fallback={<LoadingFallback />}>
              <CorrelationMatrix correlations={dashboardData.correlations} />
            </Suspense>
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Health Trends */}
            <UniversalCard variant="glass" className="p-4 sm:p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-400" />
                Health Metrics Over Time
              </h3>
              <Suspense fallback={<LoadingFallback />}>
                <HealthTrendsChart 
                  data={dashboardData.health}
                  height={400}
                  detailed={true}
                />
              </Suspense>
            </UniversalCard>

            {/* Wealth Trends */}
            <UniversalCard variant="glass" className="p-4 sm:p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Wealth Performance Over Time
              </h3>
              <Suspense fallback={<LoadingFallback />}>
                <WealthTrendsChart 
                  data={dashboardData.wealth}
                  height={400}
                  detailed={true}
                />
              </Suspense>
            </UniversalCard>

            {/* Transaction Intelligence */}
            <UniversalCard variant="glass" className="p-4 sm:p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Transaction Intelligence
              </h3>
              <Suspense fallback={<LoadingFallback />}>
                <TransactionInsightsChart 
                  data={dashboardData.transactions}
                  height={400}
                />
              </Suspense>
            </UniversalCard>
          </div>
        </TabsContent>

        {/* Real-time Tab */}
        {!isMobile && (
          <TabsContent value="realtime" className="space-y-6">
            <RealTimeMetrics 
              enabled={realTimeEnabled}
              onToggle={setRealTimeEnabled}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AnalyticsPage; 