import React, { useEffect, useState } from 'react';
import SimpleGlassCard from '@/components/ui/SimpleGlassCard';
import { colors } from '@/theme/colors';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Info
} from 'lucide-react';

interface CreditScoreData {
  score: number;
  maxScore: number;
  change: {
    amount: number;
    period: string;
  };
  utilization: number;
  rating: string;
  nextReviewDate: string;
}

interface CleanCreditScoreCardProps {
  creditData?: CreditScoreData;
  onViewReport?: () => void;
  className?: string;
}

const CleanCreditScoreCard = ({ 
  creditData = {
    score: 750,
    maxScore: 850,
    change: { amount: 15, period: 'last month' },
    utilization: 23,
    rating: 'Good',
    nextReviewDate: '2025-07-15'
  },
  onViewReport,
  className 
}: CleanCreditScoreCardProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedUtilization, setAnimatedUtilization] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(creditData.score);
      setAnimatedUtilization(creditData.utilization);
    }, 300);
    return () => clearTimeout(timer);
  }, [creditData.score, creditData.utilization]);

  const getScoreColor = (score: number) => {
    if (score >= 740) return colors.status.success;
    if (score >= 670) return colors.status.warning;
    return colors.status.error;
  };

  const getScoreRating = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const scorePercentage = (animatedScore / creditData.maxScore) * 100;
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  return (
    <SimpleGlassCard className={`p-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/[0.06]">
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Credit Score</h3>
            <p className="text-white/60 text-sm">Updated weekly</p>
          </div>
        </div>
        
        <button className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.08] transition-colors">
          <Info className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Credit Score Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getScoreColor(creditData.score)}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div 
              className="text-3xl font-bold"
              style={{ color: getScoreColor(creditData.score) }}
            >
              {animatedScore}
            </div>
            <div className="text-xs text-white/60">
              out of {creditData.maxScore}
            </div>
          </div>
        </div>
      </div>

      {/* Score Rating */}
      <div className="text-center mb-6">
        <div 
          className="text-lg font-semibold mb-1"
          style={{ color: getScoreColor(creditData.score) }}
        >
          {getScoreRating(creditData.score)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <div 
            className="flex items-center gap-1"
            style={{ 
              color: creditData.change.amount >= 0 ? colors.status.success : colors.status.error 
            }}
          >
            {creditData.change.amount >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {creditData.change.amount >= 0 ? '+' : ''}{creditData.change.amount}
            </span>
          </div>
          <span className="text-white/60 text-sm">
            {creditData.change.period}
          </span>
        </div>
      </div>

      {/* Credit Utilization */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">Credit Utilization</span>
          <span className="text-sm font-medium text-white">
            {animatedUtilization}%
          </span>
        </div>
        
        <div className="w-full bg-white/[0.06] rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${animatedUtilization}%`,
              backgroundColor: animatedUtilization <= 30 
                ? colors.status.success 
                : animatedUtilization <= 50 
                ? colors.status.warning 
                : colors.status.error
            }}
          />
        </div>
        
        <p className="text-xs text-white/50 mt-1">
          {animatedUtilization <= 30 ? 'Excellent' : animatedUtilization <= 50 ? 'Good' : 'High'} utilization
        </p>
      </div>

      {/* Action Button */}
      <button 
        onClick={onViewReport}
        className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.08] transition-all duration-200 group"
      >
        <span className="text-white font-medium">View Full Report</span>
        <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Next Review */}
      <div className="mt-4 pt-4 border-t border-white/[0.08]">
        <p className="text-xs text-white/50 text-center">
          Next review: {new Date(creditData.nextReviewDate).toLocaleDateString()}
        </p>
      </div>
    </SimpleGlassCard>
  );
};

export default CleanCreditScoreCard; 