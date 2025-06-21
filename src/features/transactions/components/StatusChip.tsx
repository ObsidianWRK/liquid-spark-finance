import React from 'react';
import { cn } from '@/shared/lib/utils';
import { TransactionStatus } from '@/types';

interface StatusChipProps {
  status: TransactionStatus;
}

const statusStyles: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: 'bg-yellow-700/60 text-yellow-300',
  [TransactionStatus.InTransit]: 'bg-blue-700/60 text-blue-300',
  [TransactionStatus.Delivered]: 'bg-green-700/60 text-green-300',
  [TransactionStatus.Completed]: 'bg-green-700/60 text-green-300',
  [TransactionStatus.Refunded]: 'bg-purple-700/60 text-purple-300',
  [TransactionStatus.None]: 'bg-gray-700/60 text-gray-300',
};

const labelMap: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: 'Pending',
  [TransactionStatus.InTransit]: 'In Transit',
  [TransactionStatus.Delivered]: 'Delivered',
  [TransactionStatus.Completed]: 'Completed',
  [TransactionStatus.Refunded]: 'Refunded',
  [TransactionStatus.None]: '—',
};

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-vueni-pill px-2 py-0.5 text-xs font-medium capitalize',
        statusStyles[status]
      )}
      data-testid="status-chip"
    >
      {labelMap[status]}
    </span>
  );
};

export default StatusChip;
