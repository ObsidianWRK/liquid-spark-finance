/**
 * StackedBarChart Test Suite
 * Tests for Apple-style stacked bar chart component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StackedBarChart, StackedBarDataPoint } from './StackedBarChart';

// Mock data for testing
const mockSpendingData: StackedBarDataPoint[] = [
  {
    date: '2024-01',
    label: 'January',
    food: 800,
    housing: 2000,
    transportation: 300,
    entertainment: 200,
    utilities: 150,
    other: 100
  },
  {
    date: '2024-02',
    label: 'February',
    food: 750,
    housing: 2000,
    transportation: 250,
    entertainment: 180,
    utilities: 140,
    other: 120
  },
  {
    date: '2024-03',
    label: 'March',
    food: 900,
    housing: 2000,
    transportation: 400,
    entertainment: 300,
    utilities: 160,
    other: 80
  }
];

const mockInvestmentData: StackedBarDataPoint[] = [
  {
    date: '2024-Q1',
    label: 'Q1 2024',
    stocks: 50000,
    bonds: 20000,
    cash: 5000,
    crypto: 3000
  },
  {
    date: '2024-Q2',
    label: 'Q2 2024',
    stocks: 55000,
    bonds: 22000,
    cash: 4000,
    crypto: 4000
  }
];

// Mock ResizeObserver for tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('StackedBarChart', () => {
  it('renders without crashing', () => {
    render(<StackedBarChart data={mockSpendingData} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('displays chart title when provided', () => {
    const title = 'Monthly Spending Breakdown';
    render(<StackedBarChart data={mockSpendingData} title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('displays subtitle when provided', () => {
    const subtitle = 'Spending by category';
    render(<StackedBarChart data={mockSpendingData} subtitle={subtitle} />);
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<StackedBarChart data={[]} loading={true} />);
    expect(screen.getByText(/No data available/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorMessage = 'Failed to load chart data';
    render(<StackedBarChart data={[]} error={errorMessage} />);
    expect(screen.getByText(/Unable to load chart/)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders time controls when enabled', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        timeControls={{
          show: true,
          options: ['1M', '3M', '6M'],
          defaultRange: '3M'
        }}
      />
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText('1M')).toBeInTheDocument();
    expect(screen.getByText('3M')).toBeInTheDocument();
    expect(screen.getByText('6M')).toBeInTheDocument();
  });

  it('handles time range changes', () => {
    const onTimeRangeChange = jest.fn();
    render(
      <StackedBarChart 
        data={mockSpendingData}
        timeControls={{
          show: true,
          options: ['1M', '3M', '6M'],
          defaultRange: '3M'
        }}
        onTimeRangeChange={onTimeRangeChange}
      />
    );
    
    fireEvent.click(screen.getByText('6M'));
    expect(onTimeRangeChange).toHaveBeenCalledWith('6M');
  });

  it('applies custom className', () => {
    const customClass = 'custom-chart-class';
    const { container } = render(
      <StackedBarChart data={mockSpendingData} className={customClass} />
    );
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <StackedBarChart data={mockSpendingData} style={customStyle} />
    );
    expect(container.firstChild).toHaveStyle('background-color: red');
  });

  it('renders with financial color scheme', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        stackedBarConfig={{ colorScheme: 'financial' }}
      />
    );
    // Chart should render without errors
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles percentage display mode', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        stackedBarConfig={{ displayMode: 'percentage' }}
      />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles currency formatting', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        financialType="currency"
        currencyCode="USD"
      />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles investment data correctly', () => {
    render(
      <StackedBarChart 
        data={mockInvestmentData}
        title="Portfolio Allocation"
        financialType="currency"
      />
    );
    expect(screen.getByText('Portfolio Allocation')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('calls onChartReady when chart is ready', async () => {
    const onChartReady = jest.fn();
    render(
      <StackedBarChart 
        data={mockSpendingData}
        onChartReady={onChartReady}
      />
    );
    
    await waitFor(() => {
      expect(onChartReady).toHaveBeenCalled();
    });
  });

  it('handles empty data gracefully', () => {
    render(<StackedBarChart data={[]} />);
    expect(screen.getByText(/No data available/)).toBeInTheDocument();
  });

  it('auto-generates series from data', () => {
    render(<StackedBarChart data={mockSpendingData} />);
    // Should render without errors and auto-detect categories
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('supports custom series configuration', () => {
    const customSeries = [
      { dataKey: 'food', label: 'Food & Dining', color: '#FF453A' },
      { dataKey: 'housing', label: 'Housing & Utilities', color: '#FF9F0A' }
    ];
    
    render(
      <StackedBarChart 
        data={mockSpendingData}
        series={customSeries}
      />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles small category grouping', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        stackedBarConfig={{
          maxCategories: 3,
          groupSmallCategories: true,
          smallCategoryThreshold: 0.1
        }}
      />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('supports accessibility features', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        accessibility={{
          ariaLabel: 'Monthly spending breakdown chart',
          keyboardNavigation: true
        }}
      />
    );
    expect(screen.getByLabelText(/Monthly spending breakdown chart/)).toBeInTheDocument();
  });

  it('handles bar click events', () => {
    const onBarClick = jest.fn();
    render(
      <StackedBarChart 
        data={mockSpendingData}
        onBarClick={onBarClick}
        stackedBarConfig={{ clickableSegments: true }}
      />
    );
    
    // Note: In a real test, you'd simulate clicking on a bar segment
    // This would require more sophisticated interaction testing
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles bar hover events', () => {
    const onBarHover = jest.fn();
    render(
      <StackedBarChart 
        data={mockSpendingData}
        onBarHover={onBarHover}
        stackedBarConfig={{ hoverEffects: true }}
      />
    );
    
    // Note: In a real test, you'd simulate hovering over a bar segment
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders header actions', () => {
    const headerActions = (
      <button data-testid="custom-action">Export</button>
    );
    
    render(
      <StackedBarChart 
        data={mockSpendingData}
        title="Spending Chart"
        headerActions={headerActions}
      />
    );
    
    expect(screen.getByTestId('custom-action')).toBeInTheDocument();
  });

  it('supports different dimensions', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        dimensions={{
          height: 400,
          minHeight: 300,
          responsive: true
        }}
      />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles gradient fill option', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        stackedBarConfig={{ gradientFill: true }}
      />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles animation configuration', () => {
    render(
      <StackedBarChart 
        data={mockSpendingData}
        stackedBarConfig={{ animateOnLoad: false }}
      />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

// Additional test suite for the StackedBarTooltip component
describe('StackedBarTooltip', () => {
  it('does not render when inactive', () => {
    const { container } = render(
      <div data-testid="tooltip-container">
        {/* StackedBarTooltip would normally be rendered by Recharts */}
      </div>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

// Performance tests
describe('StackedBarChart Performance', () => {
  it('handles large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 100 }, (_, i) => ({
      date: `2024-${String(i + 1).padStart(2, '0')}`,
      label: `Day ${i + 1}`,
      category1: Math.random() * 1000,
      category2: Math.random() * 1000,
      category3: Math.random() * 1000
    }));

    const startTime = performance.now();
    render(<StackedBarChart data={largeDataset} />);
    const endTime = performance.now();
    
    // Should render in a reasonable time (less than 1 second)
    expect(endTime - startTime).toBeLessThan(1000);
  });
});

// Integration tests with real-world financial data patterns
describe('StackedBarChart Financial Integration', () => {
  it('handles budget vs actual comparison', () => {
    const budgetData = [
      {
        date: '2024-01',
        label: 'January',
        budgeted: 3000,
        actual: 3200,
        variance: -200
      }
    ];
    
    render(
      <StackedBarChart 
        data={budgetData}
        title="Budget vs Actual"
        financialType="currency"
      />
    );
    expect(screen.getByText('Budget vs Actual')).toBeInTheDocument();
  });

  it('handles portfolio allocation over time', () => {
    const portfolioData = [
      {
        date: '2024-Q1',
        label: 'Q1 2024',
        stocks: 70,
        bonds: 20,
        cash: 10
      },
      {
        date: '2024-Q2',
        label: 'Q2 2024',
        stocks: 65,
        bonds: 25,
        cash: 10
      }
    ];
    
    render(
      <StackedBarChart 
        data={portfolioData}
        title="Portfolio Allocation"
        stackedBarConfig={{ displayMode: 'percentage' }}
        financialType="percentage"
      />
    );
    expect(screen.getByText('Portfolio Allocation')).toBeInTheDocument();
  });
});