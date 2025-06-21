/**
 * StackedBarChart Demo
 * Showcases Apple-style stacked bar chart capabilities for financial data
 */

import React, { useState } from 'react';
import { StackedBarChart, StackedBarDataPoint } from './StackedBarChart';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

// Sample spending data
const spendingData: StackedBarDataPoint[] = [
  {
    date: '2024-01',
    label: 'January',
    food: 800,
    housing: 2000,
    transportation: 300,
    entertainment: 200,
    utilities: 150,
    healthcare: 100,
    shopping: 250,
    other: 75,
  },
  {
    date: '2024-02',
    label: 'February',
    food: 750,
    housing: 2000,
    transportation: 250,
    entertainment: 180,
    utilities: 140,
    healthcare: 120,
    shopping: 200,
    other: 90,
  },
  {
    date: '2024-03',
    label: 'March',
    food: 900,
    housing: 2000,
    transportation: 400,
    entertainment: 300,
    utilities: 160,
    healthcare: 80,
    shopping: 350,
    other: 60,
  },
  {
    date: '2024-04',
    label: 'April',
    food: 850,
    housing: 2000,
    transportation: 350,
    entertainment: 220,
    utilities: 155,
    healthcare: 90,
    shopping: 180,
    other: 85,
  },
  {
    date: '2024-05',
    label: 'May',
    food: 920,
    housing: 2000,
    transportation: 380,
    entertainment: 280,
    utilities: 170,
    healthcare: 110,
    shopping: 300,
    other: 70,
  },
  {
    date: '2024-06',
    label: 'June',
    food: 880,
    housing: 2000,
    transportation: 420,
    entertainment: 350,
    utilities: 165,
    healthcare: 95,
    shopping: 220,
    other: 95,
  },
];

// Sample investment portfolio data
const portfolioData: StackedBarDataPoint[] = [
  {
    date: '2024-Q1',
    label: 'Q1 2024',
    stocks: 65000,
    bonds: 20000,
    cash: 8000,
    crypto: 4000,
    real_estate: 15000,
  },
  {
    date: '2024-Q2',
    label: 'Q2 2024',
    stocks: 70000,
    bonds: 22000,
    cash: 6000,
    crypto: 5000,
    real_estate: 15500,
  },
  {
    date: '2024-Q3',
    label: 'Q3 2024',
    stocks: 68000,
    bonds: 25000,
    cash: 7000,
    crypto: 3500,
    real_estate: 16000,
  },
  {
    date: '2024-Q4',
    label: 'Q4 2024',
    stocks: 75000,
    bonds: 23000,
    cash: 5000,
    crypto: 6000,
    real_estate: 16500,
  },
];

// Budget vs actual data
const budgetData: StackedBarDataPoint[] = [
  {
    date: '2024-01',
    label: 'January',
    budgeted_spending: 3500,
    actual_spending: 3675,
    variance: -175,
  },
  {
    date: '2024-02',
    label: 'February',
    budgeted_spending: 3500,
    actual_spending: 3230,
    variance: 270,
  },
  {
    date: '2024-03',
    label: 'March',
    budgeted_spending: 3500,
    actual_spending: 3850,
    variance: -350,
  },
  {
    date: '2024-04',
    label: 'April',
    budgeted_spending: 3500,
    actual_spending: 3430,
    variance: 70,
  },
  {
    date: '2024-05',
    label: 'May',
    budgeted_spending: 3500,
    actual_spending: 3730,
    variance: -230,
  },
  {
    date: '2024-06',
    label: 'June',
    budgeted_spending: 3500,
    actual_spending: 3725,
    variance: -225,
  },
];

// Income sources data
const incomeData: StackedBarDataPoint[] = [
  {
    date: '2024-01',
    label: 'January',
    salary: 8000,
    freelance: 1200,
    investments: 800,
    rental: 1500,
  },
  {
    date: '2024-02',
    label: 'February',
    salary: 8000,
    freelance: 900,
    investments: 850,
    rental: 1500,
  },
  {
    date: '2024-03',
    label: 'March',
    salary: 8000,
    freelance: 1500,
    investments: 920,
    rental: 1500,
  },
  {
    date: '2024-04',
    label: 'April',
    salary: 8000,
    freelance: 1100,
    investments: 780,
    rental: 1500,
  },
  {
    date: '2024-05',
    label: 'May',
    salary: 8000,
    freelance: 1350,
    investments: 890,
    rental: 1500,
  },
  {
    date: '2024-06',
    label: 'June',
    salary: 8000,
    freelance: 1600,
    investments: 950,
    rental: 1500,
  },
];

export const StackedBarChartDemo: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<
    'spending' | 'portfolio' | 'budget' | 'income'
  >('spending');
  const [displayMode, setDisplayMode] = useState<'absolute' | 'percentage'>(
    'absolute'
  );
  const [showTimeControls, setShowTimeControls] = useState(true);

  const getCurrentData = () => {
    switch (selectedDataset) {
      case 'spending':
        return spendingData;
      case 'portfolio':
        return portfolioData;
      case 'budget':
        return budgetData;
      case 'income':
        return incomeData;
      default:
        return spendingData;
    }
  };

  const getCurrentTitle = () => {
    switch (selectedDataset) {
      case 'spending':
        return 'Monthly Spending Breakdown';
      case 'portfolio':
        return 'Investment Portfolio Allocation';
      case 'budget':
        return 'Budget vs Actual Spending';
      case 'income':
        return 'Income Sources';
      default:
        return 'Financial Data';
    }
  };

  const getCurrentSubtitle = () => {
    switch (selectedDataset) {
      case 'spending':
        return 'Expenses by category over time';
      case 'portfolio':
        return 'Asset allocation across quarters';
      case 'budget':
        return 'Comparing budgeted vs actual spending';
      case 'income':
        return 'Revenue streams month by month';
      default:
        return 'Financial analysis';
    }
  };

  const getFinancialType = () => {
    return displayMode === 'percentage' ? 'percentage' : 'currency';
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            StackedBarChart Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Apple-style stacked bar charts for financial data visualization.
            Perfect for spending breakdowns, portfolio allocations, and budget
            comparisons.
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
            <CardDescription>
              Customize the chart appearance and data set
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dataset Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Dataset
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'spending', label: 'Monthly Spending' },
                  { key: 'portfolio', label: 'Portfolio Allocation' },
                  { key: 'budget', label: 'Budget vs Actual' },
                  { key: 'income', label: 'Income Sources' },
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={selectedDataset === key ? 'default' : 'outline'}
                    onClick={() => setSelectedDataset(key as any)}
                    className="text-sm"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Display Mode */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Display Mode
              </label>
              <div className="flex gap-2">
                <Button
                  variant={displayMode === 'absolute' ? 'default' : 'outline'}
                  onClick={() => setDisplayMode('absolute')}
                  className="text-sm"
                >
                  Absolute Values
                </Button>
                <Button
                  variant={displayMode === 'percentage' ? 'default' : 'outline'}
                  onClick={() => setDisplayMode('percentage')}
                  className="text-sm"
                >
                  Percentage
                </Button>
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Chart Options
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showTimeControls}
                    onChange={(e) => setShowTimeControls(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show Time Controls
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Chart */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <StackedBarChart
              data={getCurrentData()}
              title={getCurrentTitle()}
              subtitle={getCurrentSubtitle()}
              financialType={getFinancialType()}
              stackedBarConfig={{
                displayMode,
                colorScheme: 'financial',
                barRadius: 8,
                hoverEffects: true,
                animateOnLoad: true,
                maxCategories: 8,
                groupSmallCategories: true,
              }}
              dimensions={{
                height: 400,
                responsive: true,
              }}
              timeControls={
                showTimeControls
                  ? {
                      show: true,
                      options:
                        selectedDataset === 'portfolio'
                          ? ['1Y', 'ALL']
                          : ['3M', '6M', '1Y'],
                      defaultRange:
                        selectedDataset === 'portfolio' ? '1Y' : '6M',
                    }
                  : undefined
              }
              headerActions={
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    Share
                  </Button>
                </div>
              }
              onBarClick={(data, categoryKey, value) => {
                console.log('Bar clicked:', { data, categoryKey, value });
              }}
              onBarHover={(data, categoryKey) => {
                console.log('Bar hovered:', { data, categoryKey });
              }}
              onChartReady={() => {
                console.log('Chart ready');
              }}
            />
          </CardContent>
        </Card>

        {/* Feature Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spending with Percentage Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spending Distribution</CardTitle>
              <CardDescription>
                Category breakdown as percentages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StackedBarChart
                data={spendingData.slice(0, 3)}
                stackedBarConfig={{
                  displayMode: 'percentage',
                  colorScheme: 'financial',
                  maxCategories: 5,
                }}
                dimensions={{ height: 250 }}
                financialType="percentage"
              />
            </CardContent>
          </Card>

          {/* Portfolio with Custom Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asset Allocation</CardTitle>
              <CardDescription>Investment portfolio breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <StackedBarChart
                data={portfolioData.slice(0, 2)}
                series={[
                  { dataKey: 'stocks', label: 'Stocks', color: '#007AFF' },
                  { dataKey: 'bonds', label: 'Bonds', color: '#32D74B' },
                  { dataKey: 'cash', label: 'Cash', color: '#FFCC00' },
                  { dataKey: 'crypto', label: 'Crypto', color: '#AF52DE' },
                  {
                    dataKey: 'real_estate',
                    label: 'Real Estate',
                    color: '#FF9F0A',
                  },
                ]}
                stackedBarConfig={{
                  displayMode: 'absolute',
                  colorScheme: 'custom',
                }}
                dimensions={{ height: 250 }}
                financialType="currency"
              />
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income Streams</CardTitle>
              <CardDescription>Monthly revenue by source</CardDescription>
            </CardHeader>
            <CardContent>
              <StackedBarChart
                data={incomeData.slice(0, 4)}
                stackedBarConfig={{
                  displayMode: 'absolute',
                  colorScheme: 'financial',
                  showTotal: true,
                  barRadius: 12,
                }}
                dimensions={{ height: 250 }}
                financialType="currency"
              />
            </CardContent>
          </Card>

          {/* Budget Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget Analysis</CardTitle>
              <CardDescription>Planned vs actual spending</CardDescription>
            </CardHeader>
            <CardContent>
              <StackedBarChart
                data={budgetData.slice(0, 4)}
                series={[
                  {
                    dataKey: 'budgeted_spending',
                    label: 'Budgeted',
                    color: '#007AFF',
                  },
                  {
                    dataKey: 'actual_spending',
                    label: 'Actual',
                    color: '#FF453A',
                  },
                ]}
                stackedBarConfig={{
                  displayMode: 'absolute',
                  colorScheme: 'custom',
                }}
                dimensions={{ height: 250 }}
                financialType="currency"
              />
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>StackedBarChart Features</CardTitle>
            <CardDescription>
              Comprehensive Apple-style financial visualization capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Apple-style design with rounded corners',
                'Financial category color coding',
                'Absolute and percentage display modes',
                'Interactive hover and click events',
                'Automatic category grouping',
                'Time range controls',
                'Responsive layout support',
                'Currency and percentage formatting',
                'Smooth animations and transitions',
                'Accessibility features (ARIA labels)',
                'Custom tooltip with breakdown',
                'Export and sharing capabilities',
                'Small category consolidation',
                'Custom color schemes',
                'GraphBase foundation integration',
                'TypeScript support',
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-vueni-pill flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StackedBarChartDemo;
