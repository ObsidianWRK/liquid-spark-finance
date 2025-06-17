import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AccountCard from '@/components/AccountCard';
import BalanceCard from '@/components/BalanceCard';
import { OptimizedTransactionList } from '@/components/transactions/OptimizedTransactionList';
import LiquidGlassTopMenuBar from '@/components/LiquidGlassTopMenuBar';
import CreditScoreCard from '@/components/credit/CreditScoreCard';
import { UnifiedInsightsPage } from '@/components/insights/UnifiedInsightsPage';
import BudgetReportsPage from '@/components/reports/BudgetReportsPage';
import Profile from './Profile';
import ChatDrawer from '@/components/ai/ChatDrawer';
import NetWorthSummary from '@/components/financial/NetWorthSummary';
import { mockData } from '@/services/mockData';

// Lazy load WrappedPage for better performance
const WrappedPage = lazy(() => import('@/components/wrapped/WrappedPage'));

// Transform mockData transactions to match OptimizedTransactionList format
const transformTransactions = (transactions: typeof mockData.transactions) => {
  if (!transactions || transactions.length === 0) return [];
  
  return transactions.map(t => ({
    id: t.id,
    date: t.date,
    description: t.merchant,
    amount: Math.abs(t.amount),
    category: {
      name: t.category?.name?.toLowerCase() || 'other',
      color: t.category?.color || '#6366f1'
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
  const [searchParams] = useSearchParams();

  // Safety check for mock data
  if (!mockData || !mockData.accounts || mockData.accounts.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Vueni...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  const mainAccount = mockData.accounts[0];

  // Handle URL tab parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['dashboard', 'accounts', 'transactions', 'insights', 'reports', 'wrapped', 'profile'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Simple performance detection
  useEffect(() => {
    const isSlowDevice = navigator.hardwareConcurrency < 4 || 
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setPerformanceMode(isSlowDevice);
  }, []);

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        return (
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
                transactions={transformTransactions(mockData.transactions.slice(0, 10))} 
                variant="apple"
                currency="USD"
                features={{
                  showScores: true,
                  showCategories: true,
                  searchable: false,
                  filterable: false,
                  groupByDate: true,
                  sortable: false
                }}
                title="Recent Transactions"
                className="w-full"
              />
            </div>
          </div>
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
              onTransactionClick={(transaction) => {
                console.log('Transaction clicked:', transaction);
              }}
              className="w-full"
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
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            }>
              <WrappedPage />
            </Suspense>
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
          </div>
        );
    }
  }, [activeTab, mainAccount]);

  return (
    <div className={`min-h-screen w-full text-white smooth-scroll bg-black ${performanceMode ? 'performance-mode low-end-device' : ''}`}>
      {/* Top Menu Bar */}
      <LiquidGlassTopMenuBar 
        title="Vueni" 
        subtitle="Financial Intelligence Platform"
        className="fixed top-0 left-0 right-0 z-40"
      />

      {/* Main Content Area */}
      <main 
        className="flex-1 overflow-hidden pb-24"
        role="main"
        aria-label="Main content"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />

      {/* Chat Drawer */}
      <ChatDrawer />
    </div>
  );
};

export default Index;