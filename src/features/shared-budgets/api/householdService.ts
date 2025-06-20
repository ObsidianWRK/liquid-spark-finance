import { Household } from '../types';

export interface HouseholdService {
  createHousehold: (name: string) => Promise<Household>;
  inviteMember: (householdId: string, userId: string) => Promise<void>;
  acceptInvite: (householdId: string) => Promise<void>;
  listHouseholds: () => Promise<Household[]>;
}

class MockHouseholdService implements HouseholdService {
  private households: Household[] = [];

  async createHousehold(name: string): Promise<Household> {
    const household: Household = {
      id: 'house-' + Math.random().toString(36).substring(2),
      name,
      members: [],
      createdAt: new Date().toISOString(),
    };
    this.households.push(household);
    return household;
  }

  async inviteMember(_householdId: string, _userId: string): Promise<void> {
    // Mock – no-op
  }

  async acceptInvite(_householdId: string): Promise<void> {
    // Mock – no-op
  }

  async listHouseholds(): Promise<Household[]> {
    return this.households;
  }
}

export const householdService: HouseholdService = new MockHouseholdService();
