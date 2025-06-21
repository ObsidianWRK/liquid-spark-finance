/**
 * PortfolioAllocationChart - Investment allocation visualization using StackedBarChart
 * Shows asset allocation over time with Apple-style design
 */

import React, { useMemo, useCallback, useState } from 'react';
import {
  StackedBarChart,
  StackedBarDataPoint,
} from '@/components/charts/StackedBarChart';
import { investmentService } from '@/features/investments/api/investmentService';
import { Portfolio } from '@/types/investments';
import {
  TrendingUp,
  PieChart,
  Target,
  BarChart3,
  Rebalance,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

interface PortfolioAllocationChartProps {
  familyId?: string;
  showTargetAllocation?: boolean;
  showRebalanceSignals?: boolean;
  displayMode?: 'absolute' | 'percentage';
  timeRange?: '1Y' | '2Y' | '5Y' | 'ALL';
  className?: string;
}

// Asset class configuration with colors and target allocations
const ASSET_CLASSES = {
  stocks: {
    label: 'Stocks',
    color: '#007AFF', // Apple blue
    target: 60,
    description: 'Equity investments and growth assets',
  },
  bonds: {
    label: 'Bonds',
    color: '#32D74B', // Apple green
    target: 25,
    description: 'Fixed income and stable investments',
  },
  cash: {
    label: 'Cash & Cash Equivalents',
    color: '#FFCC00', // Apple yellow
    target: 10,
    description: 'High liquidity and emergency funds',
  },
  real_estate: {
    label: 'Real Estate',
    color: '#FF9F0A', // Apple orange
    target: 5,
    description: 'REITs and real estate investments',
  },
  crypto: {
    label: 'Cryptocurrency',
    color: '#AF52DE', // Apple purple
    target: 0,
    description: 'Digital assets and alternative investments',
  },
  commodities: {
    label: 'Commodities',
    color: '#5AC8FA', // Apple teal
    target: 0,
    description: 'Precious metals and commodity investments',
  },
};

const PortfolioAllocationChart: React.FC<PortfolioAllocationChartProps> = ({
  familyId = 'demo_family',
  showTargetAllocation = true,
  showRebalanceSignals = true,
  displayMode = 'percentage',
  timeRange = '1Y',
  className,
}) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate mock historical allocation data
  const chartData = useMemo((): StackedBarDataPoint[] => {
    // Mock quarterly portfolio allocation data
    const quarters = [
      { period: '2024-Q1', label: 'Q1 2024' },
      { period: '2024-Q2', label: 'Q2 2024' },
      { period: '2024-Q3', label: 'Q3 2024' },
      { period: '2024-Q4', label: 'Q4 2024' },
    ];

    return quarters.map(({ period, label }, index) => {
      // Simulate portfolio drift over time
      const baseAllocations = {
        stocks: 65 + (Math.random() - 0.5) * 10,
        bonds: 20 + (Math.random() - 0.5) * 8,
        cash: 8 + (Math.random() - 0.5) * 4,
        real_estate: 5 + (Math.random() - 0.5) * 3,
        crypto: 2 + (Math.random() - 0.5) * 2,
      };

      // Normalize to 100%
      const total = Object.values(baseAllocations).reduce(
        (sum, val) => sum + val,
        0
      );
      const normalized = Object.fromEntries(
        Object.entries(baseAllocations).map(([key, val]) => [
          key,
          (val / total) * 100,
        ])
      );

      // Convert to absolute values for a $500k portfolio
      const portfolioValue = 500000 + index * 25000; // Growing portfolio
      const absoluteValues = Object.fromEntries(
        Object.entries(normalized).map(([key, percentage]) => [
          key,
          (percentage / 100) * portfolioValue,
        ])
      );

      return {
        date: period,
        label,
        total: portfolioValue,
        ...absoluteValues,
      } as StackedBarDataPoint;
    });
  }, [timeRange]);

  // Target allocation data for comparison
  const targetAllocationData = useMemo((): StackedBarDataPoint[] => {
    if (!showTargetAllocation) return [];

    const portfolioValue = 500000; // Example portfolio value
    const targetData = {
      date: 'target',
      label: 'Target Allocation',
      total: portfolioValue,
      ...Object.fromEntries(
        Object.entries(ASSET_CLASSES).map(([key, config]) => [
          key,
          (config.target / 100) * portfolioValue,
        ])
      ),
    };

    return [targetData as StackedBarDataPoint];
  }, [showTargetAllocation]);

  // Combined data for comparison view
  const combinedData = useMemo(() => {
    if (!showTargetAllocation) return chartData;
    return [...chartData, ...targetAllocationData];
  }, [chartData, targetAllocationData, showTargetAllocation]);

  // Chart series configuration
  const chartSeries = useMemo(() => {
    return Object.entries(ASSET_CLASSES).map(([key, config]) => ({
      dataKey: key,
      label: config.label,
      color: config.color,
    }));
  }, []);

  // Calculate allocation insights
  const allocationInsights = useMemo(() => {
    if (chartData.length === 0) return null;

    const currentAllocation = chartData[chartData.length - 1];
    const totalValue = currentAllocation.total as number;

    // Calculate current percentages
    const currentPercentages = Object.fromEntries(
      Object.entries(ASSET_CLASSES).map(([key, config]) => [
        key,
        ((currentAllocation[key] as number) / totalValue) * 100,
      ])
    );

    // Calculate drift from target
    const drifts = Object.fromEntries(
      Object.entries(ASSET_CLASSES).map(([key, config]) => [
        key,
        currentPercentages[key] - config.target,
      ])
    );

    // Identify assets that need rebalancing (> 5% drift)
    const rebalanceNeeded = Object.entries(drifts)
      .filter(([_, drift]) => Math.abs(drift) > 5)
      .map(([asset, drift]) => ({
        asset,
        drift,
        action: drift > 0 ? 'reduce' : 'increase',
        label: ASSET_CLASSES[asset as keyof typeof ASSET_CLASSES].label,
      }));

    // Calculate portfolio performance metrics
    const firstQuarter = chartData[0];
    const growthRate =
      ((totalValue - (firstQuarter.total as number)) /
        (firstQuarter.total as number)) *
      100;

    return {
      currentPercentages,
      drifts,
      rebalanceNeeded,
      totalValue,
      growthRate,
      riskScore: calculateRiskScore(currentPercentages),
      diversificationScore: calculateDiversificationScore(currentPercentages),
    };
  }, [chartData]);

  // Calculate risk score based on allocation
  const calculateRiskScore = (allocations: {
    [key: string]: number;
  }): number => {
    const riskWeights = {
      stocks: 0.8,
      crypto: 1.0,
      real_estate: 0.6,
      commodities: 0.7,
      bonds: 0.2,
      cash: 0.0,
    };

    return (
      Object.entries(allocations).reduce((score, [asset, percentage]) => {
        const weight = riskWeights[asset as keyof typeof riskWeights] || 0;
        return score + (percentage * weight) / 100;
      }, 0) * 100
    );
  };

  // Calculate diversification score
  const calculateDiversificationScore = (allocations: {
    [key: string]: number;
  }): number => {
    const nonZeroAllocations = Object.values(allocations).filter(
      (val) => val > 1
    );
    const maxAllocation = Math.max(...Object.values(allocations));

    // Perfect score is 100 when well diversified
    const concentrationPenalty = Math.max(0, maxAllocation - 50);
    const diversityBonus = Math.min(nonZeroAllocations.length * 15, 60);

    return Math.max(0, Math.min(100, diversityBonus - concentrationPenalty));
  };

  // Handle rebalancing
  const handleRebalance = useCallback(() => {
    console.log('Initiating portfolio rebalancing');
    // Would integrate with investment service
  }, []);

  // Handle asset class click
  const handleAssetClick = useCallback(
    (data: StackedBarDataPoint, assetKey: string, value: number) => {
      console.log('Asset clicked:', {
        period: data.label,
        asset: assetKey,
        value,
        percentage: ((value / (data.total as number)) * 100).toFixed(1),
      });
    },
    []
  );

  return (
    <div className={className}>
      {/* Allocation Overview */}
      {allocationInsights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-4 h-4 text-blue-400" />
                <p className="text-white/60 text-sm">Total Value</p>
              </div>
              <p className="text-xl font-bold text-white">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                }).format(allocationInsights.totalValue)}
              </p>
              <p className="text-white/60 text-sm">
                +{allocationInsights.growthRate.toFixed(1)}% this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-white/60 text-sm">Risk Score</p>
              </div>
              <p className="text-xl font-bold text-white">
                {allocationInsights.riskScore.toFixed(0)}/100
              </p>
              <p className="text-white/60 text-sm">
                {allocationInsights.riskScore > 70
                  ? 'High Risk'
                  : allocationInsights.riskScore > 40
                    ? 'Moderate Risk'
                    : 'Conservative'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <p className="text-white/60 text-sm">Diversification</p>
              </div>
              <p className="text-xl font-bold text-white">
                {allocationInsights.diversificationScore.toFixed(0)}/100
              </p>
              <p className="text-white/60 text-sm">
                {allocationInsights.diversificationScore > 80
                  ? 'Well Diversified'
                  : allocationInsights.diversificationScore > 60
                    ? 'Moderately Diversified'
                    : 'Concentrated'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <p className="text-white/60 text-sm">Rebalance Needed</p>
              </div>
              <p className="text-xl font-bold text-white">
                {allocationInsights.rebalanceNeeded.length}
              </p>
              <p className="text-white/60 text-sm">
                {allocationInsights.rebalanceNeeded.length > 0
                  ? 'Actions Required'
                  : 'Well Balanced'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Chart */}
      <StackedBarChart
        data={combinedData}
        series={chartSeries}
        title="Portfolio Allocation Over Time"
        subtitle={`Asset allocation ${showTargetAllocation ? 'vs target' : 'by quarter'}`}
        headerActions={
          <div className="flex gap-2">
            {showRebalanceSignals &&
              allocationInsights?.rebalanceNeeded.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRebalance}
                  className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
                >
                  <Rebalance className="w-4 h-4 mr-2" />
                  Rebalance ({allocationInsights.rebalanceNeeded.length})
                </Button>
              )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        }
        stackedBarConfig={{
          displayMode,
          colorScheme: 'custom',
          barRadius: 8,
          hoverEffects: true,
          clickableSegments: true,
          animateOnLoad: true,
          maxCategories: 6,
          groupSmallCategories: false,
        }}
        financialType={displayMode === 'percentage' ? 'percentage' : 'currency'}
        dimensions={{
          height: 400,
          responsive: true,
        }}
        timeControls={{
          show: true,
          options: ['1Y', '2Y', '5Y'],
          defaultRange: timeRange,
        }}
        onBarClick={handleAssetClick}
        accessibility={{
          ariaLabel: 'Portfolio asset allocation over time',
          keyboardNavigation: true,
        }}
      />

      {/* Rebalancing Recommendations */}
      {showRebalanceSignals &&
        allocationInsights?.rebalanceNeeded.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Rebalancing Recommendations
              </CardTitle>
              <CardDescription>
                Your portfolio has drifted from target allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allocationInsights.rebalanceNeeded.map(
                  ({ asset, drift, action, label }) => (
                    <div
                      key={asset}
                      className="flex items-center justify-between p-3 bg-white/[0.03] rounded-vueni-lg border border-white/[0.05]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-vueni-sm"
                          style={{
                            backgroundColor:
                              ASSET_CLASSES[asset as keyof typeof ASSET_CLASSES]
                                .color,
                          }}
                        />
                        <div>
                          <p className="font-medium text-white">{label}</p>
                          <p className="text-white/60 text-sm">
                            {action === 'reduce' ? 'Overweight' : 'Underweight'}{' '}
                            by {Math.abs(drift).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${action === 'reduce' ? 'text-red-400' : 'text-green-400'}`}
                        >
                          {action === 'reduce' ? 'Sell' : 'Buy'}
                        </p>
                        <p className="text-white/60 text-sm">
                          {Math.abs(drift).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-vueni-lg">
                <p className="text-blue-400 text-sm">
                  <strong>Tip:</strong> Rebalancing helps maintain your desired
                  risk level and can improve long-term returns. Consider
                  rebalancing when allocations drift more than 5% from targets.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Asset Class Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(ASSET_CLASSES).map(([key, config]) => {
          const currentPercentage =
            allocationInsights?.currentPercentages[key] || 0;
          const drift = allocationInsights?.drifts[key] || 0;

          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-vueni-sm"
                      style={{ backgroundColor: config.color }}
                    />
                    <h4 className="font-medium text-white">{config.label}</h4>
                  </div>
                  <span className="text-lg font-bold text-white">
                    {currentPercentage.toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Target:</span>
                  <span className="text-white">{config.target}%</span>
                </div>

                <div className="flex justify-between text-sm mb-3">
                  <span className="text-white/60">Drift:</span>
                  <span
                    className={`font-medium ${
                      Math.abs(drift) > 5
                        ? 'text-yellow-400'
                        : drift > 0
                          ? 'text-red-400'
                          : drift < 0
                            ? 'text-green-400'
                            : 'text-white'
                    }`}
                  >
                    {drift >= 0 ? '+' : ''}
                    {drift.toFixed(1)}%
                  </span>
                </div>

                <p className="text-white/60 text-xs">{config.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioAllocationChart;
