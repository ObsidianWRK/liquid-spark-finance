import { restingHeartRate30d } from '@/mocks/health/restingHeartRate';
import { AnalyticsDataPoint } from '@/shared/types/analytics';

export const getRestingHeartRateTrend = (): AnalyticsDataPoint[] => {
  return restingHeartRate30d;
};
