import { AutosavePlan } from '../types';

export interface AutoSaveEngine {
  createPlan: (
    plan: Omit<AutosavePlan, 'id' | 'nextTransferDate'>
  ) => Promise<AutosavePlan>;
  listPlans: () => Promise<AutosavePlan[]>;
  pausePlan: (planId: string) => Promise<void>;
  resumePlan: (planId: string) => Promise<void>;
}

class MockAutoSaveEngine implements AutoSaveEngine {
  private plans: AutosavePlan[] = [];

  async createPlan(
    planInput: Omit<AutosavePlan, 'id' | 'nextTransferDate'>
  ): Promise<AutosavePlan> {
    const plan: AutosavePlan = {
      ...planInput,
      id: 'plan-' + Math.random().toString(36).substring(2),
      nextTransferDate: new Date().toISOString(),
      isActive: true,
    };
    this.plans.push(plan);
    return plan;
  }

  async listPlans(): Promise<AutosavePlan[]> {
    return this.plans;
  }

  async pausePlan(planId: string): Promise<void> {
    const plan = this.plans.find((p) => p.id === planId);
    if (plan) plan.isActive = false;
  }

  async resumePlan(planId: string): Promise<void> {
    const plan = this.plans.find((p) => p.id === planId);
    if (plan) plan.isActive = true;
  }
}

export const autoSaveEngine: AutoSaveEngine = new MockAutoSaveEngine();
