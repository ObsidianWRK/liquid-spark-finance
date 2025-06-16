import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, PiggyBank, DollarSign, Infinity, Percent, BarChart2, Home, Clock, PieChart, RefreshCcw, Globe } from 'lucide-react';

interface CalculatorItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const calculators: CalculatorItem[] = [
  {
    id: 'financial-freedom',
    name: 'Financial Freedom Calculator',
    description: 'How long will your savings last?',
    icon: <Calculator />,
    category: 'Retirement'
  },
  {
    id: 'roi',
    name: 'ROI Calculator',
    description: 'Evaluate return on investment.',
    icon: <TrendingUp />,
    category: 'Investing'
  },
  {
    id: 'loan',
    name: 'Loan Calculator',
    description: 'Plan loans and payments.',
    icon: <PiggyBank />,
    category: 'Debt'
  },
  {
    id: 'inflation',
    name: 'Inflation Calculator',
    description: 'Future price after inflation.',
    icon: <Infinity />,
    category: 'Other'
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    description: 'Let your money work for you.',
    icon: <Percent />,
    category: 'Savings'
  },
  {
    id: '401k',
    name: '401k Retirement Calculator',
    description: 'See your retirement account grow.',
    icon: <Clock />,
    category: 'Retirement'
  },
  {
    id: 'three-fund',
    name: 'Bogleheads 3-Fund Portfolio',
    description: 'Simulate 3-fund portfolio.',
    icon: <PieChart />,
    category: 'Investing'
  },
  {
    id: 'home-affordability',
    name: 'Home Affordability Calculator',
    description: 'How much house can you afford?',
    icon: <Home />,
    category: 'Investing'
  },
  {
    id: 'mortgage-payoff',
    name: 'Early Mortgage Payoff Calculator',
    description: 'See savings from extra payments.',
    icon: <RefreshCcw />,
    category: 'Debt'
  },
  {
    id: 'backtest',
    name: 'Stock Portfolio Backtest',
    description: 'Historical performance (hypothetical).',
    icon: <BarChart2 />,
    category: 'Investing'
  },
  {
    id: 'exchange-rate',
    name: 'Exchange Rate Calculator',
    description: 'Convert currencies.',
    icon: <Globe />,
    category: 'Other'
  }
];

const CalculatorList = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Calculators</h1>
      {calculators.map((calc) => (
        <div
          key={calc.id}
          className="liquid-glass-card rounded-2xl p-4 hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => navigate(`/calculators/${calc.id}`)}
        >
          <div className="flex items-center space-x-4">
            {calc.icon}
            <div>
              <h2 className="text-lg font-semibold text-white">{calc.name}</h2>
              <p className="text-sm text-white/70">{calc.description}</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
            {calc.category.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CalculatorList; 