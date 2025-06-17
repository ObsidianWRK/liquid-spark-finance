import React from 'react';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  icon,
  className,
}) => (
  <Card className={cn('relative overflow-hidden p-6', className)}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-secondary">{label}</p>
        <p className="text-2xl font-semibold text-primary mt-2">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                'text-sm font-medium',
                change.type === 'increase' ? 'text-success-600' : 'text-danger-600'
              )}
            >
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
            </span>
          </div>
        )}
      </div>
      {icon && <div className="p-3 bg-secondary rounded-lg">{icon}</div>}
    </div>
  </Card>
); 