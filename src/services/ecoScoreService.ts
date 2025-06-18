/*
  ecoScoreService.ts
  ------------------
  Simple life-cycle carbon model that converts transaction categories into an
  EcoScore (0–100) where 100 = ultra-sustainable.  Numbers are **illustrative**
  – replace the `EMISSION_FACTORS` with verified coefficients from your
  sustainability provider (e.g. Sustain.Life, Greenly, Doconomy).
*/

import { Transaction } from '@/types/shared';

export interface EcoBreakdown {
  totalKgCO2e: number;
  transportKg: number;
  foodKg: number;
  shoppingKg: number;
  utilitiesKg: number;
  sustainableSpendRatio: number; // % of spending tagged sustainable
  score: number; // 0-100
}

// kg CO2e per $ for high-level spend categories (placeholder values)
const EMISSION_FACTORS: Record<string, number> = {
  Transportation: 0.7,
  Food: 0.5,
  Shopping: 0.4,
  Utilities: 0.3,
  Default: 0.25
};

const SUSTAINABLE_MERCHANTS = [
  'Whole Foods',
  'Trader Joe',
  'Patagonia',
  'Tesla Supercharger',
  'Amtrak',
  'REI'
];

/**
 * Calculates environmental impact score based on transaction data.
 * 
 * Analyzes spending patterns to estimate carbon footprint using emission factors
 * per dollar spent in different categories. Considers sustainable merchant preferences
 * to provide a comprehensive eco-score from 0-100 (higher is better).
 * 
 * @param transactions - Array of financial transactions to analyze
 * @returns EcoBreakdown object with CO2 emissions, sustainable spending ratio, and overall score
 * 
 * @example
 * ```typescript
 * const transactions = [
 *   { id: '1', merchant: 'Gas Station', category: { name: 'Transportation' }, amount: -50 },
 *   { id: '2', merchant: 'Whole Foods', category: { name: 'Food' }, amount: -120 }
 * ];
 * const ecoData = calculateEcoScore(transactions);
 * console.log(ecoData.score); // Environmental score 0-100
 * ```
 */
export const calculateEcoScore = (transactions: Transaction[]): EcoBreakdown => {
  let transportKg = 0;
  let foodKg = 0;
  let shoppingKg = 0;
  let utilitiesKg = 0;
  let sustainableSpend = 0;
  let totalSpend = 0;

  transactions.forEach(t => {
    if (t.amount >= 0) return; // only consider spend
    const spendAbs = Math.abs(t.amount);
    totalSpend += spendAbs;

    const cat = t.category?.name ?? 'Default';
    const factor = EMISSION_FACTORS[cat] ?? EMISSION_FACTORS.Default;
    const kg = spendAbs * factor;

    switch (cat) {
      case 'Transportation':
        transportKg += kg;
        break;
      case 'Food':
        foodKg += kg;
        break;
      case 'Utilities':
        utilitiesKg += kg;
        break;
      case 'Shopping':
      default:
        shoppingKg += kg;
    }

    if (SUSTAINABLE_MERCHANTS.some(m => t.merchant?.includes(m))) {
      sustainableSpend += spendAbs;
    }
  });

  const totalKgCO2e = transportKg + foodKg + shoppingKg + utilitiesKg;
  const sustainableSpendRatio = totalSpend > 0 ? (sustainableSpend / totalSpend) * 100 : 0;

  // Convert kgCO2e to score where lower emissions & higher sustainable spend is better
  const emissionScore = 100 - Math.min(100, (totalKgCO2e / 500) * 100); // 500kg threshold
  const sustainableScore = sustainableSpendRatio; // direct percentage

  const score = Math.round((emissionScore * 0.7) + (sustainableScore * 0.3));

  return {
    totalKgCO2e,
    transportKg,
    foodKg,
    shoppingKg,
    utilitiesKg,
    sustainableSpendRatio: Math.round(sustainableSpendRatio),
    score
  };
}; 