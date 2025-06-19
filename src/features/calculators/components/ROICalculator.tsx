import React, { useState, useMemo, useCallback } from 'react';
import { calculateROI } from '@/utils/calculators';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UniversalCard } from '@/shared/ui/UniversalCard';

interface ROIData {
  investment: string;
  amount: number;
  percentage: number;
}

const ROICalculator = React.memo(() => {
  const [initial, setInitial] = useState(1000);
  const [current, setCurrent] = useState(1200);
  const [timeHeld, setTimeHeld] = useState(12); // months

  // Memoized expensive calculations - only recalculate when inputs change
  const calculatedROI = useMemo(() => {
    if (initial <= 0) return null;
    return calculateROI(initial, current, timeHeld);
  }, [initial, current, timeHeld]);

  const chartData = useMemo((): ROIData[] => {
    const gain = current - initial;
    const gainPercentage = initial > 0 ? ((gain / initial) * 100) : 0;
    
    return [
      {
        investment: 'Initial Investment',
        amount: initial,
        percentage: 100
      },
      {
        investment: 'Gain/Loss',
        amount: gain,
        percentage: gainPercentage
      },
      {
        investment: 'Current Value',
        amount: current,
        percentage: 100 + gainPercentage
      }
    ];
  }, [initial, current]);

  // Memoized pie chart data
  const pieData = useMemo(() => [
    { name: 'Initial Investment', value: initial, color: '#3B82F6' },
    { name: 'Gain/Loss', value: Math.max(0, current - initial), color: '#10B981' }
  ], [initial, current]);

  // Optimized event handlers with useCallback
  const handleInitialChange = useCallback((value: string) => {
    setInitial(parseFloat(value) || 0);
  }, []);

  const handleCurrentChange = useCallback((value: string) => {
    setCurrent(parseFloat(value) || 0);
  }, []);

  const handleTimeChange = useCallback((value: string) => {
    setTimeHeld(parseInt(value) || 0);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const annualizedReturn = timeHeld > 0 ? (calculatedROI || 0) * (12 / timeHeld) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">ROI Calculator</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Investment Details</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Initial Investment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={initial}
                  onChange={(e) => handleInitialChange(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="1,000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Current Value
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={current}
                  onChange={(e) => handleCurrentChange(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="1,200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Time Held (Months)
              </label>
              <input
                type="number"
                value={timeHeld}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                placeholder="12"
              />
            </div>
            
          </div>
        </div>

        {/* Results Section */}
        {calculatedROI !== null && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Results</h2>
            <div className="space-y-4">
              <div className={`text-center p-6 rounded-2xl border ${calculatedROI >= 0 ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/20' : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/20'}`}>
                <div className="text-3xl font-bold text-white mb-2">{calculatedROI?.toFixed(2)}%</div>
                <div className="text-white/80">Total Return</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{formatCurrency(current - initial)}</div>
                  <div className="text-sm text-white/60">Gain/Loss</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{annualizedReturn.toFixed(2)}%</div>
                  <div className="text-sm text-white/60">Annualized Return</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Investment Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="investment" 
                    stroke="#fff" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#fff" 
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Portfolio Composition</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-8 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-white/80 text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ROICalculator.displayName = 'ROICalculator';

export default ROICalculator; 