import React, { useState } from 'react';
import { calculateLoanPayment } from '@/shared/utils/calculators';
import GlassSlider from '@/shared/ui/GlassSlider';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface AmortizationData {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(30);
  const [payment, setPayment] = useState<number | null>(null);
  const [amortizationData, setAmortizationData] = useState<AmortizationData[]>([]);

  const generateAmortizationSchedule = (): AmortizationData[] => {
    const data: AmortizationData[] = [];
    const monthlyRate = rate / 100 / 12;
    const totalPayments = years * 12;
    const monthlyPayment = calculateLoanPayment(principal, rate, years);
    
    let remainingBalance = principal;
    
    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      // Add data point every 12 months for chart readability
      if (month % 12 === 0 || month === 1) {
        data.push({
          month,
          year: Math.ceil(month / 12),
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, remainingBalance)
        });
      }
    }
    
    return data;
  };

  const handleCalculate = () => {
    const result = calculateLoanPayment(principal, rate, years);
    const amortization = generateAmortizationSchedule();
    setPayment(result);
    setAmortizationData(amortization);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalPayments = payment ? payment * years * 12 : 0;
  const totalInterest = totalPayments - principal;

  const summaryData = [
    { name: 'Principal', value: principal, color: '#3B82F6' },
    { name: 'Interest', value: totalInterest, color: '#EF4444' }
  ];

  const loanTypes = [
    { type: 'Conventional', rate: rate, payment: payment || 0 },
    { type: 'FHA', rate: rate - 0.5, payment: calculateLoanPayment(principal, rate - 0.5, years) },
    { type: 'VA', rate: rate - 0.25, payment: calculateLoanPayment(principal, rate - 0.25, years) }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Loan Calculator</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Loan Parameters</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium text-white/80 mb-2">
                <span>Loan Amount</span>
                <span>{formatCurrency(principal)}</span>
              </div>
              <GlassSlider value={principal} min={10000} max={1000000} step={1000} onChange={setPrincipal} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium text-white/80 mb-2">
                <span>Interest Rate</span>
                <span>{rate}%</span>
              </div>
              <GlassSlider value={rate} min={0} max={15} step={0.1} onChange={setRate} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium text-white/80 mb-2">
                <span>Loan Term</span>
                <span>{years} years</span>
              </div>
              <GlassSlider value={years} min={1} max={40} step={1} onChange={setYears} />
            </div>
            
            <button
              onClick={handleCalculate}
              className="w-full py-3 px-6 rounded-xl bg-white/10 border border-white/20 text-white font-semibold button-hover"
            >
              Calculate Loan
            </button>
          </div>
        </div>

        {/* Results Section */}
        {payment !== null && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Loan Summary</h2>
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/20">
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(payment)}</div>
                <div className="text-white/80">Monthly Payment</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{formatCurrency(totalPayments)}</div>
                  <div className="text-sm text-white/60">Total Payments</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{formatCurrency(totalInterest)}</div>
                  <div className="text-sm text-white/60">Total Interest</div>
                </div>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-lg font-semibold text-white">
                  {((totalInterest / principal) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Interest as % of Principal</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {amortizationData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Amortization Chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Remaining Balance Over Time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={amortizationData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
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
                    formatter={(value: number) => [formatCurrency(value), 'Remaining Balance']}
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
                    fill="url(#balanceGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Principal vs Interest Chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Principal vs Interest</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {summaryData.map((entry, index) => (
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
              {summaryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-white/80 text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loan Comparison */}
      {payment !== null && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Loan Type Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loanTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="type" 
                  stroke="#fff" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#fff" 
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Monthly Payment']}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="payment" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator; 