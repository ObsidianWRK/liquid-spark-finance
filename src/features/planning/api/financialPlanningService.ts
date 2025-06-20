import {
  FinancialGoal,
  GoalCategory,
  GoalStatus,
  RetirementPlan,
  DebtPayoffPlan,
  EmergencyFundPlan,
  InvestmentPlan,
  FinancialMilestone,
  PlanningRecommendation,
  CashFlowProjection,
  NetWorthProjection,
  RiskProfile,
} from '@/types/financialPlanning';

/**
 * Comprehensive Financial Planning Service
 * Handles goal tracking, retirement planning, debt payoff strategies, and long-term projections
 */
export class FinancialPlanningService {
  private static instance: FinancialPlanningService;
  private goals: Map<string, FinancialGoal> = new Map();
  private retirementPlans: Map<string, RetirementPlan> = new Map();
  private debtPlans: Map<string, DebtPayoffPlan> = new Map();
  private emergencyPlans: Map<string, EmergencyFundPlan> = new Map();
  private investmentPlans: Map<string, InvestmentPlan> = new Map();

  // Financial planning constants and formulas
  private readonly INFLATION_RATE = 0.03; // 3% annual inflation
  private readonly SAFE_WITHDRAWAL_RATE = 0.04; // 4% rule for retirement
  private readonly EMERGENCY_FUND_MONTHS = 6; // 6 months of expenses
  private readonly TARGET_DEBT_TO_INCOME = 0.36; // 36% debt-to-income ratio

  static getInstance(): FinancialPlanningService {
    if (!FinancialPlanningService.instance) {
      FinancialPlanningService.instance = new FinancialPlanningService();
    }
    return FinancialPlanningService.instance;
  }

  /**
   * Create and track financial goals with intelligent recommendations
   */
  async createFinancialGoal(
    familyId: string,
    goalData: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>
  ): Promise<FinancialGoal> {
    const goal: FinancialGoal = {
      id: this.generateGoalId(),
      ...goalData,
      progress: {
        currentAmount: 0,
        percentComplete: 0,
        monthlyContribution: 0,
        projectedCompletionDate: this.calculateProjectedCompletion(goalData),
        onTrack: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Apply intelligent defaults and optimizations
    await this.optimizeGoal(goal);

    this.goals.set(goal.id, goal);
    return goal;
  }

  /**
   * Generate comprehensive retirement planning analysis
   */
  async createRetirementPlan(
    familyId: string,
    currentAge: number,
    retirementAge: number,
    currentIncome: number,
    currentSavings: number,
    monthlyContribution: number,
    riskProfile: RiskProfile = 'moderate'
  ): Promise<RetirementPlan> {
    const yearsToRetirement = retirementAge - currentAge;
    const expectedReturn = this.getExpectedReturn(riskProfile);

    // Calculate future value of current savings
    const futureValueCurrent = this.calculateFutureValue(
      currentSavings,
      expectedReturn,
      yearsToRetirement
    );

    // Calculate future value of monthly contributions
    const futureValueContributions = this.calculateAnnuityFutureValue(
      monthlyContribution * 12,
      expectedReturn,
      yearsToRetirement
    );

    const totalRetirementValue = futureValueCurrent + futureValueContributions;

    // Apply inflation adjustment for income replacement
    const inflationAdjustedIncome =
      currentIncome * Math.pow(1 + this.INFLATION_RATE, yearsToRetirement);
    const targetRetirementNeeds = inflationAdjustedIncome * 0.8; // 80% income replacement
    const targetRetirementSavings =
      targetRetirementNeeds / this.SAFE_WITHDRAWAL_RATE;

    const plan: RetirementPlan = {
      id: this.generatePlanId(),
      familyId,
      currentAge,
      retirementAge,
      yearsToRetirement,
      currentIncome,
      currentSavings,
      monthlyContribution,
      riskProfile,
      projections: {
        totalRetirementValue,
        targetRetirementSavings,
        shortfall: Math.max(0, targetRetirementSavings - totalRetirementValue),
        monthlyIncomeAtRetirement:
          (totalRetirementValue * this.SAFE_WITHDRAWAL_RATE) / 12,
        expectedReturn,
      },
      recommendations: await this.generateRetirementRecommendations(
        totalRetirementValue,
        targetRetirementSavings,
        monthlyContribution,
        yearsToRetirement
      ),
      milestones: this.generateRetirementMilestones(
        currentAge,
        retirementAge,
        targetRetirementSavings
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.retirementPlans.set(plan.id, plan);
    return plan;
  }

  /**
   * Create optimized debt payoff strategy
   */
  async createDebtPayoffPlan(
    familyId: string,
    debts: Array<{
      name: string;
      balance: number;
      interestRate: number;
      minimumPayment: number;
    }>,
    extraPayment: number = 0,
    strategy: 'avalanche' | 'snowball' = 'avalanche'
  ): Promise<DebtPayoffPlan> {
    // Sort debts based on strategy
    const sortedDebts = [...debts].sort((a, b) => {
      if (strategy === 'avalanche') {
        return b.interestRate - a.interestRate; // Highest interest first
      } else {
        return a.balance - b.balance; // Lowest balance first
      }
    });

    const payoffSchedule = this.calculateDebtPayoffSchedule(
      sortedDebts,
      extraPayment
    );
    const totalInterest = payoffSchedule.reduce(
      (sum, debt) => sum + debt.totalInterest,
      0
    );
    const payoffDate = new Date();
    payoffDate.setMonth(
      payoffDate.getMonth() +
        Math.max(...payoffSchedule.map((d) => d.monthsToPayoff))
    );

    const plan: DebtPayoffPlan = {
      id: this.generatePlanId(),
      familyId,
      strategy,
      debts: sortedDebts,
      extraPayment,
      projections: {
        totalDebt: debts.reduce((sum, debt) => sum + debt.balance, 0),
        totalInterest,
        monthsToPayoff: Math.max(
          ...payoffSchedule.map((d) => d.monthsToPayoff)
        ),
        payoffDate,
        monthlySavingsAfterPayoff:
          debts.reduce((sum, debt) => sum + debt.minimumPayment, 0) +
          extraPayment,
      },
      payoffSchedule,
      recommendations: await this.generateDebtRecommendations(
        debts,
        extraPayment,
        totalInterest
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.debtPlans.set(plan.id, plan);
    return plan;
  }

  /**
   * Emergency fund planning with intelligent sizing
   */
  async createEmergencyFundPlan(
    familyId: string,
    monthlyExpenses: number,
    currentEmergencyFund: number = 0,
    monthlyContribution: number = 0,
    targetMonths: number = this.EMERGENCY_FUND_MONTHS
  ): Promise<EmergencyFundPlan> {
    const targetAmount = monthlyExpenses * targetMonths;
    const shortfall = Math.max(0, targetAmount - currentEmergencyFund);
    const monthsToTarget =
      monthlyContribution > 0
        ? Math.ceil(shortfall / monthlyContribution)
        : Infinity;

    const plan: EmergencyFundPlan = {
      id: this.generatePlanId(),
      familyId,
      monthlyExpenses,
      targetMonths,
      targetAmount,
      currentAmount: currentEmergencyFund,
      monthlyContribution,
      projections: {
        shortfall,
        monthsToTarget,
        completionDate:
          monthlyContribution > 0
            ? new Date(Date.now() + monthsToTarget * 30 * 24 * 60 * 60 * 1000)
            : null,
      },
      recommendations: await this.generateEmergencyFundRecommendations(
        monthlyExpenses,
        currentEmergencyFund,
        monthlyContribution,
        targetAmount
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.emergencyPlans.set(plan.id, plan);
    return plan;
  }

  /**
   * Generate comprehensive financial projections
   */
  async generateFinancialProjections(
    familyId: string,
    timeHorizon: number = 30
  ): Promise<{
    netWorthProjection: NetWorthProjection[];
    cashFlowProjection: CashFlowProjection[];
    goalProjections: Array<{
      goalId: string;
      projectedCompletion: Date;
      probability: number;
    }>;
  }> {
    const goals = Array.from(this.goals.values()).filter(
      (g) => g.familyId === familyId
    );
    const netWorthProjection: NetWorthProjection[] = [];
    const cashFlowProjection: CashFlowProjection[] = [];

    // Generate month-by-month projections
    for (let month = 0; month <= timeHorizon * 12; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() + month);

      // Net worth projection (simplified - would integrate with all services)
      netWorthProjection.push({
        date,
        totalAssets: 100000 * Math.pow(1.07, month / 12), // 7% annual growth
        totalLiabilities: 50000 * Math.pow(0.95, month / 12), // 5% annual reduction
        netWorth:
          100000 * Math.pow(1.07, month / 12) -
          50000 * Math.pow(0.95, month / 12),
      });

      // Cash flow projection
      cashFlowProjection.push({
        date,
        income: 8000, // Monthly income
        expenses: 6000, // Monthly expenses
        netCashFlow: 2000,
        savingsRate: 0.25,
      });
    }

    // Goal completion projections
    const goalProjections = goals.map((goal) => ({
      goalId: goal.id,
      projectedCompletion: goal.progress.projectedCompletionDate,
      probability: this.calculateGoalProbability(goal),
    }));

    return {
      netWorthProjection,
      cashFlowProjection,
      goalProjections,
    };
  }

  /**
   * Get comprehensive financial health score and recommendations
   */
  async getFinancialHealthScore(familyId: string): Promise<{
    overallScore: number;
    categoryScores: {
      emergency: number;
      debt: number;
      savings: number;
      investment: number;
      retirement: number;
    };
    recommendations: PlanningRecommendation[];
  }> {
    // Calculate scores for each category (0-100)
    const categoryScores = {
      emergency: await this.calculateEmergencyScore(familyId),
      debt: await this.calculateDebtScore(familyId),
      savings: await this.calculateSavingsScore(familyId),
      investment: await this.calculateInvestmentScore(familyId),
      retirement: await this.calculateRetirementScore(familyId),
    };

    const overallScore =
      Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 5;

    const recommendations =
      await this.generateHealthRecommendations(categoryScores);

    return {
      overallScore,
      categoryScores,
      recommendations,
    };
  }

  // Private helper methods
  private calculateProjectedCompletion(goalData: any): Date {
    // Simplified calculation - would use more sophisticated modeling
    const monthsToComplete =
      goalData.targetAmount / (goalData.monthlyContribution || 100);
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsToComplete);
    return completionDate;
  }

  private async optimizeGoal(goal: FinancialGoal): Promise<void> {
    // Apply intelligent optimizations based on goal type and family situation
    if (goal.category === 'retirement' && !goal.monthlyContribution) {
      goal.monthlyContribution = goal.targetAmount * 0.001; // 0.1% monthly default
    }
  }

  private getExpectedReturn(riskProfile: RiskProfile): number {
    const returns = {
      conservative: 0.04,
      moderate: 0.07,
      aggressive: 0.1,
    };
    return returns[riskProfile];
  }

  private calculateFutureValue(
    principal: number,
    rate: number,
    years: number
  ): number {
    return principal * Math.pow(1 + rate, years);
  }

  private calculateAnnuityFutureValue(
    payment: number,
    rate: number,
    years: number
  ): number {
    return (payment * (Math.pow(1 + rate, years) - 1)) / rate;
  }

  private async generateRetirementRecommendations(
    currentProjection: number,
    target: number,
    monthlyContribution: number,
    yearsToRetirement: number
  ): Promise<PlanningRecommendation[]> {
    const recommendations: PlanningRecommendation[] = [];

    if (currentProjection < target) {
      const shortfall = target - currentProjection;
      const additionalMonthlyNeeded = shortfall / (yearsToRetirement * 12);

      recommendations.push({
        type: 'increase_contributions',
        title: 'Increase Monthly Retirement Contributions',
        description: `Consider increasing your monthly contribution by $${additionalMonthlyNeeded.toFixed(0)} to meet your retirement goal.`,
        impact: 'high',
        priority: 1,
        estimatedBenefit: shortfall,
        actionItems: [
          'Review your budget for additional savings opportunities',
          'Consider increasing 401(k) contributions to maximize employer match',
          'Explore IRA contribution limits',
        ],
      });
    }

    return recommendations;
  }

  private generateRetirementMilestones(
    currentAge: number,
    retirementAge: number,
    targetSavings: number
  ): FinancialMilestone[] {
    const milestones: FinancialMilestone[] = [];
    const yearsToRetirement = retirementAge - currentAge;

    // Create milestones every 5 years
    for (let age = currentAge + 5; age < retirementAge; age += 5) {
      const yearsFromNow = age - currentAge;
      const targetAmount = targetSavings * (yearsFromNow / yearsToRetirement);

      milestones.push({
        id: `retirement_${age}`,
        title: `Age ${age} Retirement Checkpoint`,
        description: `Target savings by age ${age}`,
        targetAmount,
        targetDate: new Date(
          Date.now() + yearsFromNow * 365 * 24 * 60 * 60 * 1000
        ),
        category: 'retirement',
        completed: false,
      });
    }

    return milestones;
  }

  private calculateDebtPayoffSchedule(
    debts: Array<{
      name: string;
      balance: number;
      interestRate: number;
      minimumPayment: number;
    }>,
    extraPayment: number
  ) {
    return debts.map((debt) => {
      const monthlyRate = debt.interestRate / 12;
      const payment = debt.minimumPayment + extraPayment / debts.length;

      const monthsToPayoff = Math.ceil(
        Math.log(1 + (debt.balance * monthlyRate) / payment) /
          Math.log(1 + monthlyRate)
      );

      const totalPaid = payment * monthsToPayoff;
      const totalInterest = totalPaid - debt.balance;

      return {
        ...debt,
        monthsToPayoff: isNaN(monthsToPayoff) ? 0 : monthsToPayoff,
        totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
        totalPaid: isNaN(totalPaid) ? debt.balance : totalPaid,
      };
    });
  }

  private async generateDebtRecommendations(
    debts: Array<any>,
    extraPayment: number,
    totalInterest: number
  ): Promise<PlanningRecommendation[]> {
    const recommendations: PlanningRecommendation[] = [];

    if (extraPayment === 0) {
      recommendations.push({
        type: 'debt_payoff',
        title: 'Add Extra Debt Payments',
        description:
          'Even an extra $50/month can significantly reduce interest paid and payoff time.',
        impact: 'high',
        priority: 1,
        estimatedBenefit: totalInterest * 0.3, // 30% interest savings estimate
        actionItems: [
          'Review budget for additional payment opportunities',
          'Apply windfalls (tax refunds, bonuses) to debt',
          'Consider debt consolidation for lower rates',
        ],
      });
    }

    return recommendations;
  }

  private async generateEmergencyFundRecommendations(
    monthlyExpenses: number,
    currentAmount: number,
    monthlyContribution: number,
    targetAmount: number
  ): Promise<PlanningRecommendation[]> {
    const recommendations: PlanningRecommendation[] = [];

    if (currentAmount < targetAmount) {
      recommendations.push({
        type: 'emergency_fund',
        title: 'Build Emergency Fund',
        description: `Aim for ${this.EMERGENCY_FUND_MONTHS} months of expenses ($${targetAmount.toLocaleString()}) in easily accessible savings.`,
        impact: 'high',
        priority: 1,
        estimatedBenefit: targetAmount - currentAmount,
        actionItems: [
          'Open a high-yield savings account',
          'Automate monthly transfers',
          'Start with a $1,000 starter emergency fund',
        ],
      });
    }

    return recommendations;
  }

  private calculateGoalProbability(goal: FinancialGoal): number {
    // Simplified probability calculation based on current progress and timeline
    const timeRemaining = goal.targetDate.getTime() - Date.now();
    const monthsRemaining = timeRemaining / (30 * 24 * 60 * 60 * 1000);

    if (monthsRemaining <= 0) return 0;

    const requiredMonthlyContribution =
      (goal.targetAmount - goal.progress.currentAmount) / monthsRemaining;

    const currentContribution = goal.monthlyContribution || 0;

    if (currentContribution >= requiredMonthlyContribution) return 0.95;
    if (currentContribution >= requiredMonthlyContribution * 0.8) return 0.75;
    if (currentContribution >= requiredMonthlyContribution * 0.5) return 0.5;
    return 0.25;
  }

  private async calculateEmergencyScore(familyId: string): Promise<number> {
    // Simplified scoring - would integrate with actual data
    return 75; // Example score
  }

  private async calculateDebtScore(familyId: string): Promise<number> {
    return 80; // Example score
  }

  private async calculateSavingsScore(familyId: string): Promise<number> {
    return 85; // Example score
  }

  private async calculateInvestmentScore(familyId: string): Promise<number> {
    return 70; // Example score
  }

  private async calculateRetirementScore(familyId: string): Promise<number> {
    return 65; // Example score
  }

  private async generateHealthRecommendations(
    scores: any
  ): Promise<PlanningRecommendation[]> {
    const recommendations: PlanningRecommendation[] = [];

    // Generate recommendations based on lowest scores
    const sortedScores = Object.entries(scores).sort(
      ([, a], [, b]) => (a as number) - (b as number)
    );

    for (const [category, score] of sortedScores.slice(0, 3)) {
      if ((score as number) < 80) {
        recommendations.push({
          type: category as any,
          title: `Improve ${category.charAt(0).toUpperCase() + category.slice(1)} Score`,
          description: `Your ${category} score of ${score} has room for improvement.`,
          impact: 'medium',
          priority: recommendations.length + 1,
          estimatedBenefit: 0,
          actionItems: [`Focus on ${category} improvements`],
        });
      }
    }

    return recommendations;
  }

  private generateGoalId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePlanId(): string {
    return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const financialPlanningService = FinancialPlanningService.getInstance();
