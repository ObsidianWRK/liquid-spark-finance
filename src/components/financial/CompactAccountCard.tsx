import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AccountCardDTO } from '@/types/accounts';
import { formatCurrency } from '@/utils/formatters';
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
  Banknote
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const getAccountIcon = () => {
    switch (account.accountType) {
      case 'Checking': return <Banknote className="w-5 h-5" />;
      case 'Savings': return <TrendingUp className="w-5 h-5" />;
      case 'Credit Card': return <CreditCard className="w-5 h-5" />;
      case 'Investment': return <ArrowUpRight className="w-5 h-5" />;
      default: return <Banknote className="w-5 h-5" />;
    }
  };

  const getTrendIcon = () => {
    if (!account.spendDelta) return null;
    return account.spendDelta.trend === 'up' ? 
      <ArrowUpRight className="w-3 h-3" /> : 
      <ArrowDownRight className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!account.spendDelta) return 'text-gray-500';
    return account.spendDelta.trend === 'up' ? 'text-red-500' : 'text-green-500';
  };

  const getUtilizationColor = () => {
    if (!account.creditUtilization) return '';
    if (account.creditUtilization > 80) return 'text-red-500';
    if (account.creditUtilization > 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className={cn(
      "relative overflow-hidden rounded-xl shadow-md bg-white/95 backdrop-blur-sm border border-white/20",
      "hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
      "max-w-sm w-full h-fit",
      className
    )}>
      {/* Institution Brand Strip */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: account.institution.color || '#6366f1' }}
      />

      <div className="p-4 space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {account.institution.logo ? (
              <img 
                src={account.institution.logo} 
                alt={account.institution.name}
                className="w-6 h-6 rounded"
              />
            ) : (
              <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center">
                {getAccountIcon()}
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {account.accountType} ••{account.last4}
              </div>
              <div className="text-xs text-gray-500">
                {account.institution.name}
              </div>
            </div>
          </div>
          
          {onToggleBalance && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleBalance}
              className="p-1 h-8 w-8"
            >
              {showBalance ? 
                <Eye className="w-4 h-4" /> : 
                <EyeOff className="w-4 h-4" />
              }
            </Button>
          )}
        </div>

        {/* Balance Row */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {showBalance ? formatCurrency(account.currentBalance, { currency: account.currency }) : '••••••'}
            </div>
            {account.availableBalance !== undefined && 
             account.availableBalance !== account.currentBalance && (
              <div className="text-xs text-gray-500">
                Available: {showBalance ? formatCurrency(account.availableBalance, { currency: account.currency }) : '••••••'}
              </div>
            )}
          </div>

          {/* Trend Chip */}
          {account.spendDelta && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs px-2 py-1 flex items-center gap-1",
                getTrendColor(),
                "bg-gray-100"
              )}
            >
              {getTrendIcon()}
              {account.spendDelta.percentage}%
            </Badge>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Available/Pending */}
          <div>
            <div className="text-gray-500 font-medium">
              {account.pendingCount ? 'Pending' : 'Available'}
            </div>
            <div className="text-gray-900 font-semibold">
              {account.pendingCount ? 
                `${account.pendingCount} txns` : 
                (showBalance ? formatCurrency(account.availableBalance || account.currentBalance, { currency: account.currency }) : '••••••')
              }
            </div>
          </div>

          {/* APY/Utilization */}
          <div>
            <div className="text-gray-500 font-medium">
              {account.accountType === 'Credit Card' ? 'Utilization' : 'APY'}
            </div>
            <div className={cn(
              "font-semibold",
              account.accountType === 'Credit Card' ? getUtilizationColor() : "text-gray-900"
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
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <ArrowDownRight className="w-3 h-3 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {account.lastTransaction.merchant}
              </div>
              <div className="text-xs text-gray-500">
                {account.lastTransaction.date}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {showBalance ? formatCurrency(account.lastTransaction.amount, { currency: account.currency }) : '••••'}
            </div>
          </div>
        )}

        {/* Alerts */}
        {account.alerts && account.alerts.length > 0 && (
          <div className="space-y-1">
            {account.alerts.map((alert, idx) => (
              <div key={idx} className={cn(
                "flex items-center gap-2 p-2 rounded-lg text-xs",
                alert.severity === 'critical' ? 'bg-red-50 text-red-700' :
                alert.severity === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                'bg-blue-50 text-blue-700'
              )}>
                <AlertTriangle className="w-3 h-3" />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {account.quickActions && account.quickActions.length > 0 && (
          <div className="flex gap-2">
            {account.quickActions.map((action) => (
              <Button
                key={action.type}
                variant="outline"
                size="sm"
                disabled={!action.enabled}
                onClick={() => onQuickAction?.(action.type)}
                className="flex-1 h-8 text-xs"
              >
                {action.type === 'transfer' && <Send className="w-3 h-3 mr-1" />}
                {action.type === 'deposit' && <Download className="w-3 h-3 mr-1" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompactAccountCard;
