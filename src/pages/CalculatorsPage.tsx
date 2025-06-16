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

const CalculatorsPage = () => {
  const { id } = useParams<{ id?: string }>();

  if (!id) {
    return <CalculatorList />;
  }

  const Component = componentMap[id];
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      {Component || <div className="text-white p-4">Calculator not found.</div>}
    </Suspense>
  );
};

export default CalculatorsPage; 