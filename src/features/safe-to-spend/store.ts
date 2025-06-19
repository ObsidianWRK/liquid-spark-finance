import { create } from "zustand";
import { safeToSpendService } from "@/services/safeToSpendService";
import { SpendableCash } from "@/types";

interface SafeToSpendState {
  cash?: SpendableCash;
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
}

export const useSafeToSpendStore = create<SafeToSpendState>((set) => ({
  cash: undefined,
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const cash = await safeToSpendService.calculate();
      set({ cash, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown", loading: false });
    }
  },
})); 