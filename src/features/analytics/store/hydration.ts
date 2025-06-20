import { create } from 'zustand';

interface HydrationState {
  count: number;
  lastReset: number;
  remind: boolean;
  increment: () => void;
  reset: () => void;
  checkReminder: () => void;
  dismissReminder: () => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const useHydrationStore = create<HydrationState>((set, get) => ({
  count: 0,
  lastReset: Date.now(),
  remind: false,
  increment: () => {
    const { count } = get();
    set({ count: count + 1 });
  },
  reset: () => set({ count: 0, lastReset: Date.now() }),
  checkReminder: () => {
    const { count, lastReset } = get();
    const now = new Date();
    if (now.getTime() - lastReset > DAY_MS) {
      set({ count: 0, lastReset: now.getTime() });
    }
    if (now.getHours() >= 18 && get().count < 4) {
      set({ remind: true });
    }
  },
  dismissReminder: () => set({ remind: false }),
}));
