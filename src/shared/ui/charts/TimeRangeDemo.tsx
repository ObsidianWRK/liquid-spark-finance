/**
 * TimeRangeDemo - Demo component to test TimeRange integration
 * Shows how to use TimeRangeProvider, context, and components together
 */

import React, { memo } from 'react';
import { TimeRangeProvider } from '@/context/TimeRangeContext';
import { useTimeRange } from '@/hooks/useTimeRange';
import TimeRangeToggleRadix from './TimeRangeToggleRadix';
import { GraphBase } from './GraphBase';

// Mock data for demonstration
const generateMockData = (range: string) => {
  const days =
    range === '1W' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : 365;
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      income: Math.random() * 5000 + 2000,
      spending: Math.random() * 3000 + 1000,
      savings: Math.random() * 1000 + 500,
    });
  }

  return data;
};

// Inner component that uses the context
const TimeRangeDemo: React.FC = memo(() => {
  const { selectedRange, setTimeRange, rangeLabel, getFilteredData } =
    useTimeRange({
      stabilizeCallbacks: true,
      memoizeData: true,
    });

  // Generate mock data and filter it
  const allData = generateMockData('1Y');
  const filteredData = getFilteredData(allData, 'date', 'iso');

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">
          TimeRange Integration Demo
        </h1>
        <p className="text-white/70">
          Current range:{' '}
          <span className="text-blue-400 font-medium">{rangeLabel}</span>
        </p>
        <p className="text-white/70">
          Data points:{' '}
          <span className="text-green-400 font-medium">
            {filteredData.length}
          </span>
        </p>
      </div>

      {/* Standalone TimeRangeToggle */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Standalone Time Range Toggle
        </h2>
        <div className="flex justify-center">
          <TimeRangeToggleRadix
            value={selectedRange}
            onChange={setTimeRange}
            size="md"
            showLabels={false}
            aria-label="Standalone time range selection"
          />
        </div>
      </div>

      {/* GraphBase with integrated TimeRange */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Chart with Integrated Time Range
        </h2>
        <GraphBase
          data={allData} // Pass unfiltered data - GraphBase will filter when useGlobalTimeRange=true
          type="line"
          title="Financial Overview"
          subtitle={`Showing ${rangeLabel.toLowerCase()} of financial data`}
          useGlobalTimeRange={true} // Enable global time range integration
          timeControls={{
            show: true,
            options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'],
            defaultRange: '1M',
          }}
          series={[
            { dataKey: 'income', label: 'Income', color: '#32D74B' },
            { dataKey: 'spending', label: 'Spending', color: '#FF453A' },
            { dataKey: 'savings', label: 'Savings', color: '#0A84FF' },
          ]}
          animation={{ enable: true, duration: 600 }}
          accessibility={{ keyboardNavigation: true }}
        />
      </div>

      {/* Multiple charts sharing the same time range */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraphBase
          data={allData}
          type="area"
          title="Income vs Spending"
          useGlobalTimeRange={true}
          timeControls={{ show: false }} // Hide controls on secondary charts
          series={[
            { dataKey: 'income', label: 'Income', color: '#32D74B' },
            { dataKey: 'spending', label: 'Spending', color: '#FF453A' },
          ]}
        />

        <GraphBase
          data={allData}
          type="bar"
          title="Savings Trend"
          useGlobalTimeRange={true}
          timeControls={{ show: false }}
          series={[{ dataKey: 'savings', label: 'Savings', color: '#0A84FF' }]}
        />
      </div>

      {/* Debug information */}
      <div className="mt-8 p-4 bg-white/5 rounded-vueni-lg border border-white/10">
        <h3 className="text-sm font-medium text-white mb-2">
          Debug Information
        </h3>
        <div className="text-xs text-white/60 space-y-1">
          <div>Selected Range: {selectedRange}</div>
          <div>Range Label: {rangeLabel}</div>
          <div>Total Data Points: {allData.length}</div>
          <div>Filtered Data Points: {filteredData.length}</div>
          <div>
            Filter Percentage:{' '}
            {((filteredData.length / allData.length) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
});

TimeRangeDemo.displayName = 'TimeRangeDemo';

// Wrapper component with provider
const TimeRangeDemoWithProvider: React.FC = () => {
  return (
    <TimeRangeProvider
      defaultRange="1M"
      persistSelection={true}
      cacheFiltering={true}
    >
      <TimeRangeDemo />
    </TimeRangeProvider>
  );
};

export default memo(TimeRangeDemoWithProvider);
