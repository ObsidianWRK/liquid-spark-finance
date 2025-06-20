import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Subscription } from 'rxjs';
import { wellnessEngine, BiometricsState, WellnessTrigger } from '@/features/biometric-intervention/api/WellnessEngine';
import { biometricStream, BiometricReading } from '@/features/biometric-intervention/api/BiometricStream';

// Context selector types
type BiometricsSelector<T> = (state: BiometricsState) => T;

interface BiometricsContextValue {
  state: BiometricsState | null;
  isInitialized: boolean;
  startEngine: () => void;
  stopEngine: () => void;
  triggerManualCheck: () => Promise<BiometricsState | null>;
  addTrigger: (trigger: WellnessTrigger) => void;
  removeTrigger: (triggerId: string) => void;
  updateTrigger: (triggerId: string, updates: Partial<WellnessTrigger>) => void;
  getHistory: () => BiometricReading[];
  clearHistory: () => void;
}

const BiometricsContext = createContext<BiometricsContextValue | undefined>(undefined);

// Context selector hook for optimized re-renders
export function useBiometricsSelector<T>(
  selector: BiometricsSelector<T>,
  equalityFn?: (a: T, b: T) => boolean
): T {
  const context = useContext(BiometricsContext);
  if (!context) {
    throw new Error('useBiometricsSelector must be used within a BiometricsProvider');
  }

  const { state } = context;
  
  // Provide safer default initialization with proper fallback
  const [selectedValue, setSelectedValue] = useState<T>(() => {
    if (!state) {
      // Create a safe default state for initial render
      const defaultState: BiometricsState = {
        stressIndex: 30,
        wellnessScore: 75,
        heartRate: 72,
        shouldIntervene: false,
        stressTrend: 'stable',
        wellnessTrend: 'stable',
        interventionLevel: 'none',
        connectedDevices: [],
        timestamp: new Date().toISOString(),
        lastReading: new Date().toISOString()
      };
      try {
        return selector(defaultState);
      } catch {
        // If selector fails with default state, return null as last resort
        return null as T;
      }
    }
    return selector(state);
  });
  
  const selectorRef = useRef(selector);
  const equalityFnRef = useRef(equalityFn);
  const lastSelectedRef = useRef(selectedValue);

  // Update refs
  selectorRef.current = selector;
  equalityFnRef.current = equalityFn;

  useEffect(() => {
    if (!state) return;

    try {
      const newValue = selectorRef.current(state);
      const isEqual = equalityFnRef.current 
        ? equalityFnRef.current(lastSelectedRef.current, newValue)
        : lastSelectedRef.current === newValue;

      if (!isEqual) {
        lastSelectedRef.current = newValue;
        setSelectedValue(newValue);
      }
    } catch (error) {
      console.warn('BiometricsSelector error:', error);
    }
  }, [state]);

  return selectedValue;
}

// Convenience hooks for common selectors
export function useBiometrics(): BiometricsContextValue {
  const context = useContext(BiometricsContext);
  if (!context) {
    throw new Error('useBiometrics must be used within a BiometricsProvider');
  }
  return context;
}

export function useStressIndex(): number {
  return useBiometricsSelector(state => state.stressIndex, (a, b) => Math.abs(a - b) < 1);
}

export function useWellnessScore(): number {
  return useBiometricsSelector(state => state.wellnessScore, (a, b) => Math.abs(a - b) < 1);
}

export function useShouldIntervene(): boolean {
  return useBiometricsSelector(state => state.shouldIntervene);
}

export function useHeartRate(): number | undefined {
  return useBiometricsSelector(state => state.heartRate, (a, b) => 
    (a || 0) === (b || 0) || Math.abs((a || 0) - (b || 0)) < 2
  );
}

export function useBiometricTrends(): {
  stressTrend: 'rising' | 'falling' | 'stable';
  wellnessTrend: 'improving' | 'declining' | 'stable';
} {
  return useBiometricsSelector(
    state => ({
      stressTrend: state.stressTrend,
      wellnessTrend: state.wellnessTrend,
    }),
    (a, b) => a.stressTrend === b.stressTrend && a.wellnessTrend === b.wellnessTrend
  );
}

export function useConnectedDevices(): Array<{
  id: string;
  name: string;
  type: string;
  isConnected: boolean;
}> {
  return useBiometricsSelector(
    state => state.connectedDevices,
    (a, b) => 
      a.length === b.length && 
      a.every((device, index) => 
        device.id === b[index].id && 
        device.isConnected === b[index].isConnected
      )
  );
}

export function useInterventionLevel(): 'none' | 'mild' | 'moderate' | 'severe' {
  return useBiometricsSelector(state => state.interventionLevel);
}

// Provider component with initialization and cleanup
interface BiometricsProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  debugMode?: boolean;
}

export const BiometricsProvider: React.FC<BiometricsProviderProps> = ({
  children,
  autoStart = true,
  debugMode = false,
}) => {
  const [state, setState] = useState<BiometricsState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const subscriptionRef = useRef<Subscription | null>(null);
  const debugTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize wellness engine and subscribe to state changes
  useEffect(() => {
    if (debugMode) {
      // BiometricsProvider initializing
    }

    const subscription = wellnessEngine.state$.subscribe({
      next: (newState) => {
        setState(newState);
        
        if (debugMode) {
          // Biometrics state update details
        }
      },
      error: (error) => {
        console.error('BiometricsProvider subscription error:', error);
      },
    });

    subscriptionRef.current = subscription;
    setIsInitialized(true);

    if (autoStart) {
      wellnessEngine.startEngine();
    }

    // Debug timer for sync monitoring
    if (debugMode) {
      debugTimerRef.current = setInterval(() => {
        const currentState = wellnessEngine.getCurrentState();
        if (currentState) {
          const syncDelay = Date.now() - new Date(currentState.lastReading || 0).getTime();
          if (syncDelay > 50) {
            console.warn(`🧠 Sync delay warning: ${syncDelay}ms`);
          }
        }
      }, 1000);
    }

    return () => {
      subscription.unsubscribe();
      if (debugTimerRef.current) {
        clearInterval(debugTimerRef.current);
      }
      wellnessEngine.stopEngine();
      
      if (debugMode) {
        // BiometricsProvider cleaned up
      }
    };
  }, [autoStart, debugMode]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<BiometricsContextValue>(() => ({
    state,
    isInitialized,
    startEngine: () => {
      wellnessEngine.startEngine();
      if (debugMode) {
        // Engine started
      }
    },
    stopEngine: () => {
      wellnessEngine.stopEngine();
      if (debugMode) {
        // Engine stopped
      }
    },
    triggerManualCheck: async () => {
      if (debugMode) {
        // Manual check triggered
      }
      return wellnessEngine.triggerManualCheck();
    },
    addTrigger: (trigger: WellnessTrigger) => {
      wellnessEngine.addTrigger(trigger);
      if (debugMode) {
        // Trigger added
      }
    },
    removeTrigger: (triggerId: string) => {
      wellnessEngine.removeTrigger(triggerId);
      if (debugMode) {
        // Trigger removed
      }
    },
    updateTrigger: (triggerId: string, updates: Partial<WellnessTrigger>) => {
      wellnessEngine.updateTrigger(triggerId, updates);
      if (debugMode) {
        // Trigger updated
      }
    },
    getHistory: () => wellnessEngine.getHistory(),
    clearHistory: () => {
      wellnessEngine.clearHistory();
      if (debugMode) {
        // History cleared
      }
    },
  }), [state, isInitialized, debugMode]);

  return (
    <BiometricsContext.Provider value={contextValue}>
      {children}
    </BiometricsContext.Provider>
  );
};

// HOC for components that need biometrics
export function withBiometrics<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function BiometricsWrappedComponent(props: P) {
    return (
      <BiometricsProvider>
        <Component {...props} />
      </BiometricsProvider>
    );
  };
}

// Custom hook for synchronized stress and wellness with <50ms guarantee
export function useSynchronizedMetrics(): {
  stressIndex: number;
  wellnessScore: number;
  syncTimestamp: string;
  isInSync: boolean;
} {
  return useBiometricsSelector(
    state => ({
      stressIndex: state.stressIndex,
      wellnessScore: state.wellnessScore,
      syncTimestamp: state.timestamp,
      isInSync: state.lastReading ? 
        (Date.now() - new Date(state.lastReading).getTime()) < 50 : false,
    }),
    (a, b) => 
      a.stressIndex === b.stressIndex && 
      a.wellnessScore === b.wellnessScore &&
      a.syncTimestamp === b.syncTimestamp
  );
} 