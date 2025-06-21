import React, { useMemo } from 'react';
import { AreaChart } from '@/shared/ui/charts';
import { MonthlySpending } from '@/features/mockHistoricalData';
import { VueniCharts } from '@/theme/colors/vueniPalette';

interface SpendingTrendsChartProps {
  data: MonthlySpending[];
  title: string;
}

const SpendingTrendsChart = React.memo<SpendingTrendsChartProps>(
  ({ data, title }) => {
    // Transform data for the new AreaChart component
    const chartData = useMemo(
      () =>
        data.map((item) => ({
          date: item.date,
          income: item.income,
          spending: item.spending,
          savings: item.savings,
        })),
      [data]
    );

    // Configure series for multi-area chart using VueniCharts financial mappings
    const chartSeries = useMemo(
      () => [
        {
          dataKey: 'income',
          label: 'Income',
          color: VueniCharts.financial.income, // #4ABA70 (Success)
        },
        {
          dataKey: 'spending',
          label: 'Spending',
          color: VueniCharts.financial.expenses, // #D64545 (Error)
        },
        {
          dataKey: 'savings',
          label: 'Savings',
          color: VueniCharts.financial.savings, // #516AC8 (Sapphire Dust)
        },
      ],
      []
    );

    return (
      <div className="liquid-glass-fallback rounded-vueni-lg p-6">
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
  }
);

SpendingTrendsChart.displayName = 'SpendingTrendsChart';

export default SpendingTrendsChart;
