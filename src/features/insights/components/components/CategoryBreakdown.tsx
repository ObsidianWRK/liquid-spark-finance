import React from 'react';
import { Transaction } from '@/types/shared';

interface CategoryBreakdownProps {
  transactions: Transaction[];
  variant?: string;
  interactive?: boolean;
}

// Placeholder CategoryBreakdown component for UnifiedInsightsPage
export const CategoryBreakdown = React.memo<CategoryBreakdownProps>(
  ({ transactions, variant = 'default', interactive = false }) => {
    // Calculate category totals
    const categoryTotals = transactions
      .filter((t) => t.amount < 0)
      .reduce(
        (acc, t) => {
          const category = t.category.name;
          acc[category] = (acc[category] || 0) + Math.abs(t.amount);
          return acc;
        },
        {} as Record<string, number>
      );

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    return (
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Category Breakdown
        </h3>

        <div className="space-y-3">
          {sortedCategories.map(([category, amount]) => {
            const percentage = Math.round(
              (amount /
                Object.values(categoryTotals).reduce((a, b) => a + b, 0)) *
                100
            );

            return (
              <div
                key={category}
                className={`flex items-center justify-between p-3 bg-white/5 rounded-lg ${
                  interactive
                    ? 'hover:bg-white/10 cursor-pointer transition-colors'
                    : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#6366f1' }}
                  />
                  <span className="text-white capitalize">{category}</span>
                </div>

                <div className="text-right">
                  <div className="text-white font-semibold">
                    {formatCurrency(amount)}
                  </div>
                  <div className="text-xs text-white/60">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedCategories.length === 0 && (
          <div className="text-center py-8">
            <div className="text-white/60 mb-2">📊 No data available</div>
            <div className="text-sm text-white/40">
              Add some transactions to see category breakdown
            </div>
          </div>
        )}
      </div>
    );
  }
);

CategoryBreakdown.displayName = 'CategoryBreakdown';

export default CategoryBreakdown;
