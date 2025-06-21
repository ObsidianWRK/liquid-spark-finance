import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  DollarSign,
  Infinity,
  Percent,
  BarChart2,
  Home,
  Clock,
  PieChart,
  RefreshCcw,
  Globe,
  ChevronDown,
  Check,
} from 'lucide-react';
import BackHeader from '@/shared/ui/BackHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/shared/ui/dropdown-menu';

// Lazy load calculator components for code splitting and bundle size reduction
const FinancialFreedomCalculator = lazy(
  () => import('@/features/calculators/components/FinancialFreedomCalculator')
);
const ROICalculator = lazy(
  () => import('@/features/calculators/components/ROICalculator')
);
const LoanCalculator = lazy(
  () => import('@/features/calculators/components/LoanCalculator')
);
const InflationCalculator = lazy(
  () => import('@/features/calculators/components/InflationCalculator')
);
const CompoundInterestCalculator = lazy(
  () => import('@/features/calculators/components/CompoundInterestCalculator')
);
const Retirement401kCalculator = lazy(
  () => import('@/features/calculators/components/Retirement401kCalculator')
);
const ThreeFundPortfolioCalculator = lazy(
  () => import('@/features/calculators/components/ThreeFundPortfolioCalculator')
);
const HomeAffordabilityCalculator = lazy(
  () => import('@/features/calculators/components/HomeAffordabilityCalculator')
);
const MortgagePayoffCalculator = lazy(
  () => import('@/features/calculators/components/MortgagePayoffCalculator')
);
const StockBacktestCalculator = lazy(
  () => import('@/features/calculators/components/StockBacktestCalculator')
);
const ExchangeRateCalculator = lazy(
  () => import('@/features/calculators/components/ExchangeRateCalculator')
);

// Calculator loading component
const CalculatorSkeleton = () => (
  <div className="p-8 space-y-6">
    <div className="space-y-3">
      <div className="h-8 bg-white/[0.05] rounded-vueni-lg w-1/3 animate-pulse"></div>
      <div className="h-4 bg-white/[0.03] rounded w-2/3 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-white/[0.05] rounded w-1/4 animate-pulse"></div>
            <div className="h-12 bg-white/[0.03] rounded-vueni-lg animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="h-64 bg-white/[0.03] rounded-vueni-lg animate-pulse"></div>
    </div>
  </div>
);

interface CalculatorItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  emoji: string;
  category: string;
  status?: 'popular' | 'new';
  component: React.ReactNode;
}

const calculators: CalculatorItem[] = [
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    description: 'Let your money work for you',
    icon: <Percent className="w-5 h-5" />,
    emoji: '💰',
    category: 'Savings',
    status: 'popular',
    component: <CompoundInterestCalculator />,
  },
  {
    id: 'financial-freedom',
    name: 'Financial Freedom',
    description: 'How long will your savings last?',
    icon: <Calculator className="w-5 h-5" />,
    emoji: '🚀',
    category: 'Retirement',
    component: <FinancialFreedomCalculator />,
  },
  {
    id: 'roi',
    name: 'ROI Calculator',
    description: 'Evaluate return on investment',
    icon: <TrendingUp className="w-5 h-5" />,
    emoji: '📈',
    category: 'Investing',
    status: 'popular',
    component: <ROICalculator />,
  },
  {
    id: 'loan',
    name: 'Loan Calculator',
    description: 'Plan loans and payments',
    icon: <PiggyBank className="w-5 h-5" />,
    emoji: '🏦',
    category: 'Debt',
    component: <LoanCalculator />,
  },
  {
    id: 'inflation',
    name: 'Inflation Calculator',
    description: 'Future price after inflation',
    icon: <Infinity className="w-5 h-5" />,
    emoji: '📉',
    category: 'Planning',
    status: 'new',
    component: <InflationCalculator />,
  },
  {
    id: '401k',
    name: '401k Retirement',
    description: 'See your retirement account grow',
    icon: <Clock className="w-5 h-5" />,
    emoji: '⏰',
    category: 'Retirement',
    component: <Retirement401kCalculator />,
  },
  {
    id: 'three-fund',
    name: '3-Fund Portfolio',
    description: 'Simulate portfolio allocation',
    icon: <PieChart className="w-5 h-5" />,
    emoji: '🥧',
    category: 'Investing',
    component: <ThreeFundPortfolioCalculator />,
  },
  {
    id: 'home-affordability',
    name: 'Home Affordability',
    description: 'How much house can you afford?',
    icon: <Home className="w-5 h-5" />,
    emoji: '🏠',
    category: 'Real Estate',
    status: 'new',
    component: <HomeAffordabilityCalculator />,
  },
  {
    id: 'mortgage-payoff',
    name: 'Mortgage Payoff',
    description: 'Save on interest payments',
    icon: <RefreshCcw className="w-5 h-5" />,
    emoji: '🔄',
    category: 'Debt',
    component: <MortgagePayoffCalculator />,
  },
  {
    id: 'backtest',
    name: 'Portfolio Backtest',
    description: 'Historical performance analysis',
    icon: <BarChart2 className="w-5 h-5" />,
    emoji: '📊',
    category: 'Investing',
    component: <StockBacktestCalculator />,
  },
  {
    id: 'exchange-rate',
    name: 'Exchange Rate',
    description: 'Convert currencies',
    icon: <Globe className="w-5 h-5" />,
    emoji: '💱',
    category: 'Global',
    component: <ExchangeRateCalculator />,
  },
];

const CalculatorList = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorItem>(
    calculators[0]
  );
  const navigate = useNavigate();

  // Group calculators by category
  const groupedCalculators = calculators.reduce(
    (acc, calc) => {
      if (!acc[calc.category]) {
        acc[calc.category] = [];
      }
      acc[calc.category].push(calc);
      return acc;
    },
    {} as Record<string, CalculatorItem[]>
  );

  const handleCalculatorSelect = (calculator: CalculatorItem) => {
    setSelectedCalculator(calculator);
  };

  return (
    <div className="w-full min-h-screen">
      <BackHeader title="Financial Calculators" />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header with dropdown */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Financial Calculators
              </h1>
              <p className="text-white/70 mt-1">
                Select a calculator to get started
              </p>
            </div>

            {/* Calculator Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full sm:w-auto px-4 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.12] rounded-vueni-lg flex items-center justify-between gap-3 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{selectedCalculator.emoji}</div>
                  <div className="text-left">
                    <div className="font-medium text-white">
                      {selectedCalculator.name}
                    </div>
                    <div className="text-xs text-white/60">
                      {selectedCalculator.description}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-white/60 flex-shrink-0" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-80 max-h-[70vh] overflow-y-auto bg-black/95 border-white/20 text-white">
                {Object.entries(groupedCalculators).map(
                  ([category, categoryCalcs]) => (
                    <div key={category}>
                      <DropdownMenuLabel className="text-white/40 text-xs uppercase tracking-wider">
                        {category}
                      </DropdownMenuLabel>
                      {categoryCalcs.map((calc) => (
                        <DropdownMenuItem
                          key={calc.id}
                          onClick={() => handleCalculatorSelect(calc)}
                          className="py-3 px-3 cursor-pointer hover:bg-white/10"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div className="text-lg">{calc.emoji}</div>
                              <div>
                                <div className="font-medium text-white flex items-center gap-2">
                                  {calc.name}
                                  {calc.status === 'new' && (
                                    <span className="text-xs px-1.5 py-0.5 rounded-vueni-pill bg-green-500/20 text-green-400 border border-green-500/30">
                                      New
                                    </span>
                                  )}
                                  {calc.status === 'popular' && (
                                    <span className="text-xs px-1.5 py-0.5 rounded-vueni-pill bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-white/60">
                                  {calc.description}
                                </div>
                              </div>
                            </div>
                            {selectedCalculator.id === calc.id && (
                              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                      {category !==
                        Object.keys(groupedCalculators)[
                          Object.keys(groupedCalculators).length - 1
                        ] && <DropdownMenuSeparator className="bg-white/10" />}
                    </div>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Selected Calculator Info */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-vueni-lg p-6 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-vueni-lg bg-white/[0.05] flex items-center justify-center text-2xl flex-shrink-0">
                {selectedCalculator.emoji}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-1">
                  {selectedCalculator.name}
                </h2>
                <p className="text-white/70">
                  {selectedCalculator.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs px-2 py-1 rounded-vueni-pill bg-white/10 text-white/80">
                    {selectedCalculator.category}
                  </span>
                  {selectedCalculator.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded-vueni-pill border ${
                        selectedCalculator.status === 'new'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {selectedCalculator.status === 'new' ? 'New' : 'Popular'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Component */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-vueni-lg backdrop-blur-md overflow-hidden">
          <Suspense fallback={<CalculatorSkeleton />}>
            {selectedCalculator.component}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CalculatorList;
