/**
 * AreaChart Demo - Showcase component
 * Demonstrates all features of the Apple-style AreaChart component
 */

import React, { useState } from 'react';
import { AreaChart } from './AreaChart';
import { ChartDataPoint, ChartSeries } from './types';

// Sample financial data
const portfolioData: ChartDataPoint[] = [
  {
    date: '2024-01',
    stocks: 150000,
    bonds: 50000,
    cash: 20000,
    alternatives: 30000,
  },
  {
    date: '2024-02',
    stocks: 148000,
    bonds: 52000,
    cash: 18000,
    alternatives: 32000,
  },
  {
    date: '2024-03',
    stocks: 162000,
    bonds: 48000,
    cash: 22000,
    alternatives: 28000,
  },
  {
    date: '2024-04',
    stocks: 175000,
    bonds: 55000,
    cash: 15000,
    alternatives: 35000,
  },
  {
    date: '2024-05',
    stocks: 170000,
    bonds: 58000,
    cash: 17000,
    alternatives: 40000,
  },
  {
    date: '2024-06',
    stocks: 185000,
    bonds: 52000,
    cash: 23000,
    alternatives: 42000,
  },
];

const spendingData: ChartDataPoint[] = [
  {
    date: '2024-01',
    housing: 2500,
    transportation: 800,
    food: 600,
    entertainment: 400,
    other: 300,
  },
  {
    date: '2024-02',
    housing: 2500,
    transportation: 750,
    food: 650,
    entertainment: 500,
    other: 350,
  },
  {
    date: '2024-03',
    housing: 2500,
    transportation: 900,
    food: 580,
    entertainment: 300,
    other: 280,
  },
  {
    date: '2024-04',
    housing: 2500,
    transportation: 820,
    food: 620,
    entertainment: 450,
    other: 320,
  },
  {
    date: '2024-05',
    housing: 2500,
    transportation: 880,
    food: 700,
    entertainment: 600,
    other: 400,
  },
  {
    date: '2024-06',
    housing: 2500,
    transportation: 760,
    food: 590,
    entertainment: 350,
    other: 300,
  },
];

const netWorthData: ChartDataPoint[] = [
  { date: '2024-01', netWorth: 245000 },
  { date: '2024-02', netWorth: 252000 },
  { date: '2024-03', netWorth: 268000 },
  { date: '2024-04', netWorth: 285000 },
  { date: '2024-05', netWorth: 291000 },
  { date: '2024-06', netWorth: 308000 },
];

const AreaChartDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<
    'portfolio' | 'spending' | 'networth'
  >('portfolio');

  const portfolioSeries: ChartSeries[] = [
    { dataKey: 'stocks', label: 'Stocks', color: '#0A84FF' },
    { dataKey: 'bonds', label: 'Bonds', color: '#32D74B' },
    { dataKey: 'cash', label: 'Cash', color: '#FF9F0A' },
    { dataKey: 'alternatives', label: 'Alternatives', color: '#BF5AF2' },
  ];

  const spendingSeries: ChartSeries[] = [
    { dataKey: 'housing', label: 'Housing', color: '#FF453A' },
    { dataKey: 'transportation', label: 'Transportation', color: '#FF9F0A' },
    { dataKey: 'food', label: 'Food', color: '#32D74B' },
    { dataKey: 'entertainment', label: 'Entertainment', color: '#BF5AF2' },
    { dataKey: 'other', label: 'Other', color: '#0A84FF' },
  ];

  const netWorthSeries: ChartSeries[] = [
    { dataKey: 'netWorth', label: 'Net Worth', color: '#0A84FF' },
  ];

  return (
    <div className="w-full space-y-8 p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          AreaChart Component Demo
        </h1>
        <p className="text-white/70 text-lg">
          Apple-style area charts for financial data visualization
        </p>
      </div>

      {/* Demo Selector */}
      <div className="flex justify-center space-x-4 mb-8">
        {[
          { key: 'portfolio', label: 'Portfolio Allocation' },
          { key: 'spending', label: 'Spending Breakdown' },
          { key: 'networth', label: 'Net Worth Trend' },
        ].map((demo) => (
          <button
            key={demo.key}
            onClick={() => setSelectedDemo(demo.key as any)}
            className={`px-6 py-3 rounded-vueni-lg font-medium transition-all duration-200 ${
              selectedDemo === demo.key
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {demo.label}
          </button>
        ))}
      </div>

      {/* Chart Demos */}
      <div className="grid gap-8">
        {selectedDemo === 'portfolio' && (
          <div className="bg-black/20 backdrop-blur-xl rounded-vueni-lg p-8 border border-white/10">
            <AreaChart
              data={portfolioData}
              series={portfolioSeries}
              title="Portfolio Allocation Over Time"
              subtitle="Investment asset breakdown"
              financialType="currency"
              portfolioBreakdown={true}
              stackedData={true}
              stackNormalize={false}
              areaConfig={{
                stackedAreas: true,
                fillOpacity: 0.4,
                strokeWidth: 'medium',
                smoothCurves: true,
                gradientFill: true,
                hoverEffects: true,
                portfolioMode: true,
              }}
              dimensions={{
                height: 400,
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
              className="w-full"
            />
          </div>
        )}

        {selectedDemo === 'spending' && (
          <div className="bg-black/20 backdrop-blur-xl rounded-vueni-lg p-8 border border-white/10">
            <AreaChart
              data={spendingData}
              series={spendingSeries}
              title="Monthly Spending Categories"
              subtitle="Expense breakdown by category"
              financialType="currency"
              stackedData={true}
              stackNormalize={false}
              areaConfig={{
                stackedAreas: true,
                fillOpacity: 0.3,
                strokeWidth: 'medium',
                smoothCurves: true,
                gradientFill: true,
                hoverEffects: true,
              }}
              dimensions={{
                height: 350,
                responsive: true,
              }}
              timeControls={{
                show: true,
                options: ['1M', '3M', '6M', '1Y'],
                defaultRange: '6M',
              }}
              legend={{
                show: true,
                position: 'bottom',
                align: 'center',
              }}
              className="w-full"
            />
          </div>
        )}

        {selectedDemo === 'networth' && (
          <div className="bg-black/20 backdrop-blur-xl rounded-vueni-lg p-8 border border-white/10">
            <AreaChart
              data={netWorthData}
              series={netWorthSeries}
              title="Net Worth Growth"
              subtitle="Total assets minus liabilities"
              financialType="currency"
              stackedData={false}
              trendAnalysis={true}
              areaConfig={{
                stackedAreas: false,
                fillOpacity: 0.2,
                strokeWidth: 'thick',
                smoothCurves: true,
                gradientFill: true,
                hoverEffects: true,
                showBaseline: true,
                baselineValue: 200000,
              }}
              dimensions={{
                height: 300,
                responsive: true,
              }}
              timeControls={{
                show: true,
                options: ['3M', '6M', '1Y', '2Y', 'ALL'],
                defaultRange: '6M',
              }}
              grid={{
                show: true,
                horizontal: true,
                vertical: false,
                opacity: 0.1,
              }}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-black/20 backdrop-blur-xl rounded-vueni-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            🍎 Apple Design
          </h3>
          <p className="text-white/70 text-sm">
            Follows Apple Human Interface Guidelines with smooth curves,
            gradients, and clean typography.
          </p>
        </div>

        <div className="bg-black/20 backdrop-blur-xl rounded-vueni-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            💰 Financial Focus
          </h3>
          <p className="text-white/70 text-sm">
            Built-in currency formatting, percentage calculations, and portfolio
            analysis features.
          </p>
        </div>

        <div className="bg-black/20 backdrop-blur-xl rounded-vueni-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            ⚡ Performance
          </h3>
          <p className="text-white/70 text-sm">
            Optimized for large datasets with data reduction and smooth
            animations.
          </p>
        </div>
      </div>

      {/* Usage Example */}
      <div className="bg-black/20 backdrop-blur-xl rounded-vueni-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Usage Example</h3>
        <pre className="text-xs text-white/80 bg-black/30 rounded-vueni-lg p-4 overflow-x-auto">
          {`<AreaChart
  data={portfolioData}
  series={portfolioSeries}
  title="Portfolio Allocation"
  financialType="currency"
  stackedData={true}
  areaConfig={{
    stackedAreas: true,
    fillOpacity: 0.4,
    gradientFill: true,
    portfolioMode: true,
  }}
  dimensions={{ height: 400 }}
  timeControls={{ show: true }}
  legend={{ show: true }}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default AreaChartDemo;
