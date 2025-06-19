import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TransactionList from '@/components/transactions/TransactionList';
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
    expect(screen.getByTestId('transaction-virtualized-list')).toBeInTheDocument();
  });
}); 