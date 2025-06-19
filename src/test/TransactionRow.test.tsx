import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TransactionRow from '@/components/transactions/TransactionRow';
import { Transaction } from '@/types/transactions';

const baseTx: Transaction = {
  id: 'txn_1',
  accountId: 'acc_1',
  familyId: 'fam_1',
  amount: -4500,
  currency: 'USD',
  date: new Date(),
  description: 'Test desc',
  category: 'shopping',
  paymentChannel: 'online',
  transactionType: 'purchase',
  status: 'pending',
  isPending: true,
  isRecurring: false,
  metadata: {},
  tags: [],
  excludeFromBudget: false,
  isTransfer: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TransactionRow', () => {
  it('renders merchant, category, amount, date', () => {
    render(<TransactionRow tx={{ ...baseTx, merchantName: 'Amazon' }} />);

    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('shopping', { exact: false })).toBeInTheDocument();
    expect(screen.getByTestId('status-chip')).toBeInTheDocument();
    // Amount formatted (negative)
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });

  it('shows placeholders when fields are missing', () => {
    render(<TransactionRow tx={{ ...baseTx, merchantName: undefined as any, category: undefined as any }} />);

    // en dash placeholder
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
}); 