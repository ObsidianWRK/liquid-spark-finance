import React, { useState } from 'react';
import { calculate401kBalance } from '@/shared/utils/calculators';
import { PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { AreaChart } from '@/shared/ui/charts';

interface RetirementData {
  year: number;
  age: number;
  employeeContribution: number;
  employerMatch: number;
  investmentGrowth: number;
  totalBalance: number;
}

const Retirement401kCalculator = () => {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [balance, setBalance] = useState(50000);
  const [salary, setSalary] = useState(75000);
  const [contributionPercent, setContributionPercent] = useState(10);
  const [matchRate, setMatchRate] = useState(0.5);
  const [returnRate, setReturnRate] = useState(7);
  const [futureBalance, setFutureBalance] = useState<number | null>(null);
  const [projectionData, setProjectionData] = useState<RetirementData[]>([]);

  const generateRetirementProjection = (): RetirementData[] => {
    const data: RetirementData[] = [];
    const years = retirementAge - currentAge;
    const annualContribution = salary * (contributionPercent / 100);
    const annualMatch = Math.min(annualContribution * matchRate, salary * 0.06); // Typical 6% match cap
    const annualGrowthRate = returnRate / 100;
    
    let currentBalance = balance;
    let totalEmployeeContributions = 0;
    let totalEmployerMatch = 0;
    
    // Add initial data point
    data.push({
      year: 0,
      age: currentAge,
      employeeContribution: 0,
      employerMatch: 0,
      investmentGrowth: 0,
      totalBalance: balance
    });

    for (let year = 1; year <= years; year++) {
      // Apply investment growth
      const growthThisYear = currentBalance * annualGrowthRate;
      currentBalance += growthThisYear;
      
      // Add contributions
      currentBalance += annualContribution + annualMatch;
      totalEmployeeContributions += annualContribution;
      totalEmployerMatch += annualMatch;
      
      data.push({
        year,
        age: currentAge + year,
        employeeContribution: totalEmployeeContributions,
        employerMatch: totalEmployerMatch,
        investmentGrowth: currentBalance - balance - totalEmployeeContributions - totalEmployerMatch,
        totalBalance: currentBalance
      });
    }
    
    return data;
  };

  const handleCalculate = () => {
    const years = retirementAge - currentAge;
    const annualContribution = salary * (contributionPercent / 100);
    const result = calculate401kBalance(balance, annualContribution, matchRate, returnRate, years);
    const projection = generateRetirementProjection();
    setFutureBalance(result);
    setProjectionData(projection);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const annualContribution = salary * (contributionPercent / 100);
  const annualMatch = Math.min(annualContribution * matchRate, salary * 0.06);
  const years = retirementAge - currentAge;

  const finalProjection = projectionData[projectionData.length - 1];
  const contributionBreakdown = finalProjection ? [
    { name: 'Initial Balance', value: balance, color: '#8B5CF6' },
    { name: 'Employee Contributions', value: finalProjection.employeeContribution, color: '#3B82F6' },
    { name: 'Employer Match', value: finalProjection.employerMatch, color: '#10B981' },
    { name: 'Investment Growth', value: finalProjection.investmentGrowth, color: '#F59E0B' }
  ] : [];

  // Calculate monthly income in retirement (using 4% rule)
  const monthlyRetirementIncome = futureBalance ? (futureBalance * 0.04) / 12 : 0;

  const contributionLimits = [
    { category: 'Current Contribution', amount: annualContribution, limit: 23000 },
    { category: 'Employer Match', amount: annualMatch, limit: 69000 },
    { category: 'Total Annual', amount: annualContribution + annualMatch, limit: 69000 }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">401(k) Retirement Calculator</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Retirement Planning</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(+e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="35"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Retirement Age
                </label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(+e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="65"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Current 401(k) Balance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(+e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="50,000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Annual Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(+e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="75,000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Contribution Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={contributionPercent}
                  onChange={(e) => setContributionPercent(+e.target.value)}
                  className="w-full pr-8 pl-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="10"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60">%</span>
              </div>
              <div className="text-xs text-white/60 mt-1">
                Annual: {formatCurrency(annualContribution)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Employer Match Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={matchRate}
                  onChange={(e) => setMatchRate(+e.target.value)}
                  className="w-full pr-8 pl-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="0.5"
                  step="0.25"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60">×</span>
              </div>
              <div className="text-xs text-white/60 mt-1">
                Annual Match: {formatCurrency(annualMatch)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Expected Annual Return
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={returnRate}
                  onChange={(e) => setReturnRate(+e.target.value)}
                  className="w-full pr-8 pl-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="7"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60">%</span>
              </div>
            </div>
            
            <button
              onClick={handleCalculate}
              className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold transition-all duration-200"
            >
              Calculate Retirement
            </button>
          </div>
        </div>

        {/* Results Section */}
        {futureBalance !== null && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Retirement Projection</h2>
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-400/20">
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(futureBalance)}</div>
                <div className="text-white/80">401(k) Balance at Retirement</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{formatCurrency(monthlyRetirementIncome)}</div>
                  <div className="text-sm text-white/60">Monthly Income (4% Rule)</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{years}</div>
                  <div className="text-sm text-white/60">Years to Save</div>
                </div>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-lg font-semibold text-white">
                  {formatCurrency((annualContribution + annualMatch) * years)}
                </div>
                <div className="text-sm text-white/60">Total Contributions</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {projectionData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Growth Projection Chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">401(k) Growth Over Time</h2>
            <div className="h-64">
              <AreaChart
                data={projectionData.map(item => ({
                  date: `Age ${item.age}`,
                  employeeContribution: item.employeeContribution,
                  employerMatch: item.employerMatch,
                  investmentGrowth: item.investmentGrowth,
                }))}
                series={[
                  {
                    dataKey: 'employeeContribution',
                    label: 'Employee Contributions',
                    color: '#3B82F6',
                  },
                  {
                    dataKey: 'employerMatch',
                    label: 'Employer Match', 
                    color: '#10B981',
                  },
                  {
                    dataKey: 'investmentGrowth',
                    label: 'Investment Growth',
                    color: '#F59E0B',
                  },
                ]}
                financialType="currency"
                stackedData={true}
                areaConfig={{
                  stackedAreas: true,
                  fillOpacity: 0.3,
                  strokeWidth: 'medium',
                  smoothCurves: true,
                  gradientFill: true,
                  hoverEffects: true,
                }}
                dimensions={{
                  height: 256,
                  responsive: true,
                }}
                xAxis={{
                  show: true,
                  tickFormatter: (value) => value,
                }}
                yAxis={{
                  show: true,
                  tickFormatter: (value) => formatCurrency(value),
                }}
                grid={{
                  show: true,
                  horizontal: true,
                  vertical: false,
                  strokeDasharray: "3 3",
                  opacity: 0.1,
                }}
                legend={{
                  show: true,
                  position: 'bottom',
                  align: 'center',
                }}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Contribution Breakdown */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Final Balance Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contributionBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {contributionBreakdown.map((entry, index) => (
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
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {contributionBreakdown.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-white/80">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contribution Limits */}
      {futureBalance !== null && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">2024 Contribution Limits</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionLimits}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="category" 
                  stroke="#fff" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#fff" 
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [formatCurrency(value), name === 'amount' ? 'Current' : 'Limit']}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="limit" fill="#6B7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retirement401kCalculator; 