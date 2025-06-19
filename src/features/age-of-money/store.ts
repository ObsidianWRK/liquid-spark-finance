import { create } from "zustand";
import { ageMetricService } from "@/services/ageMetricService";
import { AgeMetric } from "@/types";

interface AgeOfMoneyState {
  metric?: AgeMetric;
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
}

export const useAgeOfMoneyStore = create<AgeOfMoneyState>((set) => ({
  metric: undefined,
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const metric = await ageMetricService.calculate();
      set({ metric, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown", loading: false });
    }
  },
})); 