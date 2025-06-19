import { describe, it, expect } from "vitest";
import { useNegotiationStore as store } from "@/features/bill-negotiation/store";
import { useSubscriptionsStore } from "@/features/subscriptions/store";

// ensure subscriptions charges exist before negotiation

describe("Negotiation Store", () => {
  it("creates negotiation cases for active subscriptions", async () => {
    await (useSubscriptionsStore as any).getState().detect();
    await (store as any).getState().negotiateOutstanding();
    const cases = (store as any).getState().cases;
    expect(cases.length).toBeGreaterThan(0);
  });
}); 