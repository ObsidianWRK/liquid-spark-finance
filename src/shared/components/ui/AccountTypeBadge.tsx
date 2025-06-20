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
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'Savings':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Credit Card':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Investment':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border',
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
