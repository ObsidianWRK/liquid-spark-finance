import React from 'react';
import { Lightbulb, Clock, TrendingUp } from 'lucide-react';
import { CreditTip } from '@/types/creditScore';

interface CreditTipsProps {
  tips: CreditTip[];
}

const CreditTips = ({ tips }: CreditTipsProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f97316';
      case 'Low': return '#22c55e';
      default: return '#64748b';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Payment': return '💳';
      case 'Utilization': return '📊';
      case 'Length': return '📅';
      case 'Mix': return '🔄';
      case 'Inquiries': return '🔍';
      default: return '💡';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Credit Improvement Tips</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip) => (
          <div key={tip.id} className="liquid-glass-card p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-2xl">{getCategoryIcon(tip.category)}</div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">{tip.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-xs">{tip.timeframe}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span 
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${getImpactColor(tip.impact)}20`,
                    color: getImpactColor(tip.impact)
                  }}
                >
                  {tip.impact} Impact
                </span>
                <span className="text-xs text-slate-400 bg-slate-800/30 px-2 py-1 rounded-full">
                  {tip.category}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all">
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Start Improving</span>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditTips; 