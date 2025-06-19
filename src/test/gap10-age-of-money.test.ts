import { describe, it, expect } from "vitest";
import { useAgeOfMoneyStore as store } from "@/features/age-of-money/store";

describe("Age of Money Store", () => {
  it("calculates metric", async () => {
    await (store as any).getState().refresh();
    const metric = (store as any).getState().metric;
    expect(metric?.averageDaysHeld).toBeGreaterThan(0);
  });
}); 