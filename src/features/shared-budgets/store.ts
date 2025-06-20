import { create } from 'zustand';
import { householdService } from '@/features/shared-budgets/api/householdService';
import { Household } from '@/shared/types/shared';

interface SharedBudgetsState {
  households: Household[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  create: (name: string) => Promise<void>;
}

export const useSharedBudgetsStore = create<SharedBudgetsState>((set, get) => ({
  households: [],
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const households = await householdService.listHouseholds();
      set({ households, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? 'Unknown', loading: false });
    }
  },
  create: async (name: string) => {
    await householdService.createHousehold(name);
    await get().refresh();
  },
}));
