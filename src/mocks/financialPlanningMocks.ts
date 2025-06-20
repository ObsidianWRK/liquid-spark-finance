import {
  FinancialGoal,
  RetirementPlan,
  DebtPayoffPlan,
  LifeEventPlanning,
  InvestmentPlan,
  CashFlowProjection,
  NetWorthProjection,
} from '@/shared/types/financialPlanning';

/**
 * Simulate network latency for realistic user experience
 */
export const simulateLatency = (delay: number = 400): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * delay + delay * 0.5);
  });
};

/**
 * Generate realistic dates relative to current time
 */
const getRelativeDate = (months: number): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
};

/**
 * Enhanced Retirement Planning Mock Data
 */
export const mockRetirementPlans: RetirementPlan[] = [
  {
    id: 'retirement_plan_1',
    familyId: 'demo_family',
    currentAge: 35,
    retirementAge: 65,
    yearsToRetirement: 30,
    currentIncome: 95000,
    currentSavings: 125000,
    monthlyContribution: 1200,
    riskProfile: 'moderate',
    projections: {
      totalRetirementValue: 1850000,
      targetRetirementSavings: 2280000,
      shortfall: 430000,
      monthlyIncomeAtRetirement: 6167,
      expectedReturn: 0.07,
    },
    recommendations: [
      {
        type: 'increase_contributions',
        title: 'Increase 401(k) Contributions',
        description:
          'Consider increasing your monthly contribution by $300 to meet your retirement goal.',
        impact: 'high',
        priority: 1,
        estimatedBenefit: 430000,
        actionItems: [
          'Increase 401(k) contribution to employer match limit',
          'Consider Roth IRA for tax diversification',
        ],
        deadline: getRelativeDate(1),
      },
    ],
    milestones: [
      {
        id: 'milestone_40',
        title: 'Age 40 Checkpoint',
        description: 'Target: 3x annual income saved',
        targetAmount: 285000,
        targetDate: getRelativeDate(60),
        category: 'retirement',
        completed: false,
      },
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

/**
 * Comprehensive Debt Payoff Mock Data
 */
export const mockDebtPlans: DebtPayoffPlan[] = [
  {
    id: 'debt_plan_1',
    familyId: 'demo_family',
    strategy: 'avalanche',
    debts: [
      {
        name: 'Credit Card - Chase Sapphire',
        balance: 8500,
        interestRate: 0.2299,
        minimumPayment: 255,
      },
      {
        name: 'Personal Loan',
        balance: 12000,
        interestRate: 0.0899,
        minimumPayment: 380,
      },
      {
        name: 'Student Loan',
        balance: 28000,
        interestRate: 0.0649,
        minimumPayment: 295,
      },
    ],
    extraPayment: 500,
    projections: {
      totalDebt: 48500,
      totalInterest: 8950,
      monthsToPayoff: 36,
      payoffDate: getRelativeDate(36),
      monthlySavingsAfterPayoff: 1430,
    },
    payoffSchedule: [
      {
        name: 'Credit Card - Chase Sapphire',
        balance: 8500,
        interestRate: 0.2299,
        minimumPayment: 255,
        monthsToPayoff: 12,
        totalInterest: 1240,
        totalPaid: 9740,
      },
      {
        name: 'Personal Loan',
        balance: 12000,
        interestRate: 0.0899,
        minimumPayment: 380,
        monthsToPayoff: 24,
        totalInterest: 1850,
        totalPaid: 13850,
      },
      {
        name: 'Student Loan',
        balance: 28000,
        interestRate: 0.0649,
        minimumPayment: 295,
        monthsToPayoff: 36,
        totalInterest: 5860,
        totalPaid: 33860,
      },
    ],
    recommendations: [
      {
        type: 'debt_payoff',
        title: 'Focus Extra Payments on Highest Interest',
        description:
          'Continue with avalanche method - pay minimums on all debts, extra toward highest interest.',
        impact: 'high',
        priority: 1,
        estimatedBenefit: 4200,
        actionItems: [
          'Put all extra payments toward Chase Sapphire',
          'Consider balance transfer to 0% APR card',
        ],
      },
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

/**
 * Life Event Planning Mock Data
 */
export const mockLifeEventPlans: LifeEventPlanning[] = [
  {
    eventType: 'baby',
    plannedDate: getRelativeDate(18),
    estimatedCost: 25000,
    currentSavings: 8500,
    monthlyContribution: 750,
    recommendations: [
      {
        type: 'emergency_fund',
        title: 'Increase Emergency Fund',
        description:
          'With a baby coming, increase emergency fund to 8-9 months of expenses.',
        impact: 'high',
        priority: 1,
        estimatedBenefit: 15000,
        actionItems: [
          'Open dedicated baby fund savings account',
          'Research health insurance changes',
        ],
      },
    ],
  },
  {
    eventType: 'house_purchase',
    plannedDate: getRelativeDate(36),
    estimatedCost: 100000,
    currentSavings: 32000,
    monthlyContribution: 2000,
    recommendations: [
      {
        type: 'investment',
        title: 'Conservative Investment Strategy',
        description:
          'For goals within 3 years, keep funds in high-yield savings.',
        impact: 'medium',
        priority: 1,
        estimatedBenefit: 5000,
        actionItems: [
          'Move house fund to high-yield savings',
          'Research first-time buyer programs',
        ],
      },
    ],
  },
];

/**
 * Mock API Response Generator
 */
export class MockFinancialPlanningAPI {
  static async getRetirementPlan(familyId: string): Promise<RetirementPlan> {
    await simulateLatency(600);
    return mockRetirementPlans[0];
  }

  static async getDebtPayoffPlan(familyId: string): Promise<DebtPayoffPlan> {
    await simulateLatency(500);
    return mockDebtPlans[0];
  }

  static async getLifeEventPlans(
    familyId: string
  ): Promise<LifeEventPlanning[]> {
    await simulateLatency(400);
    return mockLifeEventPlans;
  }
}
