import { describe, it, expect } from "vitest";
import { useSharedBudgetsStore as store } from "@/features/shared-budgets/store";

describe("Shared Budgets Store", () => {
  it("creates household and lists", async () => {
    await (store as any).getState().create("Family One");
    const households = (store as any).getState().households;
    expect(households.find((h: any) => h.name === "Family One")).toBeTruthy();
  });
}); 