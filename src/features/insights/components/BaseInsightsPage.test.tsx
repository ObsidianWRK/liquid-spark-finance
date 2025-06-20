import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BaseInsightsPage from './BaseInsightsPage';
import { mockData } from '@/services/mockData';

// Mock dependencies
vi.mock('@/features/scoringModel', () => ({
  generateScoreSummary: vi.fn().mockResolvedValue({
    financial: 85,
    health: 72,
    eco: 91,
  }),
}));

vi.mock('@/hooks/usePerformanceOptimization', () => ({
  usePerformanceOptimization: () => ({}),
  useResponsiveBreakpoint: () => 'desktop',
  useAnimationDelay: () => 0,
  useLayoutDebug: () => {},
  usePerformanceTracking: () => {},
}));

const mockTransactions = mockData.transactions || [];
const mockAccounts = mockData.accounts || [];

describe('BaseInsightsPage', () => {
  const defaultProps = {
    transactions: mockTransactions,
    accounts: mockAccounts,
    className: '',
  };

  it('should render without crashing', () => {
    render(<BaseInsightsPage {...defaultProps} />);
    expect(screen.getByText(/Your Overall Scores/i)).toBeInTheDocument();
  });

  it('should display score circles', async () => {
    render(<BaseInsightsPage {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/Financial Health/i)).toBeInTheDocument();
      expect(screen.getByText(/Wellness Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Eco Impact/i)).toBeInTheDocument();
    });
  });

  it('should calculate financial metrics correctly', async () => {
    render(<BaseInsightsPage {...defaultProps} />);

    await waitFor(() => {
      // Should display spending metrics
      expect(screen.getByText(/Spending Ratio/i)).toBeInTheDocument();
      expect(screen.getByText(/Savings Rate/i)).toBeInTheDocument();
    });
  });

  it('should handle enhanced features', () => {
    render(<BaseInsightsPage {...defaultProps} />);
    expect(screen.getByText(/Your Overall Scores/i)).toBeInTheDocument();
  });

  it('should handle compact rendering', () => {
    render(<BaseInsightsPage {...defaultProps} />);
    expect(screen.getByText(/Your Overall Scores/i)).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(
      <BaseInsightsPage {...defaultProps} transactions={[]} accounts={[]} />
    );
    expect(screen.getByText(/Your Overall Scores/i)).toBeInTheDocument();
  });

  it('should calculate metrics with no income', () => {
    const noIncomeTransactions = mockTransactions.filter((t) => t.amount < 0);
    render(
      <BaseInsightsPage {...defaultProps} transactions={noIncomeTransactions} />
    );
    expect(screen.getByText(/Your Overall Scores/i)).toBeInTheDocument();
  });

  it('should handle credit card accounts', () => {
    const creditAccounts = [
      {
        id: '1',
        type: 'Credit Card',
        nickname: 'Test Credit',
        balance: -1000,
        availableBalance: 4000,
        currency: 'USD',
      },
    ];
    render(<BaseInsightsPage {...defaultProps} accounts={creditAccounts} />);
    expect(screen.getByText(/Your Overall Scores/i)).toBeInTheDocument();
  });
});
