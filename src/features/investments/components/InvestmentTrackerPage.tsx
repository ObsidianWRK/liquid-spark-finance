import React, { useEffect, useState } from 'react';
import { investmentService } from '@/features/investments/api/investmentService';
import { Portfolio } from '@/types/investments';
import InvestmentPortfolio from './InvestmentPortfolio';
import {
  TrendingUp,
  Plus,
  DollarSign,
  PieChart as PieIcon,
  Activity,
  Target,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { BackButton } from '@/shared/components/ui/BackButton';

const InvestmentTrackerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      // Use demo family ID
      const familyId = 'demo_family';
      const [portfolioData, recs] = await Promise.all([
        investmentService.getFamilyPortfolio(familyId),
        investmentService.getInvestmentRecommendations(familyId),
      ]);
      setPortfolio(portfolioData);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load investment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amt);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="responsive-padding-md space-y-4 sm:space-y-6">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-white/[0.05] rounded w-48 sm:w-64 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-4 sm:p-6"
                >
                  <div className="h-5 sm:h-6 bg-white/[0.05] rounded w-24 sm:w-32 mb-2"></div>
                  <div className="h-6 sm:h-8 bg-white/[0.05] rounded w-16 sm:w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="responsive-padding-md space-y-6 sm:space-y-8">
        {/* Back Button */}
        <BackButton
          fallbackPath="/"
          variant="default"
          label="Back to Dashboard"
          className="mb-6"
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
              <span className="truncate">Investment Portfolio</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Track your investments, analyze performance, and manage risk
            </p>
          </div>
          <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-vueni-lg transition-colors flex items-center justify-center gap-2 min-h-[48px]">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Add Investment</span>
          </button>
        </div>

        {/* Quick Stats */}
        {portfolio && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-4 sm:p-6 card-hover">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-vueni-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <p className="text-white/60 text-sm sm:text-base font-medium">
                  Portfolio Value
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white truncate">
                {formatCurrency(portfolio.totalValue)}
              </p>
            </div>

            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-4 sm:p-6 card-hover">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-vueni-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <p className="text-white/60 text-sm sm:text-base font-medium">
                  Total Gain/Loss
                </p>
              </div>
              <div className="space-y-1">
                <p
                  className={cn(
                    'text-xl sm:text-2xl font-bold truncate',
                    portfolio.totalGainLoss >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  )}
                >
                  {formatCurrency(portfolio.totalGainLoss)}
                </p>
                <p
                  className={cn(
                    'text-xs sm:text-sm',
                    portfolio.totalGainLossPercent >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  )}
                >
                  {portfolio.totalGainLossPercent >= 0 ? '+' : ''}
                  {portfolio.totalGainLossPercent.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-4 sm:p-6 card-hover">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-vueni-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <p className="text-white/60 text-sm sm:text-base font-medium">
                  Asset Allocation
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-bold text-white">
                  {portfolio.allocation.stocks.toFixed(0)}% Stocks
                </p>
                <p className="text-xs sm:text-sm text-white/60">
                  {portfolio.allocation.bonds.toFixed(0)}% Bonds,{' '}
                  {portfolio.allocation.other.toFixed(0)}% Other
                </p>
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-4 sm:p-6 sm:col-span-2 lg:col-span-1 card-hover">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-vueni-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <p className="text-white/60 text-sm sm:text-base font-medium">
                  Risk Score
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                  {portfolio.riskMetrics.concentrationRisk.toFixed(0)}
                </p>
                <p className="text-xs sm:text-sm text-white/60">
                  Concentration Risk
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Investment Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-4 sm:p-6 card-hover">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              Investment Recommendations
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="bg-white/[0.03] rounded-vueni-lg border border-white/[0.05] p-4 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 sm:mb-4 gap-3 lg:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span
                          className={cn(
                            'text-xs px-2 py-1 rounded-vueni-lg border font-medium w-fit',
                            getPriorityColor(rec.priority)
                          )}
                        >
                          {rec.priority.toUpperCase()}
                        </span>
                        <h3 className="font-semibold text-white text-sm sm:text-base">
                          {rec.title}
                        </h3>
                      </div>
                      <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                        {rec.description}
                      </p>

                      <div className="space-y-2">
                        <p className="text-white/80 text-xs sm:text-sm font-medium">
                          Action Items:
                        </p>
                        <ul className="space-y-1 sm:space-y-2">
                          {rec.actionItems.map(
                            (item: string, itemIndex: number) => (
                              <li
                                key={itemIndex}
                                className="text-white/60 text-xs sm:text-sm flex items-start gap-2"
                              >
                                <span className="text-blue-400 mt-0.5 flex-shrink-0">
                                  •
                                </span>
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="text-left lg:text-right lg:flex-shrink-0">
                      <p className="text-green-400 text-xs sm:text-sm font-medium">
                        {rec.potentialBenefit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Component */}
        <InvestmentPortfolio familyId="demo_family" />
      </div>
    </div>
  );
};

export default InvestmentTrackerPage;
