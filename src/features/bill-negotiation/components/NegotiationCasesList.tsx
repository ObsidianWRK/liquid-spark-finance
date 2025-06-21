import React, { useEffect } from 'react';
import { useNegotiationStore } from '../store';
import { Loader2, DollarSign, CheckCircle, XCircle, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const NegotiationCasesList: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { cases, loading, refresh } = useNegotiationStore((s) => ({
    cases: s.cases,
    loading: s.loading,
    refresh: s.refresh,
  }));

  useEffect(() => {
    if (cases.length > 0) {
      const interval = setInterval(() => refresh(), 3000);
      return () => clearInterval(interval);
    }
  }, [cases.length, refresh]);

  if (cases.length === 0) {
    return (
      <div className={cn('text-white/60 text-center py-4', className)}>
        <FileText className="w-8 h-8 text-white/20 mx-auto mb-2" />
        <p className="text-xs text-white/70 mb-1">No negotiations yet</p>
        <p className="text-xs text-white/50">Start by clicking above</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Summary */}
      <div className="flex items-center justify-between p-2 bg-white/[0.03] rounded-lg border border-white/[0.05] mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-3 h-3 text-green-400" />
          <span className="text-xs text-white/70">Cases</span>
          <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full">
            {cases.length}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">Potential Savings</p>
          <p className="text-xs font-semibold text-green-400">
            ${cases.reduce((sum, c) => sum + (c.savingsAmount || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Scrollable Cases List */}
      <div className="max-h-32 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
        {cases.map((cs) => {
          let icon = <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />;
          let statusText = 'In progress';
          let statusColor = 'text-yellow-400';
          
          if (cs.status === 'completed') {
            icon = <CheckCircle className="w-3 h-3 text-green-400" />;
            statusText = `Saved $${(cs.savingsAmount ?? 0).toFixed(2)}`;
            statusColor = 'text-green-400';
          } else if (cs.status === 'failed') {
            icon = <XCircle className="w-3 h-3 text-red-400" />;
            statusText = 'Failed';
            statusColor = 'text-red-400';
          }
          
          return (
            <div 
              key={cs.id}
              className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.05] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {icon}
                  <div>
                    <p className="text-xs font-medium text-white">
                      {cs.merchantName || `Case #${cs.id.slice(-6)}`}
                    </p>
                    <p className="text-xs text-white/60">
                      {cs.status === 'queued' ? 'Queued for negotiation' : 
                       cs.status === 'in_progress' ? 'Negotiating...' : 
                       cs.status === 'completed' ? 'Negotiation completed' : 
                       'Negotiation failed'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-xs font-medium', statusColor)}>
                    {statusText}
                  </p>
                  <p className="text-xs text-white/60">
                    {new Date(cs.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
