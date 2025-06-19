import { describe, it, expect } from "vitest";
import { bankLinkProvider } from "../services/bankLinkProvider";
import { subscriptionService } from "../services/subscriptionService";
import { negotiationService } from "../services/negotiationService";
import { autoSaveEngine } from "../services/autoSaveEngine";
import { householdService } from "../services/householdService";
import { advisorService } from "../services/advisorService";

/**
 * These tests ensure the mock services behave deterministically and support further feature development.
 */

describe("Gap-10 Mock Services", () => {
  it("bankLinkProvider end-to-end", async () => {
    const linkToken = await bankLinkProvider.createLinkToken();
    expect(linkToken).toMatch(/^mock-link-token-/);

    const acc = await bankLinkProvider.exchangePublicToken("public-token");
    expect(acc).toHaveProperty("id");

    const accounts = await bankLinkProvider.getLinkedAccounts();
    expect(accounts).toHaveLength(1);

    await bankLinkProvider.unlinkAccount(acc.id);
    const accountsAfter = await bankLinkProvider.getLinkedAccounts();
    expect(accountsAfter).toHaveLength(0);
  });

  it("subscriptionService detects and cancels", async () => {
    const charges = await subscriptionService.detectSubscriptions([]);
    expect(charges).toBeInstanceOf(Array);

    const result = await subscriptionService.cancelSubscription("nonexistent");
    expect(result).toBe(false);
  });

  it("negotiationService queue & status", async () => {
    const nc = await negotiationService.submitNegotiation("charge1");
    expect(nc.status).toBe("queued");

    const status = await negotiationService.getNegotiationStatus(nc.id);
    expect(status).toEqual(nc);
  });

  it("autoSaveEngine lifecycle", async () => {
    const plan = await autoSaveEngine.createPlan({
      accountId: "acc1",
      targetAmount: 100,
      cadence: "daily",
      isActive: true,
    } as any);
    expect(plan.isActive).toBe(true);

    await autoSaveEngine.pausePlan(plan.id);
    const afterPause = (await autoSaveEngine.listPlans())[0];
    expect(afterPause.isActive).toBe(false);

    await autoSaveEngine.resumePlan(plan.id);
    const afterResume = (await autoSaveEngine.listPlans())[0];
    expect(afterResume.isActive).toBe(true);
  });

  it("householdService crud", async () => {
    const house = await householdService.createHousehold("My House");
    expect(house.name).toBe("My House");

    const list = await householdService.listHouseholds();
    expect(list.map((h) => h.id)).toContain(house.id);
  });

  it("advisorService thread", async () => {
    const thread = await advisorService.openThread();
    expect(thread.messages).toHaveLength(0);

    const msg = await advisorService.sendMessage(thread.id, "Hello");
    expect(msg.sender).toBe("user");
  });
}); 