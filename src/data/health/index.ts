// Unified health data exports for all analytics components

// Activity Rings (PR #17)
import { activityRings, ActivityRingData } from '@/mocks/health/activity';

// Caloric Balance (PR #19)
export type { CaloricBalanceEntry } from '@/mocks/health/caloricBalance';
export { getCaloricBalance } from '@/mocks/health/caloricBalance';

// Mindfulness vs Spending (PR #18)
import mindfulSpending from '@/mocks/health/mindfulSpending';

// Resting Heart Rate (PR #20)
import { restingHeartRate30d } from '@/mocks/health/restingHeartRate';
import { AnalyticsDataPoint } from '@/shared/types/analytics';

// Activity Rings
export const getActivityRings = async (): Promise<ActivityRingData[]> => {
  return activityRings;
};

export type { ActivityRingData };

// Mindfulness vs Spending
export interface MindfulnessVsSpendingPoint {
  mindful: number;
  stdDev: number;
}

export function getMindfulnessVsSpending(): MindfulnessVsSpendingPoint[] {
  return mindfulSpending;
}

// Resting Heart Rate Trend
export const getRestingHeartRateTrend = (): AnalyticsDataPoint[] => {
  return restingHeartRate30d;
};
