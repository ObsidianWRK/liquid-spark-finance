import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountCardDTO } from '@/types/accounts';
import { cn } from '@/shared/lib/utils';
import { formatCurrency, formatPercent, safeRatio } from '@/shared/utils/formatters';
import { Send, Download, ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, DollarSign, PiggyBank } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

interface Props {
  acct: AccountCardDTO;
  onAction?: (id: string, action: 'transfer' | 'pay' | 'deposit') => void;
  showBalance?: boolean;
}

const categoryColors: Record<string, string> = {
  CHECKING: 'from-green-500 to-green-400',
  SAVINGS: 'from-blue-500 to-blue-400',
  CREDIT: 'from-red-500 to-red-400',
  INVESTMENT: 'from-purple-500 to-purple-400'
};

export const AccountCard: React.FC<Props> = ({ acct, onAction, showBalance = true }) => {
  const navigate = useNavigate();
  const topGradient = categoryColors[acct.category || 'CHECKING'] || 'from-emerald-500 to-emerald-400';
  
  // Safely calculate percentage change and clamp extreme values
  const deltaRatio = safeRatio(acct.percentChange30d || 0, 100); // Convert percentage to ratio
  const clampedDelta = deltaRatio ? Math.max(Math.min(deltaRatio * 100, 999), -999) : null;
  const deltaColor = clampedDelta && clampedDelta < 0 ? 'text-red-400' : 'text-green-400';
  const DeltaIcon = clampedDelta && clampedDelta < 0 ? ArrowDownRight : ArrowUpRight;

  // Safely calculate utilization percentage and clamp
  const utilRatio = acct.category === 'CREDIT' ? safeRatio(Math.abs(acct.currentBalance), acct.utilPercent || 100) : null;
  const clampedUtil = utilRatio ? Math.max(Math.min(utilRatio * 100, 999), 0) : (acct.utilPercent ? Math.max(Math.min(acct.utilPercent, 999), 0) : null);

  // Handle card click to navigate to account overview
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/accounts/${acct.id}`);
  };

  return (
    <TooltipProvider>
      <div 
        className="relative rounded-2xl p-5 bg-black/40 backdrop-blur border border-white/10 flex flex-col h-72 w-full min-h-[18rem] cursor-pointer hover:bg-black/50 transition-all duration-200"
        onClick={handleCardClick}
      >
        {/* Gradient top border */}
        <div className={cn('absolute left-0 right-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r', topGradient)} />

        {/* Header with two-column flex layout */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {acct.institution.logo && (
              <img src={acct.institution.logo} alt={acct.institution.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-white font-medium truncate">
                    {acct.accountType} ••••{acct.last4}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{acct.accountType} ••••{acct.last4}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-white/60 truncate">
                    {acct.institution.name}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{acct.institution.name}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {clampedDelta !== null && (
            <span className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white/10 flex-shrink-0', deltaColor)}>
              <DeltaIcon className="w-3 h-3" />
              {Math.abs(clampedDelta).toFixed(1)}%
            </span>
          )}
        </div>

        {/* Key figures row - Two columns to prevent overlap */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/60 text-xs mb-1">Available</div>
            <div className="text-white font-semibold truncate">
              {showBalance ? formatCurrency(acct.availableBalance ?? acct.currentBalance, { currency: acct.currency }) : '••••••'}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/60 text-xs mb-1">
              {acct.category === 'CREDIT' ? 'Utilization' : 'APY'}
            </div>
            <div className="text-white font-semibold truncate">
              {acct.category === 'CREDIT' 
                ? (clampedUtil !== null ? `${clampedUtil.toFixed(1)}%` : '--')
                : (acct.interestApy ? `${acct.interestApy.toFixed(2)}%` : '--')
              }
            </div>
          </div>
        </div>

        {/* Credit utilization bar - only show if reasonable values */}
        {acct.category === 'CREDIT' && clampedUtil !== null && clampedUtil <= 100 && (
          <div className="mb-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full', clampedUtil > 80 ? 'bg-red-500' : clampedUtil > 60 ? 'bg-yellow-500' : 'bg-green-500')}
                style={{ width: `${Math.min(clampedUtil, 100)}%` }}
              />
            </div>
            <div className="text-xs text-white/60 mt-1">{clampedUtil.toFixed(1)}% used</div>
          </div>
        )}

        {/* Last transaction */}
        {acct.lastTransaction && (
          <div className="flex items-center gap-2 text-sm mb-4">
            <TrendingUp className="w-4 h-4 text-white/60 flex-shrink-0" />
            <span className="flex-1 truncate text-white/80">{acct.lastTransaction.merchant}</span>
            <span className={cn('flex-shrink-0', acct.lastTransaction.amount < 0 ? 'text-red-400' : 'text-green-400')}>
              {showBalance ? formatCurrency(acct.lastTransaction.amount, { currency: acct.currency }) : '••••'}
            </span>
          </div>
        )}

        {/* Actions - always at bottom with mt-auto */}
        <div className="mt-auto flex gap-2">
          {/* Transfer button - for all account types */}
          <button
            className="flex-1 bg-white/5 rounded-full h-8 flex items-center justify-center text-white text-xs hover:bg-white/10 transition-colors"
            onClick={() => onAction?.(acct.id, 'transfer')}
            aria-label="Transfer"
          >
            <Send className="w-3 h-3" />
          </button>
          
          {/* Pay/Spend button - contextual to account type */}
          <button
            className="flex-1 bg-white/5 rounded-full h-8 flex items-center justify-center text-white text-xs hover:bg-white/10 transition-colors"
            onClick={() => onAction?.(acct.id, 'pay')}
            aria-label={acct.category === 'CREDIT' ? 'Pay' : 'Spend'}
          >
            {acct.category === 'CREDIT' ? <CreditCard className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
          </button>
          
          {/* Deposit/Save button - only for non-credit accounts */}
          {acct.category !== 'CREDIT' && (
            <button
              className="flex-1 bg-white/5 rounded-full h-8 flex items-center justify-center text-white text-xs hover:bg-white/10 transition-colors"
              onClick={() => onAction?.(acct.id, 'deposit')}
              aria-label="Deposit"
            >
              {acct.category === 'SAVINGS' ? <PiggyBank className="w-3 h-3" /> : <Download className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AccountCard;
