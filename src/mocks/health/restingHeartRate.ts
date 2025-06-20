import { AnalyticsDataPoint } from '@/shared/types/analytics';

const today = new Date();

export const restingHeartRate30d: AnalyticsDataPoint[] = Array.from({
  length: 30,
}).map((_, i) => {
  const date = new Date(today);
  date.setDate(today.getDate() - (29 - i));
  const base = 60 + Math.sin(i / 5) * 3;
  const variation = (Math.random() - 0.5) * 2;
  return {
    timestamp: date.toISOString(),
    value: Math.round(base + variation),
  };
});
