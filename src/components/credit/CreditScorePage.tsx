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
      <div className="min-h-screen w-full text-white">
        <div className="fixed inset-0 z-0 optimized-bg" />
        <div className="relative z-10 min-h-screen w-full">
          <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
            <div className="w-full space-y-6 animate-pulse">
              <div className="h-8 bg-slate-700/50 rounded w-48"></div>
              <div className="h-64 liquid-glass-card"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 liquid-glass-card"></div>
                <div className="h-32 liquid-glass-card"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!creditScore) {
    return (
      <div className="min-h-screen w-full text-white">
        <div className="fixed inset-0 z-0 optimized-bg" />
        <div className="relative z-10 min-h-screen w-full">
          <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white">
      {/* Optimized Background */}
      <div className="fixed inset-0 z-0 optimized-bg" />
      
      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen w-full pb-24">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-12 space-y-8">
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
              <h1 className="text-3xl font-bold text-white tracking-wide">Credit Score</h1>
              <p className="text-white/60 mt-1">
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
                  <div className="text-xs text-white/60 bg-white/10 px-3 py-1 rounded-full">
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
                          <span className="text-white/80">{item.label}</span>
                        </div>
                        <span className="text-white/60 text-sm">{item.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What this means</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    With a {creditScore.scoreRange.toLowerCase()} credit score, you may qualify for most loans and credit cards with competitive rates. Continue building your credit for even better terms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 p-1 rounded-lg">
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
                    : 'text-white/70 hover:text-white hover:bg-white/5'
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
                    <h3 className="text-lg font-semibold text-white">{factor.factor}</h3>
                    <span 
                      className="text-sm font-medium px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${getImpactColor(factor.impact)}20`,
                        color: getImpactColor(factor.impact)
                      }}
                    >
                      {factor.impact} Impact
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-4">{factor.description}</p>
                  <div className="flex items-center">
                    {factor.status === 'Positive' ? (
                      <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="text-sm text-white/60">
                      {factor.status === 'Positive' ? 'Helping your score' : 'Hurting your score'}
                    </span>
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
                    <span className="text-white/70">{new Date(point.date).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium">{point.score}</span>
                      {index > 0 && (
                        <div className="flex items-center">
                          {point.score > creditScore.history[creditScore.history.length - 7 + index]?.score ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creditTips.map((tip, index) => (
                <div key={index} className="liquid-glass-card p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tip.category === 'Payment' ? 'bg-green-500/20' :
                      tip.category === 'Utilization' ? 'bg-blue-500/20' :
                      tip.category === 'Length' ? 'bg-purple-500/20' : 'bg-orange-500/20'
                    }`}>
                      <CheckCircle className={`w-4 h-4 ${
                        tip.category === 'Payment' ? 'text-green-400' :
                        tip.category === 'Utilization' ? 'text-blue-400' :
                        tip.category === 'Length' ? 'text-purple-400' : 'text-orange-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{tip.title}</h4>
                      <p className="text-white/70 text-sm mb-3">{tip.description}</p>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                        tip.impact === 'High' ? 'bg-green-500/20 text-green-400' :
                        tip.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {tip.impact} Impact
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credit Utilization */}
              <div className="liquid-glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-4">Credit Utilization</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Current Utilization</span>
                    <span className="text-white font-medium">23%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                  <p className="text-white/60 text-sm">Recommended to keep below 30%</p>
                </div>
              </div>

              {/* Payment History */}
              <div className="liquid-glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-4">Payment History</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white font-medium">100% On-time Payments</span>
                </div>
                <p className="text-white/60 text-sm">Great job! Keep making payments on time.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditScorePage; 