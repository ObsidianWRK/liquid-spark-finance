import { Observable, BehaviorSubject, interval, combineLatest } from 'rxjs';
import {
  map,
  shareReplay,
  startWith,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { z } from 'zod';

// Zod schemas for type safety
export const BiometricReadingSchema = z.object({
  timestamp: z.string(),
  deviceId: z.string(),
  heartRate: z.number().min(30).max(220).optional(),
  heartRateVariability: z.number().min(0).max(100).optional(),
  galvanicSkinResponse: z.number().min(0).max(10).optional(),
  skinTemperature: z.number().min(90).max(110).optional(),
  respiratoryRate: z.number().min(8).max(40).optional(),
  bloodOxygenSaturation: z.number().min(0).max(100).optional(),
  stressIndex: z.number().min(0).max(100).optional(),
  confidenceScore: z.number().min(0).max(1).optional(),
});

export type BiometricReading = z.infer<typeof BiometricReadingSchema>;

export interface BiometricDataSource {
  id: string;
  name: string;
  type: 'apple-watch' | 'fitbit' | 'garmin' | 'oura' | 'manual';
  isConnected: boolean;
  lastReading?: BiometricReading;
}

class BiometricStreamService {
  private _readings$ = new BehaviorSubject<BiometricReading | null>(null);
  private _connectedDevices$ = new BehaviorSubject<BiometricDataSource[]>([]);
  private _isActive$ = new BehaviorSubject<boolean>(false);

  // Mock data generators for development
  private generateMockReading(deviceId: string): BiometricReading {
    const baseStress = Math.random() * 30 + 20; // 20-50 baseline
    const timeVariation = Math.sin(Date.now() / 60000) * 10; // Time-based variation
    const stressIndex = Math.max(
      0,
      Math.min(100, baseStress + timeVariation + (Math.random() - 0.5) * 20)
    );

    return {
      timestamp: new Date().toISOString(),
      deviceId,
      heartRate: 60 + Math.random() * 40 + (stressIndex / 100) * 20,
      heartRateVariability: 50 - (stressIndex / 100) * 30 + Math.random() * 10,
      galvanicSkinResponse: 2 + (stressIndex / 100) * 3 + Math.random() * 0.5,
      skinTemperature: 98.6 + (Math.random() - 0.5) * 2,
      respiratoryRate: 16 + (stressIndex / 100) * 8 + Math.random() * 2,
      bloodOxygenSaturation: 98 - (stressIndex / 100) * 3 + Math.random() * 2,
      stressIndex,
      confidenceScore: 0.85 + Math.random() * 0.15,
    };
  }

  // Public observables
  public readonly readings$: Observable<BiometricReading> =
    this._readings$.pipe(
      filter((reading): reading is BiometricReading => reading !== null),
      distinctUntilChanged(
        (a, b) => Math.abs(a.stressIndex || 0 - (b.stressIndex || 0)) < 2
      ),
      shareReplay(1)
    );

  public readonly connectedDevices$: Observable<BiometricDataSource[]> =
    this._connectedDevices$.pipe(shareReplay(1));

  public readonly isActive$: Observable<boolean> = this._isActive$.pipe(
    shareReplay(1)
  );

  // Derived observables
  public readonly stressLevel$: Observable<number> = this.readings$.pipe(
    map((reading) => reading.stressIndex || 0),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly heartRate$: Observable<number> = this.readings$.pipe(
    map((reading) => reading.heartRate || 0),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly wellnessScore$: Observable<number> = this.readings$.pipe(
    map((reading) => {
      const stress = reading.stressIndex || 50;
      const hrv = reading.heartRateVariability || 30;
      const hr = reading.heartRate || 70;

      // Calculate wellness score (inverse of stress, normalized)
      const stressScore = (100 - stress) * 0.4;
      const hrvScore = Math.min(100, hrv * 2) * 0.3;
      const hrScore = Math.max(0, 100 - Math.abs(hr - 70) * 2) * 0.3;

      return Math.round(stressScore + hrvScore + hrScore);
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // Combined real-time stream
  public readonly biometricState$: Observable<{
    reading: BiometricReading;
    stressIndex: number;
    wellnessScore: number;
    isActive: boolean;
    devices: BiometricDataSource[];
  }> = combineLatest([
    this.readings$,
    this.stressLevel$,
    this.wellnessScore$,
    this.isActive$,
    this.connectedDevices$,
  ]).pipe(
    map(([reading, stressIndex, wellnessScore, isActive, devices]) => ({
      reading,
      stressIndex,
      wellnessScore,
      isActive,
      devices,
    })),
    shareReplay(1)
  );

  // Control methods
  public startStream(): void {
    if (this._isActive$.value) return;

    this._isActive$.next(true);

    // Initialize mock devices
    this._connectedDevices$.next([
      {
        id: 'apple-watch-series-8',
        name: 'Apple Watch Series 8',
        type: 'apple-watch',
        isConnected: true,
      },
      {
        id: 'oura-ring-gen3',
        name: 'Oura Ring Gen 3',
        type: 'oura',
        isConnected: Math.random() > 0.3, // 70% connected
      },
    ]);

    // Start mock data stream (every 5 seconds)
    interval(5000)
      .pipe(
        filter(() => this._isActive$.value),
        map(() => this.generateMockReading('apple-watch-series-8'))
      )
      .subscribe((reading) => {
        this._readings$.next(reading);
      });
  }

  public stopStream(): void {
    this._isActive$.next(false);
  }

  public manualReading(reading: Partial<BiometricReading>): void {
    const fullReading: BiometricReading = {
      timestamp: new Date().toISOString(),
      deviceId: 'manual-input',
      ...this.generateMockReading('manual-input'),
      ...reading,
    };

    try {
      const validated = BiometricReadingSchema.parse(fullReading);
      this._readings$.next(validated);
    } catch (error) {
      console.error('Invalid biometric reading:', error);
    }
  }

  public addDevice(device: BiometricDataSource): void {
    const currentDevices = this._connectedDevices$.value;
    if (!currentDevices.find((d) => d.id === device.id)) {
      this._connectedDevices$.next([...currentDevices, device]);
    }
  }

  public removeDevice(deviceId: string): void {
    const currentDevices = this._connectedDevices$.value;
    this._connectedDevices$.next(
      currentDevices.filter((d) => d.id !== deviceId)
    );
  }

  // Get current values synchronously
  public getCurrentStressLevel(): number {
    return this._readings$.value?.stressIndex || 0;
  }

  public getCurrentWellnessScore(): number {
    const reading = this._readings$.value;
    if (!reading) return 0;

    const stress = reading.stressIndex || 50;
    const hrv = reading.heartRateVariability || 30;
    const hr = reading.heartRate || 70;

    const stressScore = (100 - stress) * 0.4;
    const hrvScore = Math.min(100, hrv * 2) * 0.3;
    const hrScore = Math.max(0, 100 - Math.abs(hr - 70) * 2) * 0.3;

    return Math.round(stressScore + hrvScore + hrScore);
  }
}

// Singleton instance
export const biometricStream = new BiometricStreamService();

// Export for React hooks
export type BiometricStreamType = typeof biometricStream;
