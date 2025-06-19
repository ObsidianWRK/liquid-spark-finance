import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay, distinctUntilChanged, tap } from 'rxjs/operators';
import { z } from 'zod';
import { biometricStream, BiometricReading, BiometricDataSource } from './BiometricStream';

// Zod schemas for BiometricsState
export const BiometricsStateSchema = z.object({
  // Current metrics
  stressIndex: z.number().min(0).max(100),
  wellnessScore: z.number().min(0).max(100),
  heartRate: z.number().min(30).max(220).optional(),
  heartRateVariability: z.number().min(0).max(100).optional(),
  
  // Trends (last 5 readings)
  stressTrend: z.enum(['rising', 'falling', 'stable']),
  wellnessTrend: z.enum(['improving', 'declining', 'stable']),
  
  // Device status
  isActive: z.boolean(),
  connectedDevices: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    isConnected: z.boolean(),
  })),
  
  // Intervention triggers
  shouldIntervene: z.boolean(),
  interventionLevel: z.enum(['none', 'mild', 'moderate', 'severe']),
  
  // Timestamps and metadata
  lastReading: z.string().optional(),
  confidenceScore: z.number().min(0).max(1).optional(),
  
  // Synchronized timing for UI (<50ms requirement)
  timestamp: z.string(),
});

export type BiometricsState = z.infer<typeof BiometricsStateSchema>;

export interface WellnessTrigger {
  id: string;
  type: 'stress' | 'wellness' | 'heartrate' | 'trend';
  threshold: number;
  condition: 'above' | 'below' | 'equal';
  enabled: boolean;
  callback?: (state: BiometricsState) => void;
}

class WellnessEngineService {
  private _state$ = new BehaviorSubject<BiometricsState | null>(null);
  private _triggers$ = new BehaviorSubject<WellnessTrigger[]>([]);
  private _history: BiometricReading[] = [];
  private readonly maxHistorySize = 50;

  // Public observables
  public readonly state$: Observable<BiometricsState> = this._state$.pipe(
    map(state => state as BiometricsState),
    distinctUntilChanged((a, b) => 
      a.stressIndex === b.stressIndex && 
      a.wellnessScore === b.wellnessScore &&
      a.timestamp === b.timestamp
    ),
    shareReplay(1)
  );

  public readonly stressIndex$: Observable<number> = this.state$.pipe(
    map(state => state.stressIndex),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly wellnessScore$: Observable<number> = this.state$.pipe(
    map(state => state.wellnessScore),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly shouldIntervene$: Observable<boolean> = this.state$.pipe(
    map(state => state.shouldIntervene),
    distinctUntilChanged(),
    shareReplay(1)
  );

  private calculateTrend(values: number[], type: 'stress' | 'wellness'): 'rising' | 'falling' | 'stable' | 'improving' | 'declining' {
    if (values.length < 3) return 'stable';
    
    const recent = values.slice(-3);
    const older = values.slice(-6, -3);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
    
    const threshold = type === 'stress' ? 5 : 8; // Different sensitivity for stress vs wellness
    const diff = recentAvg - olderAvg;
    
    if (type === 'stress') {
      if (diff > threshold) return 'rising';
      if (diff < -threshold) return 'falling';
      return 'stable';
    } else { // wellness
      if (diff > threshold) return 'improving';
      if (diff < -threshold) return 'declining';
      return 'stable';
    }
  }

  private calculateInterventionLevel(stressIndex: number, trend: string): 'none' | 'mild' | 'moderate' | 'severe' {
    if (stressIndex >= 85 || (stressIndex >= 70 && trend === 'rising')) return 'severe';
    if (stressIndex >= 70 || (stressIndex >= 60 && trend === 'rising')) return 'moderate';
    if (stressIndex >= 55 || (stressIndex >= 45 && trend === 'rising')) return 'mild';
    return 'none';
  }

  private shouldTriggerIntervention(state: BiometricsState): boolean {
    // Intervention logic based on stress, trends, and configured triggers
    const triggers = this._triggers$.value;
    
    // Check configured triggers
    for (const trigger of triggers.filter(t => t.enabled)) {
      let value: number;
      switch (trigger.type) {
        case 'stress':
          value = state.stressIndex;
          break;
        case 'wellness':
          value = state.wellnessScore;
          break;
        case 'heartrate':
          value = state.heartRate || 70;
          break;
        default:
          continue;
      }

      const shouldTrigger = 
        (trigger.condition === 'above' && value > trigger.threshold) ||
        (trigger.condition === 'below' && value < trigger.threshold) ||
        (trigger.condition === 'equal' && Math.abs(value - trigger.threshold) < 2);

      if (shouldTrigger) {
        trigger.callback?.(state);
        return true;
      }
    }

    // Default intervention thresholds
    return state.interventionLevel !== 'none';
  }

  constructor() {
    this.initializeEngine();
  }

  private initializeEngine(): void {
    // Subscribe to biometric stream and transform to wellness state
    combineLatest([
      biometricStream.biometricState$,
      this._triggers$
    ]).pipe(
      map(([biometricState, triggers]) => {
        const { reading, stressIndex, wellnessScore, isActive, devices } = biometricState;
        
        // Update history
        this._history.push(reading);
        if (this._history.length > this.maxHistorySize) {
          this._history = this._history.slice(-this.maxHistorySize);
        }

        // Calculate trends
        const stressHistory = this._history.map(r => r.stressIndex || 0);
        const wellnessHistory = this._history.map(r => {
          const stress = r.stressIndex || 50;
          const hrv = r.heartRateVariability || 30;
          const hr = r.heartRate || 70;
          
          const stressScore = (100 - stress) * 0.4;
          const hrvScore = Math.min(100, hrv * 2) * 0.3;
          const hrScore = Math.max(0, 100 - Math.abs(hr - 70) * 2) * 0.3;
          
          return Math.round(stressScore + hrvScore + hrScore);
        });

        const stressTrend = this.calculateTrend(stressHistory, 'stress') as 'rising' | 'falling' | 'stable';
        const wellnessTrend = this.calculateTrend(wellnessHistory, 'wellness') as 'improving' | 'declining' | 'stable';
        
        const interventionLevel = this.calculateInterventionLevel(stressIndex, stressTrend);
        
        const newState: BiometricsState = {
          stressIndex,
          wellnessScore,
          heartRate: reading.heartRate,
          heartRateVariability: reading.heartRateVariability,
          stressTrend,
          wellnessTrend,
          isActive,
          connectedDevices: devices,
          shouldIntervene: false, // Will be calculated next
          interventionLevel,
          lastReading: reading.timestamp,
          confidenceScore: reading.confidenceScore,
          timestamp: new Date().toISOString(),
        };

        // Calculate intervention after state is created
        newState.shouldIntervene = this.shouldTriggerIntervention(newState);

        return newState;
      }),
      tap(state => {
        // Log synchronization timing for <50ms requirement
        const timeDiff = Date.now() - new Date(state.lastReading || 0).getTime();
        if (timeDiff > 50) {
          console.warn(`Biometrics sync timing exceeded 50ms: ${timeDiff}ms`);
        }
      })
    ).subscribe(state => {
      this._state$.next(state);
    });
  }

  // Public methods
  public startEngine(): void {
    biometricStream.startStream();
  }

  public stopEngine(): void {
    biometricStream.stopStream();
  }

  public addTrigger(trigger: WellnessTrigger): void {
    const currentTriggers = this._triggers$.value;
    this._triggers$.next([...currentTriggers, trigger]);
  }

  public removeTrigger(triggerId: string): void {
    const currentTriggers = this._triggers$.value;
    this._triggers$.next(currentTriggers.filter(t => t.id !== triggerId));
  }

  public updateTrigger(triggerId: string, updates: Partial<WellnessTrigger>): void {
    const currentTriggers = this._triggers$.value;
    this._triggers$.next(
      currentTriggers.map(t => 
        t.id === triggerId ? { ...t, ...updates } : t
      )
    );
  }

  public getCurrentState(): BiometricsState | null {
    return this._state$.value;
  }

  public getHistory(): BiometricReading[] {
    return [...this._history];
  }

  public clearHistory(): void {
    this._history = [];
  }

  // Manual stress check for immediate intervention assessment
  public async triggerManualCheck(): Promise<BiometricsState | null> {
    const currentReading = biometricStream.generateMockReading('manual-check');
    biometricStream.manualReading(currentReading);
    
    // Wait for state update
    return new Promise((resolve) => {
      const subscription = this.state$.subscribe(state => {
        if (state.lastReading === currentReading.timestamp) {
          subscription.unsubscribe();
          resolve(state);
        }
      });
    });
  }
}

// Singleton instance
export const wellnessEngine = new WellnessEngineService();

// Export for React hooks
export type WellnessEngineType = typeof wellnessEngine; 