import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { calculateFinancialFreedomYears } from '@/utils/calculators';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ProjectionData {
  year: number;
  balance: number;
  totalWithdrawn: number;
}

const FinancialFreedomCalculator = () => {
  const [savings, setSavings] = useState(100000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [growthRate, setGrowthRate] = useState(5);
  const [years, setYears] = useState<number | null>(null);
  const [projectionData, setProjectionData] = useState<ProjectionData[]>([]);

  const generateProjectionData = (initialSavings: number, monthlyExpenses: number, annualGrowthRate: number): ProjectionData[] => {
    const data: ProjectionData[] = [];
    const monthlyRate = annualGrowthRate / 12;
    let balance = initialSavings;
    let totalWithdrawn = 0;
    let months = 0;
    
    // Add initial point
    data.push({ year: 0, balance: initialSavings, totalWithdrawn: 0 });
    
    const MAX_MONTHS = 50 * 12;
    while (balance > 0 && months < MAX_MONTHS) {
      balance = balance * (1 + monthlyRate) - monthlyExpenses;
      totalWithdrawn += monthlyExpenses;
      months += 1;
      
      // Add data point every 12 months
      if (months % 12 === 0) {
        data.push({
          year: months / 12,
          balance: Math.max(0, balance),
          totalWithdrawn
        });
      }
    }
    
    return data;
  };

  const handleCalculate = () => {
    const result = calculateFinancialFreedomYears(savings, monthlyExpenses, growthRate / 100);
    const projData = generateProjectionData(savings, monthlyExpenses, growthRate / 100);
    setYears(result);
    setProjectionData(projData);
  };

  // Auto-calculate on component mount and when inputs change
  useEffect(() => {
    if (savings > 0 && monthlyExpenses > 0 && growthRate > 0) {
      handleCalculate();
    }
  }, [savings, monthlyExpenses, growthRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'balance') {
      return [formatCurrency(value), 'Remaining Balance'];
    }
    if (name === 'totalWithdrawn') {
      return [formatCurrency(value), 'Total Withdrawn'];
    }
    return [value, name];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Financial Freedom Calculator</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Input Parameters</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Current Savings
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(+e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="100,000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Monthly Expenses
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(+e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="4,000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Expected Annual Growth Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(+e.target.value)}
                  className="w-full pr-8 pl-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="5"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60">%</span>
              </div>
            </div>
            
            <button
              onClick={handleCalculate}
              className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold transition-all duration-200"
            >
              Calculate Financial Freedom
            </button>
          </div>
        </div>

        {/* Results Section */}
        {years !== null && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Results</h2>
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-400/20">
                <div className="text-3xl font-bold text-white mb-2">{years} Years</div>
                <div className="text-white/80">Until Financial Freedom</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{formatCurrency(monthlyExpenses * 12)}</div>
                  <div className="text-sm text-white/60">Annual Expenses</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{formatCurrency(monthlyExpenses * years * 12)}</div>
                  <div className="text-sm text-white/60">Total Withdrawn</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Section */}
      {projectionData.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Savings Projection Over Time</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="withdrawnGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#fff" 
                  fontSize={12}
                  tickFormatter={(value) => `Year ${value}`}
                />
                <YAxis 
                  stroke="#fff" 
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(value) => `Year ${value}`}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#balanceGradient)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="totalWithdrawn"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-8 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-white/80 text-sm">Remaining Balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-white/80 text-sm">Total Withdrawn</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialFreedomCalculator; 