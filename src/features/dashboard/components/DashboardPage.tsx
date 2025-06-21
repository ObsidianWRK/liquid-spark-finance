import React, { useState, useEffect } from 'react';
import {
  Activity,
  BarChart3,
  TrendingUp,
  PieChart,
  Target,
  Zap,
  ArrowLeft,
  RefreshCw,
  Download,
  Settings,
  Calendar,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinancialDashboard from './FinancialDashboard';
import { FinancialDashboardErrorBoundary } from './FinancialDashboardErrorBoundary';
import { BankLinkingPanel } from '@/features/bank-linking';
import { visualizationService } from '@/features/dashboard/api/visualizationService';
import { cn } from '@/shared/lib/utils';
import { SubscriptionsPanel } from '@/features/subscriptions';
import { BillNegotiationPanel } from '@/features/bill-negotiation';
import { SmartSavingsPanel } from '@/features/smart-savings';
import { SharedBudgetsPanel } from '@/features/shared-budgets';
import { AgeOfMoneyCard } from '@/features/age-of-money';
import { PrivacyToggle } from '@/features/privacy-hide-amounts';
import { AdvisorChatPanel } from '@/features/advisor-chat';
import { SafeToSpendCard } from '@/features/safe-to-spend';
import { WidgetsPanel } from '@/features/widgets';
import { BiometricMonitorCard } from './health/BiometricMonitorCard';
import { WellnessScoreCard } from './health/WellnessScoreCard';
// import { LinkedAccountsCard } from './LinkedAccountsCard';
import PageContainer from '@/shared/components/PageContainer';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    '1m' | '3m' | '6m' | '1y'
  >('3m');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsRefreshing(true);
      // Load dashboard data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboard();
  };

  const handleExport = () => {
    // TODO: Implement dashboard export functionality
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <PageContainer className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            Financial Analytics Dashboard
          </h1>
          <p className="text-white/60 mt-2">
            Comprehensive view of your financial health and performance
          </p>
          {lastUpdated && (
            <p className="text-white/40 text-sm mt-1">
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/[0.08]">
            {[
              { id: '1m', label: '1M' },
              { id: '3m', label: '3M' },
              { id: '6m', label: '6M' },
              { id: '1y', label: '1Y' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSelectedTimeframe(id as any)}
                className={cn(
                  'px-3 py-1 rounded-lg transition-all text-sm',
                  selectedTimeframe === id
                    ? 'bg-blue-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/[0.05] hover:bg-white/[0.08] text-white/80 hover:text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 border border-white/[0.08]"
          >
            <RefreshCw
              className={cn('w-4 h-4', isRefreshing && 'animate-spin')}
            />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button className="bg-white/[0.05] hover:bg-white/[0.08] text-white/80 hover:text-white p-2 rounded-xl transition-colors border border-white/[0.08] flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </button>

          <PrivacyToggle />
        </div>
      </div>

      {/* Quick Insights Bar */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Insights Ready</h3>
              <p className="text-white/70 text-sm">
                Your personalized financial insights have been updated with the
                latest data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-green-400 font-semibold">+12.5%</p>
              <p className="text-white/60 text-xs">Net worth growth</p>
            </div>
            <div className="text-right">
              <p className="text-blue-400 font-semibold">85%</p>
              <p className="text-white/60 text-xs">Budget adherence</p>
            </div>
            <div className="text-right">
              <p className="text-purple-400 font-semibold">3.2x</p>
              <p className="text-white/60 text-xs">Investment return</p>
            </div>
          </div>
        </div>
      </div>

              {/* Bank Linking & Mock Accounts */}
        <div className="grid grid-cols-1 gap-6">
          <BankLinkingPanel />
        </div>

      {/* Subscriptions Detection */}
      <SubscriptionsPanel />

      {/* Bill Negotiation */}
      <BillNegotiationPanel />

      {/* Smart Savings */}
      <SmartSavingsPanel />

      {/* Shared Budgets */}
      <SharedBudgetsPanel />

      {/* Age of Money */}
      <AgeOfMoneyCard />

      {/* Advisor Chat */}
      <AdvisorChatPanel />

      {/* Health & Wellness Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safe to Spend */}
        <SafeToSpendCard />

        {/* Wellness Score */}
        <WellnessScoreCard size="md" showDetails={true} />

        {/* Biometric Stress Monitoring */}
        <BiometricMonitorCard compact={true} />
      </div>

      {/* Home Screen Widgets */}
      <WidgetsPanel />

      {/* Main Dashboard - 🛡️ BULLETPROOF: Wrapped with Error Boundary */}
      <FinancialDashboardErrorBoundary>
        <FinancialDashboard
          familyId="demo_family"
          timeframe={selectedTimeframe}
        />
      </FinancialDashboardErrorBoundary>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Insights */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            Spending Insights
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    Food spending increased
                  </p>
                  <p className="text-white/60 text-sm">
                    Up 23% from last month
                  </p>
                </div>
              </div>
              <span className="text-orange-400 font-bold">$1,250</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    Transportation savings
                  </p>
                  <p className="text-white/60 text-sm">
                    Down 15% from last month
                  </p>
                </div>
              </div>
              <span className="text-green-400 font-bold">-$320</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">On track with budget</p>
                  <p className="text-white/60 text-sm">
                    Entertainment category
                  </p>
                </div>
              </div>
              <span className="text-blue-400 font-bold">85%</span>
            </div>
          </div>
        </div>

        {/* Investment Performance */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <PieChart className="w-6 h-6 text-purple-400" />
            Investment Performance
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Portfolio growth</p>
                  <p className="text-white/60 text-sm">This quarter</p>
                </div>
              </div>
              <span className="text-green-400 font-bold">+8.2%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    Diversification score
                  </p>
                  <p className="text-white/60 text-sm">Well balanced</p>
                </div>
              </div>
              <span className="text-blue-400 font-bold">92/100</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Risk-adjusted return</p>
                  <p className="text-white/60 text-sm">Sharpe ratio</p>
                </div>
              </div>
              <span className="text-purple-400 font-bold">1.47</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Analytics Summary */}
      <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 border border-white/[0.08] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-white/60 text-sm">Total Assets</p>
            <p className="text-2xl font-bold text-white">$127,450</p>
            <p className="text-green-400 text-sm">+$2,340 this month</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Monthly Cash Flow</p>
            <p className="text-2xl font-bold text-white">+$3,250</p>
            <p className="text-blue-400 text-sm">12% above average</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Investment Return</p>
            <p className="text-2xl font-bold text-white">+8.2%</p>
            <p className="text-purple-400 text-sm">Year to date</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Savings Rate</p>
            <p className="text-2xl font-bold text-white">22%</p>
            <p className="text-orange-400 text-sm">Above target</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
