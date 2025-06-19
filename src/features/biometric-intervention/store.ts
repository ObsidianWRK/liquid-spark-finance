import { create } from "zustand";
// import { biometricInterventionService } from "@/services/biometricInterventionService";
import { 
  InterventionState, 
  InterventionPolicy, 
  StressLevel, 
  BiometricData, 
  InterventionEvent,
  BiometricPreferences
} from "./types";
import { biometricService } from "@/services/biometricService";
import { BiometricReading, InterventionAlert } from "@/types";

// Temporary mock service until real service is implemented
const mockBiometricInterventionService = {
  processeBiometricData: async (data: BiometricData): Promise<StressLevel> => {
    // Mock stress calculation
    return {
      score: Math.floor(Math.random() * 100),
      confidence: 0.85,
      baseline: 30,
      trend: 'stable' as const,
      timestamp: new Date().toISOString()
    };
  },
  triggerIntervention: async (policy: InterventionPolicy, stress: StressLevel): Promise<InterventionEvent> => {
    return {
      id: Math.random().toString(36),
      type: 'intervention_triggered',
      stressLevel: stress,
      policy,
      action: 'nudge_displayed',
      outcome: 'prevented_purchase',
      timestamp: new Date().toISOString()
    };
  },
  createPolicy: async (policy: Omit<InterventionPolicy, 'id'>): Promise<InterventionPolicy> => {
    return { ...policy, id: Math.random().toString(36) };
  },
  updatePolicy: async (id: string, updates: Partial<InterventionPolicy>): Promise<InterventionPolicy> => {
    return { id, ...updates } as InterventionPolicy;
  },
  deletePolicy: async (id: string): Promise<void> => {},
  dismissIntervention: async (eventId: string): Promise<void> => {},
  getCurrentStressLevel: async (): Promise<StressLevel> => {
    return {
      score: Math.floor(Math.random() * 100),
      confidence: 0.85,
      baseline: 30,
      trend: 'stable',
      timestamp: new Date().toISOString()
    };
  },
  updatePreferences: async (preferences: BiometricPreferences): Promise<void> => {},
  clearHistory: async (): Promise<void> => {},
  exportData: async (): Promise<Blob> => new Blob([JSON.stringify({})], { type: 'application/json' }),
  getPolicies: async (): Promise<InterventionPolicy[]> => [],
  getPreferences: async (): Promise<BiometricPreferences | null> => null,
  getRecentEvents: async (): Promise<InterventionEvent[]> => []
};

interface BiometricInterventionStore extends InterventionState {
  // Actions
  updateBiometricData: (data: BiometricData) => Promise<void>;
  checkStressIntervention: (spendingAmount: number) => Promise<boolean>;
  addPolicy: (policy: Omit<InterventionPolicy, 'id'>) => Promise<void>;
  updatePolicy: (id: string, policy: Partial<InterventionPolicy>) => Promise<void>;
  deletePolicy: (id: string) => Promise<void>;
  dismissIntervention: (eventId: string) => Promise<void>;
  triggerManualStressCheck: () => Promise<void>;
  updatePreferences: (preferences: Partial<BiometricPreferences>) => Promise<void>;
  clearHistory: () => Promise<void>;
  exportData: () => Promise<Blob>;
  initialize: () => Promise<void>;
}

const defaultPreferences = {
  wearableIntegrations: {
    appleWatch: true,
    fitbit: false,
    garmin: false,
    oura: false,
  },
  dataRetention: {
    rawBiometrics: 7,
    stressScores: 30,
    interventionEvents: 90,
  },
  privacy: {
    shareWithFamily: false,
    anonymousAnalytics: true,
    exportData: true,
  },
};

export const useBiometricInterventionStore = create<BiometricInterventionStore>((set, get) => ({
  // Initial state
  isActive: false,
  currentStress: undefined,
  activePolicies: [],
  recentEvents: [],
  preferences: defaultPreferences,
  loading: false,
  error: undefined,

  // Actions
  updateBiometricData: async (data: BiometricData) => {
    set({ loading: true, error: undefined });
    try {
      const stressLevel = await mockBiometricInterventionService.processeBiometricData(data);
      set({ 
        currentStress: stressLevel, 
        loading: false 
      });
      
      // Check if stress level triggers any policies
      const { activePolicies } = get();
      for (const policy of activePolicies) {
        if (policy.enabled && stressLevel.score >= policy.triggers.stressThreshold) {
          await mockBiometricInterventionService.triggerIntervention(policy, stressLevel);
        }
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  checkStressIntervention: async (spendingAmount: number): Promise<boolean> => {
    const { currentStress, activePolicies, isActive } = get();
    
    if (!isActive || !currentStress) return false;

    // Check each active policy
    for (const policy of activePolicies) {
      if (!policy.enabled) continue;

      const shouldIntervene = 
        currentStress.score >= policy.triggers.stressThreshold &&
        spendingAmount >= policy.triggers.spendingAmount;

      if (shouldIntervene) {
        try {
          const event = await mockBiometricInterventionService.triggerIntervention(policy, currentStress);
          
          // Update recent events
          const { recentEvents } = get();
          set({ 
            recentEvents: [event, ...recentEvents].slice(0, 50) // Keep last 50 events
          });

          return true; // Intervention triggered
        } catch (err: any) {
          set({ error: err.message });
          return false;
        }
      }
    }

    return false; // No intervention needed
  },

  addPolicy: async (policyData: Omit<InterventionPolicy, 'id'>) => {
    set({ loading: true, error: undefined });
    try {
      const policy = await mockBiometricInterventionService.createPolicy(policyData);
      const { activePolicies } = get();
      set({ 
        activePolicies: [...activePolicies, policy],
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updatePolicy: async (id: string, updates: Partial<InterventionPolicy>) => {
    set({ loading: true, error: undefined });
    try {
      const updatedPolicy = await mockBiometricInterventionService.updatePolicy(id, updates);
      const { activePolicies } = get();
      set({ 
        activePolicies: activePolicies.map(p => p.id === id ? updatedPolicy : p),
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deletePolicy: async (id: string) => {
    set({ loading: true, error: undefined });
    try {
      await mockBiometricInterventionService.deletePolicy(id);
      const { activePolicies } = get();
      set({ 
        activePolicies: activePolicies.filter(p => p.id !== id),
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  dismissIntervention: async (eventId: string) => {
    try {
      await mockBiometricInterventionService.dismissIntervention(eventId);
      const { recentEvents } = get();
      set({ 
        recentEvents: recentEvents.map(e => 
          e.id === eventId 
            ? { ...e, outcome: 'dismissed' as const }
            : e
        )
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  triggerManualStressCheck: async () => {
    set({ loading: true, error: undefined });
    try {
      const stressLevel = await mockBiometricInterventionService.getCurrentStressLevel();
      set({ currentStress: stressLevel, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updatePreferences: async (updates: Partial<BiometricPreferences>) => {
    set({ loading: true, error: undefined });
    try {
      const { preferences } = get();
      const newPreferences = { ...preferences, ...updates };
      await mockBiometricInterventionService.updatePreferences(newPreferences);
      set({ preferences: newPreferences, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearHistory: async () => {
    set({ loading: true, error: undefined });
    try {
      await mockBiometricInterventionService.clearHistory();
      set({ recentEvents: [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  exportData: async (): Promise<Blob> => {
    return await mockBiometricInterventionService.exportData();
  },

  initialize: async () => {
    set({ loading: true, error: undefined });
    try {
      const [policies, preferences, recentEvents] = await Promise.all([
        mockBiometricInterventionService.getPolicies(),
        mockBiometricInterventionService.getPreferences(),
        mockBiometricInterventionService.getRecentEvents(),
      ]);

      set({ 
        activePolicies: policies,
        preferences: preferences || defaultPreferences,
        recentEvents,
        isActive: true,
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));

interface BiometricState {
  reading?: BiometricReading;
  alerts: InterventionAlert[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  dismissAlert: (id: string) => Promise<void>;
}

export const useBiometricStore = create<BiometricState>((set, get) => ({
  reading: undefined,
  alerts: [],
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const [reading, alerts] = await Promise.all([
        biometricService.getCurrentReading(),
        biometricService.getAlerts(),
      ]);
      set({ reading, alerts, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown", loading: false });
    }
  },
  dismissAlert: async (id: string) => {
    await biometricService.dismissAlert(id);
    const updated = get().alerts.filter(a => a.id !== id);
    set({ alerts: updated });
  },
})); 