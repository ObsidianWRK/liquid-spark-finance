import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  Plus,
  MoreHorizontal,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { investmentService } from '@/services/investmentService';
import { Portfolio, Holding } from '@/types/investments';
import { cn } from '@/lib/utils';

interface InvestmentPortfolioProps {
  familyId: string;
  className?: string;
}

const InvestmentPortfolio = ({ familyId, className }: InvestmentPortfolioProps) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'holdings' | 'performance' | 'allocation'>('overview');

  useEffect(() => {
    loadPortfolio();
  }, [familyId]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const portfolioData = await investmentService.getFamilyPortfolio(familyId);
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-white/60';
  };

  const getHoldingIcon = (assetType: string) => {
    switch (assetType) {
      case 'stock':
        return <TrendingUp className="w-4 h-4" />;
      case 'bond':
        return <Shield className="w-4 h-4" />;
      case 'etf':
      case 'mutual_fund':
        return <PieChart className="w-4 h-4" />;
      case 'crypto':
        return <Zap className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getAssetTypeColor = (assetType: string) => {
    switch (assetType) {
      case 'stock':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'bond':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'etf':
      case 'mutual_fund':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'crypto':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-white/[0.05] rounded w-32"></div>
              <div className="h-6 bg-white/[0.05] rounded w-24"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-white/[0.05] rounded w-full"></div>
              <div className="h-4 bg-white/[0.05] rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className={cn("bg-white/[0.02] rounded-2xl border border-white/[0.08] p-12 text-center", className)}>
        <PieChart className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Investment Portfolio Found</h3>
        <p className="text-white/60 mb-6">Start building your investment portfolio by linking investment accounts.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors">
          Link Investment Account
        </button>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <PieChart className="w-6 h-6 text-blue-400" />
          Portfolio Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-white/60 text-sm">Total Value</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(portfolio.totalValue)}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-white/60 text-sm">Total Gain/Loss</p>
            <p className={cn("text-2xl font-bold", getPerformanceColor(portfolio.totalGainLoss))}>
              {formatCurrency(portfolio.totalGainLoss)}
            </p>
            <p className={cn("text-sm", getPerformanceColor(portfolio.totalGainLossPercent))}>
              {formatPercentage(portfolio.totalGainLossPercent)}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-white/60 text-sm">Cost Basis</p>
            <p className="text-xl font-bold text-white">{formatCurrency(portfolio.totalCostBasis)}</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Performance Metrics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(portfolio.performance.returns).map(([period, value]) => (
            <div key={period} className="text-center">
              <p className="text-white/60 text-sm capitalize">{period.replace('d', ' Days')}</p>
              <p className={cn("text-lg font-bold", getPerformanceColor(value))}>
                {formatPercentage(value)}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
          <div className="text-center">
            <p className="text-white/60 text-sm">Sharpe Ratio</p>
            <p className="text-lg font-bold text-white">{portfolio.performance.sharpeRatio.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Volatility</p>
            <p className="text-lg font-bold text-white">{portfolio.performance.volatility.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Max Drawdown</p>
            <p className="text-lg font-bold text-red-400">{portfolio.performance.maxDrawdown.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <Target className="w-5 h-5 text-blue-400" />
          Asset Allocation
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-white/60 text-sm">Stocks</p>
            <p className="text-xl font-bold text-blue-400">{portfolio.allocation.stocks.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Bonds</p>
            <p className="text-xl font-bold text-green-400">{portfolio.allocation.bonds.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Cash</p>
            <p className="text-xl font-bold text-yellow-400">{portfolio.allocation.cash.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Other</p>
            <p className="text-xl font-bold text-white/60">{portfolio.allocation.other.toFixed(1)}%</p>
          </div>
        </div>

        {/* Sector Breakdown */}
        {Object.keys(portfolio.allocation.sectors).length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/[0.08]">
            <p className="text-white/80 font-medium mb-3">Sector Breakdown</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(portfolio.allocation.sectors).map(([sector, percentage]) => (
                <div key={sector} className="flex justify-between">
                  <span className="text-white/60 text-sm">{sector}</span>
                  <span className="text-white text-sm font-medium">{percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risk Metrics */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Risk Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-white/60 text-sm mb-2">Concentration Risk</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/[0.05] rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full" 
                  style={{ width: `${Math.min(portfolio.riskMetrics.concentrationRisk, 100)}%` }}
                ></div>
              </div>
              <span className="text-white text-sm font-medium">{portfolio.riskMetrics.concentrationRisk.toFixed(1)}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-white/60 text-sm mb-2">Sector Concentration</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/[0.05] rounded-full h-2">
                <div 
                  className="bg-orange-400 h-2 rounded-full" 
                  style={{ width: `${Math.min(portfolio.riskMetrics.sectorConcentration, 100)}%` }}
                ></div>
              </div>
              <span className="text-white text-sm font-medium">{portfolio.riskMetrics.sectorConcentration.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-white/60 text-sm">Value at Risk (95%)</p>
            <p className="text-lg font-bold text-red-400">{formatCurrency(portfolio.riskMetrics.var95)}</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Value at Risk (99%)</p>
            <p className="text-lg font-bold text-red-400">{formatCurrency(portfolio.riskMetrics.var99)}</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Correlation</p>
            <p className="text-lg font-bold text-white">{portfolio.riskMetrics.correlation.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHoldings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Holdings</h3>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Holding
        </button>
      </div>

      {portfolio.holdings.map((holding) => (
        <div
          key={holding.id}
          className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 hover:bg-white/[0.03] transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            {/* Symbol & Icon */}
            <div className="flex-shrink-0">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                getAssetTypeColor(holding.assetType)
              )}>
                {getHoldingIcon(holding.assetType)}
              </div>
            </div>

            {/* Holding Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{holding.symbol}</h4>
                  <p className="text-white/60 text-sm truncate">{holding.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-lg border font-medium",
                      getAssetTypeColor(holding.assetType)
                    )}>
                      {holding.assetType.toUpperCase()}
                    </span>
                    {holding.sector && (
                      <span className="text-xs text-white/60">{holding.sector}</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-white">{formatCurrency(holding.marketValue)}</p>
                  <p className={cn("text-sm", getPerformanceColor(holding.unrealizedGainLoss))}>
                    {formatCurrency(holding.unrealizedGainLoss)} ({formatPercentage(holding.unrealizedGainLossPercent)})
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                    <span>{holding.quantity} shares</span>
                    <span>@{formatCurrency(holding.currentPrice)}</span>
                  </div>
                </div>

                {/* Action Menu */}
                <div className="flex-shrink-0 ml-2">
                  <button className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white/[0.02] rounded-xl p-1 border border-white/[0.08]">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'holdings', label: 'Holdings', icon: TrendingUp },
          { id: 'performance', label: 'Performance', icon: BarChart3 },
          { id: 'allocation', label: 'Allocation', icon: Target }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedView(id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all",
              selectedView === id
                ? "bg-blue-500 text-white"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'holdings' && renderHoldings()}
      {selectedView === 'performance' && renderOverview()} {/* Reuse overview for now */}
      {selectedView === 'allocation' && renderOverview()} {/* Reuse overview for now */}
    </div>
  );
};

export default InvestmentPortfolio;