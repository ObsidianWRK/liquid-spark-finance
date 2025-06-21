import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionsLimiter from '../components/TransactionsLimiter';

const generateTransactions = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i}`,
    accountId: 'a1',
    familyId: 'f1',
    amount: 0,
    currency: 'USD',
    date: new Date().toISOString(),
    description: `Item ${i + 1}`,
    category: 'other' as const,
    paymentChannel: 'online' as const,
    transactionType: 'purchase' as const,
    status: 'completed' as const,
    isPending: false,
    isRecurring: false,
    metadata: {},
    tags: [],
    excludeFromBudget: false,
    isTransfer: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

describe('TransactionsLimiter', () => {
  const transactions = generateTransactions(8);

  it('renders five rows and CTA initially', () => {
    render(<TransactionsLimiter transactions={transactions} />);

    const rows = screen.getAllByTestId('pfm-row');
    expect(rows).toHaveLength(5);
    expect(screen.getByTestId('show-more')).toBeInTheDocument();

    const heights = rows.map((r) => (r as HTMLElement).clientHeight);
    expect(new Set(heights).size).toBe(1);
  });

  it('shows more rows after clicking CTA', () => {
    render(<TransactionsLimiter transactions={transactions} />);
    fireEvent.click(screen.getByTestId('show-more'));

    const rows = screen.getAllByTestId('pfm-row');
    expect(rows.length).toBeGreaterThan(5);

    const heights = rows.map((r) => (r as HTMLElement).clientHeight);
    expect(new Set(heights).size).toBe(1);
  });
});
