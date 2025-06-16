import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedCircularProgress from '../insights/components/AnimatedCircularProgress';
import { creditScoreService } from '@/services/creditScoreService';
import { CreditScore } from '@/types/creditScore';

const CreditScoreCard = () => {
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

  const getScoreColor = (score: number) => {
    if (score >= 800) return '#22c55e'; // Excellent
    if (score >= 740) return '#84cc16'; // Very Good  
    if (score >= 670) return '#eab308'; // Good
    if (score >= 580) return '#f97316'; // Fair
    return '#ef4444'; // Poor
  };

  const getScoreDescription = (range: string) => {
    const descriptions = {
      'Excellent': 'You have excellent credit! Keep up the great work.',
      'Very Good': 'Your credit is in great shape with room for small improvements.',
      'Good': 'You have good credit with opportunities to improve.',
      'Fair': 'Your credit is fair. Focus on improvement strategies.',
      'Poor': 'Work on building your credit with consistent payments.'
    };
    return descriptions[range as keyof typeof descriptions] || '';
  };

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
    <div className="liquid-glass-card rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Credit Score</h3>
        <div className="text-xs text-slate-400">
          Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <AnimatedCircularProgress
          value={creditScore.score}
          maxValue={850}
          color={getScoreColor(creditScore.score)}
          size={140}
          strokeWidth={12}
        />
        
        <div className="mt-4">
          <div className="text-3xl font-bold text-white mb-1">
            {creditScore.score}
          </div>
          <div 
            className="text-lg font-semibold mb-2"
            style={{ color: getScoreColor(creditScore.score) }}
          >
            {creditScore.scoreRange} Credit
          </div>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            {getScoreDescription(creditScore.scoreRange)}
          </p>
        </div>
      </div>

      {/* Quick Factors */}
      <div className="space-y-3 mb-6">
        <h4 className="text-white font-semibold text-sm">Key Factors</h4>
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

      {/* Action Button */}
      <button 
        onClick={() => navigate('/credit-score')}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
      >
        View Full Credit Report
      </button>
    </div>
  );
};

export default CreditScoreCard; 