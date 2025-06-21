import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import CalculatorList from '@/features/calculators/components/CalculatorList';
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
import BackHeader from '@/shared/ui/BackHeader';
import PageContainer from '@/shared/components/PageContainer';

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
  'exchange-rate': <ExchangeRateCalculator />,
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
  'exchange-rate': 'Exchange Rate Calculator',
};

const CalculatorsPage = () => {
  const { id } = useParams<{ id?: string }>();

  if (!id) {
    return (
      <PageContainer className="w-full text-white">
        <CalculatorList />
      </PageContainer>
    );
  }

  const Component = componentMap[id];
  return (
    <PageContainer className="w-full text-white">
      <BackHeader title={nameMap[id] || 'Calculator'} />
      <Suspense
        fallback={
          <div className="w-full text-white flex items-center justify-center py-20">
            <div className="liquid-glass-fallback rounded-2xl p-8">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-white text-lg">
                  Loading calculator...
                </span>
              </div>
            </div>
          </div>
        }
      >
        <div className="w-full px-4 py-6 max-w-6xl mx-auto">
          <div className="liquid-glass-fallback rounded-2xl p-6">
            {Component || (
              <div className="text-white p-4 text-center">
                Calculator not found.
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </PageContainer>
  );
};

export default CalculatorsPage;
