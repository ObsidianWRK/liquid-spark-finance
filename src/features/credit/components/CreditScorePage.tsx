import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Calendar,
  Percent,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { creditScoreService } from '@/features/credit/api/creditScoreService';
import { CreditScore, CreditTip } from '@/types/creditScore';
import { cn } from '@/shared/lib/utils';
import { BackButton } from '@/shared/components/ui/BackButton';

const CreditScorePage = () => {
  const navigate = useNavigate();
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [creditTips, setCreditTips] = useState<CreditTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'factors' | 'history' | 'tips'
  >('overview');
  const [scoreHistory, setScoreHistory] = useState<CreditScore[]>([]);

  useEffect(() => {
    const loadCreditData = async () => {
      try {
        const [score, tips] = await Promise.all([
          creditScoreService.getCurrentScore(),
          creditScoreService.getCreditTips(),
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

  // Mobile-first responsive CircularProgress component
  const CircularProgress = ({
    value,
    maxValue,
  }: {
    value: number;
    maxValue: number;
  }) => {
    const radius = 70; // Fixed radius for calculations
    const circumference = 2 * Math.PI * radius;
    const progress = (value / maxValue) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        {/* Responsive SVG container */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 160 160"
            className="transform -rotate-90"
          >
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgb(30 41 59)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
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
        </div>

        {/* Responsive score display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {value}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-400">
              out of {maxValue}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="responsive-padding-md space-y-4 sm:space-y-6 animate-pulse">
          <div className="h-6 sm:h-8 bg-white/[0.05] rounded w-32 sm:w-48"></div>
          <div className="h-48 sm:h-64 md:h-80 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08]"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="h-24 sm:h-32 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08]"></div>
            <div className="h-24 sm:h-32 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08]"></div>
            <div className="h-24 sm:h-32 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] sm:block hidden"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!creditScore) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="responsive-padding-md space-y-6 sm:space-y-8">
          <BackButton
            fallbackPath="/"
            variant="default"
            label="Back to Dashboard"
          />

          <div className="bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] p-6 sm:p-8 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Credit Score Unavailable
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              We&apos;re working to get your credit score. Check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="responsive-padding-md space-y-6 sm:space-y-8">
        <BackButton
          fallbackPath="/"
          variant="default"
          label="Back to Dashboard"
        />

        {/* Header */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Credit Score
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        {/* Score Overview Card */}
        <div className="bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] p-4 sm:p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
            {/* Score Display */}
            <div className="text-center flex-shrink-0 w-full lg:w-auto">
              <CircularProgress value={creditScore.score} maxValue={850} />

              <div className="mt-4 sm:mt-6">
                <div
                  className={cn(
                    'text-lg sm:text-xl font-semibold mb-2',
                    getScoreColorClass(creditScore.score)
                  )}
                >
                  {creditScore.scoreRange} Credit
                </div>
                <div className="text-xs sm:text-sm text-gray-500 bg-white/[0.05] px-3 py-1 rounded-full inline-block">
                  {creditScore.provider} Score
                </div>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1 space-y-4 sm:space-y-6 w-full">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  Credit Score Ranges
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      range: '800-850',
                      label: 'Excellent',
                      color: 'bg-green-500',
                      current:
                        creditScore.score >= 800 && creditScore.score <= 850,
                    },
                    {
                      range: '740-799',
                      label: 'Very Good',
                      color: 'bg-lime-500',
                      current:
                        creditScore.score >= 740 && creditScore.score <= 799,
                    },
                    {
                      range: '670-739',
                      label: 'Good',
                      color: 'bg-yellow-500',
                      current:
                        creditScore.score >= 670 && creditScore.score <= 739,
                    },
                    {
                      range: '580-669',
                      label: 'Fair',
                      color: 'bg-orange-500',
                      current:
                        creditScore.score >= 580 && creditScore.score <= 669,
                    },
                    {
                      range: '300-579',
                      label: 'Poor',
                      color: 'bg-red-500',
                      current:
                        creditScore.score >= 300 && creditScore.score <= 579,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all min-h-[44px]',
                        item.current
                          ? 'bg-white/[0.05] border border-white/[0.1]'
                          : 'hover:bg-white/[0.02]'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn('w-3 h-3 rounded-full', item.color)}
                        />
                        <span
                          className={cn(
                            'font-medium text-sm sm:text-base',
                            item.current ? 'text-white' : 'text-gray-300'
                          )}
                        >
                          {item.label}
                        </span>
                        {item.current && (
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <span className="text-gray-400 text-xs sm:text-sm">
                        {item.range}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
                  What this means
                </h4>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  With a {creditScore.scoreRange.toLowerCase()} credit score,
                  you may qualify for most loans and credit cards with
                  competitive rates. Continue building your credit for even
                  better terms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile-first responsive */}
        <div className="bg-white/[0.02] rounded-2xl sm:rounded-3xl p-1 border border-white/[0.08]">
          {/* Mobile: Scrollable tabs */}
          <div className="flex sm:hidden overflow-x-auto gap-1 pb-1 scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'factors', label: 'Factors', icon: Percent },
              { id: 'history', label: 'History', icon: TrendingUp },
              { id: 'tips', label: 'Tips', icon: CheckCircle },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs whitespace-nowrap flex-shrink-0 min-h-[44px] min-w-[80px]',
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  <IconComponent className="w-3 h-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Desktop: Grid tabs */}
          <div className="hidden sm:grid grid-cols-4 gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'factors', label: 'Credit Factors', icon: Percent },
              { id: 'history', label: 'Score History', icon: TrendingUp },
              { id: 'tips', label: 'Improvement Tips', icon: CheckCircle },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all min-h-[48px]',
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4 sm:space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] p-4 sm:p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.15] hover:transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500/30">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base">
                      Credit Utilization
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Payment history impact
                    </p>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  23%
                </div>
                <div className="text-xs sm:text-sm text-green-400">
                  Excellent
                </div>
              </div>

              <div className="bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] p-4 sm:p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.15] hover:transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-green-500/30">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base">
                      Payment History
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      On-time payments
                    </p>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-green-400">
                  Perfect record
                </div>
              </div>

              <div className="bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] p-4 sm:p-6 sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.15] hover:transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-purple-500/30">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base">
                      Credit Age
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Average account age
                    </p>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  7.2 yrs
                </div>
                <div className="text-xs sm:text-sm text-yellow-400">
                  Good length
                </div>
              </div>
            </div>
          )}

          {activeTab === 'factors' && (
            <div className="bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Factors Affecting Your Score
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {creditScore.factors?.map((factor, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/[0.02] rounded-lg gap-3 sm:gap-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm sm:text-base">
                        {factor.factor}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">
                        {factor.description}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div
                        className={cn(
                          'text-xs sm:text-sm font-medium',
                          factor.impact === 'High' && 'text-red-400',
                          factor.impact === 'Medium' && 'text-yellow-400',
                          factor.impact === 'Low' && 'text-green-400'
                        )}
                      >
                        {factor.impact} Impact
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Score History
              </h3>
              <div className="text-center py-8 sm:py-12 text-gray-400">
                <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">
                  Score history visualization coming soon
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3 sm:space-y-4">
              {creditTips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.08] p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        tip.impact === 'High' && 'bg-red-500/20',
                        tip.impact === 'Medium' && 'bg-yellow-500/20',
                        tip.impact === 'Low' && 'bg-green-500/20'
                      )}
                    >
                      <CheckCircle
                        className={cn(
                          'w-5 h-5',
                          tip.impact === 'High' && 'text-red-400',
                          tip.impact === 'Medium' && 'text-yellow-400',
                          tip.impact === 'Low' && 'text-green-400'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <h4 className="font-semibold text-white text-sm sm:text-base">
                          {tip.title}
                        </h4>
                        <span
                          className={cn(
                            'text-xs px-2 py-1 rounded-full w-fit',
                            tip.impact === 'High' &&
                              'bg-red-500/20 text-red-400',
                            tip.impact === 'Medium' &&
                              'bg-yellow-500/20 text-yellow-400',
                            tip.impact === 'Low' &&
                              'bg-green-500/20 text-green-400'
                          )}
                        >
                          {tip.impact}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3">
                        {tip.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-gray-400">Category:</span>
                          <span className="text-blue-400 ml-1">
                            {tip.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Timeframe:</span>
                          <span className="text-blue-400 ml-1">
                            {tip.timeframe}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditScorePage;
