import React from 'react';
import { LineChart } from '@/shared/ui/charts';
import { HistoricalScore } from '@/features/mockHistoricalData';

interface TimeSeriesChartProps {
  data: HistoricalScore[];
  title: string;
  showLegend?: boolean;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  title,
  showLegend = true,
}) => {
  // Configure series for Vueni-branded LineChart
  const series = [
    {
      dataKey: 'financial',
      label: 'Financial Health',
      color: '#516AC8', // Vueni Sapphire Dust
    },
    {
      dataKey: 'health',
      label: 'Wellness Score',
      color: '#E3AF64', // Vueni Caramel Essence
    },
    {
      dataKey: 'eco',
      label: 'Eco Impact',
      color: '#4ABA70', // Vueni Success Green
    },
  ];

  return (
    <LineChart
      data={data}
      series={series}
      title={title}
      multiSeries={true}
      financialType="percentage"
      trendAnalysis={true}
      dimensions={{ height: 320, responsive: true }}
      legend={{ show: showLegend }}
      lineConfig={{
        smoothLines: true,
        strokeWidth: 'medium',
        showDots: false,
        gradientFill: false,
        hoverEffects: true,
      }}
      className="liquid-glass-fallback rounded-vueni-lg p-6"
    />
  );
};

export default TimeSeriesChart;
