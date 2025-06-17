import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { UniversalCard } from '@/components/ui/UniversalCard';

const queryClient = new QueryClient();

// Advanced Lazy Loading with Chunk Names for Bundle Analysis
const Index = lazy(() => 
  import(/* webpackChunkName: "index" */ './pages/Index')
);
const Profile = lazy(() => 
  import(/* webpackChunkName: "profile" */ './pages/Profile')
);
const NotFound = lazy(() => 
  import(/* webpackChunkName: "not-found" */ './pages/NotFound')
);

// Financial Components Chunk
const CreditScorePage = lazy(() => 
  import(/* webpackChunkName: "financial" */ './components/credit/CreditScorePage')
);
const SavingsGoals = lazy(() => 
  import(/* webpackChunkName: "financial" */ './components/savings/SavingsGoals')
);
const BudgetPlannerPage = lazy(() => 
  import(/* webpackChunkName: "financial" */ './components/budget/BudgetPlannerPage')
);
const InvestmentTrackerPage = lazy(() => 
  import(/* webpackChunkName: "financial" */ './components/investments/InvestmentTrackerPage')
);
const BudgetReportsPage = lazy(() => 
  import(/* webpackChunkName: "reports" */ './components/reports/BudgetReportsPage')
);

// Tools & Utilities Chunk
const TransactionDemo = lazy(() => 
  import(/* webpackChunkName: "tools" */ './pages/TransactionDemo')
);
const CalculatorsPage = lazy(() => 
  import(/* webpackChunkName: "tools" */ './pages/CalculatorsPage')
);

// Insights Chunk (Optimized)
const InsightsPage = lazy(() => 
  import(/* webpackChunkName: "insights" */ './pages/InsightsPage')
);

// Enhanced Loading Fallback Component
const OptimizedLoadingFallback = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <UniversalCard variant="glass" className="p-8">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        <div className="space-y-2">
          <div className="text-lg font-semibold">Loading Vueni</div>
          <div className="text-sm text-white/60">Optimized components loading...</div>
        </div>
      </div>
    </UniversalCard>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<OptimizedLoadingFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
