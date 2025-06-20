import React, { useEffect, useMemo } from 'react';
import { ScatterPlot } from '@/shared/ui/charts';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Badge } from '@/shared/ui/badge';
import { Brain } from 'lucide-react';
import { getMindfulnessVsSpending } from '@/data/health';
import { toast } from '@/shared/ui/sonner';

export const MindfulnessVsSpending: React.FC = () => {
  const data = useMemo(() => getMindfulnessVsSpending(), []);

  useEffect(() => {
    const total = data.reduce((sum, d) => sum + d.mindful, 0);
    if (total < 40) {
      toast('Low mindfulness activity - Try increasing mindful minutes to stabilize spending.');
    }
  }, [data]);

  const scatterData = data.map((d, index) => ({ 
    date: `Day ${index + 1}`, 
    mindful: d.mindful, 
    stdDev: d.stdDev 
  }));

  // Calculate correlation strength
  const avgMindful = data.reduce((sum, d) => sum + d.mindful, 0) / data.length;
  const avgStdDev = data.reduce((sum, d) => sum + d.stdDev, 0) / data.length;
  const correlation = data.reduce((sum, d) => sum + (d.mindful - avgMindful) * (d.stdDev - avgStdDev), 0) / data.length;
  const correlationStrength = Math.abs(correlation) > 15 ? 'Strong' : Math.abs(correlation) > 8 ? 'Moderate' : 'Weak';

  return (
    <UniversalCard variant="glass" interactive className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Mindfulness vs Spending
        </h3>
        <Badge
          variant="outline"
          className={`text-xs ${
            correlationStrength === 'Strong' 
              ? 'border-red-400/20 text-red-400'
              : correlationStrength === 'Moderate'
              ? 'border-yellow-400/20 text-yellow-400' 
              : 'border-green-400/20 text-green-400'
          }`}
        >
          {correlationStrength} Correlation
        </Badge>
      </div>
      
      <div className="mb-4">
        <ScatterPlot
          data={scatterData}
          series={[{ dataKey: 'stdDev', label: 'Spending Variance', color: '#8b5cf6' }]}
          xAxis={{ 
            show: true, 
            dataKey: 'mindful', 
            type: 'number',
            tickFormatter: (value) => `${value}min`
          }}
          yAxis={{ 
            show: true, 
            dataKey: 'stdDev', 
            type: 'number',
            tickFormatter: (value) => `$${value}`
          }}
          dimensions={{ height: 250, responsive: true }}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-white/[0.02] rounded-lg">
          <div className="text-white/60">Avg Mindful Minutes</div>
          <div className="text-lg font-bold text-purple-400">{avgMindful.toFixed(1)}</div>
        </div>
        <div className="p-3 bg-white/[0.02] rounded-lg">
          <div className="text-white/60">Avg Spending Variance</div>
          <div className="text-lg font-bold text-blue-400">${avgStdDev.toFixed(0)}</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
        <div className="text-xs text-white/80">
          💡 <strong>Insight:</strong> {correlation < -5 
            ? 'Higher mindfulness correlates with more stable spending patterns.' 
            : correlation > 5
            ? 'Lower mindfulness correlates with more volatile spending.' 
            : 'Mindfulness and spending variance show minimal correlation.'}
        </div>
      </div>
    </UniversalCard>
  );
};

export default MindfulnessVsSpending; 