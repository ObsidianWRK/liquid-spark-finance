import { SavingsGoal, Contribution, SavingsInsight } from '@/types/savingsGoals';

export class SavingsGoalsService {
  private static instance: SavingsGoalsService;
  private goals: SavingsGoal[] = [];

  static getInstance(): SavingsGoalsService {
    if (!SavingsGoalsService.instance) {
      SavingsGoalsService.instance = new SavingsGoalsService();
    }
    return SavingsGoalsService.instance;
  }

  async getGoals(): Promise<SavingsGoal[]> {
    // Mock data - replace with API call
    if (this.goals.length === 0) {
      this.goals = [
        {
          id: '1',
          name: 'Emergency Fund',
          description: 'Save 6 months of expenses',
          targetAmount: 15000,
          currentAmount: 8500,
          targetDate: '2024-12-31',
          category: 'Emergency Fund',
          color: '#ef4444',
          icon: '🛡️',
          isCompleted: false,
          createdAt: '2024-01-01',
          contributions: [
            {
              id: '1',
              amount: 1000,
              date: '2024-01-15',
              type: 'manual',
              description: 'Initial deposit'
            },
            {
              id: '2',
              amount: 500,
              date: '2024-02-01',
              type: 'automatic',
              description: 'Monthly transfer'
            }
          ]
        },
        {
          id: '2',
          name: 'Vacation to Japan',
          description: 'Trip for two weeks',
          targetAmount: 5000,
          currentAmount: 2800,
          targetDate: '2024-09-15',
          category: 'Vacation',
          color: '#10b981',
          icon: '✈️',
          isCompleted: false,
          createdAt: '2024-02-01',
          contributions: [
            {
              id: '3',
              amount: 800,
              date: '2024-02-15',
              type: 'manual',
              description: 'Initial vacation fund'
            }
          ]
        },
        {
          id: '3',
          name: 'New Car',
          description: 'Down payment for Tesla Model 3',
          targetAmount: 12000,
          currentAmount: 4200,
          targetDate: '2025-03-01',
          category: 'Car',
          color: '#3b82f6',
          icon: '🚗',
          isCompleted: false,
          createdAt: '2024-03-01',
          contributions: []
        }
      ];
    }
    return this.goals;
  }

  async createGoal(goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'contributions' | 'isCompleted'>): Promise<SavingsGoal> {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      contributions: [],
      isCompleted: false
    };
    
    this.goals.push(newGoal);
    return newGoal;
  }

  async addContribution(goalId: string, contribution: Omit<Contribution, 'id'>): Promise<void> {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      const newContribution: Contribution = {
        ...contribution,
        id: Date.now().toString()
      };
      
      goal.contributions.push(newContribution);
      goal.currentAmount += contribution.amount;
      
      if (goal.currentAmount >= goal.targetAmount) {
        goal.isCompleted = true;
      }
    }
  }

  async updateGoal(goalId: string, updates: Partial<SavingsGoal>): Promise<void> {
    const goalIndex = this.goals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      this.goals[goalIndex] = { ...this.goals[goalIndex], ...updates };
    }
  }

  async deleteGoal(goalId: string): Promise<void> {
    this.goals = this.goals.filter(g => g.id !== goalId);
  }

  async getSavingsInsights(): Promise<SavingsInsight[]> {
    const goals = await this.getGoals();
    const insights: SavingsInsight[] = [];

    goals.forEach(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const dailyRequired = Math.max(0, (goal.targetAmount - goal.currentAmount) / daysLeft);

      if (progress >= 100) {
        insights.push({
          type: 'milestone',
          title: `🎉 ${goal.name} Complete!`,
          description: `You've reached your ${goal.name} goal of $${goal.targetAmount.toLocaleString()}`,
          actionable: false
        });
      } else if (progress >= 75) {
        insights.push({
          type: 'progress',
          title: `Almost there! 📈`,
          description: `You're ${progress.toFixed(0)}% of the way to your ${goal.name} goal`,
          actionable: false
        });
      } else if (dailyRequired > 0 && daysLeft > 0) {
        insights.push({
          type: 'suggestion',
          title: `Stay on track 💪`,
          description: `Save $${dailyRequired.toFixed(0)} daily to reach your ${goal.name} goal`,
          actionable: true,
          action: 'Set up automatic savings'
        });
      } else if (daysLeft <= 0 && progress < 100) {
        insights.push({
          type: 'suggestion',
          title: `Goal deadline passed ⏰`,
          description: `Consider extending the deadline for your ${goal.name} goal or adjusting the target`,
          actionable: true,
          action: 'Adjust goal'
        });
      }
    });

    // Add general insights
    if (goals.length === 0) {
      insights.push({
        type: 'suggestion',
        title: 'Start your savings journey! 🌟',
        description: 'Create your first savings goal to begin building wealth',
        actionable: true,
        action: 'Create first goal'
      });
    } else if (goals.length < 3) {
      insights.push({
        type: 'suggestion',
        title: 'Diversify your goals 🎯',
        description: 'Consider adding more savings goals for different priorities',
        actionable: true,
        action: 'Add new goal'
      });
    }

    return insights;
  }

  calculateMonthlyContribution(targetAmount: number, currentAmount: number, targetDate: string): number {
    const monthsLeft = Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, (targetAmount - currentAmount) / Math.max(1, monthsLeft));
  }

  calculateDailyContribution(targetAmount: number, currentAmount: number, targetDate: string): number {
    const daysLeft = Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, (targetAmount - currentAmount) / Math.max(1, daysLeft));
  }

  getGoalById(goalId: string): Promise<SavingsGoal | undefined> {
    return Promise.resolve(this.goals.find(g => g.id === goalId));
  }
}

export const savingsGoalsService = SavingsGoalsService.getInstance(); 