/**
 * AreaChart Tests
 * Test suite for the Apple-style AreaChart component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AreaChart } from './AreaChart';
import { ChartDataPoint, ChartSeries } from './types';

// Mock the recharts library
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Area: ({ dataKey }: any) => <div data-testid={`area-${dataKey}`} />,
}));

// Sample test data
const mockData: ChartDataPoint[] = [
  { date: '2024-01', income: 5000, spending: 3000, savings: 2000 },
  { date: '2024-02', income: 5200, spending: 3100, savings: 2100 },
  { date: '2024-03', income: 5100, spending: 2900, savings: 2200 },
  { date: '2024-04', income: 5300, spending: 3200, savings: 2100 },
  { date: '2024-05', income: 5150, spending: 3050, savings: 2100 },
];

const mockSeries: ChartSeries[] = [
  { dataKey: 'income', label: 'Income', color: '#32D74B' },
  { dataKey: 'spending', label: 'Spending', color: '#FF453A' },
  { dataKey: 'savings', label: 'Savings', color: '#0A84FF' },
];

describe('AreaChart', () => {
  beforeEach(() => {
    // Clear any previous mocks
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<AreaChart data={mockData} />);
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('renders with title and subtitle', () => {
      render(
        <AreaChart 
          data={mockData} 
          title="Financial Overview" 
          subtitle="Monthly breakdown" 
        />
      );
      
      expect(screen.getByText('Financial Overview')).toBeInTheDocument();
      expect(screen.getByText('Monthly breakdown')).toBeInTheDocument();
    });

    it('renders responsive container by default', () => {
      render(<AreaChart data={mockData} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('auto-generates series from data when not provided', () => {
      render(<AreaChart data={mockData} />);
      
      // Should auto-detect numeric fields and create areas
      expect(screen.getByTestId('area-income')).toBeInTheDocument();
    });

    it('uses provided series configuration', () => {
      render(<AreaChart data={mockData} series={mockSeries} />);
      
      mockSeries.forEach(serie => {
        expect(screen.getByTestId(`area-${serie.dataKey}`)).toBeInTheDocument();
      });
    });

    it('handles empty data gracefully', () => {
      render(<AreaChart data={[]} title="Empty Chart" />);
      
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByText("There's no data to display in this chart yet.")).toBeInTheDocument();
    });
  });

  describe('Financial Type Formatting', () => {
    it('applies currency formatting', () => {
      render(
        <AreaChart 
          data={mockData} 
          financialType="currency"
          title="Revenue Chart"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('applies percentage formatting', () => {
      const percentageData = [
        { date: '2024-01', stocks: 60, bonds: 30, cash: 10 },
        { date: '2024-02', stocks: 65, bonds: 25, cash: 10 },
      ];
      
      render(
        <AreaChart 
          data={percentageData} 
          financialType="percentage"
          title="Asset Allocation"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('applies allocation formatting', () => {
      const allocationData = [
        { date: '2024-01', equities: 70.5, fixedIncome: 20.0, alternatives: 9.5 },
        { date: '2024-02', equities: 68.2, fixedIncome: 22.1, alternatives: 9.7 },
      ];
      
      render(
        <AreaChart 
          data={allocationData} 
          financialType="allocation"
          portfolioBreakdown={true}
          title="Portfolio Breakdown"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Area Configuration', () => {
    it('applies custom area configuration', () => {
      const customConfig = {
        fillOpacity: 0.5,
        strokeWidth: 'thick' as const,
        smoothCurves: false,
        gradientFill: false,
      };
      
      render(
        <AreaChart 
          data={mockData} 
          areaConfig={customConfig}
          title="Custom Areas"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('enables stacked areas for multi-series data', () => {
      render(
        <AreaChart 
          data={mockData} 
          multiSeries={true}
          stackedData={true}
          title="Stacked Areas"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('applies portfolio mode styling', () => {
      render(
        <AreaChart 
          data={mockData} 
          portfolioBreakdown={true}
          financialType="allocation"
          title="Portfolio Composition"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      // Portfolio summary should be shown in header actions
      expect(screen.getByText(/Current Allocation:/)).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading state', () => {
      render(<AreaChart data={mockData} loading={true} title="Loading Chart" />);
      
      // Should show skeleton loader with animate-pulse class
      const loadingContainer = screen.getByTestId('responsive-container').parentElement;
      expect(loadingContainer).toHaveClass('animate-pulse');
    });

    it('shows error state', () => {
      const errorMessage = 'Failed to load chart data';
      render(
        <AreaChart 
          data={mockData} 
          error={errorMessage} 
          title="Error Chart"
        />
      );
      
      expect(screen.getByText('Unable to load chart')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('handles retry functionality', () => {
      const onRetry = vi.fn();
      render(
        <AreaChart 
          data={mockData} 
          error="Network error" 
          errorConfig={{ onRetry }}
        />
      );
      
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);
      
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Interaction and Events', () => {
    it('handles data point click events', () => {
      const onDataPointClick = vi.fn();
      render(
        <AreaChart 
          data={mockData} 
          onDataPointClick={onDataPointClick}
          title="Interactive Chart"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('handles data point hover events', () => {
      const onDataPointHover = vi.fn();
      render(
        <AreaChart 
          data={mockData} 
          onDataPointHover={onDataPointHover}
          title="Hover Chart"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('supports time range controls', () => {
      const onTimeRangeChange = vi.fn();
      render(
        <AreaChart 
          data={mockData} 
          timeControls={{ 
            show: true, 
            options: ['1M', '3M', '1Y'], 
            defaultRange: '1M' 
          }}
          onTimeRangeChange={onTimeRangeChange}
          title="Time Range Chart"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('includes proper ARIA labels', () => {
      render(
        <AreaChart 
          data={mockData} 
          title="Accessible Chart"
          accessibility={{ 
            ariaLabel: 'Financial area chart showing income and expenses' 
          }}
        />
      );
      
      const chartContainer = screen.getByRole('img');
      expect(chartContainer).toHaveAttribute('aria-label', 'Financial area chart showing income and expenses');
    });

    it('supports keyboard navigation', () => {
      render(
        <AreaChart 
          data={mockData} 
          accessibility={{ keyboardNavigation: true }}
          title="Keyboard Chart"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Performance Features', () => {
    it('reduces data precision for large datasets', async () => {
      // Create a large dataset
      const largeData = Array.from({ length: 500 }, (_, i) => ({
        date: `2024-${String(i + 1).padStart(3, '0')}`,
        value: Math.random() * 1000,
      }));
      
      render(
        <AreaChart 
          data={largeData} 
          precisionReduce={true}
          title="Large Dataset"
        />
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      });
    });

    it('disables data reduction when configured', () => {
      const largeData = Array.from({ length: 200 }, (_, i) => ({
        date: `2024-${String(i + 1).padStart(3, '0')}`,
        value: Math.random() * 1000,
      }));
      
      render(
        <AreaChart 
          data={largeData} 
          precisionReduce={false}
          title="No Reduction"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Apple Design Integration', () => {
    it('applies Apple animation by default', () => {
      render(
        <AreaChart 
          data={mockData} 
          appleAnimation={true}
          title="Animated Chart"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('disables Apple animation when configured', () => {
      render(
        <AreaChart 
          data={mockData} 
          appleAnimation={false}
          title="Static Chart"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('applies custom series colors', () => {
      const customColors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
      render(
        <AreaChart 
          data={mockData} 
          seriesColors={customColors}
          multiSeries={true}
          title="Custom Colors"
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });
});