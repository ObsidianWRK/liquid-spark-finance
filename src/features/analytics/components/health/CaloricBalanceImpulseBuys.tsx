import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { StackedBarChart, StackedBarDataPoint } from '@/shared/ui/charts/StackedBarChart';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { InterventionNudge } from '@/features/biometric-intervention';
import { getCaloricBalance, CaloricBalanceEntry } from '@/data/health';

const CaloricBalanceImpulseBuys: React.FC = () => {
  const [data, setData] = useState<CaloricBalanceEntry[]>([]);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    getCaloricBalance().then(res => {
      setData(res);
      const last = res[res.length - 1];
      if (last && last.surplus > 500 && last.impulseCount > 1) {
        setShowNudge(true);
      }
    });
  }, []);

  if (data.length === 0) return null;

  const chartData: StackedBarDataPoint[] = data.map(d => ({
    date: d.date,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    surplus: d.surplus,
    impulseCount: d.impulseCount
  }));

  const series = [
    { dataKey: 'surplus', label: 'Caloric Surplus', color: '#FF9F0A' },
    { dataKey: 'impulseCount', label: 'Impulse Buys', color: '#FF453A' }
  ];

  const mockEvent = {
    id: 'caloric-nudge',
    type: 'intervention_triggered' as const,
    stressLevel: {
      score: 78,
      confidence: 0.85,
      baseline: 30,
      trend: 'rising' as const,
      timestamp: new Date().toISOString()
    },
    policy: {
      id: 'high-stress-policy',
      name: 'High Stress Spending Block',
      enabled: true,
      triggers: {
        stressThreshold: 75,
        spendingAmount: 50,
        consecutiveHighStress: 2
      },
      actions: {
        cardFreeze: false,
        nudgeMessage: true,
        breathingExercise: true,
        delayPurchase: 30,
        safeToSpendReduction: 50
      },
      schedule: {
        enabled: false,
        startTime: '09:00',
        endTime: '22:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      }
    },
    action: 'nudge_displayed',
    outcome: 'prevented_purchase' as const,
    timestamp: new Date().toISOString()
  };

  return (
    <UniversalCard variant="glass" interactive className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-yellow-400" />
        Caloric Balance & Impulse Buys
      </h3>
      <StackedBarChart
        data={chartData}
        series={series}
        stackedBarConfig={{ displayMode: 'absolute', colorScheme: 'custom', barRadius: 6, animateOnLoad: true }}
        dimensions={{ height: 300, responsive: true }}
      />
      {showNudge && (
        <InterventionNudge
          event={mockEvent}
          onDismiss={() => setShowNudge(false)}
          onProceedAnyway={() => setShowNudge(false)}
          onTakeBreathing={() => setShowNudge(false)}
        />
      )}
    </UniversalCard>
  );
};

export default CaloricBalanceImpulseBuys;
