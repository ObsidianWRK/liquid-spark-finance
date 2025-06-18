import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AccountCard from '@/components/AccountCard';
import BalanceCard from '@/components/BalanceCard';
import { OptimizedTransactionList } from '@/components/transactions/OptimizedTransactionList';
import LiquidGlassTopMenuBar from '@/components/LiquidGlassTopMenuBar';
import CreditScoreCard from '@/components/credit/CreditScoreCard';
import ConsolidatedInsightsPage from '@/components/insights/ConsolidatedInsightsPage';
import BudgetReportsPage from '@/components/reports/BudgetReportsPage';
import SavingsGoals from '@/components/savings/SavingsGoals';
import CalculatorList from '@/components/calculators/CalculatorList';
import { useIsMobile } from '@/hooks/use-mobile';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { mockData } from '@/services/mockData';

// Lazy load components properly without webpack comments
const InvestmentTrackerPage = lazy(() => import('@/components/investments/InvestmentTrackerPage'));
const BudgetPlannerPage = lazy(() => import('@/components/budget/BudgetPlannerPage'));
const DashboardPage = lazy(() => import('@/components/dashboard/DashboardPage'));
const FinancialPlanningPage = lazy(() => import('@/components/planning/FinancialPlanningPage'));

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

export default function Index() {
  // ALL HOOKS MOVED TO TOP - No early returns before hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataValid, setIsDataValid] = useState(false);
  const isMobile = useIsMobile();

  // Data validation in useEffect instead of early return
  useEffect(() => {
    const validateAndLoadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate data validation and loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Data validation logic
        setIsDataValid(true);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    validateAndLoadData();
  }, []);

  // View management in useEffect
  useEffect(() => {
    const tab = searchParams.get('tab') || searchParams.get('view') || 'dashboard';
    setCurrentView(tab);
  }, [searchParams]);

  const handleViewChange = useCallback((view: string) => {
    setCurrentView(view);
    setSearchParams({ tab: view });
  }, [setSearchParams]);

  // Error display after hooks
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Dashboard</h2>
          <p className="text-white/70">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading display after hooks  
  if (loading || !isDataValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'accounts':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Accounts</h1>
                <p className="text-white/60 mt-1">
                  Manage all your financial accounts in one place
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockData.accounts?.map(account => (
                <AccountCard key={account.id} account={account} />
              )) || (
                <div className="col-span-full text-center py-12">
                  <p className="text-white/60">No accounts connected yet</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'insights':
        return <ConsolidatedInsightsPage />;
      case 'transactions':
        return (
            <OptimizedTransactionList 
            transactions={mockData.transactions || []}
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
        );
      case 'reports':
        return <BudgetReportsPage />;
      case 'savings':
        return <SavingsGoals />;
      case 'calculators':
        return <CalculatorList />;
      case 'investments':
        return (
          <Suspense fallback={<div className="p-6 text-white">Loading investments...</div>}>
            <InvestmentTrackerPage />
          </Suspense>
        );
      case 'budget':
        return (
          <Suspense fallback={<div className="p-6 text-white">Loading budget planner...</div>}>
            <BudgetPlannerPage />
          </Suspense>
        );
      case 'analytics':
        return (
          <Suspense fallback={<div className="p-6 text-white">Loading analytics dashboard...</div>}>
            <DashboardPage />
          </Suspense>
        );
      case 'planning':
        return (
          <Suspense fallback={<div className="p-6 text-white">Loading financial planning...</div>}>
            <FinancialPlanningPage familyId="demo_family" />
          </Suspense>
        );
      default:
        return (
          <>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AccountCard account={mockData.accounts?.[0] || {
                  id: 'default',
                  type: 'checking',
                  nickname: 'Main Account',
                  balance: 0,
                  availableBalance: 0,
                  currency: 'USD'
                }} />
              <BalanceCard 
                  accountType={mockData.accounts?.[0]?.type || 'checking'}
                  nickname={mockData.accounts?.[0]?.nickname || 'Main Account'}
                  balance={mockData.accounts?.[0]?.balance || 0}
                  availableBalance={mockData.accounts?.[0]?.availableBalance || 0}
                  currency={mockData.accounts?.[0]?.currency || 'USD'}
                trend="up"
                trendPercentage={12.5}
              />
                <CreditScoreCard />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <OptimizedTransactionList 
                    transactions={mockData.transactions?.slice(0, 10) || []}
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
                  />
                </div>
                <div>
                  <SavingsGoals compact={true} />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <PerformanceMonitor />
        <LiquidGlassTopMenuBar />
        
        <div className="flex flex-1 overflow-hidden">
          <Navigation 
            activeTab={currentView}
            onTabChange={handleViewChange}
          />
          
          <main className="flex-1 overflow-y-auto pt-24 pb-safe" style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 6rem)' }}>
            <div className="min-h-full">
              {renderCurrentView()}
            </div>
            {/* Extra bottom spacing to ensure content is never clipped */}
            <div className="h-16"></div>
          </main>
          </div>
      </div>
    </ErrorBoundary>
  );
}