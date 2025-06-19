import { describe, it, expect } from "vitest";
import { useAdvisorChatStore as store } from "@/features/advisor-chat/store";

describe("Advisor Chat Store", () => {
  it("opens thread and sends message", async () => {
    await (store as any).getState().openChat();
    const thread = (store as any).getState().thread;
    expect(thread).toBeDefined();

    await (store as any).getState().sendMessage("Hello");
    const updated = (store as any).getState().thread;
    expect(updated.messages.length).toBeGreaterThan(0);
  });
}); 