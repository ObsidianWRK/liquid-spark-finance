import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { LiquidGlassProvider } from '@/shared/hooks/useLiquidGlass';
import { FeatureFlagProvider } from '@/components/shared/VueniFeatureFlags';
import GlobalGradientBackground from '@/shared/ui/GlobalGradientBackground';
import { BiometricsProvider } from '@/providers/BiometricsProvider';
import { VueniThemeProvider } from '@/theme/ThemeProvider';
import '@/app/styles/accessibility.css';

const queryClient = new QueryClient();

// Vite-Compatible Lazy Loading (NO Webpack chunks) - Fixed for Vercel
const Index = lazy(() => import('./pages/Index'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Financial Components
const CreditScorePage = lazy(() => import('@/features/credit/components/CreditScorePage'));
const SavingsGoals = lazy(() => import('@/features/savings/components/SavingsGoals'));
const BudgetPlannerPage = lazy(() => import('@/features/budget/components/BudgetPlannerPage'));
const InvestmentTrackerPage = lazy(() => import('@/features/investments/components/InvestmentTrackerPage'));
const BudgetReportsPage = lazy(() => import('@/features/budget/components/BudgetReportsPage'));

// Tools & Utilities
const TransactionDemo = lazy(() => import('./pages/TransactionDemo'));
const CalculatorsPage = lazy(() => import('./pages/CalculatorsPage'));

// Insights (Fixed for Vercel)
const InsightsPage = lazy(() => import('./pages/InsightsPage'));

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

const AccountOverview = lazy(() => import('./pages/AccountOverview'));

const App = () => (
  <VueniThemeProvider>
    <QueryClientProvider client={queryClient}>
      <FeatureFlagProvider preset="production">
        <LiquidGlassProvider>
          <BiometricsProvider autoStart={true} debugMode={import.meta.env.DEV}>
            <TooltipProvider>
              <GlobalGradientBackground />
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
                    <Route path="/accounts/:accountId" element={<AccountOverview />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </BiometricsProvider>
        </LiquidGlassProvider>
      </FeatureFlagProvider>
    </QueryClientProvider>
  </VueniThemeProvider>
);

export default App;
