import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedCircularProgress from '../insights/components/AnimatedCircularProgress';
import { creditScoreService } from '@/features/credit/api/creditScoreService';
import { CreditScore } from '@/types/creditScore';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { OptimizedScoreCard } from '@/features/insights/components/components/OptimizedScoreCard';

const CreditScoreCard = React.memo(() => {
  const navigate = useNavigate();
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCreditScore = async () => {
      try {
        const score = await creditScoreService.getCurrentScore();
        setCreditScore(score);
      } catch (error) {
        console.error('Failed to load credit score:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCreditScore();
  }, []);

  const getScoreColor = useMemo(() => (score: number) => {
    if (score >= 800) return '#22c55e'; // Excellent
    if (score >= 740) return '#84cc16'; // Very Good  
    if (score >= 670) return '#eab308'; // Good
    if (score >= 580) return '#f97316'; // Fair
    return '#ef4444'; // Poor
  }, []);

  const getScoreDescription = useMemo(() => {
    const descriptions = {
      'Excellent': 'You have excellent credit! Keep up the great work.',
      'Very Good': 'Your credit is in great shape with room for small improvements.',
      'Good': 'You have good credit with opportunities to improve.',
      'Fair': 'Your credit is fair. Focus on improvement strategies.',
      'Poor': 'Work on building your credit with consistent payments.'
    };
    return (range: string) => descriptions[range as keyof typeof descriptions] || '';
  }, []);

  const handleViewFullReport = useCallback(() => {
    navigate('/credit-score');
  }, [navigate]);

  if (loading) {
    return (
      <div className="liquid-glass-card p-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded mb-4"></div>
        <div className="h-32 bg-slate-700 rounded mb-4"></div>
        <div className="h-4 bg-slate-700 rounded"></div>
      </div>
    );
  }

  if (!creditScore) {
    return (
      <div className="liquid-glass-card p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Credit Score Unavailable</h3>
          <p className="text-slate-400 text-sm">We're working to get your credit score. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <UniversalCard variant="glass" className="p-6" interactive>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-white tracking-wide">Credit Score</h3>
        <div className="text-xs text-slate-400 font-medium italic">
          Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      {/* Optimized Score Display */}
      <div className="mb-6">
        <OptimizedScoreCard
          data={{
            score: creditScore.score,
            maxScore: 850,
            label: creditScore.scoreRange,
            description: getScoreDescription(creditScore.scoreRange),
            color: getScoreColor(creditScore.score),
            trend: {
              direction: 'up',
              percentage: 5
            }
          }}
          variant="enhanced"
          size="lg"
        />
      </div>

      {/* Quick Factors */}
      <div className="space-y-3 mb-6">
        <h4 className="text-white font-black text-sm tracking-wide">Key Factors</h4>
        {creditScore.factors.slice(0, 3).map((factor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {factor.status === 'Positive' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : factor.status === 'Negative' ? (
                <AlertCircle className="w-4 h-4 text-orange-400" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-slate-500" />
              )}
              <span className="text-slate-300 text-sm">{factor.factor}</span>
            </div>
            <span className="text-xs text-slate-400">{factor.percentage}%</span>
          </div>
        ))}
      </div>

      {/* Optimized Action Button */}
      <UniversalCard
        variant="glass"
                        className="card-hover-enhanced"
        interactive
        onClick={handleViewFullReport}
      >
        <div className="py-3 text-center">
          <span className="text-white font-bold text-lg tracking-wide">
            View Full Credit Report
          </span>
        </div>
      </UniversalCard>
    </UniversalCard>
  );
});

CreditScoreCard.displayName = 'CreditScoreCard';

export default CreditScoreCard; 