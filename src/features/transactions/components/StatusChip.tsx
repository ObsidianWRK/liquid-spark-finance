import React from 'react';
import { cn } from '@/shared/lib/utils';
import { TransactionStatus } from '@/types';

interface StatusChipProps {
  status: TransactionStatus;
}

const statusStyles: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: 'bg-vueni-warning/60 text-vueni-warning',
  [TransactionStatus.InTransit]: 'bg-vueni-sapphireDust/60 text-vueni-sapphireDust',
  [TransactionStatus.Delivered]: 'bg-vueni-success/60 text-vueni-success',
  [TransactionStatus.Completed]: 'bg-vueni-success/60 text-vueni-success',
  [TransactionStatus.Refunded]: 'bg-vueni-blueOblivion/60 text-vueni-blueOblivion',
  [TransactionStatus.None]: 'bg-vueni-n500/60 text-vueni-n500',
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
