/*
  healthKitService.ts
  -------------------
  Lightweight abstraction around Apple HealthKit. In a true native iOS context we would bridge to
  HKHealthStore via React Native, Capacitor, or a native Swift module. For web we fall back to
  a stubbed API that can be replaced by your backend which syncs HealthKit data from the device.
*/

export interface HealthMetrics {
  activeEnergyBurned: number; // kcal per day average
  exerciseMinutes: number; // minutes per day average
  stepCount: number; // steps per day average
  sleepHours: number; // hours per night average
  restingHeartRate: number; // bpm
  vo2Max: number; // ml/kg·min
  mindfulMinutes: number; // minutes per day average
}

export interface HealthScoreBreakdown {
  activityScore: number;
  cardioScore: number;
  recoveryScore: number;
  totalScore: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Convert raw HealthKit metrics into a 0-100 health score using a simple weighted model
 * loosely inspired by Oura / WHOOP methodologies.
 */
export const calculateHealthScore = (
  metrics: HealthMetrics
): HealthScoreBreakdown => {
  // Activity (40%) – active energy + exercise minutes + steps
  const activityTargetCalories = 450; // Apple Activity default move goal
  const activityTargetExercise = 30; // mins
  const activityTargetSteps = 7500;

  const activityCalScore = clamp(
    (metrics.activeEnergyBurned / activityTargetCalories) * 100,
    0,
    100
  );
  const activityExScore = clamp(
    (metrics.exerciseMinutes / activityTargetExercise) * 100,
    0,
    100
  );
  const activityStepScore = clamp(
    (metrics.stepCount / activityTargetSteps) * 100,
    0,
    100
  );
  const activityScore =
    (activityCalScore + activityExScore + activityStepScore) / 3;

  // Cardio (30%) – resting heart rate (lower is better) + VO2Max (higher is better)
  const rhrScore = clamp(((80 - metrics.restingHeartRate) / 40) * 100, 0, 100); // 40-80 bpm range
  const vo2Score = clamp(((metrics.vo2Max - 25) / 30) * 100, 0, 100); // 25-55 range
  const cardioScore = (rhrScore + vo2Score) / 2;

  // Recovery (30%) – sleep + mindful minutes
  const sleepScore = clamp((metrics.sleepHours / 8) * 100, 0, 100);
  const mindfulnessScore = clamp((metrics.mindfulMinutes / 15) * 100, 0, 100);
  const recoveryScore = (sleepScore + mindfulnessScore) / 2;

  const totalScore = Math.round(
    activityScore * 0.4 + cardioScore * 0.3 + recoveryScore * 0.3
  );

  return {
    activityScore: Math.round(activityScore),
    cardioScore: Math.round(cardioScore),
    recoveryScore: Math.round(recoveryScore),
    totalScore,
  };
};

/**
 * Attempt to retrieve HealthKit metrics. Runs in two modes:
 * 1. Native / Capacitor – fetches from window.healthKit bridge if available.
 * 2. Web fallback      – hits REST endpoint `/api/health/summary` which should
 *    be filled by your backend cron pulling from Apple HealthKit CloudKit sync.
 */
export const fetchHealthMetrics = async (): Promise<HealthMetrics> => {
  if (typeof window !== 'undefined' && (window as any).healthKit?.getSummary) {
    const summary = await (window as any).healthKit.getSummary();
    return summary as HealthMetrics;
  }

  // Fallback fetch – returns demo data if endpoint unavailable
  try {
    const res = await fetch('/api/health/summary');
    if (res.ok) return (await res.json()) as HealthMetrics;
  } catch (_) {
    /* ignore */
  }

  // Demo placeholder values
  return {
    activeEnergyBurned: 380,
    exerciseMinutes: 28,
    stepCount: 8200,
    sleepHours: 7.4,
    restingHeartRate: 58,
    vo2Max: 42,
    mindfulMinutes: 12,
  };
};
