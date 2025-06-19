export interface BiometricData {
  heartRate?: number;
  heartRateVariability?: number;
  galvanicSkinResponse?: number;
  skinTemperature?: number;
  respiratoryRate?: number;
  timestamp: string;
  deviceId: string;
}

export interface StressLevel {
  score: number; // 0-100, where 100 is maximum stress
  confidence: number; // 0-1, model confidence
  baseline: number; // Personal baseline stress level
  trend: 'rising' | 'falling' | 'stable';
  timestamp: string;
}

export interface InterventionPolicy {
  id: string;
  name: string;
  enabled: boolean;
  triggers: {
    stressThreshold: number; // Stress level that triggers intervention
    spendingAmount: number; // Dollar amount that triggers if stressed
    consecutiveHighStress: number; // Minutes of high stress before trigger
  };
  actions: {
    cardFreeze: boolean;
    nudgeMessage: boolean;
    breathingExercise: boolean;
    delayPurchase: number; // Seconds to delay purchase
    safeToSpendReduction: number; // Percentage to reduce safe-to-spend
  };
  schedule: {
    enabled: boolean;
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    daysOfWeek: number[]; // 0-6, Sunday-Saturday
  };
}

export interface InterventionEvent {
  id: string;
  type: 'stress_detected' | 'intervention_triggered' | 'user_action';
  stressLevel: StressLevel;
  policy: InterventionPolicy;
  action: string;
  outcome: 'prevented_purchase' | 'delayed_purchase' | 'proceeded_anyway' | 'dismissed';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BiometricPreferences {
  wearableIntegrations: {
    appleWatch: boolean;
    fitbit: boolean;
    garmin: boolean;
    oura: boolean;
  };
  dataRetention: {
    rawBiometrics: number; // Days to keep raw data
    stressScores: number; // Days to keep processed stress data
    interventionEvents: number; // Days to keep intervention history
  };
  privacy: {
    shareWithFamily: boolean;
    anonymousAnalytics: boolean;
    exportData: boolean;
  };
}

export interface InterventionState {
  isActive: boolean;
  currentStress?: StressLevel;
  activePolicies: InterventionPolicy[];
  recentEvents: InterventionEvent[];
  preferences: BiometricPreferences;
  loading: boolean;
  error?: string;
} 