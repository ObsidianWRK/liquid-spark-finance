import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdaptiveNavigation } from '@/navigation';
import { ScrollControllerProvider } from '@/navigation/context/ScrollControllerContext';
import { BiometricsProvider } from '@/providers/BiometricsProvider';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import { initializeForReactApp } from '@/shared/utils/viewport-init';

// Use existing working components
const Index = React.lazy(() => import('./pages/Index'));
const Profile = React.lazy(() => import('./pages/Profile'));
const TransactionDemo = React.lazy(() => import('./pages/TransactionDemo'));
const CalculatorsPage = React.lazy(() => import('./pages/CalculatorsPage'));
const CalculatorsHub = React.lazy(() => import('./pages/CalculatorsHub'));
const CreditScorePage = React.lazy(() => import('./pages/CreditScore'));
const SavingsGoals = React.lazy(() => import('./pages/SavingsGoals'));
const BudgetPlannerPage = React.lazy(() => import('./pages/BudgetPlanner'));
const InvestmentTrackerPage = React.lazy(() => import('./pages/InvestmentTracker'));
const BudgetReportsPage = React.lazy(() => import('./pages/Reports'));
const InsightsPage = React.lazy(() => import('./pages/InsightsPage'));
const AccountOverview = React.lazy(() => import('./pages/AccountOverview'));
const AccountsListPage = React.lazy(() => import('./pages/AccountsListPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
  </div>
);

// Account-specific loading fallback
const AccountLoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-white/70">Loading account details...</p>
    </div>
  </div>
);

// Global Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage?: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global Application Error:', error, errorInfo);

    // In development, log more details
    if (import.meta.env.DEV) {
      console.error('Error stack:', error.stack);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: undefined });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, errorMessage: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Oops! Something went wrong
              </h1>
              <p className="text-white/70">
                Don&apos;t worry, this happens sometimes. We&apos;ve logged the
                error and will look into it.
              </p>
              {import.meta.env.DEV && this.state.errorMessage && (
                <details className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
                  <summary className="cursor-pointer text-red-400 font-medium">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-300 whitespace-pre-wrap">
                    {this.state.errorMessage}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={this.handleRetry}
              >
                Try Again
              </button>
              <button
                className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors font-medium"
                onClick={this.handleGoHome}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // Initialize Viewport Guardian on app startup (temporarily disabled for debugging)
  useEffect(() => {
    try {
      // initializeForReactApp(); // Disabled to prevent viewport crashes
      // Viewport Guardian initialization skipped for debugging
    } catch (error) {
      console.warn('App initialization error:', error);
    }
  }, []);

  return (
    <ScrollControllerProvider>
      <Router>
        <div className="min-h-screen bg-black relative overflow-hidden">
          {/* Global SVG Filters */}
          <LiquidGlassSVGFilters />

          {/* Adaptive Navigation System */}
          <AdaptiveNavigation />

          {/* Main Content Area */}
          <main className="relative">
            <BiometricsProvider
              autoStart={true}
              debugMode={import.meta.env.DEV}
            >
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Main Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/transactions" element={<TransactionDemo />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/reports" element={<BudgetReportsPage />} />

                    {/* Accounts Routes */}
                    <Route path="/accounts" element={<AccountsListPage />} />
                    <Route
                      path="/accounts/:accountId"
                      element={
                        <Suspense fallback={<AccountLoadingFallback />}>
                          <AccountOverview />
                        </Suspense>
                      }
                    />

                    {/* Feature Pages */}
                    <Route path="/calculators" element={<CalculatorsHub />} />
                    <Route
                      path="/calculators/:id"
                      element={<CalculatorsPage />}
                    />
                    <Route
                      path="/budget-planner"
                      element={<BudgetPlannerPage />}
                    />
                    <Route
                      path="/investment-tracker"
                      element={<InvestmentTrackerPage />}
                    />
                    <Route path="/credit" element={<CreditScorePage />} />
                    <Route path="/savings" element={<SavingsGoals />} />

                    {/* Legacy Route Redirects */}
                    {/* The old "/goal-setting" path now redirects to the canonical
                        "/savings" route for backward compatibility. */}
                    <Route
                      path="/goal-setting"
                      element={<Navigate to="/savings" replace />}
                    />
                    <Route path="/credit-score" element={<CreditScorePage />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </BiometricsProvider>
          </main>
        </div>
      </Router>
    </ScrollControllerProvider>
  );
}

export default App;
