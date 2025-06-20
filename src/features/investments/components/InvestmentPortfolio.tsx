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
import { investmentService } from '@/features/investments/api/investmentService';
import { Portfolio, Holding } from '@/types/investments';
import { cn } from '@/shared/lib/utils';

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
    <div className="space-y-4 sm:space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 sm:p-6 card-hover">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
          <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          Portfolio Summary
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-2">
            <p className="text-white/60 text-xs sm:text-sm">Total Value</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">{formatCurrency(portfolio.totalValue)}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-white/60 text-xs sm:text-sm">Total Gain/Loss</p>
            <div className="space-y-1">
              <p className={cn("text-lg sm:text-xl lg:text-2xl font-bold truncate", getPerformanceColor(portfolio.totalGainLoss))}>
                {formatCurrency(portfolio.totalGainLoss)}
              </p>
              <p className={cn("text-xs sm:text-sm", getPerformanceColor(portfolio.totalGainLossPercent))}>
                {formatPercentage(portfolio.totalGainLossPercent)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <p className="text-white/60 text-xs sm:text-sm">Cost Basis</p>
            <p className="text-lg sm:text-xl font-bold text-white truncate">{formatCurrency(portfolio.totalCostBasis)}</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 sm:p-6 card-hover">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-3">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          Performance Metrics
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(portfolio.performance.returns).map(([period, value]) => (
            <div key={period} className="text-center p-2 sm:p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
              <p className="text-white/60 text-xs sm:text-sm capitalize truncate">{period.replace('d', ' Days')}</p>
              <p className={cn("text-sm sm:text-base lg:text-lg font-bold truncate", getPerformanceColor(value))}>
                {formatPercentage(value)}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/[0.08]">
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <p className="text-white/60 text-xs sm:text-sm">Sharpe Ratio</p>
            <p className="text-base sm:text-lg font-bold text-white">{portfolio.performance.sharpeRatio.toFixed(2)}</p>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <p className="text-white/60 text-xs sm:text-sm">Volatility</p>
            <p className="text-base sm:text-lg font-bold text-white">{portfolio.performance.volatility.toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05] sm:col-span-3 lg:col-span-1">
            <p className="text-white/60 text-xs sm:text-sm">Max Drawdown</p>
            <p className="text-base sm:text-lg font-bold text-red-400">{portfolio.performance.maxDrawdown.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 sm:p-6 card-hover">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-3">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          Asset Allocation
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <p className="text-white/60 text-xs sm:text-sm">Stocks</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-blue-400">{portfolio.allocation.stocks.toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <p className="text-white/60 text-xs sm:text-sm">Bonds</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-green-400">{portfolio.allocation.bonds.toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <p className="text-white/60 text-xs sm:text-sm">Cash</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-yellow-400">{portfolio.allocation.cash.toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <p className="text-white/60 text-xs sm:text-sm">Other</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-white/60">{portfolio.allocation.other.toFixed(1)}%</p>
          </div>
        </div>

        {/* Sector Breakdown */}
        {Object.keys(portfolio.allocation.sectors).length > 0 && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/[0.08]">
            <p className="text-white/80 font-medium mb-3 text-sm sm:text-base">Sector Breakdown</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {Object.entries(portfolio.allocation.sectors).map(([sector, percentage]) => (
                <div key={sector} className="flex justify-between p-2 sm:p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                  <span className="text-white/60 text-xs sm:text-sm truncate flex-1">{sector}</span>
                  <span className="text-white text-xs sm:text-sm font-medium ml-2">{percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risk Metrics */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 sm:p-6 card-hover">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          Risk Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <p className="text-white/60 text-xs sm:text-sm mb-2">Concentration Risk</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/[0.05] rounded-full h-2 sm:h-3">
                <div 
                  className="bg-red-400 h-2 sm:h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(portfolio.riskMetrics.concentrationRisk, 100)}%` }}
                ></div>
              </div>
              <span className="text-white text-xs sm:text-sm font-medium min-w-[3rem]">{portfolio.riskMetrics.concentrationRisk.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-white/60 text-xs sm:text-sm mb-2">Sector Concentration</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/[0.05] rounded-full h-2 sm:h-3">
                <div 
                  className="bg-orange-400 h-2 sm:h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(portfolio.riskMetrics.sectorConcentration, 100)}%` }}
                ></div>
              </div>
              <span className="text-white text-xs sm:text-sm font-medium min-w-[3rem]">{portfolio.riskMetrics.sectorConcentration.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <p className="text-white/60 text-xs sm:text-sm">Value at Risk (95%)</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-red-400 truncate">{formatCurrency(portfolio.riskMetrics.var95)}</p>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <p className="text-white/60 text-xs sm:text-sm">Value at Risk (99%)</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-red-400 truncate">{formatCurrency(portfolio.riskMetrics.var99)}</p>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05] sm:col-span-3 lg:col-span-1">
            <p className="text-white/60 text-xs sm:text-sm">Correlation</p>
            <p className="text-base sm:text-lg font-bold text-white">{portfolio.riskMetrics.correlation.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAllocation = () => (
    <div className="space-y-6">
      {/* Asset Allocation Overview */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-400" />
          Asset Allocation Management
        </h3>
        
        {/* Main Allocation Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-blue-400">{portfolio.allocation.stocks.toFixed(0)}%</span>
            </div>
            <p className="text-white/60 text-sm mb-1">Stocks</p>
            <p className="text-blue-400 font-semibold text-xs sm:text-sm">{formatCurrency(portfolio.totalValue * portfolio.allocation.stocks / 100)}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-green-400">{portfolio.allocation.bonds.toFixed(0)}%</span>
            </div>
            <p className="text-white/60 text-sm mb-1">Bonds</p>
            <p className="text-green-400 font-semibold text-xs sm:text-sm">{formatCurrency(portfolio.totalValue * portfolio.allocation.bonds / 100)}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-yellow-400">{portfolio.allocation.cash.toFixed(0)}%</span>
            </div>
            <p className="text-white/60 text-sm mb-1">Cash</p>
            <p className="text-yellow-400 font-semibold text-xs sm:text-sm">{formatCurrency(portfolio.totalValue * portfolio.allocation.cash / 100)}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-purple-400">{portfolio.allocation.other.toFixed(0)}%</span>
            </div>
            <p className="text-white/60 text-sm mb-1">Other</p>
            <p className="text-purple-400 font-semibold text-xs sm:text-sm">{formatCurrency(portfolio.totalValue * portfolio.allocation.other / 100)}</p>
          </div>
        </div>

        {/* Allocation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Rebalance Portfolio</span>
            <span className="sm:hidden">Rebalance</span>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Asset Class</span>
            <span className="sm:hidden">Add Asset</span>
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Optimize Allocation</span>
            <span className="sm:hidden">Optimize</span>
          </button>
        </div>
      </div>

      {/* Sector Allocation Details */}
      {Object.keys(portfolio.allocation.sectors).length > 0 && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <PieChart className="w-5 h-5 text-green-400" />
            Sector Allocation
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(portfolio.allocation.sectors).map(([sector, percentage]) => (
              <div key={sector} className="flex items-center justify-between p-3 sm:p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white text-sm sm:text-base truncate">{sector}</p>
                    <p className="text-white/60 text-xs sm:text-sm">{formatCurrency(portfolio.totalValue * percentage / 100)}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm sm:text-lg font-bold text-white">{percentage.toFixed(1)}%</p>
                  <div className="w-12 sm:w-16 bg-white/[0.05] rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk vs Return Analysis */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Risk vs Return Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">Conservative</p>
            <p className="text-base sm:text-lg font-bold text-green-400">Low Risk</p>
            <p className="text-white/60 text-xs">20% Stocks, 70% Bonds, 10% Cash</p>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">Current Allocation</p>
            <p className="text-base sm:text-lg font-bold text-blue-400">Moderate Risk</p>
            <p className="text-white/60 text-xs">{portfolio.allocation.stocks.toFixed(0)}% Stocks, {portfolio.allocation.bonds.toFixed(0)}% Bonds</p>
          </div>
          <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">Aggressive</p>
            <p className="text-base sm:text-lg font-bold text-red-400">High Risk</p>
            <p className="text-white/60 text-xs">80% Stocks, 15% Bonds, 5% Cash</p>
          </div>
        </div>
      </div>

      {/* Allocation History & Rebalancing */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Recent Allocation Changes
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-white">Increased stock allocation</p>
              <p className="text-white/60 text-sm">Rebalanced on Dec 15, 2024</p>
            </div>
          </div>
          <span className="text-blue-400 font-bold">+5%</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-white">Added bond diversification</p>
              <p className="text-white/60 text-sm">Rebalanced on Dec 1, 2024</p>
            </div>
          </div>
          <span className="text-green-400 font-bold">+3%</span>
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
          className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 card-hover"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-white text-sm sm:text-base">{holding.symbol}</h4>
                  <p className="text-white/60 text-xs sm:text-sm truncate">{holding.name}</p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-lg border font-medium",
                      getAssetTypeColor(holding.assetType)
                    )}>
                      {holding.assetType.toUpperCase()}
                    </span>
                    {holding.sector && (
                      <span className="text-xs text-white/60 truncate">{holding.sector}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:block text-right">
                  <div>
                    <p className="font-bold text-white text-sm sm:text-base">{formatCurrency(holding.marketValue)}</p>
                    <p className={cn("text-xs sm:text-sm", getPerformanceColor(holding.unrealizedGainLoss))}>
                      {formatCurrency(holding.unrealizedGainLoss)} ({formatPercentage(holding.unrealizedGainLossPercent)})
                    </p>
                    <div className="flex sm:block items-center gap-1 sm:gap-0 mt-1 text-xs text-white/60">
                      <span>{holding.quantity} shares</span>
                      <span className="sm:block inline">@{formatCurrency(holding.currentPrice)}</span>
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
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Navigation Tabs */}
      <div className="bg-white/[0.02] rounded-xl p-1 border border-white/[0.08]">
        {/* Mobile: Scrollable tabs */}
        <div className="flex sm:hidden overflow-x-auto gap-1 pb-1 scrollbar-hide">
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
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs whitespace-nowrap flex-shrink-0",
                selectedView === id
                  ? "bg-blue-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
        
        {/* Desktop: Grid tabs */}
        <div className="hidden sm:grid grid-cols-4 gap-1">
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
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm",
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
      </div>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'holdings' && renderHoldings()}
      {selectedView === 'performance' && renderOverview()} {/* Reuse overview for now */}
      {selectedView === 'allocation' && renderAllocation()}
    </div>
  );
};

export default InvestmentPortfolio;