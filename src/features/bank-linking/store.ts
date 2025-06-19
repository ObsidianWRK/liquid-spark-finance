import { create } from "zustand";
import { bankLinkProvider } from "@/features/bankLinkProvider";
import { LinkedAccount } from "@/types";

interface BankLinkingState {
  accounts: LinkedAccount[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  linkMockAccount: () => Promise<void>;
  unlink: (id: string) => Promise<void>;
}

export const useBankLinkingStore = create<BankLinkingState>((set, get) => ({
  accounts: [],
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const accounts = await bankLinkProvider.getLinkedAccounts();
      set({ accounts, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown error", loading: false });
    }
  },
  linkMockAccount: async () => {
    await bankLinkProvider.exchangePublicToken("public-token-" + Date.now());
    await get().refresh();
  },
  unlink: async (id: string) => {
    await bankLinkProvider.unlinkAccount(id);
    await get().refresh();
  },
})); 