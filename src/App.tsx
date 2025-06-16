import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CreditScorePage from "./components/credit/CreditScorePage";
import SavingsGoals from "./components/savings/SavingsGoals";
import TransactionDemo from "./pages/TransactionDemo";
import BudgetPlannerPage from "./components/budget/BudgetPlannerPage";
import InvestmentTrackerPage from "./components/investments/InvestmentTrackerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
