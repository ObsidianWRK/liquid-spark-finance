import { AgeMetric } from "../types";

export interface AgeMetricService {
  calculate: () => Promise<AgeMetric>;
}

class MockAgeMetricService implements AgeMetricService {
  async calculate(): Promise<AgeMetric> {
    return {
      averageDaysHeld: Math.floor(Math.random() * 40) + 10, // random 10-50 days
      calculatedAt: new Date().toISOString(),
    };
  }
}

export const ageMetricService: AgeMetricService = new MockAgeMetricService(); 