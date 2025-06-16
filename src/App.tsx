import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';

const queryClient = new QueryClient();

const Index = lazy(() => import('./pages/Index'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CreditScorePage = lazy(() => import('./components/credit/CreditScorePage'));
const SavingsGoals = lazy(() => import('./components/savings/SavingsGoals'));
const TransactionDemo = lazy(() => import('./pages/TransactionDemo'));
const BudgetPlannerPage = lazy(() => import('./components/budget/BudgetPlannerPage'));
const InvestmentTrackerPage = lazy(() => import('./components/investments/InvestmentTrackerPage'));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/credit-score" element={<CreditScorePage />} />
            <Route path="/savings" element={<SavingsGoals />} />
            <Route path="/transactions" element={<TransactionDemo />} />
            <Route path="/budget-planner" element={<BudgetPlannerPage />} />
            <Route path="/goal-setting" element={<SavingsGoals />} />
            <Route path="/investment-tracker" element={<InvestmentTrackerPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
