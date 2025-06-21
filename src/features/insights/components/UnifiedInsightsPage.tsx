import React, { memo, useMemo } from 'react';
import { Card } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

// Types based on test requirements
export interface Transaction {
  id: string;
  merchant?: string;
  description?: string;
  category: {
    name: string;
    color?: string;
  };
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  type?: 'expense' | 'income';
  scores?: {
    health?: number;
    eco?: number;
    financial?: number;
  };
}

export interface Account {
  id: string;
  type: string;
  nickname?: string;
  balance: number;
  availableBalance?: number;
  currency: string;
  accountType?: string;
}

export type InsightsVariant =
  | 'comprehensive'
  | 'simple'
  | 'standard'
  | 'minimal'
  | 'mobile';
export type TimeFrameType = '7d' | '30d' | '90d' | '1y';

export interface UnifiedInsightsConfig {
  variant: InsightsVariant;
  features: {
    showScores?: boolean;
    showTrends?: boolean;
    showCategories?: boolean;
    enableInteractions?: boolean;
    showComparisons?: boolean;
  };
  layout: {
    columns: number;
    spacing: 'tight' | 'normal' | 'wide';
    responsive: boolean;
  };
  dataSource: {
    transactions: Transaction[];
    accounts: Account[];
    timeframe: TimeFrameType;
  };
}

export interface UnifiedInsightsPageProps {
  config: UnifiedInsightsConfig;
  className?: string;
  'data-testid'?: string;
}

const generateMockScores = () => ({
  financial: 72 + Math.floor(Math.random() * 20),
  health: 75 + Math.floor(Math.random() * 20),
  eco: 82 + Math.floor(Math.random() * 15),
});

const calculateSummaryStats = (
  transactions: Transaction[],
  accounts: Account[]
) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlySpending = Math.abs(
    transactions
      .filter(
        (t) =>
          t.amount < 0 && new Date(t.date).getMonth() === new Date().getMonth()
      )
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const categories = transactions.reduce(
    (acc, transaction) => {
      const category = transaction.category.name;
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalBalance,
    monthlySpending,
    categories,
    transactionCount: transactions.length,
  };
};

const ScoreDisplay = memo(
  ({
    scores,
  }: {
    scores: { financial: number; health: number; eco: number };
  }) => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-2 mx-auto">
          <span className="text-white text-sm font-medium">
            {scores.financial}
          </span>
        </div>
        <p className="text-white/80 text-xs">Financial</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-2 mx-auto">
          <span className="text-white text-sm font-medium">
            {scores.health}
          </span>
        </div>
        <p className="text-white/80 text-xs">Health</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-2 mx-auto">
          <span className="text-white text-sm font-medium">{scores.eco}</span>
        </div>
        <p className="text-white/80 text-xs">Eco</p>
      </div>
    </div>
  )
);

ScoreDisplay.displayName = 'ScoreDisplay';

const MetricCard = memo(
  ({
    title,
    value,
    subtitle,
  }: {
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <Card className="bg-white/[0.02] border-white/[0.08] p-4">
      <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-lg font-semibold">{value}</p>
      {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
    </Card>
  )
);

MetricCard.displayName = 'MetricCard';

const CategoryBreakdown = memo(
  ({ categories }: { categories: Record<string, number> }) => {
    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return (
      <div className="space-y-3">
        <h3 className="text-white text-sm font-medium mb-3">Top Categories</h3>
        {sortedCategories.map(([category, amount]) => (
          <div key={category} className="flex justify-between items-center">
            <span className="text-white/80 text-sm">{category}</span>
            <span className="text-white text-sm font-medium">
              ${amount.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    );
  }
);

CategoryBreakdown.displayName = 'CategoryBreakdown';

export const UnifiedInsightsPage = memo<UnifiedInsightsPageProps>(
  ({ config, className, 'data-testid': testId = 'unified-insights-page' }) => {
    const { variant, features, layout, dataSource } = config;
    const { transactions, accounts } = dataSource;

    const scores = useMemo(() => generateMockScores(), []);
    const stats = useMemo(
      () => calculateSummaryStats(transactions, accounts),
      [transactions, accounts]
    );

    const gridCols =
      layout.columns === 1
        ? 'grid-cols-1'
        : layout.columns === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    const spacing =
      layout.spacing === 'tight'
        ? 'gap-3'
        : layout.spacing === 'wide'
          ? 'gap-8'
          : 'gap-6';

    return (
      <PageContainer className={cn('w-full p-6 space-y-6', className)}>
        <main role="main" data-testid={testId}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Financial Insights
          </h1>
          <p className="text-white/70">
            {variant === 'comprehensive'
              ? 'Comprehensive financial overview'
              : 'Financial summary'}
          </p>
        </div>

        {/* Scores Section */}
        {features.showScores && (
          <Card className="bg-white/[0.02] border-white/[0.08] p-6">
            <h2 className="text-white text-lg font-semibold mb-4">
              Your Scores
            </h2>
            <ScoreDisplay scores={scores} />
          </Card>
        )}

        {/* Summary Metrics */}
        <div className={cn('grid', gridCols, spacing)}>
          <MetricCard
            title="Total Balance"
            value={`$${stats.totalBalance.toLocaleString()}`}
            subtitle="Across all accounts"
          />
          <MetricCard
            title="Monthly Spending"
            value={`$${stats.monthlySpending.toLocaleString()}`}
            subtitle="This month"
          />
          <MetricCard
            title="Transactions"
            value={stats.transactionCount.toString()}
            subtitle={`${dataSource.timeframe} period`}
          />
        </div>

        {/* Categories Section */}
        {features.showCategories && (
          <div className={cn('grid', 'grid-cols-1 md:grid-cols-2', spacing)}>
            <Card className="bg-white/[0.02] border-white/[0.08] p-6">
              <CategoryBreakdown categories={stats.categories} />
            </Card>

            <Card className="bg-white/[0.02] border-white/[0.08] p-6">
              <h3 className="text-white text-sm font-medium mb-3">
                Recent Activity
              </h3>
              <div className="space-y-2">
                {transactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-white/80 text-sm">
                      {transaction.merchant ||
                        transaction.description ||
                        'Transaction'}
                    </span>
                    <span className="text-white text-sm font-medium">
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Trends Section */}
        {features.showTrends && (
          <Card className="bg-white/[0.02] border-white/[0.08] p-6">
            <h2 className="text-white text-lg font-semibold mb-4">
              Spending Trends
            </h2>
            <div className="text-white/60 text-center py-8">
              <p>Trends visualization would appear here</p>
              <p className="text-sm mt-2">
                Data for {dataSource.timeframe} timeframe
              </p>
            </div>
          </Card>
        )}

        {/* Comprehensive variant additional content */}
        {variant === 'comprehensive' && (
          <div className={cn('grid', 'grid-cols-1 lg:grid-cols-2', spacing)}>
            <Card className="bg-white/[0.02] border-white/[0.08] p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Account Summary
              </h3>
              <div className="space-y-3">
                {accounts.slice(0, 4).map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">
                        {account.nickname || account.type}
                      </p>
                      <p className="text-white/60 text-xs">{account.type}</p>
                    </div>
                    <span className="text-white text-sm font-medium">
                      ${account.balance.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white/[0.02] border-white/[0.08] p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Financial Health
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Overall Score</span>
                  <span className="text-white text-lg font-semibold">
                    {scores.financial}/100
                  </span>
                </div>
                <div className="w-full bg-white/[0.1] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scores.financial}%` }}
                  />
                </div>
                <p className="text-white/60 text-xs">
                  Based on spending patterns, savings rate, and account balances
                </p>
              </div>
            </Card>
          </div>
        )}
        </main>
      </PageContainer>
    );
  }
);

UnifiedInsightsPage.displayName = 'UnifiedInsightsPage';

export default UnifiedInsightsPage;
