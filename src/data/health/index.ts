import { activityRings, ActivityRingData } from '@/mocks/health/activity';

export const getActivityRings = async (): Promise<ActivityRingData[]> => {
  return activityRings;
};

export type { ActivityRingData };
