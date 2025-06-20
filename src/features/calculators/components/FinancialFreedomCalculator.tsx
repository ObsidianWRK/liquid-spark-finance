import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { calculateFinancialFreedomYears } from '@/shared/utils/calculators';
import { LineChart } from '@/shared/ui/charts';

interface ProjectionData {
  year: number;
  date: string;
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
    const startDate = new Date();
    data.push({ 
      year: 0, 
      date: startDate.toISOString(),
      balance: initialSavings, 
      totalWithdrawn: 0 
    });
    
    const MAX_MONTHS = 50 * 12;
    while (balance > 0 && months < MAX_MONTHS) {
      balance = balance * (1 + monthlyRate) - monthlyExpenses;
      totalWithdrawn += monthlyExpenses;
      months += 1;
      
      // Add data point every 12 months
      if (months % 12 === 0) {
        const futureDate = new Date(startDate);
        futureDate.setMonth(futureDate.getMonth() + months);
        
        data.push({
          year: months / 12,
          date: futureDate.toISOString(),
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
              className="w-full py-3 px-6 rounded-xl bg-white/10 border border-white/20 text-white font-semibold button-hover"
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
        <LineChart
          data={projectionData}
          series={[
            {
              dataKey: 'balance',
              label: 'Remaining Balance',
              color: '#007AFF', // Apple system blue
            },
            {
              dataKey: 'totalWithdrawn',
              label: 'Total Withdrawn',
              color: '#32D74B', // Apple system green
            }
          ]}
          title="Savings Projection Over Time"
          multiSeries={true}
          financialType="currency"
          trendAnalysis={true}
          dimensions={{ height: 384, responsive: true }}
          legend={{ show: true, position: 'bottom' }}
          lineConfig={{
            smoothLines: true,
            strokeWidth: 'medium',
            showDots: true,
            gradientFill: true,
            gradientOpacity: 0.15,
            hoverEffects: true,
          }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
        />
      )}
    </div>
  );
};

export default FinancialFreedomCalculator; 