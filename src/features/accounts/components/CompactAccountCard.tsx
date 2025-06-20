import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedCard } from '@/shared/ui/UnifiedCard';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { AccountCardDTO } from '@/types/accounts';
import { formatCurrency } from '@/shared/utils/formatters';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Send,
  Download,
  CreditCard,
  AlertTriangle,
  Banknote,
  Building2,
  PiggyBank,
  Landmark
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface CompactAccountCardProps {
  account: AccountCardDTO;
  showBalance?: boolean;
  onToggleBalance?: () => void;
  onQuickAction?: (action: string) => void;
  className?: string;
}

const CompactAccountCard: React.FC<CompactAccountCardProps> = ({
  account,
  showBalance = true,
  onToggleBalance,
  onQuickAction,
  className
}) => {
  const navigate = useNavigate();

  const getAccountIcon = () => {
    switch (account.accountType) {
      case 'Checking': return Banknote;
      case 'Savings': return TrendingUp;
      case 'Credit Card': return CreditCard;
      case 'Investment': return ArrowUpRight;
      default: return Banknote;
    }
  };

  const getTrendDirection = () => {
    if (!account.spendDelta) return undefined;
    return account.spendDelta.trend === 'up' ? 'up' : 'down';
  };

  const getUtilizationColor = () => {
    if (!account.creditUtilization) return '';
    if (account.creditUtilization > 80) return 'text-red-500';
    if (account.creditUtilization > 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Map spendDelta to UnifiedCard delta format
  const delta = account.spendDelta ? {
    value: account.spendDelta.percentage,
    format: 'percentage' as const,
    label: 'spending'
  } : undefined;

  // Handle card click to navigate to account overview
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/accounts/${account.id}`);
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <UnifiedCard
        variant="default"
        size="lg"
        className={cn("card w-full min-w-[18rem] sm:max-w-[20rem] lg:max-w-[22rem] xl:max-w-[24rem] card-hover", className)}
        interactive
        icon={getAccountIcon()}
        iconColor={account.institution.color || '#6366f1'}
        title={`${account.accountType} ••${account.last4}`}
        subtitle={account.institution.name}
        metric={showBalance ? formatCurrency(account.currentBalance, { currency: account.currency }) : '••••••'}
        delta={delta}
        trendDirection={getTrendDirection()}
        badge={account.alerts && account.alerts.length > 0 ? {
          text: `${account.alerts.length} Alert${account.alerts.length > 1 ? 's' : ''}`,
          variant: account.alerts.some(a => a.severity === 'critical') ? 'error' : 'warning'
        } : undefined}
      >
        {/* Institution Brand Strip */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ backgroundColor: account.institution.color || '#6366f1' }}
        />

        {/* Toggle Balance Button */}
        {onToggleBalance && (
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBalance();
              }}
              className="p-1 h-8 w-8 bg-white/5 hover:bg-white/10"
            >
              {showBalance ? 
                <Eye className="w-4 h-4" /> : 
                <EyeOff className="w-4 h-4" />
              }
            </Button>
          </div>
        )}

        {/* Available Balance */}
        {account.availableBalance !== undefined && 
         account.availableBalance !== account.currentBalance && (
          <div className="text-sm text-white/60 mt-1">
            Available: {showBalance ? formatCurrency(account.availableBalance, { currency: account.currency }) : '••••••'}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm mt-4">
          {/* Available/Pending */}
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/60 text-xs mb-1">
              {account.pendingCount ? 'Pending' : 'Available'}
            </div>
            <div className="text-white font-semibold">
              {account.pendingCount ? 
                `${account.pendingCount} txns` : 
                (showBalance ? formatCurrency(account.availableBalance || account.currentBalance, { currency: account.currency }) : '••••••')
              }
            </div>
          </div>

          {/* APY/Utilization */}
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/60 text-xs mb-1">
              {account.accountType === 'Credit Card' ? 'Utilization' : 'APY'}
            </div>
            <div className={cn(
              "font-semibold",
              account.accountType === 'Credit Card' ? getUtilizationColor() : "text-white"
            )}>
              {account.accountType === 'Credit Card' && account.creditUtilization !== undefined ? 
                `${account.creditUtilization}%` :
                account.interestApy ? `${account.interestApy}%` : '--'
              }
            </div>
          </div>
        </div>

        {/* Last Transaction */}
        {account.lastTransaction && (
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl mt-4">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {account.lastTransaction.merchant}
              </div>
              <div className="text-xs text-white/60">
                {account.lastTransaction.date}
              </div>
            </div>
            <div className="text-sm font-semibold text-white">
              {showBalance ? formatCurrency(account.lastTransaction.amount, { currency: account.currency }) : '••••'}
            </div>
          </div>
        )}

        {/* Alerts */}
        {account.alerts && account.alerts.length > 0 && (
          <div className="space-y-2 mt-4">
            {account.alerts.map((alert, idx) => (
              <div key={idx} className={cn(
                "flex items-center gap-2 p-2 rounded-xl text-xs",
                alert.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              )}>
                <AlertTriangle className="w-3 h-3" />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {account.quickActions && account.quickActions.length > 0 && (
          <div
            className={cn(
              account.quickActions.length > 2
                ? "grid grid-cols-2 gap-2 mt-4"
                : "flex gap-2 mt-4 flex-wrap"
            )}
          >
            {account.quickActions!.map((action, idx) => {
              const spanFull = account.quickActions!.length > 2 && idx === 2; // 3rd action
              return (
                <Button
                  key={action.type}
                  variant="outline"
                  size="sm"
                  disabled={!action.enabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAction?.(action.type);
                  }}
                  className={cn(
                    "h-8 text-xs bg-white/5 border-white/10 text-white hover:bg-white/10 truncate",
                    account.quickActions!.length > 2 ? "w-full" : "flex-1",
                    spanFull && "col-span-2"
                  )}
                >
                  {action.type === 'transfer' && <Send className="w-3 h-3 mr-1" />}
                  {action.type === 'deposit' && <Download className="w-3 h-3 mr-1" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </UnifiedCard>
    </div>
  );
};

export default CompactAccountCard;
