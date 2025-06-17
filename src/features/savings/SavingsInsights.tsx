import React from 'react';
import { SavingsInsight } from './types';

interface Props {
  insights: SavingsInsight[];
}

const SavingsInsights: React.FC<Props> = ({ insights }) => {
  if (insights.length === 0) {
    return (
      <div className="text-center text-white/60 py-12">No insights yet — keep saving! ✨</div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div
          key={insight.title}
          className="liquid-glass-card p-4 border border-white/10 rounded-xl"
        >
          <h3 className="text-white font-semibold mb-1 flex items-center space-x-2">
            <span>{insight.title}</span>
            {insight.actionable && <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Action</span>}
          </h3>
          <p className="text-white/70 text-sm">{insight.description}</p>
          {insight.actionable && (
            <button className="mt-2 text-sm text-indigo-400 hover:underline">{insight.action}</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SavingsInsights;
