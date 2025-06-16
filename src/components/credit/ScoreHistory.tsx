import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ScoreHistoryPoint } from '@/types/creditScore';

interface ScoreHistoryProps {
  history: ScoreHistoryPoint[];
}

const ScoreHistory = ({ history }: ScoreHistoryProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 800) return '#22c55e'; // Excellent
    if (score >= 740) return '#84cc16'; // Very Good  
    if (score >= 670) return '#eab308'; // Good
    if (score >= 580) return '#f97316'; // Fair
    return '#ef4444'; // Poor
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Score History</h3>
      
      <div className="liquid-glass-card p-6">
        <div className="space-y-4">
          {history.slice(-12).map((point, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-slate-300 font-medium text-sm">
                    {new Date(point.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: getScoreColor(point.score) }}
                  >
                    {point.score}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(point.change)}
                    {point.change !== 0 && (
                      <span className={`text-sm font-medium ${getChangeColor(point.change)}`}>
                        {point.change > 0 ? '+' : ''}{point.change}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-slate-400">
                  {point.score >= 800 ? 'Excellent' :
                   point.score >= 740 ? 'Very Good' :
                   point.score >= 670 ? 'Good' :
                   point.score >= 580 ? 'Fair' : 'Poor'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="text-slate-400 text-sm mb-2">12-Month Trend</div>
            <div className="flex items-center justify-center space-x-4">
              {(() => {
                const firstScore = history[0]?.score || 0;
                const lastScore = history[history.length - 1]?.score || 0;
                const overallChange = lastScore - firstScore;
                
                return (
                  <>
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(overallChange)}
                      <span className={`font-semibold ${getChangeColor(overallChange)}`}>
                        {overallChange > 0 ? '+' : ''}{overallChange} points
                      </span>
                    </div>
                    <div className="text-slate-400 text-sm">
                      Since {new Date(history[0]?.date || new Date()).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreHistory; 