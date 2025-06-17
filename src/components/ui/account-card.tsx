import React from 'react';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface AccountCardProps {
  accountName: string;
  accountType: string;
  balance: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  accountName,
  accountType,
  balance,
  isActive = false,
  onClick,
  className,
}) => (
  <Card
    className={cn(
      'cursor-pointer p-6 transition-all border hover:border-secondary',
      isActive && 'border-brand-500 bg-brand-50 dark:bg-brand-950',
      className
    )}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-primary">{accountName}</h3>
      {isActive && (
        <span className="px-2 py-1 text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200 rounded-full">
          Active
        </span>
      )}
    </div>
    <p className="text-sm text-secondary mb-2">{accountType}</p>
    <p className="text-2xl font-bold text-primary">
      ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
    <p className="text-xs text-tertiary mt-2">
      Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
  </Card>
); 