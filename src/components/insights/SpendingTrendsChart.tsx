import React, { useMemo } from 'react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SimpleAreaChart } from '@/components/ui/lightweight-charts';
import { MonthlySpending } from '@/services/mockHistoricalData';

interface SpendingTrendsChartProps {
  data: MonthlySpending[];
  title: string;
}

const SpendingTrendsChart = React.memo<SpendingTrendsChartProps>(({ data, title }) => {
  // Transform data for individual area charts
  const incomeData = useMemo(() => 
    data.map((item, index) => ({ x: index, y: item.income, label: item.date })), [data]
  );
  
  const spendingData = useMemo(() => 
    data.map((item, index) => ({ x: index, y: item.spending, label: item.date })), [data]
  );
  
  const savingsData = useMemo(() => 
    data.map((item, index) => ({ x: index, y: item.savings, label: item.date })), [data]
  );

  return (
    <div className="liquid-glass-fallback rounded-2xl p-6">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-6">{title}</h3>
      <div className="h-80 space-y-4">
        {/* Combined view */}
        <div className="relative h-full">
          <div className="absolute inset-0">
            <SimpleAreaChart
              data={incomeData}
              width={600}
              height={240}
              strokeColor="#10b981"
              fillColor="#10b981"
              gradientId="incomeGradient"
              className="absolute inset-0"
            />
          </div>
          <div className="absolute inset-0">
            <SimpleAreaChart
              data={spendingData}
              width={600}
              height={240}
              strokeColor="#ef4444"
              fillColor="#ef4444"
              gradientId="spendingGradient"
              className="absolute inset-0 opacity-80"
            />
          </div>
          <div className="absolute inset-0">
            <SimpleAreaChart
              data={savingsData}
              width={600}
              height={240}
              strokeColor="#3b82f6"
              fillColor="#3b82f6"
              gradientId="savingsGradient"
              className="absolute inset-0 opacity-60"
            />
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-white text-sm">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-white text-sm">Spending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-white text-sm">Savings</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SpendingTrendsChart.displayName = 'SpendingTrendsChart';

export default SpendingTrendsChart; 