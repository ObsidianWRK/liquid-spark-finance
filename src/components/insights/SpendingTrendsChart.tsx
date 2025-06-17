import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlySpending } from '@/services/mockHistoricalData';

interface SpendingTrendsChartProps {
  data: MonthlySpending[];
  title: string;
}

const SpendingTrendsChart = React.memo<SpendingTrendsChartProps>(({ data, title }) => {
  // Memoized formatters to prevent recreation on every render
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return (value: number) => formatter.format(value);
  }, []);

  const formatDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' });
    return (dateStr: string) => {
      const date = new Date(dateStr);
      return formatter.format(date);
    };
  }, []);

  const formatTooltipDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    return (dateStr: string) => {
      const date = new Date(dateStr);
      return formatter.format(date);
    };
  }, []);

  return (
    <div className="liquid-glass-fallback rounded-2xl p-6">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-6">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#fff" 
              fontSize={12}
              tickFormatter={formatDate}
            />
            <YAxis 
              stroke="#fff" 
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const displayName = name === 'income' ? 'Income' : 
                                  name === 'spending' ? 'Spending' : 
                                  name === 'savings' ? 'Savings' : name;
                return [formatCurrency(value), displayName];
              }}
              labelFormatter={(value) => formatTooltipDate(value)}
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#fff', paddingTop: '20px' }}
              formatter={(value) => 
                value === 'income' ? 'Income' : 
                value === 'spending' ? 'Spending' : 
                value === 'savings' ? 'Savings' : value
              }
            />
            <Area
              type="monotone"
              dataKey="income"
              stackId="1"
              stroke="#10b981"
              fill="url(#incomeGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stackId="2"
              stroke="#ef4444"
              fill="url(#spendingGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stackId="3"
              stroke="#3b82f6"
              fill="url(#savingsGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

SpendingTrendsChart.displayName = 'SpendingTrendsChart';

export default SpendingTrendsChart; 