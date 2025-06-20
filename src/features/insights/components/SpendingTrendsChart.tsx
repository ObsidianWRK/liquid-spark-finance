import React, { useMemo } from 'react';
import { AreaChart } from '@/shared/ui/charts';
import { MonthlySpending } from '@/features/mockHistoricalData';

interface SpendingTrendsChartProps {
  data: MonthlySpending[];
  title: string;
}

const SpendingTrendsChart = React.memo<SpendingTrendsChartProps>(({ data, title }) => {
  // Transform data for the new AreaChart component
  const chartData = useMemo(() => 
    data.map(item => ({
      date: item.date,
      income: item.income,
      spending: item.spending,
      savings: item.savings,
    })), [data]
  );

  // Configure series for multi-area chart
  const chartSeries = useMemo(() => [
    {
      dataKey: 'income',
      label: 'Income',
      color: '#32D74B', // Apple green
    },
    {
      dataKey: 'spending', 
      label: 'Spending',
      color: '#FF453A', // Apple red
    },
    {
      dataKey: 'savings',
      label: 'Savings', 
      color: '#0A84FF', // Apple blue
    },
  ], []);

  return (
    <div className="liquid-glass-fallback rounded-2xl p-6">
      <AreaChart
        data={chartData}
        series={chartSeries}
        title={title}
        subtitle="Monthly financial trends"
        financialType="currency"
        multiSeries={true}
        stackedData={false}
        areaConfig={{
          fillOpacity: 0.2,
          strokeWidth: 'medium',
          smoothCurves: true,
          gradientFill: true,
          hoverEffects: true,
        }}
        dimensions={{
          height: 320,
          responsive: true,
        }}
        timeControls={{
          show: true,
          options: ['3M', '6M', '1Y', 'ALL'],
          defaultRange: '6M',
        }}
        legend={{
          show: true,
          position: 'bottom',
          align: 'center',
        }}
        className="h-80"
      />
    </div>
  );
});

SpendingTrendsChart.displayName = 'SpendingTrendsChart';

export default SpendingTrendsChart; 