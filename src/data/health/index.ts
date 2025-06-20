import { bloodPressureZonesMock, BloodPressureZones } from '@/mocks/health/bloodPressure';

/**
 * Fetch blood pressure zone distribution.
 * In real implementation this would call an API or health service.
 */
export const getBloodPressureZones = async (): Promise<BloodPressureZones> => {
  return Promise.resolve(bloodPressureZonesMock);
};
