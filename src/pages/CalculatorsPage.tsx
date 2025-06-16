import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import CalculatorList from '@/components/calculators/CalculatorList';
import FinancialFreedomCalculator from '@/components/calculators/FinancialFreedomCalculator';
import ROICalculator from '@/components/calculators/ROICalculator';
import LoanCalculator from '@/components/calculators/LoanCalculator';
import InflationCalculator from '@/components/calculators/InflationCalculator';
import CompoundInterestCalculator from '@/components/calculators/CompoundInterestCalculator';
import Retirement401kCalculator from '@/components/calculators/Retirement401kCalculator';
import ThreeFundPortfolioCalculator from '@/components/calculators/ThreeFundPortfolioCalculator';
import HomeAffordabilityCalculator from '@/components/calculators/HomeAffordabilityCalculator';
import MortgagePayoffCalculator from '@/components/calculators/MortgagePayoffCalculator';
import StockBacktestCalculator from '@/components/calculators/StockBacktestCalculator';
import ExchangeRateCalculator from '@/components/calculators/ExchangeRateCalculator';
import BackHeader from '@/components/ui/BackHeader';

const componentMap: Record<string, React.ReactNode> = {
  'financial-freedom': <FinancialFreedomCalculator />,
  roi: <ROICalculator />,
  loan: <LoanCalculator />,
  inflation: <InflationCalculator />,
  'compound-interest': <CompoundInterestCalculator />,
  '401k': <Retirement401kCalculator />,
  'three-fund': <ThreeFundPortfolioCalculator />,
  'home-affordability': <HomeAffordabilityCalculator />,
  'mortgage-payoff': <MortgagePayoffCalculator />,
  backtest: <StockBacktestCalculator />,
  'exchange-rate': <ExchangeRateCalculator />
};

const nameMap: Record<string, string> = {
  'financial-freedom': 'Financial Freedom Calculator',
  roi: 'ROI Calculator',
  loan: 'Loan Calculator',
  inflation: 'Inflation Calculator',
  'compound-interest': 'Compound Interest Calculator',
  '401k': '401k Retirement Calculator',
  'three-fund': '3-Fund Portfolio Calculator',
  'home-affordability': 'Home Affordability Calculator',
  'mortgage-payoff': 'Early Mortgage Payoff Calculator',
  backtest: 'Stock Backtest Calculator',
  'exchange-rate': 'Exchange Rate Calculator'
};

const CalculatorsPage = () => {
  const { id } = useParams<{ id?: string }>();

  if (!id) {
    return (
      <div className="w-full text-white">
        <CalculatorList />
      </div>
    );
  }

  const Component = componentMap[id];
  return (
    <div className="w-full text-white">
      <BackHeader title={nameMap[id] || 'Calculator'} />
      <Suspense fallback={
        <div className="w-full text-white flex items-center justify-center py-20">
          <div className="liquid-glass-fallback rounded-2xl p-8">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-white text-lg">Loading calculator...</span>
            </div>
          </div>
        </div>
      }>
        <div className="w-full px-4 py-6 max-w-6xl mx-auto">
          <div className="liquid-glass-fallback rounded-2xl p-6">
            {Component || <div className="text-white p-4 text-center">Calculator not found.</div>}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default CalculatorsPage; 