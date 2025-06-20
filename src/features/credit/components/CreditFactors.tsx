import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { CreditFactor } from '@/types/creditScore';

interface CreditFactorsProps {
  factors: CreditFactor[];
}

const CreditFactors = ({ factors }: CreditFactorsProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f97316';
      case 'Low':
        return '#22c55e';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Positive':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Negative':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Credit Factors</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((factor, index) => (
          <div key={index} className="liquid-glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(factor.status)}
                <div>
                  <h4 className="text-white font-semibold">{factor.factor}</h4>
                  <span className="text-xs text-slate-400">
                    {factor.percentage}% of score
                  </span>
                </div>
              </div>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${getImpactColor(factor.impact)}20`,
                  color: getImpactColor(factor.impact),
                }}
              >
                {factor.impact} Impact
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              {factor.description}
            </p>

            <div className="mt-4">
              <div className="w-full bg-slate-800/30 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${factor.percentage * 2.5}%`, // Scale for visual effect
                    backgroundColor:
                      factor.status === 'Positive'
                        ? '#22c55e'
                        : factor.status === 'Negative'
                          ? '#ef4444'
                          : '#64748b',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditFactors;
