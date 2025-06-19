import { LinkedAccount } from "../types";

// NOTE: In a production build this file will be swapped with a concrete implementation (Plaid, Teller, etc.)
// For now we expose an interface and a simple in-memory mock provider so that feature development can proceed.

export interface BankLinkProvider {
  /**
   * Initiates a link flow and returns a link token that the client can use to bootstrap OAuth.
   */
  createLinkToken: () => Promise<string>;

  /**
   * Finalises the link process and stores the linked account meta.
   */
  exchangePublicToken: (publicToken: string) => Promise<LinkedAccount>;

  /**
   * Returns all linked accounts for the current user.
   */
  getLinkedAccounts: () => Promise<LinkedAccount[]>;

  /**
   * Unlinks an existing account by id.
   */
  unlinkAccount: (accountId: string) => Promise<void>;
}

// Simple mock implementation – will be replaced during integration testing.
class InMemoryBankLinkProvider implements BankLinkProvider {
  private accounts: LinkedAccount[] = [];

  async createLinkToken(): Promise<string> {
    return "mock-link-token-" + Math.random().toString(36).substring(2, 15);
  }

  async exchangePublicToken(publicToken: string): Promise<LinkedAccount> {
    const newAccount: LinkedAccount = {
      id: publicToken + "-acc",
      provider: "mock",
      displayName: "Mock Checking",
      institutionName: "Mock Bank",
      lastFour: "1234",
      type: "checking",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  async getLinkedAccounts(): Promise<LinkedAccount[]> {
    return this.accounts;
  }

  async unlinkAccount(accountId: string): Promise<void> {
    this.accounts = this.accounts.filter((acc) => acc.id !== accountId);
  }
}

// Export a singleton mock provider for immediate use
export const bankLinkProvider: BankLinkProvider = new InMemoryBankLinkProvider(); 