import React from 'react';
import { LineChart } from '@/shared/ui/charts';
import { HistoricalScore } from '@/features/mockHistoricalData';

interface TimeSeriesChartProps {
  data: HistoricalScore[];
  title: string;
  showLegend?: boolean;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title, showLegend = true }) => {
  // Configure series for Apple-style LineChart
  const series = [
    {
      dataKey: 'financial',
      label: 'Financial Health',
      color: '#007AFF', // Apple system blue
    },
    {
      dataKey: 'health', 
      label: 'Wellness Score',
      color: '#FF453A', // Apple system red
    },
    {
      dataKey: 'eco',
      label: 'Eco Impact',
      color: '#32D74B', // Apple system green
    }
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
      className="liquid-glass-fallback rounded-2xl p-6"
    />
  );
};

export default TimeSeriesChart; 