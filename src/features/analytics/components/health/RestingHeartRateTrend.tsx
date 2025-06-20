import React, { useMemo } from 'react';
import { LineChart } from '@/shared/ui/charts';
import { Badge } from '@/shared/ui/badge';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Heart } from 'lucide-react';
import { getRestingHeartRateTrend } from '@/data/health';

const RestingHeartRateTrend: React.FC = () => {
  const data = useMemo(() => getRestingHeartRateTrend(), []);

  const trend = data[data.length - 1].value - data[0].value;
  const chipClass = trend <= 0
    ? 'border-green-400/20 text-green-400'
    : 'border-red-400/20 text-red-400';
  const chipLabel = trend <= 0 ? 'Improving' : 'Rising';

  const chartData = data.map(d => ({ date: d.timestamp.split('T')[0], value: d.value }));

  return (
    <UniversalCard variant="glass" interactive className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-400" />
        Resting Heart Rate
      </h3>
      <div className="relative">
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <div className="flex-1 bg-red-400/10" />
          <div className="flex-1 bg-yellow-400/10" />
          <div className="flex-1 bg-green-400/10" />
        </div>
        <LineChart
          data={chartData}
          series={[{ dataKey: 'value', label: 'BPM', color: '#60a5fa' }]}
          dimensions={{ height: 200, responsive: true }}
          legend={{ show: false }}
          className="relative z-10"
          lineConfig={{ smoothLines: true, showDots: false }}
        />
        <Badge
          variant="outline"
          className={`absolute top-2 right-2 z-20 text-xs ${chipClass}`}
        >
          {chipLabel}
        </Badge>
      </div>
    </UniversalCard>
  );
};

export default RestingHeartRateTrend;
