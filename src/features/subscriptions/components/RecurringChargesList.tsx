import React, { useEffect, useState } from 'react';
import { useSubscriptionsStore } from '../store';
import { Button } from '@/shared/ui/button';
import { 
  Repeat, 
  XCircle, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/utils/formatters';

const VISIBLE_COUNT = 5;

export const RecurringChargesList: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { charges, loading, detect, cancel } = useSubscriptionsStore((s) => ({
    charges: s.charges,
    loading: s.loading,
    detect: s.detect,
    cancel: s.cancel,
  }));

  const [expanded, setExpanded] = useState(false);
  const displayCharges = expanded ? charges : charges.slice(0, VISIBLE_COUNT);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (!expanded && scrollTop + clientHeight >= scrollHeight - 5) {
      setExpanded(true);
    }
  };

  useEffect(() => {
    detect();
  }, [detect]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'text-blue-400';
      case 'monthly': return 'text-green-400';
      case 'quarterly': return 'text-yellow-400';
      case 'yearly': return 'text-purple-400';
      default: return 'text-white/60';
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-white/40';
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return 'Unknown';
    if (confidence >= 0.8) return 'High confidence';
    if (confidence >= 0.6) return 'Medium confidence';
    return 'Low confidence';
  };

  if (loading && charges.length === 0) {
    return (
      <div className={cn('text-white/60 text-center py-4', className)}>
        <div className="animate-spin w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-xs">Analyzing subscriptions...</p>
      </div>
    );
  }

  if (charges.length === 0) {
    return (
      <div className={cn('text-white/60 text-center py-4', className)}>
        <Repeat className="w-8 h-8 text-white/20 mx-auto mb-2" />
        <p className="text-xs text-white/70 mb-1">No Subscriptions Detected</p>
        <p className="text-xs text-white/50">We&apos;ll scan your transactions</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Summary - Compact */}
      <div className="flex items-center justify-between p-2 bg-white/[0.03] rounded-lg border border-white/[0.05] mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-orange-400" />
          <span className="text-xs text-white/70">Active</span>
          <span className="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">
            {charges.length}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">Monthly</p>
          <p className="text-xs font-semibold text-white">
            {formatCurrency(
              charges
                .filter(c => c.frequency === 'monthly')
                .reduce((sum, c) => sum + c.amount, 0)
            )}
          </p>
        </div>
      </div>

      {/* Scrollable Subscription List - Compact */}
      <div
        className="max-h-40 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5"
        onScroll={handleScroll}
      >
        {displayCharges.map((charge) => (
          <div
            key={charge.id}
            className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.05] hover:bg-white/[0.04] transition-all"
          >
            {/* Left side: Subscription name and due date */}
            <div className="flex flex-col min-w-0 flex-1">
              <h4 className="text-sm font-medium text-white truncate">
                {charge.merchantName}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/60">
                  {formatDate(charge.nextDueDate)}
                </span>
              </div>
            </div>

            {/* Right side: Monthly cost and actions */}
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white">
                  {formatCurrency(charge.amount)}
                </p>
                <p className={cn('text-xs', getFrequencyColor(charge.frequency))}>
                  {charge.frequency}
                </p>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => cancel(charge.id)}
                disabled={charge.status === 'pending_cancel'}
                className="h-6 px-2 text-xs border-red-500/20 text-red-400 hover:bg-red-500/10 flex-shrink-0"
              >
                <XCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {!expanded && charges.length > VISIBLE_COUNT && (
          <button
            className="w-full text-center text-xs text-orange-400 p-2 hover:underline"
            onClick={() => setExpanded(true)}
          >
            See all subscriptions
          </button>
        )}
      </div>

      {/* Footer - Compact */}
      <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.05]">
        <p className="text-xs text-white/60 text-center">
          Auto-detected from transactions
        </p>
      </div>
    </div>
  );
};
