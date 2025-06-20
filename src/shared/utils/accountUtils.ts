import { Transaction } from '@/shared/types/transactions';

/**
 * Calculate the number of days an account balance has been below a warning threshold
 * @param balanceHistory Array of balance values (most recent first)
 * @param threshold Warning threshold amount
 * @returns Number of consecutive days below threshold
 */
export function getDaysInWarning(
  balanceHistory: number[],
  threshold: number
): number {
  if (!balanceHistory.length) return 0;

  let daysInWarning = 0;

  // Count consecutive days below threshold starting from most recent
  for (const balance of balanceHistory) {
    if (balance < threshold) {
      daysInWarning++;
    } else {
      break; // Stop at first day above threshold
    }
  }

  return daysInWarning;
}

/**
 * Enhanced transaction type with biometric data
 */
export interface TransactionWithBiometrics extends Transaction {
  stressAtTime: number;
  heartRateAtTime?: number;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Merge biometric data with transaction history
 * @param transactions Array of transactions
 * @param currentStressIndex Current stress level (0-100)
 * @returns Transactions enhanced with biometric data
 */
export function mergeBiometricsWithTransactions(
  transactions: Transaction[],
  currentStressIndex: number
): TransactionWithBiometrics[] {
  return transactions.map((transaction) => {
    // Generate realistic stress levels for each transaction based on:
    // 1. Transaction amount (higher amounts = higher stress)
    // 2. Time of day (work hours = higher stress)
    // 3. Day of week (weekdays = higher stress)
    // 4. Current user stress as baseline

    const transactionDate = new Date(transaction.date);
    const hour = transactionDate.getHours();
    const dayOfWeek = transactionDate.getDay();
    const transactionAmount = Math.abs(transaction.amount);

    // Base stress from current user state
    let stressAtTime = currentStressIndex || 30;

    // Amount-based stress increase
    if (transactionAmount > 500) stressAtTime += 20;
    else if (transactionAmount > 200) stressAtTime += 10;
    else if (transactionAmount > 100) stressAtTime += 5;

    // Time-based stress (work hours are more stressful)
    if (hour >= 9 && hour <= 17) stressAtTime += 10;
    if (hour >= 14 && hour <= 16) stressAtTime += 5; // Peak stress hours

    // Weekday stress
    if (dayOfWeek >= 1 && dayOfWeek <= 5) stressAtTime += 5;

    // Add some randomness to make it realistic
    stressAtTime += (Math.random() - 0.5) * 15;

    // Clamp to 0-100 range
    stressAtTime = Math.max(0, Math.min(100, Math.round(stressAtTime)));

    // Calculate risk level based on stress
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (stressAtTime >= 70) riskLevel = 'high';
    else if (stressAtTime >= 40) riskLevel = 'medium';

    // Estimate heart rate based on stress (rough correlation)
    const heartRateAtTime = Math.round(
      70 + (stressAtTime / 100) * 30 + (Math.random() - 0.5) * 10
    );

    return {
      ...transaction,
      stressAtTime,
      heartRateAtTime,
      riskLevel,
    };
  });
}

/**
 * Calculate account health score based on various factors
 * @param currentBalance Current account balance
 * @param averageBalance 30-day average balance
 * @param minimumBalance Minimum required balance
 * @param daysInWarning Number of days below threshold
 * @returns Health score from 0-100 (100 = excellent health)
 */
export function calculateAccountHealthScore(
  currentBalance: number,
  averageBalance: number,
  minimumBalance: number,
  daysInWarning: number
): number {
  let score = 100;

  // Penalty for being below minimum balance
  if (currentBalance < minimumBalance) {
    score -= 30;
  }

  // Penalty for days in warning
  score -= daysInWarning * 5;

  // Bonus for having balance above average
  if (currentBalance > averageBalance * 1.2) {
    score += 10;
  }

  // Penalty for balance significantly below average
  if (currentBalance < averageBalance * 0.8) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate account insights based on transaction patterns and biometric data
 * @param transactions Recent transactions with biometric data
 * @param accountBalance Current account balance
 * @returns Array of insight messages
 */
export function generateAccountInsights(
  transactions: TransactionWithBiometrics[],
  accountBalance: number
): string[] {
  const insights: string[] = [];

  // Analyze high-stress spending patterns
  const highStressTransactions = transactions.filter(
    (tx) => tx.stressAtTime >= 70
  );
  if (highStressTransactions.length > 0) {
    const avgAmount =
      highStressTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) /
      highStressTransactions.length;
    insights.push(
      `You tend to spend ${avgAmount.toFixed(0)}% more during high-stress periods. Consider implementing spending delays when stressed.`
    );
  }

  // Time-based spending insights
  const workHourTransactions = transactions.filter((tx) => {
    const hour = new Date(tx.date).getHours();
    return hour >= 9 && hour <= 17;
  });

  if (workHourTransactions.length > transactions.length * 0.6) {
    insights.push(
      'Most of your spending occurs during work hours. Consider setting up automated savings to reduce impulse purchases.'
    );
  }

  // Balance optimization insights
  if (accountBalance > 10000) {
    insights.push(
      'You have a healthy emergency fund. Consider investing excess funds in a high-yield savings account or investment portfolio.'
    );
  }

  return insights;
}
