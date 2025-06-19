import React, { useEffect, useState } from 'react';
import { investmentService } from '@/services/investmentService';
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
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
        investmentService.getInvestmentRecommendations(familyId)
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
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amt);

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
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/[0.05] rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
                <div className="h-6 bg-white/[0.05] rounded w-32 mb-2"></div>
                <div className="h-8 bg-white/[0.05] rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Dashboard</span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            Investment Portfolio
          </h1>
          <p className="text-white/60 mt-2">Track your investments, analyze performance, and manage risk</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Investment
        </button>
      </div>

      {/* Quick Stats */}
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <p className="text-white/60 text-sm">Portfolio Value</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(portfolio.totalValue)}</p>
          </div>
          
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <p className="text-white/60 text-sm">Total Gain/Loss</p>
            </div>
            <p className={cn("text-2xl font-bold", portfolio.totalGainLoss >= 0 ? "text-green-400" : "text-red-400")}>
              {formatCurrency(portfolio.totalGainLoss)}
            </p>
            <p className={cn("text-sm", portfolio.totalGainLossPercent >= 0 ? "text-green-400" : "text-red-400")}>
              {portfolio.totalGainLossPercent >= 0 ? '+' : ''}{portfolio.totalGainLossPercent.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <p className="text-white/60 text-sm">Asset Allocation</p>
            </div>
            <p className="text-lg font-bold text-white">{portfolio.allocation.stocks.toFixed(0)}% Stocks</p>
            <p className="text-sm text-white/60">{portfolio.allocation.bonds.toFixed(0)}% Bonds, {portfolio.allocation.other.toFixed(0)}% Other</p>
          </div>
          
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <p className="text-white/60 text-sm">Risk Score</p>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{portfolio.riskMetrics.concentrationRisk.toFixed(0)}</p>
            <p className="text-sm text-white/60">Concentration Risk</p>
          </div>
        </div>
      )}

      {/* Investment Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-400" />
            Investment Recommendations
          </h2>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white/[0.03] rounded-xl border border-white/[0.05] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-lg border font-medium",
                        getPriorityColor(rec.priority)
                      )}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <h3 className="font-semibold text-white">{rec.title}</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{rec.description}</p>
                    
                    <div className="space-y-1">
                      <p className="text-white/80 text-sm font-medium">Action Items:</p>
                      <ul className="space-y-1">
                        {rec.actionItems.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="text-white/60 text-sm flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-medium">{rec.potentialBenefit}</p>
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
  );
};

export default InvestmentTrackerPage; 