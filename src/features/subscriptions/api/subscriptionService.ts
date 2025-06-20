import { RecurringCharge } from '../types';

export interface SubscriptionService {
  detectSubscriptions: (transactions: unknown[]) => Promise<RecurringCharge[]>;
  cancelSubscription: (chargeId: string) => Promise<boolean>; // returns success flag
}

class MockSubscriptionService implements SubscriptionService {
  private charges: RecurringCharge[] = [];

  async detectSubscriptions(): Promise<RecurringCharge[]> {
    if (this.charges.length === 0) {
      // generate mock charges
      this.charges = [
        {
          id: 'sub-1',
          accountId: 'acc1',
          merchantName: 'Netflix',
          amount: 15.99,
          frequency: 'monthly',
          nextDueDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: 'active',
        },
        {
          id: 'sub-2',
          accountId: 'acc1',
          merchantName: 'Spotify',
          amount: 9.99,
          frequency: 'monthly',
          nextDueDate: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: 'active',
        },
      ];
    }
    return this.charges;
  }

  async cancelSubscription(chargeId: string): Promise<boolean> {
    const charge = this.charges.find((c) => c.id === chargeId);
    if (charge) {
      charge.status = 'pending_cancel';
      return true;
    }
    return false;
  }
}

export const subscriptionService: SubscriptionService =
  new MockSubscriptionService();
