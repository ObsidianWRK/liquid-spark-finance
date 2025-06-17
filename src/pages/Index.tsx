import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AccountCard from '@/components/AccountCard';
import BalanceCard from '@/components/BalanceCard';
import { VueniUnifiedTransactionList } from '@/components/shared';
import { OptimizedTransactionList } from '@/components/transactions/OptimizedTransactionList';
import LiquidGlassTopMenuBar from '@/components/LiquidGlassTopMenuBar';
import CreditScoreCard from '@/components/credit/CreditScoreCard';
import NewInsightsPage from '@/components/insights/NewInsightsPage';
import { UnifiedInsightsPage } from '@/components/insights/UnifiedInsightsPage';
import WrappedPage from '@/components/wrapped/WrappedPage';
import BudgetReportsPage from '@/components/reports/BudgetReportsPage';
import Profile from './Profile';
import ChatDrawer from '@/components/ai/ChatDrawer';
import NetWorthSummary from '@/components/financial/NetWorthSummary';
import { mockData } from '@/services/mockData';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

// Transform mockData transactions to match UnifiedTransactionList format
const transformTransactions = (transactions: typeof mockData.transactions) => {
  return transactions.map(t => ({
    id: t.id,
    date: t.date,
    description: t.merchant,
    amount: Math.abs(t.amount),
    category: {
      name: t.category.name.toLowerCase(),
      color: t.category.color || '#6366f1'
    },
    type: t.amount < 0 ? 'expense' : 'income' as const,
    merchant: t.merchant,
    status: 'completed' as const,
    scores: {
      health: Math.floor(Math.random() * 100),
      eco: Math.floor(Math.random() * 100),
      financial: Math.floor(Math.random() * 100),
    }
  }));
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [performanceMode, setPerformanceMode] = useState(false);
  const { liquidSettings } = usePerformanceOptimization();
  const [searchParams] = useSearchParams();

  // Handle URL tab parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['dashboard', 'accounts', 'transactions', 'insights', 'reports', 'wrapped', 'profile'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Performance detection
  useEffect(() => {
    const checkPerformance = () => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const duration = performance.now() - start;
        if (duration > 16.67) { // More than one frame at 60fps
          setPerformanceMode(true);
        }
      });
    };

    checkPerformance();
  }, []);

  // Calculate main account data for BalanceCard
  const mainAccount = mockData.accounts[0]; // Main checking account

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Enhanced Navigation Menu Bar */}
            <div className="w-full">
              <LiquidGlassTopMenuBar />
            </div>
            
            {/* Balance Overview Section */}
            <div className="w-full space-y-6 pt-20">
              <div className="w-full">
                <BalanceCard 
                  accountType={mainAccount.type}
                  nickname={mainAccount.nickname}
                  balance={mainAccount.balance}
                  availableBalance={mainAccount.availableBalance}
                  currency={mainAccount.currency}
                  trend="up"
                  trendPercentage={12.5}
                />
              </div>
              
              {/* Credit Score and Account Cards Grid */}
              <div className="w-full space-y-6">
                {/* Credit Score Card */}
                <div className="w-full">
                  <CreditScoreCard />
                </div>
                
                {/* Account Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mockData.accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div className="w-full">
                <OptimizedTransactionList 
                  transactions={transformTransactions(mockData.transactions.slice(0, 15))}
                  variant="apple"
                  currency="USD"
                  features={{
                    showScores: true,
                    showCategories: true,
                    searchable: false,
                    groupByDate: true,
                    sortable: true
                  }}
                />
              </div>
            </div>
          </>
        );
      case 'accounts':
        return (
          <div className="w-full space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">All Accounts</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockData.accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
            
            {/* Net Worth Summary */}
            <NetWorthSummary accounts={mockData.accounts} className="mt-8" />
          </div>
        );
      case 'transactions':
        return (
          <div className="w-full">
            <OptimizedTransactionList 
              transactions={transformTransactions(mockData.transactions)} 
              variant="apple"
              currency="USD"
              features={{
                showScores: true,
                showCategories: true,
                searchable: true,
                filterable: true,
                groupByDate: true,
                sortable: true
              }}
            />
          </div>
        );
      case 'insights':
        return (
          <div className="w-full">
            <UnifiedInsightsPage 
              config={{
                variant: 'comprehensive',
                features: {
                  showScores: true,
                  showTrends: true,
                  showCategories: true,
                  enableInteractions: true,
                  showComparisons: true
                },
                layout: {
                  columns: 3,
                  spacing: 'normal',
                  responsive: true
                },
                dataSource: {
                  transactions: transformTransactions(mockData.transactions),
                  accounts: mockData.accounts,
                  timeframe: '30d'
                }
              }}
            />
          </div>
        );
      case 'reports':
        return (
          <div className="w-full">
            <BudgetReportsPage />
          </div>
        );
      case 'wrapped':
        return (
          <div className="w-full">
            <WrappedPage />
          </div>
        );
      case 'profile':
        return (
          <div className="w-full">
            <Profile />
          </div>
        );
      default:
        return (
          <div className="w-full">
            <h1 className="text-2xl font-bold text-white">Welcome to Vueni</h1>
          </div>
        );
    }
  }, [activeTab, mainAccount]);

  return (
    <div className={`min-h-screen w-full text-white smooth-scroll bg-black ${performanceMode ? 'performance-mode low-end-device' : ''}`}>
      {/* Optimized Background */}
      <div className={`fixed inset-0 z-0 ${performanceMode ? 'bg-black' : 'optimized-bg'}`} />
      
      {/* Main Content Container - Full Screen Layout */}
      <div className="relative z-10 min-h-screen w-full pb-24">
        <div className="w-full px-4 pt-24 pb-8 sm:px-6 lg:px-8 xl:px-12">
          {/* Header - Only show on dashboard */}
          {activeTab === 'dashboard' && (
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider drop-shadow-lg">
                **VUENI**
              </h1>
              <p className="text-white/70 text-base sm:text-lg lg:text-xl font-semibold italic tracking-wide">***Intelligence You Can Bank On***</p>
            </div>
          )}

          {/* Dynamic Content */}
          <main className="w-full space-y-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Chat Drawer */}
      <ChatDrawer />
    </div>
  );
};

export default Index;
