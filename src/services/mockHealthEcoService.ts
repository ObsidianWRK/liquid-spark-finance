
import { Transaction } from '@/types/shared';

export interface HealthData {
  score: number;
  trends: {
    exercise: number;
    nutrition: number;
    sleep: number;
    stress: number;
  };
}

export interface EcoData {
  score: number;
  metrics: {
    carbonFootprint: number;
    sustainableSpending: number;
    greenTransport: number;
    renewableEnergy: number;
  };
  monthlyImpact: {
    co2Saved: number;
    treesEquivalent: number;
  };
}

export const mockHealthEcoService = {
  getHealthScore: (transactions: Transaction[]): HealthData => {
    // Mock calculation based on spending patterns
    const fitnessSpending = transactions
      .filter(t => t.category?.name === 'Fitness' || t.merchant?.includes('Gym'))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const fastFoodSpending = transactions
      .filter(t => t.merchant?.includes('McDonald') || t.merchant?.includes('Fast'))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const healthcareSpending = transactions
      .filter(t => t.category?.name === 'Healthcare')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    let baseScore = 65;
    if (fitnessSpending > 100) baseScore += 15;
    if (fastFoodSpending < 50) baseScore += 10;
    if (healthcareSpending > 50) baseScore += 10;

    return {
      score: Math.min(100, Math.max(0, baseScore)),
      trends: {
        exercise: Math.min(100, (fitnessSpending / 10) + 40),
        nutrition: Math.max(0, 80 - (fastFoodSpending / 5)),
        sleep: 75,
        stress: 65
      }
    };
  },

  getEcoScore: (transactions: Transaction[]): EcoData => {
    const sustainableMerchants = ['Whole Foods', 'Trader Joe', 'REI', 'Patagonia'];
    const transportSpending = transactions
      .filter(t => t.category?.name === 'Transportation')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const sustainableSpending = transactions
      .filter(t => sustainableMerchants.some(merchant => t.merchant?.includes(merchant)))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    let baseScore = 72;
    if (sustainableSpending > 200) baseScore += 15;
    if (transportSpending < 150) baseScore += 10;

    const finalScore = Math.min(100, Math.max(0, baseScore));
    const co2Saved = Math.round((finalScore - 50) * 1.5);
    const treesEquivalent = Math.round(co2Saved / 20);

    return {
      score: finalScore,
      metrics: {
        carbonFootprint: Math.max(0, 100 - finalScore),
        sustainableSpending: Math.min(100, (sustainableSpending / 500) * 100),
        greenTransport: Math.max(0, 100 - (transportSpending / 2)),
        renewableEnergy: 85
      },
      monthlyImpact: {
        co2Saved: Math.max(0, co2Saved),
        treesEquivalent: Math.max(0, treesEquivalent)
      }
    };
  }
};
