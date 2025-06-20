import React, { useState, useEffect, useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, Brain, BarChart3, Download, RefreshCw, Calendar, Clock, Target, Shield, Heart, DollarSign, Zap } from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { cn } from '@/shared/lib/utils';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { analyticsService } from '../api/analyticsService';
import { AnalyticsDashboardData, AnalyticsTimeframe } from '@/shared/types/analytics';
import { unifiedDataManager, useUnifiedState } from '@/services/unifiedDataManager';
import MindfulnessVsSpending from './health/MindfulnessVsSpending';

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

// Device interfaces for company-based health device system
interface DeviceModel {
  id: string;
  name: string;
  status: 'connected' | 'syncing' | 'offline' | 'pairing';
  lastSync?: string;
  batteryLevel?: number;
  isUserDevice?: boolean; // Whether user actually owns this device
}

interface DeviceCompany {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  models: DeviceModel[];
}

interface ConnectedDevice {
  companyId: string;
  companyName: string;
  modelId: string;
  modelName: string;
  icon: string;
  bgColor: string;
  status: 'connected' | 'syncing' | 'offline' | 'pairing';
  lastSync?: string;
  batteryLevel?: number;
}

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
  const [showAllDevices, setShowAllDevices] = useState(false);

  // Company-based device ecosystem with model lineups
  // 🚀 Adding new devices is simple:
  // 1. Add new models to existing company arrays
  // 2. Add new companies with their model lineups  
  // 3. Set isUserDevice: true for devices the user owns
  // 4. System automatically handles prioritization and display
  const deviceCompanies: DeviceCompany[] = useMemo(() => [
    {
      id: 'apple',
      name: 'Apple',
      icon: '🍎',
      bgColor: 'bg-gray-800',
      models: [
        { id: 'watch-series-9', name: 'Apple Watch Series 9', status: 'connected', lastSync: '2 min ago', batteryLevel: 78, isUserDevice: true },
        { id: 'watch-ultra-2', name: 'Apple Watch Ultra 2', status: 'offline', lastSync: 'Never', isUserDevice: false },
        { id: 'watch-se', name: 'Apple Watch SE', status: 'offline', lastSync: 'Never', isUserDevice: false }
      ]
    },
    {
      id: 'whoop',
      name: 'WHOOP',
      icon: '💪',
      bgColor: 'bg-blue-600',
      models: [
        { id: 'whoop-4', name: 'WHOOP 4.0', status: 'connected', lastSync: '5 min ago', batteryLevel: 65, isUserDevice: true },
        { id: 'whoop-3', name: 'WHOOP 3.0', status: 'offline', lastSync: 'Never', isUserDevice: false }
      ]
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: '⚡',
      bgColor: 'bg-teal-500',
      models: [
        { id: 'sense-2', name: 'Fitbit Sense 2', status: 'syncing', lastSync: '1 hour ago', batteryLevel: 45, isUserDevice: true },
        { id: 'versa-4', name: 'Fitbit Versa 4', status: 'offline', lastSync: 'Never', isUserDevice: false },
        { id: 'charge-5', name: 'Fitbit Charge 5', status: 'offline', lastSync: 'Never', isUserDevice: false },
        { id: 'inspire-3', name: 'Fitbit Inspire 3', status: 'offline', lastSync: 'Never', isUserDevice: false }
      ]
    },
    {
      id: 'oura',
      name: 'Oura',
      icon: '💍',
      bgColor: 'bg-purple-600',
      models: [
        { id: 'ring-gen-3', name: 'Oura Ring Gen 3', status: 'connected', lastSync: '10 min ago', batteryLevel: 82, isUserDevice: true },
        { id: 'ring-gen-2', name: 'Oura Ring Gen 2', status: 'offline', lastSync: 'Never', isUserDevice: false }
      ]
    },
    {
      id: 'garmin',
      name: 'Garmin',
      icon: '🏃',
      bgColor: 'bg-blue-700',
      models: [
        { id: 'fenix-7', name: 'Garmin Fenix 7', status: 'offline', lastSync: '2 days ago', batteryLevel: 0, isUserDevice: true },
        { id: 'vivoactive-5', name: 'Garmin Vivoactive 5', status: 'offline', lastSync: 'Never', isUserDevice: false },
        { id: 'forerunner-965', name: 'Garmin Forerunner 965', status: 'offline', lastSync: 'Never', isUserDevice: false },
        { id: 'venu-3', name: 'Garmin Venu 3', status: 'offline', lastSync: 'Never', isUserDevice: false }
      ]
    },
    {
      id: 'samsung',
      name: 'Samsung',
      icon: '⌚',
      bgColor: 'bg-gray-700',
      models: [
        { id: 'galaxy-watch-6', name: 'Galaxy Watch 6', status: 'offline', lastSync: 'Never', isUserDevice: false },
        { id: 'galaxy-fit-3', name: 'Galaxy Fit 3', status: 'pairing', lastSync: 'Never', batteryLevel: 95, isUserDevice: true },
        { id: 'galaxy-watch-active-2', name: 'Galaxy Watch Active 2', status: 'offline', lastSync: 'Never', isUserDevice: false }
      ]
    },
    {
      id: 'amazfit',
      name: 'Amazfit',
      icon: '⚡',
      bgColor: 'bg-orange-600',
      models: [
        { id: 'gts-4', name: 'Amazfit GTS 4', status: 'offline', lastSync: '3 hours ago', batteryLevel: 23, isUserDevice: true },
        { id: 'gtr-4', name: 'Amazfit GTR 4', status: 'offline', lastSync: 'Never', isUserDevice: false },
        { id: 'band-7', name: 'Amazfit Band 7', status: 'offline', lastSync: 'Never', isUserDevice: false },
        { id: 't-rex-2', name: 'Amazfit T-Rex 2', status: 'offline', lastSync: 'Never', isUserDevice: false }
      ]
    }
  ], []);

  // Flatten user devices into connected device list
  const allConnectedDevices: ConnectedDevice[] = useMemo(() => {
    return deviceCompanies.flatMap(company => 
      company.models
        .filter(model => model.isUserDevice)
        .map(model => ({
          companyId: company.id,
          companyName: company.name,
          modelId: model.id,
          modelName: model.name,
          icon: company.icon,
          bgColor: company.bgColor,
          status: model.status,
          lastSync: model.lastSync,
          batteryLevel: model.batteryLevel
        }))
    );
  }, [deviceCompanies]);

  // Utility functions for device management
  const getDevicesByCompany = (companyId: string) => {
    return deviceCompanies.find(company => company.id === companyId)?.models || [];
  };

  const getConnectedDevicesByCompany = (companyId: string) => {
    return allConnectedDevices.filter(device => device.companyId === companyId);
  };

  const getTotalAvailableModels = () => {
    return deviceCompanies.reduce((total, company) => total + company.models.length, 0);
  };

  // Calculate device statistics
  const connectedDevicesCount = useMemo(() => 
    allConnectedDevices.filter(device => device.status === 'connected').length, 
    [allConnectedDevices]
  );

  // Determine which devices to display (prioritize connected devices)
  const displayedDevices = useMemo(() => {
    if (showAllDevices) {
      return allConnectedDevices.slice(0, 4);
    }
    
    // Sort devices by priority: connected > syncing > pairing > offline
    const priorityOrder = { connected: 4, syncing: 3, pairing: 2, offline: 1 };
    const sortedDevices = [...allConnectedDevices].sort((a, b) => 
      priorityOrder[b.status] - priorityOrder[a.status]
    );
    
    return sortedDevices.slice(0, 4);
  }, [allConnectedDevices, showAllDevices]);
  
  // Connect to unified data manager
  const [unifiedData, setUnifiedData] = useState(unifiedDataManager.getSnapshot());

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

  // Subscribe to unified data manager
  useEffect(() => {
    const subscription = unifiedDataManager.fullState$.subscribe((state) => {
      setUnifiedData(state);
    });
    
    return () => subscription.unsubscribe();
  }, []);

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

      {/* Connected Devices */}
      <UniversalCard variant="glass" interactive className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Connected Devices
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-xs text-white/50">
              <span>{connectedDevicesCount} of {allConnectedDevices.length} user devices connected</span>
              <span>{deviceCompanies.length} brands • {getTotalAvailableModels()} models available</span>
            </div>
            <Button
              onClick={() => setShowAllDevices(!showAllDevices)}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white h-6 px-2"
            >
              {showAllDevices ? 'Show Less' : 'View All'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedDevices.map((device) => (
            <div key={device.modelId} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                device.bgColor
              )}>
                <span className="text-white text-xs font-bold">{device.icon}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">{device.modelName}</div>
                <div className={cn(
                  "text-xs",
                  device.status === 'connected' ? "text-green-400" :
                  device.status === 'syncing' ? "text-yellow-400" :
                  device.status === 'pairing' ? "text-blue-400" :
                  "text-gray-400"
                )}>
                  {device.status === 'connected' ? 'Connected' :
                   device.status === 'syncing' ? 'Syncing' :
                   device.status === 'pairing' ? 'Pairing' :
                   'Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
        {showAllDevices && allConnectedDevices.length > 4 && (
          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allConnectedDevices.slice(4).map((device) => (
                <div key={device.modelId} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    device.bgColor
                  )}>
                    <span className="text-white text-xs font-bold">{device.icon}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{device.modelName}</div>
                    <div className={cn(
                      "text-xs",
                      device.status === 'connected' ? "text-green-400" :
                      device.status === 'syncing' ? "text-yellow-400" :
                      device.status === 'pairing' ? "text-blue-400" :
                      "text-gray-400"
                    )}>
                      {device.status === 'connected' ? 'Connected' :
                       device.status === 'syncing' ? 'Syncing' :
                       device.status === 'pairing' ? 'Pairing' :
                       'Offline'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </UniversalCard>

      {/* Enhanced Score Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UniversalCard variant="glass" interactive className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-white">Health Score</span>
            </div>
            <Badge variant="outline" className="border-green-400/20 text-green-400 text-xs">Excellent</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{unifiedData.health.wellnessScore}</div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+3 pts</span>
            <span className="text-white/60">this week</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">HRV</span>
              <span className="text-white">{unifiedData.health.heartRateVariability}ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Stress</span>
              <span className={cn(
                "text-xs",
                unifiedData.health.stressLevel > 60 ? "text-red-400" :
                unifiedData.health.stressLevel > 40 ? "text-yellow-400" : "text-green-400"
              )}>
                {unifiedData.health.stressLevel > 60 ? 'High' : 
                 unifiedData.health.stressLevel > 40 ? 'Medium' : 'Low'} ({unifiedData.health.stressLevel})
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Sleep</span>
              <span className="text-white">{unifiedData.health.sleepHours}h</span>
            </div>
          </div>
        </UniversalCard>
        
        <UniversalCard variant="glass" interactive className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white">Wealth Score</span>
            </div>
            <Badge variant="outline" className="border-yellow-400/20 text-yellow-400 text-xs">Good</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{Math.round((unifiedData.wealth.savingsRate + (100 - unifiedData.wealth.debtToIncomeRatio)) / 2)}</div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+2 pts</span>
            <span className="text-white/60">this month</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Net Worth</span>
              <span className="text-white">${(unifiedData.wealth.netWorth / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">ROI</span>
              <span className="text-blue-400">{unifiedData.wealth.portfolioReturns.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Savings Rate</span>
              <span className="text-white">{unifiedData.wealth.savingsRate}%</span>
            </div>
          </div>
        </UniversalCard>
        
        <UniversalCard variant="glass" interactive className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-white">Eco Score</span>
            </div>
            <Badge variant="outline" className="border-green-400/20 text-green-400 text-xs">Excellent</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-2">82</div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+5 pts</span>
            <span className="text-white/60">this month</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">CO₂ Saved</span>
              <span className="text-white">48kg</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Green Spending</span>
              <span className="text-purple-400">$340</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Score Trend</span>
              <span className="text-green-400">Rising</span>
            </div>
          </div>
        </UniversalCard>
        
        <UniversalCard variant="glass" interactive className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-white">Correlation Index</span>
            </div>
            <Badge variant="outline" className="border-yellow-400/20 text-yellow-400 text-xs">Moderate</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{Math.round((Math.abs(unifiedData.correlations.stressSpending) + Math.abs(unifiedData.correlations.sleepROI) + Math.abs(unifiedData.correlations.activityDecisions)) / 3 * 100)}</div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+4 pts</span>
            <span className="text-white/60">this week</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Stress-Spending</span>
              <span className={cn(
                "text-xs",
                unifiedData.correlations.stressSpending > 0 ? "text-orange-400" : "text-blue-400"
              )}>
                {unifiedData.correlations.stressSpending > 0 ? '+' : ''}{unifiedData.correlations.stressSpending.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Sleep-ROI</span>
              <span className={cn(
                "text-xs",
                unifiedData.correlations.sleepROI > 0 ? "text-green-400" : "text-red-400"
              )}>
                {unifiedData.correlations.sleepROI > 0 ? '+' : ''}{unifiedData.correlations.sleepROI.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Activity-Decisions</span>
              <span className={cn(
                "text-xs",
                unifiedData.correlations.activityDecisions > 0 ? "text-blue-400" : "text-red-400"
              )}>
                {unifiedData.correlations.activityDecisions > 0 ? '+' : ''}{unifiedData.correlations.activityDecisions.toFixed(2)}
              </span>
            </div>
          </div>
        </UniversalCard>
      </div>

      {/* Key Correlations */}
      {dashboardData.correlations.length > 0 && (
        <UniversalCard variant="glass" interactive className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Key Correlations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.correlations.slice(0, 3).map((correlation) => (
              <div key={correlation.id} className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/80 capitalize">
                    {correlation.type.replace('-', ' → ')}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      correlation.strength === 'strong' ? "border-red-400/20 text-red-400" :
                      correlation.strength === 'moderate' ? "border-yellow-400/20 text-yellow-400" :
                      "border-gray-400/20 text-gray-400"
                    )}
                  >
                    {correlation.strength}
                  </Badge>
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  {correlation.correlationCoefficient.toFixed(2)}
                </div>
                <div className="text-xs text-white/60">
                  {correlation.insights[0] || 'No insights available'}
                </div>
              </div>
            ))}
          </div>
        </UniversalCard>
      )}

      {/* Insights */}
      {dashboardData.insights.length > 0 && (
        <UniversalCard variant="glass" interactive className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Smart Insights</h3>
          <div className="space-y-3">
            {dashboardData.insights.slice(0, 5).map((insight) => (
              <div key={insight.id} className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                    <p className="text-sm text-white/70">{insight.description}</p>
                    {insight.recommendation && (
                      <p className="text-xs text-blue-400 mt-2">💡 {insight.recommendation}</p>
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      insight.impact === 'high' ? "border-red-400/20 text-red-400" :
                      insight.impact === 'medium' ? "border-yellow-400/20 text-yellow-400" :
                      "border-green-400/20 text-green-400"
                    )}
                  >
                    {insight.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </UniversalCard>
      )}

      {/* Device-Specific Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UniversalCard variant="glass" interactive className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Heart Rate Zones
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Zone 1 (Recovery)</span>
              <span className="text-white font-medium">23%</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Zone 2 (Aerobic)</span>
              <span className="text-white font-medium">45%</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Zone 3 (Threshold)</span>
              <span className="text-white font-medium">22%</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-2">
              <div className="bg-orange-400 h-2 rounded-full" style={{ width: '22%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Zone 4 (VO2 Max)</span>
              <span className="text-white font-medium">10%</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-2">
              <div className="bg-red-400 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
            
            <div className="mt-4 p-3 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Avg HR Today</span>
                <span className="text-white">{unifiedData.health.heartRate} bpm</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-white/60">Resting HR</span>
                <span className="text-green-400">52 bpm</span>
              </div>
            </div>
          </div>
        </UniversalCard>

        <MindfulnessVsSpending />

        <UniversalCard variant="glass" interactive className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Sleep Analysis
          </h3>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-white">{unifiedData.health.sleepHours}h</div>
              <div className="text-sm text-white/60">Last night</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Deep Sleep</span>
                <span className="text-purple-400">1h 52m</span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-2">
                <div className="bg-purple-400 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">REM Sleep</span>
                <span className="text-blue-400">2h 18m</span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Light Sleep</span>
                <span className="text-green-400">3h 24m</span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Sleep Score</span>
                <span className="text-green-400">{unifiedData.health.sleepScore}/100</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-white/60">Efficiency</span>
                <span className="text-white">92%</span>
              </div>
            </div>
          </div>
        </UniversalCard>

        <UniversalCard variant="glass" interactive className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            Daily Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/70">Steps</span>
              <span className="text-white font-bold">{unifiedData.health.steps.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-3">
              <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${Math.min(100, (unifiedData.health.steps / 10000) * 100)}%` }}></div>
            </div>
            <div className="text-xs text-white/60 text-right">Goal: 10,000</div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-white/[0.02] rounded-lg">
                <div className="text-xs text-white/60">Active Calories</div>
                <div className="text-lg font-bold text-orange-400">{unifiedData.health.activeCalories}</div>
              </div>
              <div className="p-3 bg-white/[0.02] rounded-lg">
                <div className="text-xs text-white/60">Distance</div>
                <div className="text-lg font-bold text-blue-400">3.2mi</div>
              </div>
              <div className="p-3 bg-white/[0.02] rounded-lg">
                <div className="text-xs text-white/60">Floors</div>
                <div className="text-lg font-bold text-green-400">{unifiedData.health.floors}</div>
              </div>
              <div className="p-3 bg-white/[0.02] rounded-lg">
                <div className="text-xs text-white/60">Active Min</div>
                <div className="text-lg font-bold text-purple-400">{unifiedData.health.activeMinutes}</div>
              </div>
            </div>
          </div>
        </UniversalCard>
      </div>

      {/* Financial Health Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UniversalCard variant="glass" interactive className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Stress vs Spending Patterns
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/70">High Stress Days</span>
                <Badge variant="outline" className="border-red-400/20 text-red-400 text-xs">
                  +127% spending
                </Badge>
              </div>
              <div className="text-2xl font-bold text-red-400">$189</div>
              <div className="text-xs text-white/60">Avg daily spend</div>
            </div>
            
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/70">Low Stress Days</span>
                <Badge variant="outline" className="border-green-400/20 text-green-400 text-xs">
                  -23% spending
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-400">$83</div>
              <div className="text-xs text-white/60">Avg daily spend</div>
            </div>
            
            <div className="p-3 bg-orange-400/10 rounded-lg border border-orange-400/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">Smart Alert</span>
              </div>
              <div className="text-xs text-white/80">
                Your stress levels have been elevated for 3 days. Consider meditation before making purchases.
              </div>
            </div>
          </div>
        </UniversalCard>
        
        <UniversalCard variant="glass" interactive className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            Sleep Quality Impact on ROI
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/70">Good Sleep (8+ hrs)</span>
                <Badge variant="outline" className="border-green-400/20 text-green-400 text-xs">
                  +2.3% ROI
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-400">11.7%</div>
              <div className="text-xs text-white/60">Investment returns</div>
            </div>
            
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/70">Poor Sleep (&lt;6 hrs)</span>
                <Badge variant="outline" className="border-red-400/20 text-red-400 text-xs">
                  -1.8% ROI
                </Badge>
              </div>
              <div className="text-2xl font-bold text-red-400">6.9%</div>
              <div className="text-xs text-white/60">Investment returns</div>
            </div>
            
            <div className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Insight</span>
              </div>
              <div className="text-xs text-white/80">
                Better sleep correlates with improved decision-making and investment performance.
              </div>
            </div>
          </div>
        </UniversalCard>
      </div>

      {/* Health Trends Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UniversalCard variant="glass" interactive className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Health Trends (7 Days)
          </h3>
          <div className="space-y-4">
            {/* Heart Rate Trend */}
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-white">Heart Rate Variability</span>
                <Badge variant="outline" className="border-green-400/20 text-green-400 text-xs">
                  +8% this week
                </Badge>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {[42, 38, 45, 41, 47, 43, 45].map((hrv, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-white/60 mb-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </div>
                    <div className="h-12 md:h-16 lg:h-32 bg-white/[0.05] rounded flex items-end justify-center">
                      <div 
                        className="bg-green-400 rounded-sm w-3 md:w-4 lg:w-6" 
                        style={{ height: `${(hrv / 50) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-white mt-1">{hrv}ms</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stress Levels */}
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-white">Stress Levels</span>
                <Badge variant="outline" className="border-yellow-400/20 text-yellow-400 text-xs">
                  Stable
                </Badge>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {[28, 45, 32, 38, 52, 35, 32].map((stress, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-white/60 mb-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </div>
                    <div className="h-12 md:h-16 lg:h-32 bg-white/[0.05] rounded flex items-end justify-center">
                      <div 
                        className={`rounded-sm w-3 md:w-4 lg:w-6 ${stress > 45 ? 'bg-red-400' : stress > 35 ? 'bg-yellow-400' : 'bg-green-400'}`}
                        style={{ height: `${(stress / 60) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-white mt-1">{stress}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-white">Sleep Quality</span>
                <Badge variant="outline" className="border-blue-400/20 text-blue-400 text-xs">
                  Improving
                </Badge>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {[8.2, 6.5, 7.8, 7.2, 8.5, 8.8, 7.5].map((sleep, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-white/60 mb-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </div>
                    <div className="h-12 md:h-16 lg:h-32 bg-white/[0.05] rounded flex items-end justify-center">
                      <div 
                        className="bg-purple-400 rounded-sm w-3 md:w-4 lg:w-6" 
                        style={{ height: `${(sleep / 10) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-white mt-1">{sleep}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </UniversalCard>
        
        <UniversalCard variant="glass" interactive className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Wealth Performance (30 Days)
          </h3>
          <div className="space-y-4">
            {/* Net Worth Progression */}
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-white">Net Worth Growth</span>
                <Badge variant="outline" className="border-green-400/20 text-green-400 text-xs">
                  +$3,240 (2.6%)
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-2">${(unifiedData.wealth.netWorth / 1000).toFixed(1)}K</div>
              <div className="text-xs text-white/60 mb-3">Current net worth</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">30 days ago</span>
                  <span className="text-white">${((unifiedData.wealth.netWorth - 3240) / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">15 days ago</span>
                  <span className="text-white">${((unifiedData.wealth.netWorth - 1650) / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">7 days ago</span>
                  <span className="text-white">${((unifiedData.wealth.netWorth - 720) / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Today</span>
                  <span className="text-green-400">${(unifiedData.wealth.netWorth / 1000).toFixed(1)}K</span>
                </div>
              </div>
            </div>

            {/* Portfolio Returns */}
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-white">Portfolio Returns</span>
                <Badge variant="outline" className="border-blue-400/20 text-blue-400 text-xs">
                  {unifiedData.wealth.portfolioReturns.toFixed(1)}% YTD
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">Stocks</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-sm">+{(unifiedData.wealth.portfolioReturns + 4.2).toFixed(1)}%</span>
                    <div className="w-16 bg-white/[0.05] rounded-full h-1">
                      <div className="bg-green-400 h-1 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">Bonds</span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-sm">+{(unifiedData.wealth.portfolioReturns - 4.4).toFixed(1)}%</span>
                    <div className="w-16 bg-white/[0.05] rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{ width: '19%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">Crypto</span>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-sm">-15.2%</span>
                    <div className="w-16 bg-white/[0.05] rounded-full h-1">
                      <div className="bg-red-400 h-1 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">REITs</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-sm">+{(unifiedData.wealth.portfolioReturns - 1.3).toFixed(1)}%</span>
                    <div className="w-16 bg-white/[0.05] rounded-full h-1">
                      <div className="bg-green-400 h-1 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Health Metrics */}
            <div className="p-4 bg-white/[0.02] rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-white">Financial Health</span>
                <Badge variant="outline" className="border-green-400/20 text-green-400 text-xs">
                  {unifiedData.wealth.savingsRate > 15 && unifiedData.wealth.debtToIncomeRatio < 20 ? 'Strong' : 
                   unifiedData.wealth.savingsRate > 10 || unifiedData.wealth.debtToIncomeRatio < 30 ? 'Good' : 'Fair'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{unifiedData.wealth.savingsRate}%</div>
                  <div className="text-xs text-white/60">Savings Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{(unifiedData.wealth.debtToIncomeRatio / 100).toFixed(2)}</div>
                  <div className="text-xs text-white/60">Debt-to-Income</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">{unifiedData.wealth.emergencyFundMonths}</div>
                  <div className="text-xs text-white/60">Emergency Fund</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">{unifiedData.family.creditScore}</div>
                  <div className="text-xs text-white/60">Credit Score</div>
                </div>
              </div>
            </div>
          </div>
        </UniversalCard>
      </div>
    </div>
  );
};

export default AnalyticsPage; 