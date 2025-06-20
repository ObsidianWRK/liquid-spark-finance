import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AccountCard from '@/features/accounts/components/AccountCard';
import { Grid } from '@/features/accounts/components/Grid';
import { QuickAccessRail } from '@/features/accounts/components/QuickAccessRail';
import { TransactionList } from '@/features/transactions/components/TransactionList';
import LiquidGlassTopMenuBar from '@/components/LiquidGlassTopMenuBar';
import BudgetReportsPage from '@/features/budget/components/BudgetReportsPage';
import SavingsGoals from '@/features/savings/components/SavingsGoals';
import CalculatorList from '@/features/calculators/components/CalculatorList';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { mockData, getCompactAccountCards } from '@/services/mockData';
import { Transaction } from '@/shared/types/shared';
// CC: New Feature Cloud and Smart Accounts Deck imports
import FeatureCloud from '@/components/FeatureCloud';
import { VirtualizedDeck } from '@/components/AccountDeck/VirtualizedDeck';
import { isFeatureEnabled, trackFeatureUsage } from '@/shared/utils/featureFlags';
import { transformToAccountRowData } from '@/shared/utils/accountTransformers';
import CleanCreditScoreCard from '@/features/credit/components/CleanCreditScoreCard';
import { BiometricMonitor, InterventionNudge, useBiometricInterventionStore } from '@/features/biometric-intervention';

// Lazy load components properly without webpack comments
const InvestmentTrackerPage = lazy(() => import('@/features/investments/components/InvestmentTrackerPage'));
const BudgetPlannerPage = lazy(() => import('@/features/budget/components/BudgetPlannerPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/components/DashboardPage'));
const FinancialPlanningPage = lazy(() => import('@/features/planning/components/FinancialPlanningPage'));
const CreditScorePage = lazy(() => import('@/features/credit/components/CreditScorePage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/components/AnalyticsPage'));

// Simple Insights component for now
const SimpleInsights = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-white mb-4">Financial Insights</h2>
    <p className="text-white/60">Insights functionality will be restored once import issues are resolved.</p>
  </div>
);

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

// Adapt mock transactions for new UI fields
const adaptTransactions = (transactions: typeof mockData.transactions): Transaction[] => {
  return transactions.map((t) => ({
    ...t,
    // Map legacy fields if present
    shippingCarrier: (t as any).shippingCarrier ?? (t as any).shippingProvider ?? undefined,
    shippingStatus: (t as any).shippingStatus ??
      ((s => {
        if (!s) return undefined;
        const map: Record<string, string> = {
          'Delivered': 'DELIVERED',
          'Out for Delivery': 'OUT_FOR_DELIVERY',
          'In Transit': 'IN_TRANSIT',
          'Pending': 'PENDING'
        };
        return map[s] as any;
      })((t as any).deliveryStatus)),
    // Provide fallback paymentMethod mock if absent
    paymentMethod: (t as any).paymentMethod ?? (t.amount < 0 ? {
      accountName: 'Vueni Card',
      last4: '4242',
      network: 'Visa'
    } : undefined)
  })) as unknown as Transaction[];
};

// Demo component to showcase intervention system
const DemoInterventionNudge: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  
  useEffect(() => {
    // Show demo intervention after 3 seconds for demonstration
    const timer = setTimeout(() => setShowDemo(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const mockEvent = {
    id: 'demo-intervention-1',
    type: 'intervention_triggered' as const,
    stressLevel: {
      score: 78,
      confidence: 0.85,
      baseline: 30,
      trend: 'rising' as const,
      timestamp: new Date().toISOString()
    },
    policy: {
      id: 'high-stress-policy',
      name: 'High Stress Spending Block',
      enabled: true,
      triggers: {
        stressThreshold: 75,
        spendingAmount: 50,
        consecutiveHighStress: 2
      },
      actions: {
        cardFreeze: false,
        nudgeMessage: true,
        breathingExercise: true,
        delayPurchase: 30,
        safeToSpendReduction: 50
      },
      schedule: {
        enabled: false,
        startTime: '09:00',
        endTime: '22:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      }
    },
    action: 'nudge_displayed',
    outcome: 'prevented_purchase' as const,
    timestamp: new Date().toISOString()
  };

  if (!showDemo) return null;

  return (
    <InterventionNudge
      event={mockEvent}
      onDismiss={() => setShowDemo(false)}
      onProceedAnyway={() => {
        console.log('User proceeded with purchase despite stress intervention');
        setShowDemo(false);
      }}
      onTakeBreathing={() => {
        console.log('User started breathing exercise');
        setShowDemo(false);
      }}
    />
  );
};

export default function Index() {
  // ALL HOOKS MOVED TO TOP - No early returns before hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataValid, setIsDataValid] = useState(false);
  // Initialize balance visibility with all accounts visible by default
  const [balanceVisibility, setBalanceVisibility] = useState<Record<string, boolean>>(() => {
    const initialVisibility: Record<string, boolean> = {};
    getCompactAccountCards().forEach(account => {
      initialVisibility[account.id] = true; // Show balances by default
    });
    return initialVisibility;
  });
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

  const handleToggleBalance = useCallback((accountId: string) => {
    setBalanceVisibility(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  }, []);

  const handleQuickAction = useCallback((accountId: string, action: string) => {
    // Quick action handler
    // TODO: Implement quick actions
  }, []);

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
            
            {/* Compact Account Cards Grid */}
            <Grid>
              {getCompactAccountCards().map(account => (
                <AccountCard
                  key={account.id}
                  acct={{ ...account, category: account.accountType === 'Credit Card' ? 'CREDIT' : account.accountType.toUpperCase() as any }}
                  showBalance={balanceVisibility[account.id] ?? true}
                  onAction={(id, act) => handleQuickAction(id, act)}
                />
              ))}
            </Grid>
          </div>
        );
      case 'insights':
        return <SimpleInsights />;
      case 'transactions':
        return (
          <div className="max-w-none w-full relative">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Recent Transactions</h1>
                  <p className="text-white/60">
                    {mockData.transactions?.length || 0} transactions • 30 of 30
                  </p>
                </div>
                
                {/* Compact Biometric Monitor */}
                <div className="hidden lg:block">
                  <BiometricMonitor compact={true} className="w-80" />
                </div>
              </div>
              
              <div className="max-w-none">
                <TransactionList 
                  transactions={adaptTransactions(mockData.transactions) || []}
                  isLoading={false}
                  onTransactionClick={(transaction) => console.log('Transaction clicked:', transaction)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Demo Intervention Nudge - Shows how the system would work during a transaction */}
            <DemoInterventionNudge />
          </div>
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
            <AnalyticsPage />
          </Suspense>
        );
      case 'planning':
        return (
          <Suspense fallback={<div className="p-6 text-white">Loading financial planning...</div>}>
            <FinancialPlanningPage familyId="demo_family" />
          </Suspense>
        );
      case 'credit':
        return (
          <Suspense fallback={<div className="p-6 text-white">Loading credit score...</div>}>
            <CreditScorePage />
          </Suspense>
        );
      default:
        return (
          <>
            {/* CC: Feature Cloud Hero Section (R1 requirement) */}
            {isFeatureEnabled('FEATURE_CLOUD') && (
              <div className="relative py-16 px-6">
                <FeatureCloud 
                  className="max-w-6xl mx-auto"
                />
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* CC: Smart Accounts Deck and Compact Account Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Smart Accounts Deck (R2 requirement) */}
                {isFeatureEnabled('SMART_ACCOUNTS_DECK') && (
                  <div>
                    <VirtualizedDeck 
                      accounts={transformToAccountRowData()}
                      height={400}
                      onAccountClick={(account) => {
                        trackFeatureUsage('smart_accounts_deck', 'account_clicked');
                        // Account click handler
                      }}
                    />
                  </div>
                )}
                
                {/* Enhanced Quick Access Rail */}
                <div>
                  <QuickAccessRail
                    accounts={getCompactAccountCards()}
                    title="Quick Access"
                    subtitle={`${getCompactAccountCards().length} accounts • Total Balance: $83.8K`}
                    showBalance={Object.values(balanceVisibility).some(v => v === true)}
                    onToggleBalance={() => {
                      // Check if any balance is currently visible
                      const anyVisible = Object.values(balanceVisibility).some(v => v === true);
                      // Toggle all accounts to the opposite state
                      const newVisibility: Record<string, boolean> = {};
                      getCompactAccountCards().forEach(account => {
                        newVisibility[account.id] = !anyVisible; // If any visible, hide all. If all hidden, show all.
                      });
                      setBalanceVisibility(newVisibility);
                    }}
                    onAccountSelect={(accountId) => {
                      console.log('Selected account:', accountId);
                      // TODO: Navigate to account details
                    }}
                    onViewAll={() => handleViewChange('accounts')}
                    maxVisibleDesktop={6}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TransactionList 
                    transactions={adaptTransactions(mockData.transactions)?.slice(0, 10) || []}
                    isLoading={false}
                    onTransactionClick={(transaction) => console.log('Transaction clicked:', transaction)}
                  />
                </div>
                <div className="space-y-6">
                  <CleanCreditScoreCard />
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
      <div>
        {/* WHY: Removed min-h-screen and flex - let content flow naturally */}
        <PerformanceMonitor />
        <LiquidGlassTopMenuBar />
        
        <div className="flex">
          <Navigation 
            activeTab={currentView}
            onTabChange={handleViewChange}
          />
          
          <main className="flex-1 pt-24 pb-safe" style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 6rem)' }}>
            {/* WHY: Let main content flow naturally without height constraints */}
            <div>
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