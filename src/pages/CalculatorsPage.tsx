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
    return <CalculatorList />;
  }

  const Component = componentMap[id];
  return (
    <>
      <BackHeader title={nameMap[id] || 'Calculator'} />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
        <div className="liquid-glass-card rounded-2xl p-4 mx-4 sm:mx-auto max-w-3xl">
          {Component || <div className="text-white p-4">Calculator not found.</div>}
        </div>
      </Suspense>
    </>
  );
};

export default CalculatorsPage; 