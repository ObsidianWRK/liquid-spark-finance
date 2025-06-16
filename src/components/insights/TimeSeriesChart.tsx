import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HistoricalScore } from '@/services/mockHistoricalData';

interface TimeSeriesChartProps {
  data: HistoricalScore[];
  title: string;
  showLegend?: boolean;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title, showLegend = true }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="liquid-glass-fallback rounded-2xl p-6">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-6">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
              domain={[0, 100]}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const displayName = name === 'financial' ? 'Financial Health' : 
                                  name === 'health' ? 'Wellness Score' : 
                                  name === 'eco' ? 'Eco Impact' : name;
                return [`${Math.round(value)}`, displayName];
              }}
              labelFormatter={(value) => formatTooltipDate(value)}
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            {showLegend && (
              <Legend 
                wrapperStyle={{ color: '#fff', paddingTop: '20px' }}
                formatter={(value) => 
                  value === 'financial' ? 'Financial Health' : 
                  value === 'health' ? 'Wellness Score' : 
                  value === 'eco' ? 'Eco Impact' : value
                }
              />
            )}
            <Line
              type="monotone"
              dataKey="financial"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="health"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#ef4444' }}
            />
            <Line
              type="monotone"
              dataKey="eco"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesChart; 