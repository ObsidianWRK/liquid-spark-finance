import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton';
import { UniversalCard } from '@/shared/ui/UniversalCard';

export const AccountOverviewSkeleton: React.FC = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-10 h-10 rounded-vueni-pill bg-white/10" />
        <div className="flex-1">
          <Skeleton className="h-8 w-64 bg-white/10 mb-2" />
          <Skeleton className="h-4 w-48 bg-white/10" />
        </div>
        <div className="text-right">
          <Skeleton className="h-8 w-32 bg-white/10 mb-1" />
          <Skeleton className="h-4 w-28 bg-white/10" />
        </div>
      </div>

      {/* Collapsible panes skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <UniversalCard key={i} variant="glass" className="w-full">
            {/* Pane header skeleton */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-vueni-lg bg-white/10" />
                <Skeleton className="h-6 w-32 bg-white/10" />
                <Skeleton className="h-5 w-16 rounded-vueni-pill bg-white/10" />
              </div>
              <Skeleton className="w-5 h-5 bg-white/10" />
            </div>

            {/* Expanded pane content skeleton (only show for first pane) */}
            {i === 0 && (
              <div className="px-6 pb-6">
                <div className="border-t border-white/[0.08] pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div
                        key={j}
                        className="bg-white/[0.03] rounded-vueni-lg p-4 border border-white/[0.05]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="w-5 h-5 bg-white/10" />
                          <Skeleton className="h-4 w-24 bg-white/10" />
                        </div>
                        <Skeleton className="h-6 w-20 bg-white/10" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </UniversalCard>
        ))}
      </div>
    </div>
  </div>
);

export default AccountOverviewSkeleton;
