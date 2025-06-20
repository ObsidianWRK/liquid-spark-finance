export type GoalCategory =
  | 'emergency_fund'
  | 'retirement'
  | 'house_down_payment'
  | 'vacation'
  | 'education'
  | 'debt_payoff'
  | 'car_purchase'
  | 'investment'
  | 'wedding'
  | 'business'
  | 'other';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  familyId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetAmount: number;
  targetDate: Date;
  priority: number; // 1-5, 1 being highest
  monthlyContribution?: number;
  autoContribute: boolean;
  status: GoalStatus;
  progress: {
    currentAmount: number;
    percentComplete: number;
    monthlyContribution: number;
    projectedCompletionDate: Date;
    onTrack: boolean;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RetirementPlan {
  id: string;
  familyId: string;
  currentAge: number;
  retirementAge: number;
  yearsToRetirement: number;
  currentIncome: number;
  currentSavings: number;
  monthlyContribution: number;
  riskProfile: RiskProfile;
  projections: {
    totalRetirementValue: number;
    targetRetirementSavings: number;
    shortfall: number;
    monthlyIncomeAtRetirement: number;
    expectedReturn: number;
  };
  recommendations: PlanningRecommendation[];
  milestones: FinancialMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtPayoffPlan {
  id: string;
  familyId: string;
  strategy: 'avalanche' | 'snowball';
  debts: Array<{
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
  }>;
  extraPayment: number;
  projections: {
    totalDebt: number;
    totalInterest: number;
    monthsToPayoff: number;
    payoffDate: Date;
    monthlySavingsAfterPayoff: number;
  };
  payoffSchedule: Array<{
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
    monthsToPayoff: number;
    totalInterest: number;
    totalPaid: number;
  }>;
  recommendations: PlanningRecommendation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyFundPlan {
  id: string;
  familyId: string;
  monthlyExpenses: number;
  targetMonths: number;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  projections: {
    shortfall: number;
    monthsToTarget: number;
    completionDate: Date | null;
  };
  recommendations: PlanningRecommendation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentPlan {
  id: string;
  familyId: string;
  goalAmount: number;
  timeHorizon: number; // years
  riskProfile: RiskProfile;
  monthlyContribution: number;
  assetAllocation: {
    stocks: number;
    bonds: number;
    reits: number;
    commodities: number;
    cash: number;
  };
  projections: {
    expectedValue: number;
    probabilityOfSuccess: number;
    worstCaseScenario: number;
    bestCaseScenario: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialMilestone {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  targetDate: Date;
  category: GoalCategory;
  completed: boolean;
  completedDate?: Date;
}

export interface PlanningRecommendation {
  type:
    | 'increase_contributions'
    | 'debt_payoff'
    | 'emergency_fund'
    | 'investment'
    | 'insurance'
    | 'tax_strategy';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  priority: number;
  estimatedBenefit: number; // Dollar amount
  actionItems: string[];
  deadline?: Date;
}

export interface CashFlowProjection {
  date: Date;
  income: number;
  expenses: number;
  netCashFlow: number;
  savingsRate: number;
}

export interface NetWorthProjection {
  date: Date;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export interface FinancialHealthMetrics {
  emergencyFundRatio: number; // months of expenses covered
  debtToIncomeRatio: number;
  savingsRate: number;
  netWorthGrowthRate: number;
  investmentDiversification: number;
  retirementReadiness: number;
}

export interface GoalProgress {
  goalId: string;
  currentAmount: number;
  targetAmount: number;
  percentComplete: number;
  daysRemaining: number;
  onTrack: boolean;
  suggestedMonthlyContribution: number;
  projectedCompletionDate: Date;
}

export interface FinancialSnapshot {
  date: Date;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  investmentValue: number;
  debtBalance: number;
}

export interface LifeEventPlanning {
  eventType:
    | 'marriage'
    | 'baby'
    | 'house_purchase'
    | 'job_change'
    | 'retirement'
    | 'education';
  plannedDate: Date;
  estimatedCost: number;
  currentSavings: number;
  monthlyContribution: number;
  recommendations: PlanningRecommendation[];
}
