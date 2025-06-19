import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  MoreHorizontal,
  Play,
  BookOpen,
  Share2,
  Heart
} from 'lucide-react';
import BackHeader from '@/components/ui/BackHeader';

// Import calculator components
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

interface CalculatorCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  emoji: string;
  category: string;
  heroMetric: string;
  subMetric: string;
  status: 'popular' | 'new' | 'trending' | 'premium';
  sparklineData: number[];
  lastUpdated: string;
  component: React.ReactNode;
}

const generateSparkline = (trend: 'up' | 'down' | 'volatile'): number[] => {
  const baseData = Array.from({ length: 15 }, (_, i) => Math.random() * 20 + 40);
  
  if (trend === 'up') {
    return baseData.map((val, i) => val + (i * 2));
  } else if (trend === 'down') {
    return baseData.map((val, i) => val - (i * 1.5));
  } else {
    return baseData.map((val, i) => val + Math.sin(i) * 10);
  }
};

const calculatorCards: CalculatorCard[] = [
  {
    id: 'compound-interest',
    title: 'Compound Interest',
    description: 'Let your money work for you',
    icon: <Percent className="w-5 h-5" />,
    emoji: '💰',
    category: 'Savings',
    heroMetric: '$127,592',
    subMetric: 'Projected Growth',
    status: 'popular',
    sparklineData: generateSparkline('up'),
    lastUpdated: '2 days ago',
    component: <CompoundInterestCalculator />
  },
  {
    id: 'financial-freedom',
    title: 'Financial Freedom',
    description: 'How long will your savings last?',
    icon: <Calculator className="w-5 h-5" />,
    emoji: '🚀',
    category: 'Retirement',
    heroMetric: '18.5 years',
    subMetric: 'Freedom Timeline',
    status: 'trending',
    sparklineData: generateSparkline('up'),
    lastUpdated: '1 day ago',
    component: <FinancialFreedomCalculator />
  },
  {
    id: 'roi',
    title: 'ROI Calculator',
    description: 'Evaluate return on investment',
    icon: <TrendingUp className="w-5 h-5" />,
    emoji: '📈',
    category: 'Investing',
    heroMetric: '12.8%',
    subMetric: 'Annual Return',
    status: 'popular',
    sparklineData: generateSparkline('up'),
    lastUpdated: '3 days ago',
    component: <ROICalculator />
  },
  {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'Plan loans and payments',
    icon: <PiggyBank className="w-5 h-5" />,
    emoji: '🏦',
    category: 'Debt',
    heroMetric: '$2,847',
    subMetric: 'Monthly Payment',
    status: 'popular',
    sparklineData: generateSparkline('down'),
    lastUpdated: '1 week ago',
    component: <LoanCalculator />
  },
  {
    id: '401k',
    title: '401k Retirement',
    description: 'See your retirement account grow',
    icon: <Clock className="w-5 h-5" />,
    emoji: '⏰',
    category: 'Retirement',
    heroMetric: '$1.2M',
    subMetric: 'Retirement Balance',
    status: 'trending',
    sparklineData: generateSparkline('up'),
    lastUpdated: '5 days ago',
    component: <Retirement401kCalculator />
  },
  {
    id: 'home-affordability',
    title: 'Home Affordability',
    description: 'How much house can you afford?',
    icon: <Home className="w-5 h-5" />,
    emoji: '🏠',
    category: 'Real Estate',
    heroMetric: '$485K',
    subMetric: 'Max Home Price',
    status: 'new',
    sparklineData: generateSparkline('up'),
    lastUpdated: '2 days ago',
    component: <HomeAffordabilityCalculator />
  },
  {
    id: 'three-fund',
    title: '3-Fund Portfolio',
    description: 'Simulate Bogleheads portfolio',
    icon: <PieChart className="w-5 h-5" />,
    emoji: '🥧',
    category: 'Investing',
    heroMetric: '8.4%',
    subMetric: 'Historic Return',
    status: 'popular',
    sparklineData: generateSparkline('volatile'),
    lastUpdated: '1 week ago',
    component: <ThreeFundPortfolioCalculator />
  },
  {
    id: 'mortgage-payoff',
    title: 'Mortgage Payoff',
    description: 'See savings from extra payments',
    icon: <RefreshCcw className="w-5 h-5" />,
    emoji: '🔄',
    category: 'Debt',
    heroMetric: '$89,250',
    subMetric: 'Interest Saved',
    status: 'trending',
    sparklineData: generateSparkline('down'),
    lastUpdated: '3 days ago',
    component: <MortgagePayoffCalculator />
  },
  {
    id: 'backtest',
    title: 'Portfolio Backtest',
    description: 'Historical performance analysis',
    icon: <BarChart2 className="w-5 h-5" />,
    emoji: '📊',
    category: 'Investing',
    heroMetric: '+142%',
    subMetric: '10-Year Return',
    status: 'premium',
    sparklineData: generateSparkline('volatile'),
    lastUpdated: '4 days ago',
    component: <StockBacktestCalculator />
  },
  {
    id: 'inflation',
    title: 'Inflation Impact',
    description: 'Future price after inflation',
    icon: <Infinity className="w-5 h-5" />,
    emoji: '📉',
    category: 'Planning',
    heroMetric: '$1,628',
    subMetric: 'Future Value',
    status: 'new',
    sparklineData: generateSparkline('up'),
    lastUpdated: '1 week ago',
    component: <InflationCalculator />
  },
  {
    id: 'exchange-rate',
    title: 'Currency Exchange',
    description: 'Convert currencies in real-time',
    icon: <Globe className="w-5 h-5" />,
    emoji: '💱',
    category: 'Global',
    heroMetric: '€854.30',
    subMetric: 'Current Rate',
    status: 'popular',
    sparklineData: generateSparkline('volatile'),
    lastUpdated: '2 hours ago',
    component: <ExchangeRateCalculator />
  }
];

const Sparkline = ({ data, color = '#3B82F6' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((max - value) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-24 h-8">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="opacity-80"
        />
      </svg>
    </div>
  );
};

const StatusBadge = ({ status }: { status: CalculatorCard['status'] }) => {
  const variants = {
    popular: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Popular' },
    new: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'New' },
    trending: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Trending' },
    premium: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Premium' }
  };

  const variant = variants[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${variant.bg} ${variant.text} ${variant.border}`}>
      {variant.label}
    </span>
  );
};

const CalculatorsHub = () => {
  const navigate = useNavigate();
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (calculator: CalculatorCard) => {
    setSelectedCalculator(calculator);
    setIsModalOpen(true);
  };

  const handleNavigateToCalculator = (id: string) => {
    navigate(`/calculators/${id}`);
    setIsModalOpen(false);
  };

  const groupedCalculators = calculatorCards.reduce((acc, calc) => {
    if (!acc[calc.category]) {
      acc[calc.category] = [];
    }
    acc[calc.category].push(calc);
    return acc;
  }, {} as Record<string, CalculatorCard[]>);

  return (
    <div className="w-full min-h-screen text-white">
      <BackHeader title="Calculator Hub" />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Financial Calculator Hub
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Powerful tools to plan your financial future. Calculate returns, analyze loans, and make informed decisions.
          </p>
        </div>

        {/* Calculator Grid by Category */}
        {Object.entries(groupedCalculators).map(([category, calculators]) => (
          <div key={category} className="space-y-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-white">{category}</h2>
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-white/40 text-sm">{calculators.length} tools</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {calculators.map((calculator) => (
                <div
                  key={calculator.id}
                  className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.03] hover:border-white/[0.12] hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-xl"
                  onClick={() => handleCardClick(calculator)}
                >
                  {/* Header with Icon and Menu */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-lg">
                        {calculator.emoji}
                      </div>
                      <div>
                        <h3 className="font-medium text-white/80 text-sm">{calculator.title}</h3>
                        <p className="text-white/60 text-xs">{calculator.description}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-white/60" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 border-white/20 text-white">
                        <DropdownMenuItem onClick={() => handleNavigateToCalculator(calculator.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Open Calculator
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Learn More
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Heart className="w-4 h-4 mr-2" />
                          Add to Favorites
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Metrics Grid */}
                  <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.03] rounded-xl p-3">
                        <div className="text-xs text-white/60 mb-1">Primary</div>
                        <div className="text-sm font-semibold text-white">{calculator.heroMetric}</div>
                      </div>
                      <div className="bg-white/[0.03] rounded-xl p-3">
                        <div className="text-xs text-white/60 mb-1">Metric</div>
                        <div className="text-sm font-semibold text-white">{calculator.subMetric}</div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Value with Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-bold text-white">{calculator.heroMetric}</div>
                      <StatusBadge status={calculator.status} />
                    </div>
                    <Sparkline 
                      data={calculator.sparklineData} 
                      color={calculator.status === 'trending' ? '#F59E0B' : 
                             calculator.status === 'new' ? '#10B981' : 
                             calculator.status === 'premium' ? '#8B5CF6' : '#3B82F6'} 
                    />
                  </div>

                  {/* Bottom Date */}
                  <div className="flex justify-end">
                    <span className="text-xs text-white/40">Updated {calculator.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Stats */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-2">{calculatorCards.length}</div>
              <div className="text-white/60 text-sm">Total Calculators</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">{Object.keys(groupedCalculators).length}</div>
              <div className="text-white/60 text-sm">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">
                {calculatorCards.filter(c => c.status === 'popular').length}
              </div>
              <div className="text-white/60 text-sm">Popular Tools</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">
                {calculatorCards.filter(c => c.status === 'new').length}
              </div>
              <div className="text-white/60 text-sm">New Additions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {selectedCalculator?.emoji} {selectedCalculator?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedCalculator?.component}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalculatorsHub; 