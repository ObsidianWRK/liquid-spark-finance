import mindfulSpending from '@/mocks/health/mindfulSpending';

export interface MindfulnessVsSpendingPoint {
  mindful: number;
  stdDev: number;
}

export function getMindfulnessVsSpending(): MindfulnessVsSpendingPoint[] {
  return mindfulSpending;
}
