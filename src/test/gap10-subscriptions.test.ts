import { describe, it, expect } from 'vitest';
import { useSubscriptionsStore as store } from '@/features/subscriptions/store';

// Zustand doesn't have built-in sync test; we'll call store functions directly.

describe('Subscriptions Store', () => {
  it('detects mock charges', async () => {
    const detect = (store as any).getState().detect as () => Promise<void>;
    await detect();
    const { charges } = (store as any).getState();
    expect(charges.length).toBeGreaterThan(0);
  });

  it('cancels a subscription', async () => {
    const { detect, cancel } = (store as any).getState();
    await detect();
    const id = (store as any).getState().charges[0].id;
    await cancel(id);
    const updated = (store as any).getState().charges.find((c) => c.id === id);
    expect(updated?.status).toBe('pending_cancel');
  });
});
