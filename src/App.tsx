import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/components/ui/NotificationSystem';
import GlobalSearch from '@/components/search/GlobalSearch';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

const queryClient = new QueryClient();

const Index = lazy(() => import('./pages/Index'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CreditScorePage = lazy(() => import('./components/credit/CreditScorePage'));
const SavingsGoals = lazy(() => import('./components/savings/SavingsGoals'));
const TransactionDemo = lazy(() => import('./pages/TransactionDemo'));
const BudgetPlannerPage = lazy(() => import('./components/budget/BudgetPlannerPage'));
const InvestmentTrackerPage = lazy(() => import('./components/investments/InvestmentTrackerPage'));
const CalculatorsPage = lazy(() => import('./pages/CalculatorsPage'));
const BudgetReportsPage = lazy(() => import('./components/reports/BudgetReportsPage'));

// Import insights page
const InsightsPage = lazy(() => import('./pages/InsightsPage'));

// Enhanced Loading Component
const LoadingFallback = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="liquid-glass-fallback rounded-2xl p-8 text-center">
      <div className="flex items-center space-x-4 mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="text-white text-lg">Loading application...</span>
      </div>
      <p className="text-white/60 text-sm">Please wait while we set up your experience</p>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="liquid-glass-fallback rounded-2xl p-8 text-center max-w-md">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
      <p className="text-white/70 mb-6">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="space-y-3">
        <button 
          onClick={resetErrorBoundary}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full text-white/70 hover:text-white py-2 px-6 rounded-lg transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  </div>
);

// Skip Link Component for Accessibility
const SkipLink = () => (
  <a 
    href="#main-content" 
    className="skip-link bg-blue-500 text-white py-2 px-4 rounded absolute top-0 left-0 transform -translate-y-full focus:translate-y-0 z-50 transition-transform"
  >
    Skip to main content
  </a>
);

const App = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('vueni-onboarding-complete');
  });

  // Global keyboard shortcut (Cmd+K / Ctrl+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('vueni-onboarding-complete', 'true');
    setShowOnboarding(false);
  };

  const handleNavigate = (type: string, id: string) => {
    switch (type) {
      case 'transaction':
        window.location.href = `/transactions?tx=${id}`;
        break;
      case 'account':
        window.location.href = `/accounts?acc=${id}`;
        break;
      case 'calculator':
        window.location.href = `/calculators/${id}`;
        break;
      case 'help':
        window.open(`/help/${id}`, '_blank');
        break;
      default:
        window.location.href = `/${type}`;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <NotificationProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <SkipLink />
              <Toaster />
              <Sonner />
              {/* Screen reader live region for toast announcements */}
              <div id="sr-toast-live" aria-live="polite" aria-atomic="true" className="sr-only" />
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <main id="main-content">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/credit-score" element={<CreditScorePage />} />
                      <Route path="/savings" element={<SavingsGoals />} />
                      <Route path="/transactions" element={<TransactionDemo />} />
                      <Route path="/budget-planner" element={<BudgetPlannerPage />} />
                      <Route path="/goal-setting" element={<SavingsGoals />} />
                      <Route path="/investment-tracker" element={<InvestmentTrackerPage />} />
                      <Route path="/calculators" element={<CalculatorsPage />} />
                      <Route path="/calculators/:id" element={<CalculatorsPage />} />
                      <Route path="/reports" element={<BudgetReportsPage />} />
                      <Route path="/insights" element={<InsightsPage />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </Suspense>
              </BrowserRouter>
              {showSearch && (
                <GlobalSearch
                  isOpen={showSearch}
                  onClose={() => setShowSearch(false)}
                  onNavigate={handleNavigate}
                />
              )}
              {showOnboarding && (
                <OnboardingFlow
                  onComplete={handleOnboardingComplete}
                  onSkip={handleOnboardingComplete}
                />
              )}
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
