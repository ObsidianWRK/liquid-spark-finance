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

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
            <p className="text-white/60">Error: {this.state.error?.message}</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Transform mockData transactions to match OptimizedTransactionList format
const transformTransactions = (transactions: typeof mockData.transactions) => {
  try {
    if (!transactions || transactions.length === 0) {
      console.warn('No transactions available');
      return [];
    }
    
    return transactions.map(t => ({
      id: t.id,
      date: t.date,
      description: t.merchant,
      amount: Math.abs(t.amount),
      category: {
        name: t.category?.name?.toLowerCase() || 'other',
        color: t.category?.color || '#6366f1'
      },
      type: (t.amount < 0 ? 'expense' : 'income') as 'expense' | 'income',
      merchant: t.merchant,
      status: 'completed' as const,
      scores: {
        health: Math.floor(Math.random() * 100),
        eco: Math.floor(Math.random() * 100),
        financial: Math.floor(Math.random() * 100),
      }
    }));
  } catch (error) {
    console.error('Error transforming transactions:', error);
    return [];
  }
};

const Index = () => {
  // Check data availability first to avoid hook violations
  if (!mockData) {
    console.error('mockData is undefined');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Data Loading Error</h1>
          <p className="text-white/60">mockData is not available</p>
        </div>
      </div>
    );
  }

  if (!mockData.accounts || mockData.accounts.length === 0) {
    console.error('No accounts in mockData');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-yellow-400">No Accounts Found</h1>
          <p className="text-white/60">No account data available</p>
        </div>
      </div>
    );
  }

  // ALL HOOKS DECLARED AFTER EARLY RETURNS TO ENSURE CONSISTENT HOOK ORDER
  const [activeTab, setActiveTab] = useState('dashboard');
  const [performanceMode, setPerformanceMode] = useState(false);
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Debug logging
  useEffect(() => {
    console.log('Index component mounted');
    console.log('mockData:', { 
      accountsCount: mockData?.accounts?.length, 
      transactionsCount: mockData?.transactions?.length 
    });
    setDebugInfo(`Loaded: ${mockData?.accounts?.length || 0} accounts, ${mockData?.transactions?.length || 0} transactions`);
  }, []);

  // Handle URL tab parameter
  useEffect(() => {
    try {
      const tabFromUrl = searchParams.get('tab');
      if (tabFromUrl && ['dashboard', 'accounts', 'transactions', 'insights', 'reports', 'wrapped', 'profile'].includes(tabFromUrl)) {
        setActiveTab(tabFromUrl);
        console.log('Tab changed to:', tabFromUrl);
      }
    } catch (error) {
      console.error('Error handling URL tab parameter:', error);
    }
  }, [searchParams]);

  // Simple performance detection
  useEffect(() => {
    try {
      const isSlowDevice = navigator.hardwareConcurrency < 4 || 
                          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setPerformanceMode(isSlowDevice);
      console.log('Performance mode:', isSlowDevice);
    } catch (error) {
      console.error('Error in performance detection:', error);
      setPerformanceMode(false);
    }
  }, []);

  const mainAccount = mockData.accounts[0];

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
    <ErrorBoundary>
      <div className={`min-h-screen w-full text-white smooth-scroll bg-black ${performanceMode ? 'performance-mode low-end-device' : ''}`}>
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-0 right-0 z-50 bg-black/80 text-xs text-white p-2 rounded-bl-lg">
            {debugInfo}
          </div>
        )}

        {/* Top Menu Bar */}
        <LiquidGlassTopMenuBar 
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
    </ErrorBoundary>
  );
};

export default Index;