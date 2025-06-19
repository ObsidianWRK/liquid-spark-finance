import { SpendableCash } from "../types";

export interface SafeToSpendService {
  calculate: () => Promise<SpendableCash>;
}

class MockSafeToSpendService implements SafeToSpendService {
  async calculate(): Promise<SpendableCash> {
    // Mock calculation: random safe amount + next Friday as payday
    const today = new Date();
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));

    return {
      amount: Math.floor(Math.random() * 800) + 200, // $200-$1000
      payday: nextFriday.toISOString(),
      calculatedAt: new Date().toISOString(),
    };
  }
}

export const safeToSpendService: SafeToSpendService = new MockSafeToSpendService(); 