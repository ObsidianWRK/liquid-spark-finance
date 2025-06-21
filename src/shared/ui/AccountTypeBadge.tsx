import React from 'react';
import {
  Banknote,
  TrendingUp,
  CreditCard,
  TrendingDown,
  Building,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface AccountTypeBadgeProps {
  accountType: string;
  last4?: string;
  className?: string;
}

const getAccountIcon = (type: string) => {
  switch (type) {
    case 'Checking':
      return <Banknote className="w-4 h-4" />;
    case 'Savings':
      return <TrendingUp className="w-4 h-4" />;
    case 'Credit Card':
      return <CreditCard className="w-4 h-4" />;
    case 'Investment':
      return <TrendingDown className="w-4 h-4" />;
    default:
      return <Building className="w-4 h-4" />;
  }
};

const getAccountColor = (type: string) => {
  switch (type) {
    case 'Checking':
      return 'bg-vueni-sapphireDust/20 text-vueni-sapphireDust border-vueni-sapphireDust/30';
    case 'Savings':
      return 'bg-vueni-success/20 text-vueni-success border-vueni-success/30';
    case 'Credit Card':
      return 'bg-vueni-warning/20 text-vueni-warning border-vueni-warning/30';
    case 'Investment':
      return 'bg-vueni-blueOblivion/20 text-vueni-blueOblivion border-vueni-blueOblivion/30';
    default:
      return 'bg-vueni-n500/20 text-vueni-n500 border-vueni-n500/30';
  }
};

export const AccountTypeBadge: React.FC<AccountTypeBadgeProps> = ({
  accountType,
  last4,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-vueni-pill text-sm font-medium border',
        getAccountColor(accountType),
        className
      )}
    >
      {getAccountIcon(accountType)}
      <span>{accountType}</span>
      {last4 && <span>••{last4}</span>}
    </span>
  );
};

export default AccountTypeBadge;
