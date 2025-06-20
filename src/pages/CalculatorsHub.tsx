// A no-op comment to try and un-stick the model.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedCard } from '@/shared/ui/UnifiedCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Calculator,
  Landmark,
  PiggyBank,
  Repeat,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Home,
  CircleDollarSign,
  CandlestickChart,
  Scale,
  Heart,
} from 'lucide-react';
import BackHeader from '@/shared/ui/BackHeader';

// Import calculator components
import FinancialFreedomCalculator from '@/features/calculators/components/FinancialFreedomCalculator';
import ROICalculator from '@/features/calculators/components/ROICalculator';
import LoanCalculator from '@/features/calculators/components/LoanCalculator';
import InflationCalculator from '@/features/calculators/components/InflationCalculator';
import CompoundInterestCalculator from '@/features/calculators/components/CompoundInterestCalculator';
import Retirement401kCalculator from '@/features/calculators/components/Retirement401kCalculator';
import ThreeFundPortfolioCalculator from '@/features/calculators/components/ThreeFundPortfolioCalculator';
import HomeAffordabilityCalculator from '@/features/calculators/components/HomeAffordabilityCalculator';
import MortgagePayoffCalculator from '@/features/calculators/components/MortgagePayoffCalculator';
import StockBacktestCalculator from '@/features/calculators/components/StockBacktestCalculator';
import ExchangeRateCalculator from '@/features/calculators/components/ExchangeRateCalculator';

const calculatorList = [
  {
    id: 'financial-freedom',
    name: 'Financial Freedom',
    icon: Landmark,
    component: FinancialFreedomCalculator,
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    icon: TrendingUp,
    component: ROICalculator,
  },
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    icon: PiggyBank,
    component: LoanCalculator,
  },
  {
    id: 'inflation-calculator',
    name: 'Inflation Calculator',
    icon: Repeat,
    component: InflationCalculator,
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    icon: CircleDollarSign,
    component: CompoundInterestCalculator,
  },
  {
    id: '401k-retirement',
    name: '401k Retirement',
    icon: Briefcase,
    component: Retirement401kCalculator,
  },
  {
    id: 'three-fund-portfolio',
    name: 'Three-Fund Portfolio',
    icon: CandlestickChart,
    component: ThreeFundPortfolioCalculator,
  },
  {
    id: 'home-affordability',
    name: 'Home Affordability',
    icon: Home,
    component: HomeAffordabilityCalculator,
  },
  {
    id: 'mortgage-payoff',
    name: 'Mortgage Payoff',
    icon: ShieldCheck,
    component: MortgagePayoffCalculator,
  },
  {
    id: 'stock-backtest',
    name: 'Stock Backtest',
    icon: CandlestickChart,
    component: StockBacktestCalculator,
  },
  {
    id: 'exchange-rate-calculator',
    name: 'Exchange Rate Calculator',
    icon: Scale,
    component: ExchangeRateCalculator,
  },
];

const CalculatorsHub = () => {
  const navigate = useNavigate();
  const [selectedCalculator, setSelectedCalculator] = useState<
    (typeof calculatorList)[0] | null
  >(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openCalculator = (calculator) => {
    setSelectedCalculator(calculator);
  };

  const closeCalculator = () => {
    setSelectedCalculator(null);
  };

  const handleMenuSelect = (calculatorId) => {
    const calculator = calculatorList.find((c) => c.id === calculatorId);
    if (calculator) {
      openCalculator(calculator);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile-first responsive container with proper spacing */}
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="max-w-none w-full mx-auto">
          <BackHeader title="Calculators" />

          {/* Responsive header with proper spacing */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Calculators
              </h1>
              <p className="text-white/60 text-sm sm:text-base mt-1">
                Financial tools and calculators
              </p>
            </div>

            {/* Responsive dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 rounded-lg hover:bg-blue-700 
                                             transition-all duration-200 text-sm sm:text-base font-medium
                                             focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  Select Calculator
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {calculatorList.map((calculator) => (
                  <DropdownMenuItem
                    key={calculator.id}
                    onSelect={() => handleMenuSelect(calculator.id)}
                  >
                    {calculator.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile-first responsive grid with progressive enhancement */}
          <div
            className="grid grid-cols-1 
                                    xs:grid-cols-2 
                                    sm:grid-cols-2 
                                    md:grid-cols-3 
                                    lg:grid-cols-4 
                                    xl:grid-cols-5
                                    2xl:grid-cols-6
                                    gap-3 sm:gap-4 md:gap-5 lg:gap-6"
            data-testid="calculators-grid"
          >
            {calculatorList.map((calculator) => (
              <UnifiedCard
                key={calculator.id}
                onClick={() => openCalculator(calculator)}
                className="group card-hover
                                          min-h-[120px] sm:min-h-[140px] md:min-h-[160px]
                                          flex flex-col items-center justify-center"
                data-testid="calculator-card"
              >
                <div className="p-3 sm:p-4 md:p-5 text-center w-full">
                  <calculator.icon
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 
                                                               mb-2 sm:mb-3 text-blue-400 mx-auto
                                                               group-hover:text-blue-300 transition-colors"
                  />
                  <h2
                    className="text-sm sm:text-base md:text-lg font-semibold
                                                   leading-tight text-white/90 group-hover:text-white
                                                   transition-colors"
                  >
                    {calculator.name}
                  </h2>
                </div>
              </UnifiedCard>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive modal dialog */}
      {selectedCalculator && (
        <Dialog open={true} onOpenChange={closeCalculator}>
          <DialogContent
            className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl
                                            max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl">
                {selectedCalculator.name}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <selectedCalculator.component />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalculatorsHub;
