import React, { useMemo } from 'react';
import { UnifiedCard } from '@/shared/ui/UnifiedCard';
import { AccountCardDTO } from '@/types/accounts';
import { formatCurrency } from '@/shared/utils/formatters';
import { 
  Building2, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Landmark,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface QuickAccessCardProps {
  account: AccountCardDTO;
  variant?: 'rail' | 'grid';
  showBalance?: boolean;
  onSelect?: (accountId: string) => void;
  className?: string;
}

// Account type color mapping for left border accent
const accountTypeColors = {
  'checking': 'border-l-blue-400',
  'savings': 'border-l-green-400', 
  'credit': 'border-l-orange-400',
  'investment': 'border-l-purple-400',
  'loan': 'border-l-red-400',
  'depository': 'border-l-blue-400',
  'brokerage': 'border-l-purple-400'
} as const;

const accountTypeIcons = {
  'checking': Building2,
  'savings': PiggyBank,
  'credit': CreditCard,
  'investment': TrendingUp,
  'loan': Landmark,
  'depository': Building2,
  'brokerage': TrendingUp
} as const;

export const QuickAccessCard = React.memo<QuickAccessCardProps>(({
  account,
  variant = 'rail',
  showBalance = true,
  onSelect,
  className
}) => {
  // Memoized calculations to prevent re-renders
  const { accountTypeKey, IconComponent, trendDirection, deltaValue, formattedBalance, accountMask } = useMemo(() => {
    const normalizedType = account.accountType?.toLowerCase().replace(/\s+/g, '_').replace('card', '') || 'checking';
    const typeKey = (normalizedType in accountTypeColors ? normalizedType : 'checking') as keyof typeof accountTypeColors;
    
    const Icon = accountTypeIcons[typeKey] || Building2;
    
    // Calculate trend based on spend delta
    let trend: 'up' | 'down' | 'flat' = 'flat';
    let delta = 0;
    
    if (account.spendDelta?.amount) {
      delta = account.spendDelta.amount;
      trend = account.spendDelta.trend === 'up' ? 'up' : account.spendDelta.trend === 'down' ? 'down' : 'flat';
    }
    
    const balance = showBalance ? formatCurrency(account.currentBalance, { currency: account.currency }) : '••••••';
    const mask = account.last4 || '••••';
    
    return {
      accountTypeKey: typeKey,
      IconComponent: Icon,
      trendDirection: trend,
      deltaValue: delta,
      formattedBalance: balance,
      accountMask: mask
    };
  }, [account, showBalance]);

  const handleClick = () => {
    onSelect?.(account.id);
  };

  return (
    <UnifiedCard
      title={account.accountName}
      subtitle={`${account.institution.name} • ••••${accountMask}`}
      metric={formattedBalance}
      delta={deltaValue !== 0 ? {
        value: deltaValue,
        format: 'currency',
        label: 'vs last month'
      } : undefined}
      icon={IconComponent}
      iconColor="text-white/80"
      trendDirection={trendDirection}
      variant="default"
      size={variant === 'rail' ? 'sm' : 'md'}
      interactive={true}
      onClick={handleClick}
      className={cn(
        // Base styling for dark mode only
        'bg-white/[0.02] border-white/[0.08] border-l-2',
        // Account type color accent
        accountTypeColors[accountTypeKey],
        // Responsive dimensions
        variant === 'rail' 
          ? 'min-w-[160px] max-w-[28vw] sm:max-w-72 snap-start' 
          : 'w-full',
        // Hover effects
        'hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200',
        // Focus accessibility
        'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        className
      )}
    >
      {/* Account Type Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-block px-2 py-0.5 bg-white/[0.08] rounded-md text-xs font-medium text-white/80 capitalize">
          {account.accountType?.replace(/([A-Z])/g, ' $1').trim()}
        </span>
        
        {/* Quick Action Indicator */}
        {account.quickActions && account.quickActions.length > 0 && (
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span className="text-xs text-white/60">Active</span>
          </div>
        )}
      </div>
      
      {/* Available Balance (for credit cards) */}
      {account.accountType?.toLowerCase().includes('credit') && account.availableBalance !== undefined && (
        <div className="mt-2 pt-2 border-t border-white/[0.06]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/60">Available</span>
                         <span className="text-xs font-medium text-green-400">
               {showBalance ? formatCurrency(account.availableBalance || 0, { currency: account.currency }) : '••••••'}
             </span>
          </div>
        </div>
      )}
    </UnifiedCard>
  );
});

QuickAccessCard.displayName = 'QuickAccessCard'; 