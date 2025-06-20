import { describe, it, expect } from 'vitest';
import { useSmartSavingsStore as store } from '@/features/smart-savings/store';

describe('Smart Savings Store', () => {
  it('creates plan and toggles active state', async () => {
    await (store as any).getState().create({
      accountId: 'acc1',
      targetAmount: 25,
      cadence: 'daily',
      isActive: true,
    });
    const plan = (store as any).getState().plans[0];
    expect(plan.isActive).toBe(true);

    await (store as any).getState().pause(plan.id);
    const paused = (store as any)
      .getState()
      .plans.find((p) => p.id === plan.id);
    expect(paused?.isActive).toBe(false);

    await (store as any).getState().resume(plan.id);
    const resumed = (store as any)
      .getState()
      .plans.find((p) => p.id === plan.id);
    expect(resumed?.isActive).toBe(true);
  });
});
