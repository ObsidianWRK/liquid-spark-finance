/**
 * GraphBase Test Component - Simple test to verify component functionality
 */

import React from 'react';
import { GraphBase } from './GraphBase';

// Simple test data
const testData = [
  { date: '2024-01-01', value: 100, income: 2500, spending: 1800 },
  { date: '2024-01-02', value: 120, income: 2600, spending: 1900 },
  { date: '2024-01-03', value: 80, income: 2400, spending: 1700 },
  { date: '2024-01-04', value: 150, income: 2700, spending: 2000 },
  { date: '2024-01-05', value: 90, income: 2500, spending: 1750 },
];

const GraphBaseTest: React.FC = () => {
  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-white text-center">
          GraphBase Component Test
        </h1>

        {/* Basic Line Chart */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <GraphBase
            data={testData}
            type="line"
            title="Basic Line Chart"
            subtitle="Testing the GraphBase component"
            dimensions={{ height: 300 }}
            series={[{ dataKey: 'value', label: 'Value', color: '#3b82f6' }]}
          />
        </div>

        {/* Multi-series Area Chart */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <GraphBase
            data={testData}
            type="area"
            title="Income vs Spending"
            subtitle="Financial overview"
            dimensions={{ height: 300 }}
            series={[
              { dataKey: 'income', label: 'Income', color: '#10b981' },
              { dataKey: 'spending', label: 'Spending', color: '#ef4444' },
            ]}
            legend={{ show: true, position: 'bottom' }}
          />
        </div>

        {/* Bar Chart */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <GraphBase
            data={testData}
            type="bar"
            title="Bar Chart Test"
            dimensions={{ height: 300 }}
            series={[
              { dataKey: 'value', label: 'Daily Value', color: '#8b5cf6' },
            ]}
          />
        </div>

        {/* Loading State Test */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <GraphBase
            data={[]}
            type="line"
            title="Loading State"
            loading={true}
            dimensions={{ height: 300 }}
          />
        </div>

        {/* Error State Test */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <GraphBase
            data={[]}
            type="line"
            title="Error State"
            error="Test error message"
            dimensions={{ height: 300 }}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphBaseTest;
