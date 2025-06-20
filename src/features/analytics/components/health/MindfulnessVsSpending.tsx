import React, { useEffect, useMemo } from 'react';
import { ScatterPlot } from '@/shared/ui/charts';
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

  const scatterData = data.map((d, index) => ({ date: `Day ${index + 1}`, mindful: d.mindful, stdDev: d.stdDev }));

  return (
    <ScatterPlot
      data={scatterData}
      series={[{ dataKey: 'stdDev', label: 'Spending SD', color: '#3b82f6' }]}
      xAxis={{ show: true, dataKey: 'mindful', type: 'number' }}
      yAxis={{ show: true, dataKey: 'stdDev', type: 'number' }}
      title="Mindfulness vs Spending"
    />
  );
};

export default MindfulnessVsSpending; 