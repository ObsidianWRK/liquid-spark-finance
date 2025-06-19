import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Info, CheckCircle, AlertCircle, CreditCard, Calendar, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { creditScoreService } from '@/features/creditScoreService';
import { CreditScore, CreditTip } from '@/types/creditScore';
import { cn } from '@/lib/utils';

const CreditScorePage = () => {
  const navigate = useNavigate();
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [creditTips, setCreditTips] = useState<CreditTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'history' | 'tips'>('overview');
  const [scoreHistory, setScoreHistory] = useState<CreditScore[]>([]);

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

  const getScoreColorClass = (score: number) => {
    if (score >= 800) return 'text-green-500';
    if (score >= 740) return 'text-lime-500';
    if (score >= 670) return 'text-yellow-500';
    if (score >= 580) return 'text-orange-500';
    return 'text-red-500';
  };

  const CircularProgress = ({ value, maxValue, size = 200 }: { value: number; maxValue: number; size?: number }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / maxValue) * circumference;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(30 41 59)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getScoreColor(value)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-400">out of {maxValue}</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 text-white space-y-6 animate-pulse">
        <div className="h-8 bg-white/[0.05] rounded w-48"></div>
        <div className="h-64 bg-white/[0.02] rounded-3xl border border-white/[0.08]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-white/[0.02] rounded-3xl border border-white/[0.08]"></div>
          <div className="h-32 bg-white/[0.02] rounded-3xl border border-white/[0.08]"></div>
        </div>
      </div>
    );
  }

  if (!creditScore) {
    return (
      <div className="p-6 md:p-8 text-white space-y-8">
        <button
          onClick={() => navigate('/')}
          className="liquid-glass-button flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </button>

        <div className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-8 text-center">
          <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Credit Score Unavailable</h2>
          <p className="text-gray-400">We're working to get your credit score. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-6 md:p-8 space-y-8">
      {/* Back to Dashboard */}
      <button
        onClick={() => navigate('/')}
        className="liquid-glass-button flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Dashboard</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold">Credit Score</h1>
        <p className="text-gray-400 text-sm">
          Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      {/* Score Overview Card */}
      <div className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Score Display */}
          <div className="text-center flex-shrink-0">
            <CircularProgress
              value={creditScore.score}
              maxValue={850}
              size={200}
            />
            
            <div className="mt-6">
              <div className={cn('text-xl font-semibold mb-2', getScoreColorClass(creditScore.score))}>
                {creditScore.scoreRange} Credit
              </div>
              <div className="text-xs text-gray-500 bg-white/[0.05] px-3 py-1 rounded-full">
                {creditScore.provider} Score
              </div>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Credit Score Ranges</h3>
              <div className="space-y-3">
                {[
                  { range: '800-850', label: 'Excellent', color: 'bg-green-500', current: creditScore.score >= 800 && creditScore.score <= 850 },
                  { range: '740-799', label: 'Very Good', color: 'bg-lime-500', current: creditScore.score >= 740 && creditScore.score <= 799 },
                  { range: '670-739', label: 'Good', color: 'bg-yellow-500', current: creditScore.score >= 670 && creditScore.score <= 739 },
                  { range: '580-669', label: 'Fair', color: 'bg-orange-500', current: creditScore.score >= 580 && creditScore.score <= 669 },
                  { range: '300-579', label: 'Poor', color: 'bg-red-500', current: creditScore.score >= 300 && creditScore.score <= 579 }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-all',
                      item.current ? 'bg-white/[0.05] border border-white/[0.1]' : 'hover:bg-white/[0.02]'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn('w-3 h-3 rounded-full', item.color)} />
                      <span className={cn('font-medium', item.current ? 'text-white' : 'text-gray-300')}>
                        {item.label}
                      </span>
                      {item.current && (
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <span className="text-gray-400 text-sm">{item.range}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
              <h4 className="text-lg font-semibold text-white mb-2">What this means</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                With a {creditScore.scoreRange.toLowerCase()} credit score, you may qualify for most loans and credit cards with competitive rates. Continue building your credit for even better terms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/[0.05] p-1 rounded-3xl">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'factors', label: 'Credit Factors', icon: Percent },
          { id: 'history', label: 'Score History', icon: TrendingUp },
          { id: 'tips', label: 'Improvement Tips', icon: CheckCircle }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2',
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
              )}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Credit Utilization</h3>
                  <p className="text-sm text-gray-400">Payment history impact</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">23%</div>
              <div className="text-sm text-green-400">Excellent</div>
            </div>

            <div className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Payment History</h3>
                  <p className="text-sm text-gray-400">On-time payments</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-green-400">Perfect record</div>
            </div>

            <div className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Credit Age</h3>
                  <p className="text-sm text-gray-400">Average account age</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">7.2 yrs</div>
              <div className="text-sm text-yellow-400">Good length</div>
            </div>
          </div>
        )}

        {activeTab === 'factors' && (
          <div className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-6">
            <h3 className="text-xl font-bold text-white mb-6">Factors Affecting Your Score</h3>
            <div className="space-y-4">
              {creditScore.factors?.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-white">{factor.factor}</div>
                    <div className="text-sm text-gray-400 mt-1">{factor.description}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      'text-sm font-medium',
                      factor.impact === 'High' && 'text-red-400',
                      factor.impact === 'Medium' && 'text-yellow-400',
                      factor.impact === 'Low' && 'text-green-400'
                    )}>
                      {factor.impact} Impact
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-6">
            <h3 className="text-xl font-bold text-white mb-6">Score History</h3>
            <div className="text-center py-12 text-gray-400">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Score history visualization coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            {creditTips.map((tip, index) => (
              <div key={index} className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-6">
                <div className="flex items-start space-x-4">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    tip.impact === 'High' && 'bg-red-500/20',
                    tip.impact === 'Medium' && 'bg-yellow-500/20',
                    tip.impact === 'Low' && 'bg-green-500/20'
                  )}>
                    <CheckCircle className={cn(
                      'w-5 h-5',
                      tip.impact === 'High' && 'text-red-400',
                      tip.impact === 'Medium' && 'text-yellow-400',
                      tip.impact === 'Low' && 'text-green-400'
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{tip.title}</h4>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        tip.impact === 'High' && 'bg-red-500/20 text-red-400',
                        tip.impact === 'Medium' && 'bg-yellow-500/20 text-yellow-400',
                        tip.impact === 'Low' && 'bg-green-500/20 text-green-400'
                      )}>
                        {tip.impact}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{tip.description}</p>
                    <div className="mt-3 text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-blue-400 ml-1">{tip.category}</span>
                      <span className="text-gray-500 mx-2">•</span>
                      <span className="text-gray-400">Timeframe:</span>
                      <span className="text-blue-400 ml-1">{tip.timeframe}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditScorePage; 