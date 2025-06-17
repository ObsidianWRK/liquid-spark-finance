import React from 'react';

interface TrendChartProps {
  data: any[];
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

// Placeholder TrendChart component for UnifiedInsightsPage
export const TrendChart = React.memo<TrendChartProps>(({ 
  data, 
  timeframe, 
  onTimeframeChange 
}) => {
  return (
    <div className="bg-white/5 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Spending Trends</h3>
        <select
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
        >
          <option value="7d">7 days</option>
          <option value="30d">30 days</option>
          <option value="90d">90 days</option>
        </select>
      </div>
      
      <div className="h-64 flex items-center justify-center bg-white/5 rounded border border-white/10">
        <div className="text-center">
          <div className="text-white/60 mb-2">📈 Trend Chart</div>
          <div className="text-sm text-white/40">
            Chart visualization for {timeframe} timeframe
          </div>
        </div>
      </div>
    </div>
  );
});

TrendChart.displayName = 'TrendChart';

export default TrendChart;