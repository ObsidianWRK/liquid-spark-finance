import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountCard from '@/features/accounts/components/AccountCard';
import { Grid } from '@/features/accounts/components/Grid';
import { QuickAccessRail } from '@/features/accounts/components/QuickAccessRail';
import TransactionList from '@/components/TransactionList';
import BudgetReportsPage from '@/features/budget/components/BudgetReportsPage';
import SavingsGoals from '@/features/savings/components/SavingsGoals';
import CalculatorList from '@/features/calculators/components/CalculatorList';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { mockData, getCompactAccountCards } from '@/services/mockData';
import { usePrivacyStore } from '@/features/privacy-hide-amounts/store';
import { Transaction } from '@/shared/types/shared';
// CC: New Feature Cloud and Smart Accounts Deck imports
import FeatureCloud from '@/components/FeatureCloud';
import { VirtualizedDeck } from '@/components/AccountDeck/VirtualizedDeck';
import {
  isFeatureEnabled,
  trackFeatureUsage,
} from '@/shared/utils/featureFlags';
import { transformToAccountRowData } from '@/shared/utils/accountTransformers';
import CleanCreditScoreCard from '@/features/credit/components/CleanCreditScoreCard';
import {
  BiometricMonitor,
  InterventionNudge,
  useBiometricInterventionStore,
} from '@/features/biometric-intervention';
// PFM Gap-10 Feature Imports
import { BankLinkingPanel } from '@/features/bank-linking/components/BankLinkingPanel';
import { SubscriptionsPanel } from '@/features/subscriptions/components/SubscriptionsPanel';
import { BillNegotiationPanel } from '@/features/bill-negotiation/components/BillNegotiationPanel';
import { SmartSavingsPanel } from '@/features/smart-savings/components/SmartSavingsPanel';
import { SharedBudgetsPanel } from '@/features/shared-budgets/components/SharedBudgetsPanel';
import { AgeOfMoneyCard } from '@/features/age-of-money/components/AgeOfMoneyCard';
import { PrivacyToggle } from '@/features/privacy-hide-amounts/components/PrivacyToggle';
import { AdvisorChatPanel } from '@/features/advisor-chat/components/AdvisorChatPanel';
import { SafeToSpendCard } from '@/features/safe-to-spend/components/SafeToSpendCard';
import { WidgetsPanel } from '@/features/widgets/components/WidgetsPanel';
import { BiometricMonitorCard } from '@/features/biometric-intervention/components/BiometricMonitorCard';
// Financial selectors for proper financial calculations
import { selectTotalWealth } from '@/selectors/financialSelectors';
import { mockAccountsEnhanced } from '@/services/mockData';
import { formatCurrency } from '@/shared/utils/formatters';

// Lazy load components properly without webpack comments
const InvestmentTrackerPage = lazy(
  () => import('@/features/investments/components/InvestmentTrackerPage')
);
const BudgetPlannerPage = lazy(
  () => import('@/features/budget/components/BudgetPlannerPage')
);
const DashboardPage = lazy(
  () => import('@/features/dashboard/components/DashboardPage')
);
const FinancialPlanningPage = lazy(
  () => import('@/features/planning/components/FinancialPlanningPage')
);
const CreditScorePage = lazy(
  () => import('@/features/credit/components/CreditScorePage')
);
const AnalyticsPage = lazy(
  () => import('@/features/analytics/components/AnalyticsPage')
);
const InsightsPage = lazy(() => import('./InsightsPage'));

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
            <h1 className="text-2xl font-bold text-red-400">
              Something went wrong
            </h1>
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
const adaptTransactions = (
  transactions: typeof mockData.transactions
): Transaction[] => {
  // Helper to convert legacy transaction into full shape expected by UI
  const baseAdapted = transactions.map((t, idx) => {
    const categoryName =
      typeof (t as any).category === 'string'
        ? (t as any).category
        : (t as any).category?.name?.toLowerCase() || 'other';

    return {
      // Legacy + required fields
      id: t.id ?? `txn_${idx}`,
      accountId: (t as any).accountId ?? 'acc_001',
      familyId: 'demo_family',
      amount: t.amount,
      currency: (t as any).currency ?? 'USD',
      date: new Date(t.date),
      merchantName: (t as any).merchantName ?? (t as any).merchant ?? 'Unknown',
      description:
        (t as any).description ??
        ((t as any).merchant
          ? `Purchase at ${(t as any).merchant}`
          : 'Transaction'),
      category: categoryName,
      paymentChannel: 'online',
      transactionType: t.amount < 0 ? 'purchase' : 'deposit',
      status: (() => {
        const raw = ((t.status as string) ?? '').toLowerCase();
        if (raw === 'pending') return 'pending';
        if (['cancelled', 'failed', 'returned', 'refunded'].includes(raw))
          return 'refunded';
        return 'completed';
      })(),
      isPending: (t.status as string)?.toLowerCase() === 'pending',
      isRecurring: false,
      metadata: {
        tracking_number: (t as any).trackingNumber,
        carrier: (t as any).shippingCarrier ?? (t as any).shippingProvider,
        shipping_status: (t as any).shippingStatus ?? undefined,
        payment_account_name: (t as any).paymentMethod?.accountName,
        payment_last4: (t as any).paymentMethod?.last4,
        payment_network: (t as any).paymentMethod?.network,
      },
      tags: [],
      excludeFromBudget: false,
      isTransfer: false,
      createdAt: new Date(t.date),
      updatedAt: new Date(t.date),
    } as unknown as Transaction;
  });

  // --- Ensure 60 days of transactions ---
  const DAY_MS = 24 * 60 * 60 * 1000;
  const today = new Date();
  const existingDateKeys = new Set(
    baseAdapted.map((tx) => new Date(tx.date).toDateString())
  );

  const fillerMerchants = [
    'Starbucks',
    'Amazon',
    'Target',
    'Whole Foods',
    'CVS',
    'Walmart',
    'Netflix',
    'Spotify',
    'Uber',
    'Airbnb',
    'Costco',
    'Home Depot',
  ];

  let fillerIdx = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(today.getTime() - i * DAY_MS);
    const key = d.toDateString();
    if (existingDateKeys.has(key)) continue; // already have a transaction on this day

    const merchant = fillerMerchants[fillerIdx % fillerMerchants.length];
    fillerIdx++;

    baseAdapted.push({
      id: `auto_txn_${i}`,
      accountId: 'acc_001',
      familyId: 'demo_family',
      amount: -(Math.random() * 100 + 5),
      currency: 'USD',
      date: d,
      merchantName: merchant,
      description: `Purchase at ${merchant}`,
      category: 'shopping',
      paymentChannel: 'online',
      transactionType: 'purchase',
      status: 'completed',
      isPending: false,
      isRecurring: false,
      metadata: {},
      tags: [],
      excludeFromBudget: false,
      isTransfer: false,
      createdAt: d,
      updatedAt: d,
    } as unknown as Transaction);
  }

  return baseAdapted.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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
      timestamp: new Date().toISOString(),
    },
    policy: {
      id: 'high-stress-policy',
      name: 'High Stress Spending Block',
      enabled: true,
      triggers: {
        stressThreshold: 75,
        spendingAmount: 50,
        consecutiveHighStress: 2,
      },
      actions: {
        cardFreeze: false,
        nudgeMessage: true,
        breathingExercise: true,
        delayPurchase: 30,
        safeToSpendReduction: 50,
      },
      schedule: {
        enabled: false,
        startTime: '09:00',
        endTime: '22:00',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    },
    action: 'nudge_displayed',
    outcome: 'prevented_purchase' as const,
    timestamp: new Date().toISOString(),
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataValid, setIsDataValid] = useState(false);
  // Use global privacy store instead of local state
  const { setting: privacySetting, toggle: togglePrivacy } = usePrivacyStore();
  const isMobile = useIsMobile();

  // Calculate proper financial metrics using selectors
  const netWorth = selectTotalWealth(mockAccountsEnhanced);

  // Data validation in useEffect instead of early return
  useEffect(() => {
    const validateAndLoadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate data validation and loading
        await new Promise((resolve) => setTimeout(resolve, 500));

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

  const handleToggleBalance = useCallback((accountId: string) => {
    // Use global privacy toggle instead of per-account visibility
    togglePrivacy();
  }, [togglePrivacy]);

  const handleQuickAction = useCallback((accountId: string, action: string) => {
    // Quick action handler
    // TODO: Implement quick actions
  }, []);

  // Error display after hooks
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading Dashboard
          </h2>
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

  const renderDashboardContent = () => {
    return (
      <>
        {/* CC: Feature Cloud Hero Section (R1 requirement) */}
        {isFeatureEnabled('FEATURE_CLOUD') && (
          <div className="relative py-16 px-6">
            <FeatureCloud className="max-w-6xl mx-auto" />
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* CC: Smart Accounts Deck and Compact Account Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ minHeight: '400px' }}>
            {/* Smart Accounts Deck (R2 requirement) */}
            {isFeatureEnabled('SMART_ACCOUNTS_DECK') && (
              <div className="h-full">
                <VirtualizedDeck
                  accounts={transformToAccountRowData()}
                  height={400}
                  onAccountClick={(account) => {
                    trackFeatureUsage(
                      'smart_accounts_deck',
                      'account_clicked'
                    );
                    // Account click handler
                  }}
                  className="h-full"
                />
              </div>
            )}

            {/* Enhanced Quick Access Rail */}
            <div className="h-full">
              <QuickAccessRail
                accounts={getCompactAccountCards()}
                title="Quick Access"
                subtitle={`${getCompactAccountCards().length} accounts • Net Worth: ${formatCurrency(netWorth, { currency: 'USD' })}`}
                showBalance={!privacySetting.hideAmounts}
                onToggleBalance={togglePrivacy}
                onAccountSelect={(accountId) => {
                  console.log('Selected account:', accountId);
                  // TODO: Navigate to account details
                }}
                onViewAll={() => {
                  // Navigation will be handled by the global navigation system
                  console.log('Navigate to accounts page');
                }}
                maxVisibleDesktop={6}
                className="h-full flex flex-col"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <TransactionList
                transactions={
                  adaptTransactions(mockData.transactions)?.slice(0, 10) ||
                  []
                }
                isLoading={false}
                currency="USD"
                onTransactionClick={(transaction) =>
                  console.log('Transaction clicked:', transaction)
                }
              />
            </div>
            <div className="space-y-6">
              <CleanCreditScoreCard />
              <SavingsGoals compact={true} />
            </div>
          </div>

          {/* PFM Gap-10 Features Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Personal Finance Management</h2>
                <p className="text-white/60 mt-1">
                  Comprehensive financial tools and automation
                </p>
              </div>
              <PrivacyToggle />
            </div>

            {/* Core PFM Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <BankLinkingPanel />
              <SubscriptionsPanel />
              <BillNegotiationPanel />
              <SmartSavingsPanel />
              <SharedBudgetsPanel />
              <AdvisorChatPanel />
              <SafeToSpendCard />
              <WidgetsPanel />
            </div>

            {/* Analytics & Wellness Features */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AgeOfMoneyCard />
              <BiometricMonitorCard />
              <div className="md:col-span-1 lg:col-span-1">
                {/* Future expansion slot for additional wellness features */}
                <div className="h-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 flex items-center justify-center">
                  <div className="text-center text-white/40">
                    <div className="text-sm">More features</div>
                    <div className="text-xs">Coming soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // This is now the main dashboard page - navigation is handled by the global AdaptiveNavigation system
  const renderCurrentView = () => {
    return renderDashboardContent();
  };

  return (
    <ErrorBoundary>
      <div>
        {/* WHY: Removed min-h-screen and flex - let content flow naturally */}
        <PerformanceMonitor />

        <main
          className="pt-24 pb-safe"
          style={{
            paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 6rem)',
          }}
        >
          {/* WHY: Let main content flow naturally without height constraints */}
          <div>{renderCurrentView()}</div>
          {/* Extra bottom spacing to ensure content is never clipped */}
          <div className="h-16"></div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
