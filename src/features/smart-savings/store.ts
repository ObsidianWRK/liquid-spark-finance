import { create } from "zustand";
import { autoSaveEngine } from "@/services/autoSaveEngine";
import { AutosavePlan } from "@/types";

interface SmartSavingsState {
  plans: AutosavePlan[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  create: (input: Omit<AutosavePlan, "id" | "nextTransferDate">) => Promise<void>;
  pause: (id: string) => Promise<void>;
  resume: (id: string) => Promise<void>;
}

export const useSmartSavingsStore = create<SmartSavingsState>((set, get) => ({
  plans: [],
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const plans = await autoSaveEngine.listPlans();
      set({ plans, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown", loading: false });
    }
  },
  create: async (input) => {
    await autoSaveEngine.createPlan(input);
    await get().refresh();
  },
  pause: async (id) => {
    await autoSaveEngine.pausePlan(id);
    await get().refresh();
  },
  resume: async (id) => {
    await autoSaveEngine.resumePlan(id);
    await get().refresh();
  },
})); 