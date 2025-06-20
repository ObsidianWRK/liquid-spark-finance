/**
 * SpendingBreakdownChart - Enhanced spending visualization using StackedBarChart
 * Replaces basic bar charts with Apple-style stacked bars for category breakdowns
 */

import React, { useMemo, useCallback } from 'react';
import { StackedBarChart, StackedBarDataPoint } from '@/components/charts/StackedBarChart';
import { mockData } from '@/services/mockData';
import { Transaction, TransactionCategory } from '@/types/transactions';
import { Calendar, TrendingDown, Filter, Download, Share2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface SpendingBreakdownChartProps {
  familyId?: string;
  timeRange?: '1M' | '3M' | '6M' | '1Y';
  showComparisons?: boolean;
  displayMode?: 'absolute' | 'percentage';
  className?: string;
}

// Category mapping for better labels and colors
const CATEGORY_MAPPING: Record<TransactionCategory, { label: string; color: string }> = {
  food: { label: 'Food & Dining', color: '#FF453A' },
  housing: { label: 'Housing', color: '#FF9F0A' },
  transportation: { label: 'Transportation', color: '#FFCC00' },
  entertainment: { label: 'Entertainment', color: '#AF52DE' },
  healthcare: { label: 'Healthcare', color: '#FF375F' },
  shopping: { label: 'Shopping', color: '#5AC8FA' },
  utilities: { label: 'Utilities', color: '#32D74B' },
  debt_payments: { label: 'Debt Payments', color: '#FF3B30' },
  savings: { label: 'Savings', color: '#007AFF' },
  other: { label: 'Other', color: '#8E8E93' }
};

const SpendingBreakdownChart: React.FC<SpendingBreakdownChartProps> = ({
  familyId = 'demo_family',
  timeRange = '6M',
  showComparisons = false,
  displayMode = 'absolute',
  className
}) => {
  // Process transaction data into chart format
  const chartData = useMemo((): StackedBarDataPoint[] => {
    // Filter to expense transactions only
    const expenses = mockData.transactions.filter(tx => tx.amount < 0);
    
    // Map transaction categories to our category system
    const mapCategory = (txCategory: string): TransactionCategory => {
      const categoryLower = txCategory.toLowerCase();
      
      if (['grocery', 'groceries', 'dining', 'coffee', 'food', 'restaurant', 'starbucks'].some(k => categoryLower.includes(k))) {
        return 'food';
      }
      if (['shopping', 'amazon', 'target', 'walmart', 'best buy', 'home depot', 'nike', 'electronics'].some(k => categoryLower.includes(k))) {
        return 'shopping';
      }
      if (['gas', 'uber', 'lyft', 'transportation', 'fuel', 'transit'].some(k => categoryLower.includes(k))) {
        return 'transportation';
      }
      if (['entertainment', 'netflix', 'spotify', 'apple music', 'movie', 'concert', 'streaming'].some(k => categoryLower.includes(k))) {
        return 'entertainment';
      }
      if (['health', 'pharmacy', 'cvs', 'healthcare', 'medical', 'doctor'].some(k => categoryLower.includes(k))) {
        return 'healthcare';
      }
      if (['utilities', 'electric', 'water', 'internet', 'phone', 'cable'].some(k => categoryLower.includes(k))) {
        return 'utilities';
      }
      if (['rent', 'mortgage', 'housing', 'property', 'hoa'].some(k => categoryLower.includes(k))) {
        return 'housing';
      }
      if (['debt', 'loan', 'payment', 'credit card'].some(k => categoryLower.includes(k))) {
        return 'debt_payments';
      }
      if (['saving', 'investment', '401', 'ira', 'transfer'].some(k => categoryLower.includes(k))) {
        return 'savings';
      }
      
      return 'other';
    };

    // Group transactions by month and category
    const monthlyData: { [month: string]: { [category: string]: number } } = {};
    
    expenses.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      const category = mapCategory(tx.category.name);
      const amount = Math.abs(tx.amount);
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      
      if (!monthlyData[monthKey][category]) {
        monthlyData[monthKey][category] = 0;
      }
      
      monthlyData[monthKey][category] += amount;
    });

    // Convert to chart data format
    const chartData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, categories]) => {
        const monthDate = new Date(month + '-01');
        const monthLabel = monthDate.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
        
        const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
        
        return {
          date: month,
          label: monthLabel,
          ...categories,
          total
        } as StackedBarDataPoint;
      });

    return chartData;
  }, []);

  // Custom series configuration with financial category colors
  const chartSeries = useMemo(() => {
    if (chartData.length === 0) return [];
    
    // Get all unique categories from the data
    const categories = new Set<string>();
    chartData.forEach(dataPoint => {
      Object.keys(dataPoint).forEach(key => {
        if (key !== 'date' && key !== 'label' && key !== 'total' && typeof dataPoint[key] === 'number') {
          categories.add(key);
        }
      });
    });

    // Calculate totals for sorting
    const categoryTotals = Array.from(categories).map(category => ({
      category,
      total: chartData.reduce((sum, point) => sum + (point[category] as number || 0), 0)
    }));

    // Sort by total amount (descending)
    categoryTotals.sort((a, b) => b.total - a.total);

    return categoryTotals.map(({ category }) => ({
      dataKey: category,
      label: CATEGORY_MAPPING[category as TransactionCategory]?.label || category,
      color: CATEGORY_MAPPING[category as TransactionCategory]?.color || '#8E8E93'
    }));
  }, [chartData]);

  // Calculate insights
  const insights = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const totalSpending = chartData.reduce((sum, point) => sum + (point.total as number || 0), 0);
    const avgMonthlySpending = totalSpending / chartData.length;
    
    // Find top spending category
    const categoryTotals: { [key: string]: number } = {};
    chartData.forEach(point => {
      chartSeries.forEach(serie => {
        const value = point[serie.dataKey] as number || 0;
        categoryTotals[serie.dataKey] = (categoryTotals[serie.dataKey] || 0) + value;
      });
    });
    
    const topCategory = Object.entries(categoryTotals).reduce((max, [category, total]) => 
      total > max.total ? { category, total } : max, 
      { category: '', total: 0 }
    );
    
    // Calculate month-over-month change
    const lastMonth = chartData[chartData.length - 1];
    const secondLastMonth = chartData[chartData.length - 2];
    const momChange = lastMonth && secondLastMonth 
      ? ((lastMonth.total as number) - (secondLastMonth.total as number)) / (secondLastMonth.total as number) * 100
      : 0;
    
    return {
      totalSpending,
      avgMonthlySpending,
      topCategory: {
        name: CATEGORY_MAPPING[topCategory.category as TransactionCategory]?.label || topCategory.category,
        amount: topCategory.total,
        percentage: (topCategory.total / totalSpending) * 100
      },
      momChange
    };
  }, [chartData, chartSeries]);

  // Handle chart interactions
  const handleCategoryClick = useCallback(() => {
    // Could navigate to detailed transaction view
  }, []);

  const handleExport = useCallback(() => {
    // Export functionality
  }, []);

  const handleShare = useCallback(() => {
    // Share functionality
  }, []);

  if (chartData.length === 0) {
    return (
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-8 text-center">
        <TrendingDown className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Spending Data</h3>
        <p className="text-white/60">Connect your accounts to see spending breakdowns</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with insights */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
            <p className="text-white/60 text-sm mb-1">Total Spending</p>
            <p className="text-xl font-bold text-white">
              {new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              }).format(insights.totalSpending)}
            </p>
          </div>
          
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
            <p className="text-white/60 text-sm mb-1">Monthly Average</p>
            <p className="text-xl font-bold text-white">
              {new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              }).format(insights.avgMonthlySpending)}
            </p>
          </div>
          
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
            <p className="text-white/60 text-sm mb-1">Top Category</p>
            <p className="text-lg font-bold text-white">{insights.topCategory.name}</p>
            <p className="text-white/60 text-sm">
              {insights.topCategory.percentage.toFixed(1)}% of spending
            </p>
          </div>
          
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
            <p className="text-white/60 text-sm mb-1">Month-over-Month</p>
            <p className={`text-lg font-bold ${
              insights.momChange > 0 ? 'text-red-400' : 
              insights.momChange < 0 ? 'text-green-400' : 'text-white'
            }`}>
              {insights.momChange >= 0 ? '+' : ''}{insights.momChange.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <StackedBarChart
        data={chartData}
        series={chartSeries}
        title="Monthly Spending Breakdown"
        subtitle={`Expenses by category over the last ${chartData.length} months`}
        headerActions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        }
        stackedBarConfig={{
          displayMode,
          colorScheme: 'financial',
          barRadius: 8,
          hoverEffects: true,
          clickableSegments: true,
          animateOnLoad: true,
          maxCategories: 8,
          groupSmallCategories: true,
          smallCategoryThreshold: 0.03 // Group categories < 3% of total
        }}
        financialType={displayMode === 'percentage' ? 'percentage' : 'currency'}
        dimensions={{
          height: 400,
          responsive: true
        }}
        timeControls={{
          show: true,
          options: ['3M', '6M', '1Y'],
          defaultRange: timeRange
        }}
        onBarClick={handleCategoryClick}
        onChartReady={() => {
          /* Chart ready */
        }}
        accessibility={{
          ariaLabel: 'Monthly spending breakdown by category',
          keyboardNavigation: true
        }}
      />

      {/* Additional insights */}
      {showComparisons && insights && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-400" />
              Spending Trends
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Highest month:</span>
                <span className="text-white font-medium">
                  {chartData.reduce((max, point) => 
                    (point.total as number) > max.amount ? 
                    { month: point.label, amount: point.total as number } : max,
                    { month: '', amount: 0 }
                  ).month}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Most volatile category:</span>
                <span className="text-white font-medium">
                  {insights.topCategory.name}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.08] p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-400" />
              Budget Insights
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Above average months:</span>
                <span className="text-white font-medium">
                  {chartData.filter(point => 
                    (point.total as number) > insights.avgMonthlySpending
                  ).length} of {chartData.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Consistency score:</span>
                <span className="text-white font-medium">
                  {Math.max(0, 100 - Math.abs(insights.momChange)).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingBreakdownChart;