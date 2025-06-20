import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdaptiveNavigation } from '@/navigation';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import { initializeForReactApp } from '@/shared/utils/viewport-init';

// Use existing working components
const Index = React.lazy(() => import('./pages/Index'));
const Profile = React.lazy(() => import('./pages/Profile'));
const TransactionDemo = React.lazy(() => import('./pages/TransactionDemo'));
const CalculatorsPage = React.lazy(() => import('./pages/CalculatorsPage'));
const CalculatorsHub = React.lazy(() => import('./pages/CalculatorsHub'));
const CreditScorePage = React.lazy(() => import('@/features/credit/components/CreditScorePage'));
const SavingsGoals = React.lazy(() => import('@/features/savings/components/SavingsGoals'));
const BudgetPlannerPage = React.lazy(() => import('@/features/budget/components/BudgetPlannerPage'));
const InvestmentTrackerPage = React.lazy(() => import('@/features/investments/components/InvestmentTrackerPage'));
const BudgetReportsPage = React.lazy(() => import('@/features/budget/components/BudgetReportsPage'));
const InsightsPage = React.lazy(() => import('./pages/InsightsPage'));
const AccountOverview = React.lazy(() => import('./pages/AccountOverview'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
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
              <h1 className="text-2xl font-bold text-white">Oops! Something went wrong</h1>
              <p className="text-white/70">
                Don't worry, this happens sometimes. We've logged the error and will look into it.
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
      console.log('Viewport Guardian initialization skipped for debugging');
    } catch (error) {
      console.warn('App initialization error:', error);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 relative overflow-hidden">
        {/* Global SVG Filters */}
        <LiquidGlassSVGFilters />

        {/* Adaptive Navigation System */}
        <AdaptiveNavigation />

        {/* Main Content Area */}
        <main className="relative">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/transactions" element={<TransactionDemo />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/reports" element={<BudgetReportsPage />} />
                
                {/* Account Detail Route */}
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
                <Route path="/calculators/:id" element={<CalculatorsPage />} />
                <Route path="/budget-planner" element={<BudgetPlannerPage />} />
                <Route path="/investment-tracker" element={<InvestmentTrackerPage />} />
                <Route path="/goal-setting" element={<SavingsGoals />} />
                <Route path="/credit" element={<CreditScorePage />} />
                <Route path="/savings" element={<SavingsGoals />} />
                
                {/* Legacy Route Redirects */}
                <Route path="/credit-score" element={<CreditScorePage />} />
                <Route path="/settings" element={<Profile />} />
                <Route path="/accounts" element={<Index />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;
