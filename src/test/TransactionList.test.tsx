import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TransactionList from '@/features/transactions/components/TransactionList';
import { Transaction } from '@/types/transactions';

// Helper to generate mock transactions
const generateTx = (id: number): Transaction => ({
  id: `t-${id}`,
  accountId: 'acc',
  familyId: 'fam',
  amount: id % 2 === 0 ? -100 * id : 200 * id,
  currency: 'USD',
  date: new Date(2025, 0, (id % 28) + 1),
  description: 'Test',
  category: 'shopping',
  paymentChannel: 'online',
  transactionType: 'purchase',
  status: 'posted',
  isPending: false,
  isRecurring: false,
  metadata: {},
  tags: [],
  excludeFromBudget: false,
  isTransfer: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('TransactionList', () => {
  it('renders empty state', () => {
    render(<TransactionList transactions={[]} />);
    expect(screen.getByTestId('transaction-list-empty')).toBeInTheDocument();
  });

  it('renders loading skeletons', () => {
    render(<TransactionList transactions={[]} isLoading />);
    expect(screen.getByTestId('transaction-list-loading')).toBeInTheDocument();
  });

  it('renders without virtualization for small lists', () => {
    const txs = Array.from({ length: 10 }, (_, i) => generateTx(i));
    render(<TransactionList transactions={txs} />);
    expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('transaction-row').length).toBeGreaterThan(0);
  });

  it('uses virtualization for large lists', () => {
    const txs = Array.from({ length: 501 }, (_, i) => generateTx(i));
    render(<TransactionList transactions={txs} />);
    expect(
      screen.getByTestId('transaction-virtualized-list')
    ).toBeInTheDocument();
  });

  it('shows CTA when collapsed and expands on click', () => {
    const txs = Array.from({ length: 6 }, (_, i) => generateTx(i));
    render(<TransactionList transactions={txs} />);
    expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-list-cta')).toBeInTheDocument();
    expect(screen.getAllByTestId('transaction-row').length).toBe(5);
    fireEvent.click(screen.getByTestId('transaction-list-cta'));
    expect(screen.queryByTestId('transaction-list-cta')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('transaction-row').length).toBe(6);
  });

  it('virtualizes after expanding when list is large', () => {
    const txs = Array.from({ length: 501 }, (_, i) => generateTx(i));
    render(<TransactionList transactions={txs} />);
    expect(screen.queryByTestId('transaction-virtualized-list')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('transaction-list-cta'));
    expect(screen.getByTestId('transaction-virtualized-list')).toBeInTheDocument();
  });
});
