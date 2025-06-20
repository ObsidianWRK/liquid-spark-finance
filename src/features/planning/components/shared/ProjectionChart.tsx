import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/shared/lib/utils';

interface ProjectionChartProps {
  data: Array<{
    date: Date | string;
    value: number;
    label?: string;
    [key: string]: any;
  }>;
  title: string;
  type?: 'line' | 'area';
  height?: number;
  color?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({
  data,
  title,
  type = 'area',
  height = 300,
  color = '#3b82f6',
  formatValue,
  className
}) => {
  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
  };

  const formatCurrency = (value: number) => {
    if (formatValue) return formatValue(value);
    
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const chartData = data.map(item => ({
    ...item,
    dateFormatted: formatDate(item.date),
    displayValue: item.value
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white/80 text-sm mb-1">{label}</p>
          <p className="text-white font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <div className={cn("bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6", className)}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="dateFormatted"
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {type === 'area' ? (
            <Area
              type="monotone"
              dataKey="displayValue"
              stroke={color}
              strokeWidth={2}
              fill={`${color}20`}
              fillOpacity={0.3}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="displayValue"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectionChart; 