import { create } from "zustand";
import { subscriptionService } from "@/features/subscriptionService";
import { RecurringCharge } from "@/types";

interface SubscriptionsState {
  charges: RecurringCharge[];
  loading: boolean;
  error?: string;
  detect: () => Promise<void>;
  cancel: (id: string) => Promise<void>;
}

export const useSubscriptionsStore = create<SubscriptionsState>((set, get) => ({
  charges: [],
  loading: false,
  error: undefined,
  detect: async () => {
    set({ loading: true, error: undefined });
    try {
      const charges = await subscriptionService.detectSubscriptions([]);
      set({ charges, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown", loading: false });
    }
  },
  cancel: async (id: string) => {
    await subscriptionService.cancelSubscription(id);
    const updated = get().charges.map((c) => (c.id === id ? { ...c, status: "pending_cancel" } : c));
    set({ charges: updated });
  },
})); 