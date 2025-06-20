import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleGlassCard from '@/shared/ui/SimpleGlassCard';
import { vueniTheme } from '@/theme/unified';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Info,
  Bar,
  Tooltip,
} from 'lucide-react';
import { creditScoreService } from '@/features/credit/api/creditScoreService';
import { getScoreColor, getScoreGrade } from '@/shared/utils/formatters';
import { 
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

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
  creditData,
  onViewReport,
  className 
}: CleanCreditScoreCardProps) => {
  const navigate = useNavigate();
  const [data, setData] = useState<CreditScoreData | null>(creditData ?? null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedUtilization, setAnimatedUtilization] = useState(0);

  // Fetch data if not provided via props to keep in sync with CreditScorePage
  useEffect(() => {
    if (!data) {
      (async () => {
        try {
          const current = await creditScoreService.getCurrentScore();
          // Map service data to CreditScoreData shape
          setData({
            score: current.score,
            maxScore: 850,
            change: {
              amount: current.score - 750, // Mock change calculation
              period: 'last month'
            },
            utilization: current.factors?.find(f => f.factor === 'Credit Utilization')?.percentage ?? 23,
            rating: current.scoreRange,
            nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        } catch (e) {
          console.error('Failed to fetch credit score for card', e);
        }
      })();
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      setAnimatedScore(data.score);
      setAnimatedUtilization(data.utilization);
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

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

  const renderFactors = (factors: any[]) => {
    if (!factors?.length) return null;
    return (
      <div className="space-y-4">
        {factors.map((factor, index) => {
          const progress = factor.score;
          const statusColor = getScoreColor(progress);

          return (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">{factor.factor}</span>
              <div className="w-16 h-2 bg-white/[0.06] rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: statusColor,
                    transition: `width ${500 + index * 100}ms ease-out`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderHistoryChart = () => {
    if (!history?.length) return null;

    return (
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart 
          data={history}
          margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={vueniTheme.colors.palette.primary} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={vueniTheme.colors.palette.primary} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(26, 26, 36, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(4px)',
            }}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            formatter={(value: number) => [value, 'Score']}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke={vueniTheme.colors.palette.primary}
            strokeWidth={2} 
            fill="url(#scoreGradient)" 
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2, stroke: vueniTheme.colors.text.primary, fill: vueniTheme.colors.palette.primary }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  if (!data) {
    return null; // or skeleton state (omitted for brevity)
  }

  const scorePercentage = (animatedScore / data.maxScore) * 100;
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
              stroke={getScoreColor(data.score)}
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
              style={{ color: getScoreColor(data.score) }}
            >
              {animatedScore}
            </div>
            <div className="text-xs text-white/60">
              out of {data.maxScore}
            </div>
          </div>
        </div>
      </div>

      {/* Score Rating */}
      <div className="text-center mb-6">
        <div 
          className="text-lg font-semibold mb-1"
          style={{ color: getScoreColor(data.score) }}
        >
          {getScoreRating(data.score)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <div 
            className="flex items-center gap-1"
            style={{ 
              color: data.change.amount >= 0 ? colors.status.success : colors.status.error 
            }}
          >
            {data.change.amount >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {data.change.amount >= 0 ? '+' : ''}{data.change.amount}
            </span>
          </div>
          <span className="text-white/60 text-sm">
            {data.change.period}
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
        onClick={() => {
          if (onViewReport) {
            onViewReport();
          } else {
            // Fallback: navigate to credit tab on dashboard
            navigate('/?tab=credit');
          }
        }}
        className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.08] transition-all duration-200 group"
      >
        <span className="text-white font-medium">View Full Report</span>
        <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Next Review */}
      <div className="mt-4 pt-4 border-t border-white/[0.08]">
        <p className="text-xs text-white/50 text-center">
          Next review: {new Date(data.nextReviewDate).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        {renderFactors(creditFactors.breakdown)}
        {renderHistoryChart()}
      </div>
    </SimpleGlassCard>
  );
};

export default CleanCreditScoreCard; 