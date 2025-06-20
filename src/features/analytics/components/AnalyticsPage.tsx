import React, { useState, useEffect, useMemo } from 'react';
import { Activity, TrendingUp, Brain, BarChart3, Download, RefreshCw, Calendar } from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
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
  const isMobile = useIsMobile();
  
  // State management
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>('30d');

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

  // Tab handling will be implemented in Phase 3

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

      {/* Note: Advanced tabs and components will be implemented in Phase 3 */}
    </div>
  );
};

export default AnalyticsPage; 