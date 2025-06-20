import { describe, it, expect } from 'vitest';
import {
  useBiometricInterventionStore,
  useBiometricStore,
} from '@/features/biometric-intervention/store';

describe('Biometric Intervention System', () => {
  it('initializes biometric intervention store', async () => {
    const store = useBiometricInterventionStore.getState();
    await store.initialize();
    expect(store.isActive).toBe(true);
  });

  it('triggers manual stress check', async () => {
    const store = useBiometricInterventionStore.getState();
    await store.triggerManualStressCheck();
    expect(store.currentStress).toBeDefined();
    expect(store.currentStress?.score).toBeGreaterThanOrEqual(0);
    expect(store.currentStress?.score).toBeLessThanOrEqual(100);
  });

  it('handles biometric alerts', async () => {
    const { refresh, dismissAlert } = useBiometricStore.getState();
    await refresh();
    const state = useBiometricStore.getState();

    expect(state.reading).toBeDefined();
    expect(state.reading?.heartRate).toBeGreaterThan(0);
    expect(state.reading?.stressLevel).toBeGreaterThanOrEqual(0);

    // Test alert dismissal if any alerts exist
    if (state.alerts.length > 0) {
      const alertId = state.alerts[0].id;
      await dismissAlert(alertId);
      const updatedState = useBiometricStore.getState();
      expect(updatedState.alerts.find((a) => a.id === alertId)).toBeUndefined();
    }
  });

  it('checks stress intervention logic', async () => {
    const store = useBiometricInterventionStore.getState();
    await store.triggerManualStressCheck();

    // Test intervention check with high spending amount
    const shouldIntervene = await store.checkStressIntervention(1000);
    expect(typeof shouldIntervene).toBe('boolean');
  });

  it('manages intervention policies', async () => {
    const store = useBiometricInterventionStore.getState();

    const testPolicy = {
      name: 'Test High Stress Policy',
      enabled: true,
      triggers: {
        stressThreshold: 80,
        spendingAmount: 100,
        timeWindow: 300,
      },
      actions: {
        showNudge: true,
        delayPurchase: 30,
        requireConfirmation: true,
        suggestAlternatives: false,
      },
      schedule: {
        enabledDays: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '18:00',
        timezone: 'UTC',
      },
    };

    await store.addPolicy(testPolicy);
    expect(store.activePolicies.length).toBeGreaterThan(0);

    const addedPolicy = store.activePolicies[store.activePolicies.length - 1];
    expect(addedPolicy.name).toBe(testPolicy.name);
  });
});
