import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdaptiveNavigation } from '@/navigation';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';

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

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
  </div>
);

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Navigation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong.</h1>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 relative overflow-hidden">
        {/* Global SVG Filters */}
        <LiquidGlassSVGFilters />

        {/* Adaptive Navigation System */}
        <AdaptiveNavigation />

        {/* Main Content Area */}
        <main className="relative">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/transactions" element={<TransactionDemo />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/reports" element={<BudgetReportsPage />} />
              
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
        </main>
      </div>
    </Router>
  );
}

export default App;
