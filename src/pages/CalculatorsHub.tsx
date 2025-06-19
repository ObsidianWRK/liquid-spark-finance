// A no-op comment to try and un-stick the model.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedCard } from '@/shared/ui/UnifiedCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
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
    Heart
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
    { id: 'financial-freedom', name: 'Financial Freedom', icon: Landmark, component: FinancialFreedomCalculator },
    { id: 'roi-calculator', name: 'ROI Calculator', icon: TrendingUp, component: ROICalculator },
    { id: 'loan-calculator', name: 'Loan Calculator', icon: PiggyBank, component: LoanCalculator },
    { id: 'inflation-calculator', name: 'Inflation Calculator', icon: Repeat, component: InflationCalculator },
    { id: 'compound-interest', name: 'Compound Interest', icon: CircleDollarSign, component: CompoundInterestCalculator },
    { id: '401k-retirement', name: '401k Retirement', icon: Briefcase, component: Retirement401kCalculator },
    { id: 'three-fund-portfolio', name: 'Three-Fund Portfolio', icon: CandlestickChart, component: ThreeFundPortfolioCalculator },
    { id: 'home-affordability', name: 'Home Affordability', icon: Home, component: HomeAffordabilityCalculator },
    { id: 'mortgage-payoff', name: 'Mortgage Payoff', icon: ShieldCheck, component: MortgagePayoffCalculator },
    { id: 'stock-backtest', name: 'Stock Backtest', icon: CandlestickChart, component: StockBacktestCalculator },
    { id: 'exchange-rate-calculator', name: 'Exchange Rate Calculator', icon: Scale, component: ExchangeRateCalculator },
];

const CalculatorsHub = () => {
    const navigate = useNavigate();
    const [selectedCalculator, setSelectedCalculator] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openCalculator = (calculator) => {
        setSelectedCalculator(calculator);
    };

    const closeCalculator = () => {
        setSelectedCalculator(null);
    };

    const handleMenuSelect = (calculatorId) => {
        const calculator = calculatorList.find(c => c.id === calculatorId);
        if (calculator) {
            openCalculator(calculator);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
            <BackHeader onBack={() => navigate('/')} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Calculators</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Select Calculator
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {calculatorList.map(calculator => (
                            <DropdownMenuItem key={calculator.id} onSelect={() => handleMenuSelect(calculator.id)}>
                                {calculator.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {calculatorList.map((calculator) => (
                    <UnifiedCard
                        key={calculator.id}
                        onClick={() => openCalculator(calculator)}
                        className="cursor-pointer"
                    >
                        <div className="p-4">
                            <calculator.icon className="w-8 h-8 mb-2 text-blue-400" />
                            <h2 className="text-lg font-semibold">{calculator.name}</h2>
                        </div>
                    </UnifiedCard>
                ))}
            </div>

            {selectedCalculator && (
                <Dialog open={true} onOpenChange={closeCalculator}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{selectedCalculator.name}</DialogTitle>
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