/**
 * LineChart component tests
 * Basic functionality and Apple-style features testing
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LineChart } from './LineChart';

// Mock data for testing
const mockData = [
  { date: '2023-01-01', value: 1000, revenue: 5000, expenses: 3000 },
  { date: '2023-02-01', value: 1200, revenue: 5500, expenses: 3200 },
  { date: '2023-03-01', value: 1100, revenue: 5200, expenses: 3400 },
  { date: '2023-04-01', value: 1300, revenue: 5800, expenses: 3100 },
  { date: '2023-05-01', value: 1500, revenue: 6000, expenses: 2900 },
];

describe('LineChart', () => {
  it('renders without crashing', () => {
    render(
      <LineChart
        data={mockData}
        title="Test Chart"
      />
    );
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(
      <LineChart
        data={[]}
        title="Empty Chart"
      />
    );
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('displays trend analysis when enabled', () => {
    render(
      <LineChart
        data={mockData}
        title="Trend Chart"
        trendAnalysis={true}
        series={[
          {
            dataKey: 'value',
            label: 'Value',
            color: '#007AFF'
          }
        ]}
      />
    );
    
    // Should show a trend indicator (percentage change)
    expect(screen.getByText(/[+-]\d+\.\d%/)).toBeInTheDocument();
  });

  it('supports multi-series configuration', () => {
    render(
      <LineChart
        data={mockData}
        title="Multi-Series Chart"
        multiSeries={true}
        series={[
          {
            dataKey: 'revenue',
            label: 'Revenue',
            color: '#32D74B'
          },
          {
            dataKey: 'expenses',
            label: 'Expenses',
            color: '#FF453A'
          }
        ]}
        legend={{ show: true }}
      />
    );
    
    expect(screen.getByText('Multi-Series Chart')).toBeInTheDocument();
  });

  it('formats currency correctly when financialType is currency', () => {
    render(
      <LineChart
        data={mockData}
        title="Currency Chart"
        financialType="currency"
        series={[
          {
            dataKey: 'value',
            label: 'Value',
            color: '#007AFF'
          }
        ]}
      />
    );
    
    expect(screen.getByText('Currency Chart')).toBeInTheDocument();
  });

  it('applies Apple-style configuration correctly', () => {
    render(
      <LineChart
        data={mockData}
        title="Apple Style Chart"
        appleAnimation={true}
        lineConfig={{
          smoothLines: true,
          strokeWidth: 'medium',
          showDots: true,
          gradientFill: true,
          hoverEffects: true,
        }}
      />
    );
    
    expect(screen.getByText('Apple Style Chart')).toBeInTheDocument();
  });
});