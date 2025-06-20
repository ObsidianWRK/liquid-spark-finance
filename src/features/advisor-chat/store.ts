import { create } from "zustand";
import { advisorService } from "@/features/advisor-chat/api/advisorService";
import { AdvisorThread, AdvisorMessage } from "@/shared/types/shared";

interface AdvisorChatState {
  thread?: AdvisorThread;
  loading: boolean;
  error?: string;
  openChat: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  closeChat: () => void;
}

export const useAdvisorChatStore = create<AdvisorChatState>((set, get) => ({
  thread: undefined,
  loading: false,
  error: undefined,
  openChat: async () => {
    set({ loading: true, error: undefined });
    try {
      const thread = await advisorService.openThread();
      set({ thread, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown", loading: false });
    }
  },
  sendMessage: async (content: string) => {
    const { thread } = get();
    if (!thread) return;
    
    try {
      const msg = await advisorService.sendMessage(thread.id, content);
      // optimistic update
      const updated = { ...thread, messages: [...thread.messages, msg] };
      set({ thread: updated });

      // simulate AI response after delay
      setTimeout(async () => {
        const aiMsg: AdvisorMessage = {
          id: "ai-" + Date.now(),
          sender: "advisor",
          content: "Thanks for your question. I'm here to help with your financial planning needs.",
          createdAt: new Date().toISOString(),
        };
        const final = { ...get().thread!, messages: [...get().thread!.messages, aiMsg] };
        set({ thread: final });
      }, 1500);
    } catch (err: any) {
      set({ error: err.message ?? "Failed to send" });
    }
  },
  closeChat: () => {
    set({ thread: undefined });
  },
})); 