import { describe, it, expect } from 'vitest';
import { useSafeToSpendStore as store } from '@/features/safe-to-spend/store';

describe('Safe to Spend Store', () => {
  it('calculates safe spending amount', async () => {
    await (store as any).getState().refresh();
    const cash = (store as any).getState().cash;
    expect(cash?.amount).toBeGreaterThan(0);
    expect(cash?.payday).toBeDefined();
  });
});
