/**
 * GraphBase Demo Component
 * Demonstrates the Apple-style GraphBase component with sample financial data
 */

import React, { useState } from 'react';
import { GraphBase } from './GraphBase';
import { ChartType, TimeRangeOption } from './types';

// Sample financial data
const generateSampleData = (days: number = 30) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      income: Math.random() * 1000 + 2000,
      spending: Math.random() * 800 + 1200,
      savings: Math.random() * 500 + 300,
      investments: Math.random() * 300 + 100,
      debt: Math.random() * 200 + 50,
    });
  }
  
  return data;
};

const GraphBaseDemo: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('1M');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate data based on time range
  const getDaysFromRange = (range: TimeRangeOption): number => {
    switch (range) {
      case '1W': return 7;
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case 'ALL': return 730; // 2 years
      default: return 30;
    }
  };
  
  const data = generateSampleData(getDaysFromRange(timeRange));
  
  const handleTimeRangeChange = (newRange: TimeRangeOption) => {
    setLoading(true);
    setTimeRange(newRange);
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  
  const handleChartTypeChange = (newType: ChartType) => {
    setChartType(newType);
  };
  
  const simulateError = () => {
    setError("Failed to load chart data. Please try again.");
  };
  
  const clearError = () => {
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">GraphBase Demo</h1>
        <p className="text-white/70">
          Apple-style chart component with financial data visualization
        </p>
      </div>
      
      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Chart Type
            </label>
            <div className="flex gap-2">
              {(['line', 'area', 'bar', 'stackedBar'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleChartTypeChange(type)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    chartType === type
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={simulateError}
              className="px-4 py-2 text-sm bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
            >
              Simulate Error
            </button>
            <button
              onClick={clearError}
              className="px-4 py-2 text-sm bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all"
            >
              Clear Error
            </button>
          </div>
        </div>
      </div>
      
      {/* Chart Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <GraphBase
            data={data}
            type={chartType}
            title="Financial Overview"
            subtitle="Income, spending, and savings trends"
            timeRange={timeRange}
            timeControls={{
              show: true,
              options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'],
              defaultRange: '1M'
            }}
            onTimeRangeChange={handleTimeRangeChange}
            loading={loading}
            error={error}
            errorConfig={{
              showRetry: true,
              onRetry: clearError
            }}
            dimensions={{
              height: 400,
              responsive: true
            }}
            legend={{
              show: true,
              position: 'bottom'
            }}
            grid={{
              show: true,
              horizontal: true,
              vertical: false
            }}
            accessibility={{
              title: "Financial data chart",
              description: "A chart showing income, spending, savings, investments, and debt over time"
            }}
          />
        </div>
        
        {/* Compact Charts */}
        <div>
          <GraphBase
            data={data}
            type="area"
            title="Income vs Spending"
            series={[
              { dataKey: 'income', label: 'Income', color: '#10b981' },
              { dataKey: 'spending', label: 'Spending', color: '#ef4444' }
            ]}
            dimensions={{
              height: 250,
              responsive: true
            }}
            animation={{
              enable: true,
              duration: 600
            }}
          />
        </div>
        
        <div>
          <GraphBase
            data={data}
            type="bar"
            title="Monthly Breakdown"
            series={[
              { dataKey: 'savings', label: 'Savings', color: '#3b82f6' },
              { dataKey: 'investments', label: 'Investments', color: '#8b5cf6' }
            ]}
            dimensions={{
              height: 250,
              responsive: true
            }}
            legend={{
              show: true,
              position: 'top'
            }}
          />
        </div>
      </div>
      
      {/* Feature Showcase */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-white/90">🎨 Apple Design</h4>
            <ul className="text-white/70 space-y-1">
              <li>• SF Pro typography</li>
              <li>• Apple color system</li>
              <li>• Consistent spacing</li>
              <li>• Glass morphism</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-white/90">📊 Chart Types</h4>
            <ul className="text-white/70 space-y-1">
              <li>• Line charts</li>
              <li>• Area charts</li>
              <li>• Bar charts</li>
              <li>• Stacked bars</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-white/90">♿ Accessibility</h4>
            <ul className="text-white/70 space-y-1">
              <li>• ARIA labels</li>
              <li>• Keyboard navigation</li>
              <li>• Screen reader support</li>
              <li>• High contrast mode</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-white/90">🚀 Performance</h4>
            <ul className="text-white/70 space-y-1">
              <li>• React.memo optimization</li>
              <li>• Lazy loading</li>
              <li>• Data virtualization</li>
              <li>• Debounced updates</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-white/90">📱 Responsive</h4>
            <ul className="text-white/70 space-y-1">
              <li>• Mobile-first design</li>
              <li>• Touch-friendly controls</li>
              <li>• Adaptive layouts</li>
              <li>• Smooth animations</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-white/90">🔧 Customizable</h4>
            <ul className="text-white/70 space-y-1">
              <li>• Custom tooltips</li>
              <li>• Flexible legends</li>
              <li>• Theme integration</li>
              <li>• Event handlers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphBaseDemo;