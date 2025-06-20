import { describe, it, expect } from "vitest";
import { usePrivacyStore as store } from "@/features/privacy-hide-amounts/store";
import { formatCurrency } from "@/shared/utils/formatters";

describe("Privacy hide amounts", () => {
  it("masks currency when enabled", () => {
    (store as any).getState().toggle(); // enable hide
    const hidden = formatCurrency(1234);
    expect(/•/.test(hidden)).toBe(true);
    (store as any).getState().toggle(); // disable
  });
}); 