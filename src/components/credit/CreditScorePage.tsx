import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedCircularProgress from '../insights/components/AnimatedCircularProgress';
import { creditScoreService } from '@/services/creditScoreService';
import { CreditScore, CreditTip } from '@/types/creditScore';

const CreditScorePage = () => {
  const navigate = useNavigate();
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [creditTips, setCreditTips] = useState<CreditTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'history' | 'tips'>('overview');

  useEffect(() => {
    const loadCreditData = async () => {
      try {
        const [score, tips] = await Promise.all([
          creditScoreService.getCurrentScore(),
          creditScoreService.getCreditTips()
        ]);
        setCreditScore(score);
        setCreditTips(tips);
      } catch (error) {
        console.error('Failed to load credit data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCreditData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 800) return '#22c55e'; // Excellent
    if (score >= 740) return '#84cc16'; // Very Good  
    if (score >= 670) return '#eab308'; // Good
    if (score >= 580) return '#f97316'; // Fair
    return '#ef4444'; // Poor
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f97316';
      case 'Low': return '#22c55e';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-48"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-slate-700 rounded"></div>
            <div className="h-32 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!creditScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white mb-6 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="liquid-glass-card p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Credit Score Unavailable</h2>
            <p className="text-slate-400">We're working to get your credit score. Check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Credit Score</h1>
            <p className="text-slate-400 mt-1">
              Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Score Overview Card */}
        <div className="liquid-glass-card p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Score Display */}
            <div className="text-center">
              <AnimatedCircularProgress
                value={creditScore.score}
                maxValue={850}
                color={getScoreColor(creditScore.score)}
                size={200}
                strokeWidth={16}
              />
              
              <div className="mt-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {creditScore.score}
                </div>
                <div 
                  className="text-xl font-semibold mb-3"
                  style={{ color: getScoreColor(creditScore.score) }}
                >
                  {creditScore.scoreRange} Credit
                </div>
                <div className="text-xs text-slate-400 bg-slate-800/30 px-3 py-1 rounded-full">
                  {creditScore.provider} Score
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Score Range</h3>
                <div className="space-y-2">
                  {[
                    { range: '800-850', label: 'Excellent', color: '#22c55e' },
                    { range: '740-799', label: 'Very Good', color: '#84cc16' },
                    { range: '670-739', label: 'Good', color: '#eab308' },
                    { range: '580-669', label: 'Fair', color: '#f97316' },
                    { range: '300-579', label: 'Poor', color: '#ef4444' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-300">{item.label}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{item.range}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What this means</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  With a {creditScore.scoreRange.toLowerCase()} credit score, you may qualify for most loans and credit cards with competitive rates. Continue building your credit for even better terms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800/30 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'factors', label: 'Credit Factors' },
            { id: 'history', label: 'Score History' },
            { id: 'tips', label: 'Improvement Tips' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'factors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creditScore.factors.map((factor, index) => (
              <div key={index} className="liquid-glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {factor.status === 'Positive' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : factor.status === 'Negative' ? (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-400" />
                    )}
                    <h3 className="text-white font-semibold">{factor.factor}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{factor.percentage}%</span>
                </div>
                
                <p className="text-slate-400 text-sm mb-3">{factor.description}</p>
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${getImpactColor(factor.impact)}20`,
                      color: getImpactColor(factor.impact)
                    }}
                  >
                    {factor.impact} Impact
                  </span>
                  <span 
                    className="text-xs font-medium"
                    style={{ color: factor.status === 'Positive' ? '#22c55e' : factor.status === 'Negative' ? '#ef4444' : '#64748b' }}
                  >
                    {factor.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creditTips.map((tip) => (
              <div key={tip.id} className="liquid-glass-card p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div 
                    className="w-2 h-2 rounded-full mt-2"
                    style={{ backgroundColor: getImpactColor(tip.impact) }}
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{tip.title}</h3>
                    <p className="text-slate-400 text-sm">{tip.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span 
                    className="font-medium px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${getImpactColor(tip.impact)}20`,
                      color: getImpactColor(tip.impact)
                    }}
                  >
                    {tip.impact} Impact
                  </span>
                  <span className="text-slate-400">{tip.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="liquid-glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Score History</h3>
            <div className="space-y-4">
              {creditScore.history.slice(-6).map((point, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="text-slate-300 font-medium">
                      {new Date(point.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="text-white font-bold text-lg">
                      {point.score}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {point.change !== 0 && (
                      <>
                        {point.change > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span 
                          className={`text-sm font-medium ${
                            point.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {point.change > 0 ? '+' : ''}{point.change}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditScorePage; 