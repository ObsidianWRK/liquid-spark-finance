import { create } from 'zustand';
import { negotiationService } from '@/features/bill-negotiation/api/negotiationService';
import { useSubscriptionsStore } from '@/features/subscriptions/store';
import { NegotiationCase } from '@/types';

interface NegotiationState {
  cases: NegotiationCase[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  negotiateOutstanding: () => Promise<void>;
}

export const useNegotiationStore = create<NegotiationState>((set, get) => ({
  cases: [],
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const current = get().cases;
      // refresh each case status
      const updated: NegotiationCase[] = await Promise.all(
        current.map(
          async (c: NegotiationCase) =>
            (await negotiationService.getNegotiationStatus(c.id)) ?? c
        )
      );
      set({ cases: updated, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? 'Unknown', loading: false });
    }
  },
  negotiateOutstanding: async () => {
    set({ loading: true, error: undefined });
    try {
      const charges = useSubscriptionsStore
        .getState()
        .charges.filter((c) => c.status === 'active');
      const newCases: NegotiationCase[] = [];
      for (const charge of charges) {
        // avoid duplicate negotiation per chargeId
        if (!get().cases.find((cs: NegotiationCase) => cs.chargeId === charge.id)) {
          const nc = await negotiationService.submitNegotiation(charge.id, charge.merchantName);
          newCases.push(nc);
        }
      }
      set({ cases: [...get().cases, ...newCases], loading: false });
    } catch (err: any) {
      set({ error: err.message ?? 'Unknown', loading: false });
    }
  },
}));
