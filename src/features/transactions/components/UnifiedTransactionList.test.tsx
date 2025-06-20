import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UnifiedTransactionList from './UnifiedTransactionList';

// Mock dependencies
vi.mock('@/shared/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('@/theme/unified', () => ({
  vueniTheme: {
    colors: {
      success: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b',
    },
  },
}));

const mockTransactions = [
  {
    id: '1',
    merchant: 'Coffee Shop',
    category: {
      name: 'Food & Dining',
      color: '#10b981',
    },
    amount: -4.5,
    date: '2024-01-15',
    status: 'completed' as const,
    scores: {
      health: 75,
      eco: 82,
      financial: 88,
    },
  },
  {
    id: '2',
    merchant: 'Salary Deposit',
    category: {
      name: 'Income',
      color: '#3b82f6',
    },
    amount: 5000,
    date: '2024-01-14',
    status: 'completed' as const,
    scores: {
      health: 95,
      eco: 70,
      financial: 100,
    },
  },
  {
    id: '3',
    merchant: 'Gas Station',
    category: {
      name: 'Transportation',
      color: '#f59e0b',
    },
    amount: -45.0,
    date: '2024-01-13',
    status: 'pending' as const,
  },
];

describe('UnifiedTransactionList', () => {
  const defaultProps = {
    transactions: mockTransactions,
    variant: 'default' as const,
    currency: 'USD',
    features: {
      showScores: true,
      showCategories: true,
      searchable: true,
      filterable: true,
      groupByDate: true,
      sortable: true,
      exportable: false,
      showActions: false,
      compactMode: false,
      showShipping: false,
    },
  };

  it('should render without crashing', () => {
    render(<UnifiedTransactionList {...defaultProps} />);
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
  });

  it('should display transactions', () => {
    render(<UnifiedTransactionList {...defaultProps} />);

    expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
    expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
    expect(screen.getByText('Gas Station')).toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    render(<UnifiedTransactionList {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Coffee' } });

    await waitFor(() => {
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
      expect(screen.queryByText('Gas Station')).not.toBeInTheDocument();
    });
  });

  it('should show score circles when enabled', () => {
    render(<UnifiedTransactionList {...defaultProps} />);

    // Should show score circles for transactions that have scores
    expect(screen.getAllByRole('progressbar')).toHaveLength(6); // 2 transactions × 3 scores each
  });

  it('should hide score circles when disabled', () => {
    const propsWithoutScores = {
      ...defaultProps,
      features: {
        ...defaultProps.features,
        showScores: false,
      },
    };

    render(<UnifiedTransactionList {...propsWithoutScores} />);
    expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
  });

  it('should handle filter functionality', async () => {
    render(<UnifiedTransactionList {...defaultProps} />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    // Should show filter options
    await waitFor(() => {
      expect(screen.getByText(/all statuses/i)).toBeInTheDocument();
    });
  });

  it('should handle sorting', async () => {
    render(<UnifiedTransactionList {...defaultProps} />);

    const sortButton = screen.getByRole('button', { name: /sort/i });
    fireEvent.click(sortButton);

    await waitFor(() => {
      expect(screen.getByText(/date/i)).toBeInTheDocument();
      expect(screen.getByText(/amount/i)).toBeInTheDocument();
    });
  });

  it('should handle compact mode', () => {
    const compactProps = {
      ...defaultProps,
      features: {
        ...defaultProps.features,
        compactMode: true,
      },
    };

    render(<UnifiedTransactionList {...compactProps} />);
    expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
  });

  it('should handle empty transactions', () => {
    render(<UnifiedTransactionList {...defaultProps} transactions={[]} />);
    expect(screen.getByText(/no transactions/i)).toBeInTheDocument();
  });

  it('should handle apple variant', () => {
    render(<UnifiedTransactionList {...defaultProps} variant="apple" />);
    expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
  });

  it('should format amounts correctly', () => {
    render(<UnifiedTransactionList {...defaultProps} />);

    expect(screen.getByText('-$4.50')).toBeInTheDocument();
    expect(screen.getByText('+$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('-$45.00')).toBeInTheDocument();
  });

  it('should handle transaction click', () => {
    const onTransactionClick = vi.fn();
    render(
      <UnifiedTransactionList
        {...defaultProps}
        onTransactionClick={onTransactionClick}
      />
    );

    const transaction = screen.getByText('Coffee Shop');
    fireEvent.click(transaction);

    expect(onTransactionClick).toHaveBeenCalledWith(mockTransactions[0]);
  });
});
