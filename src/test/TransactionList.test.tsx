import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UnifiedTransactionList } from '@/ui-kit';
import type { Transaction } from '@/features/transactions/components/UnifiedTransactionList';

// Helper to generate mock transactions
const generateTx = (id: number): Transaction => ({
  id: `t-${id}`,
  merchant: `Merchant ${id}`,
  category: { name: 'shopping', color: '#f00' },
  amount: id % 2 === 0 ? -100 * id : 200 * id,
  date: new Date(2025, 0, (id % 28) + 1).toISOString(),
  status: 'completed',
});

describe('UnifiedTransactionList', () => {
  it('renders empty state', () => {
    render(<UnifiedTransactionList transactions={[]} />);
    expect(screen.getByText(/no transactions/i)).toBeInTheDocument();
  });

  it('renders provided transactions', () => {
    const txs = Array.from({ length: 3 }, (_, i) => generateTx(i));
    render(<UnifiedTransactionList transactions={txs} />);
    expect(screen.getByText('Merchant 1')).toBeInTheDocument();
    expect(screen.getByText('Merchant 2')).toBeInTheDocument();
  });

  it('filters transactions via search', async () => {
    const txs = Array.from({ length: 3 }, (_, i) => generateTx(i));
    render(<UnifiedTransactionList transactions={txs} />);
    const search = screen.getByPlaceholderText(/search/i);
    fireEvent.change(search, { target: { value: 'Merchant 2' } });
    await waitFor(() => {
      expect(screen.getByText('Merchant 2')).toBeInTheDocument();
      expect(screen.queryByText('Merchant 1')).not.toBeInTheDocument();
    });
  });

  it('supports compact mode', () => {
    const txs = Array.from({ length: 2 }, (_, i) => generateTx(i));
    render(<UnifiedTransactionList transactions={txs} features={{ compactMode: true }} />);
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });
});
