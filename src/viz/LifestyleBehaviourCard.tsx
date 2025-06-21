/**
 * @fileoverview LifestyleBehaviourCard - Account Insights Visualization
 * @description Smart account insights with spending behavior analysis
 * Replaces AccountCard.tsx with enhanced MetricIQ visualization
 */

import React, { useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { GridTile } from './GridTile';
import { DotMatrixSpark } from './DotMatrixSpark';
import { VIZ_TOKENS } from './tokens';
import type { LifestyleBehaviourCardProps } from './types';

/**
 * LifestyleBehaviourCard Component
 * 
 * Features:
 * - Spending pattern analysis
 * - Account balance insights
 * - Behavioral trend indicators
 * - Interactive spending categories
 */
export const LifestyleBehaviourCard: React.FC<LifestyleBehaviourCardProps> = ({
  spendingPatterns,
  accountMetrics,
  className,
}) => {
  // Generate sparkline data from spending patterns
  const sparklineData = useMemo(() => {
    return spendingPatterns.slice(0, 10).map(pattern => pattern.amount);
  }, [spendingPatterns]);

  // Calculate insights
  const insights = useMemo(() => {
    const totalSpending = spendingPatterns.reduce((sum, p) => sum + p.amount, 0);
    const averageSpending = totalSpending / spendingPatterns.length;
    const highSpendingCategories = spendingPatterns
      .filter(p => p.amount > averageSpending)
      .length;

    return {
      totalSpending,
      averageSpending,
      highSpendingCategories,
      savingsRate: ((accountMetrics.totalBalance - accountMetrics.monthlySpend) / accountMetrics.totalBalance * 100),
    };
  }, [spendingPatterns, accountMetrics]);

  return (
    <GridTile title="Lifestyle & Spending" className={className}>
      <div className="space-y-6">
        {/* Account Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-white/60">Total Balance</div>
            <div className="text-xl font-bold text-white">
              ${accountMetrics.totalBalance.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-white/60">Monthly Spend</div>
            <div className="text-xl font-bold text-white">
              ${accountMetrics.monthlySpend.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Spending Trend Sparkline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">Spending Trend</span>
            <span className="text-xs text-white/60">Last 10 transactions</span>
          </div>
          <DotMatrixSpark 
            data={sparklineData}
            width={280}
            height={48}
            className="w-full"
          />
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-white/80">Top Categories</div>
          <div className="space-y-2">
            {spendingPatterns.slice(0, 4).map((pattern, index) => (
              <div 
                key={pattern.category}
                className="flex items-center justify-between p-3 rounded-[12px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${(index * 90) % 360}, 60%, 70%)` 
                    }}
                  />
                  <span className="text-sm font-medium text-white/90">
                    {pattern.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">
                    ${pattern.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center">
                    <span 
                      className="text-xs"
                      style={{ 
                        color: pattern.trend === 'up' 
                          ? VIZ_TOKENS.colors.WHITE_40
                          : pattern.trend === 'down' 
                            ? VIZ_TOKENS.colors.WHITE_80 
                            : VIZ_TOKENS.colors.WHITE_60 
                      }}
                    >
                      {pattern.trend === 'up' ? '↗' : pattern.trend === 'down' ? '↘' : '→'}
                    </span>
                    <span className="text-xs text-white/60 ml-1">
                      {pattern.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Summary */}
        <div className="pt-3 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                {insights.savingsRate.toFixed(1)}%
              </div>
              <div className="text-xs text-white/60">Savings Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {insights.highSpendingCategories}
              </div>
              <div className="text-xs text-white/60">High Categories</div>
            </div>
          </div>
        </div>
      </div>
    </GridTile>
  );
}; 