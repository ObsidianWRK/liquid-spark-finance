import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MultiLineChart } from '@/components/ui/lightweight-charts';
import { HistoricalScore } from '@/services/mockHistoricalData';

interface TimeSeriesChartProps {
  data: HistoricalScore[];
  title: string;
  showLegend?: boolean;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title, showLegend = true }) => {
  // Configure lines for MultiLineChart
  const lines = [
    {
      dataKey: 'financial',
      stroke: '#3b82f6',
      label: 'Financial Health'
    },
    {
      dataKey: 'health', 
      stroke: '#ef4444',
      label: 'Wellness Score'
    },
    {
      dataKey: 'eco',
      stroke: '#10b981', 
      label: 'Eco Impact'
    }
  ];

  return (
    <div className="liquid-glass-fallback rounded-2xl p-6">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-6">{title}</h3>
      <div className="h-80">
        <MultiLineChart
          data={data as any[]}
          lines={lines}
          width={600}
          height={300}
          xAxisKey="date"
          showLegend={showLegend}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default TimeSeriesChart; 