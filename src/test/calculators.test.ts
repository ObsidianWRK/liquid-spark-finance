import { describe, it, expect } from 'vitest';
import {
  calculateFinancialFreedomYears,
  calculateROI,
  calculateLoanPayment,
  calculateInflationAdjustedValue,
  calculateCompoundInterest,
  calculate401kBalance,
  calculateThreeFundPortfolioReturn,
  calculateMaximumHomePrice,
  calculateMortgagePayoffSavings,
  calculatePortfolioBacktest,
  convertCurrency,
} from '../utils/calculators';

describe('Financial Calculators - Accuracy Tests', () => {
  describe('calculateFinancialFreedomYears', () => {
    it('should calculate correct financial freedom years for typical scenarios', () => {
      // Test case from documentation
      const result = calculateFinancialFreedomYears(500000, 4000, 0.04);
      expect(result).toBeCloseTo(25.67, 1);
    });

    it('should handle edge cases correctly', () => {
      // Zero savings
      expect(calculateFinancialFreedomYears(0, 1000)).toBe(0);

      // Very low expenses
      expect(calculateFinancialFreedomYears(100000, 100, 0.04)).toBeGreaterThan(
        40
      );

      // High growth rate
      const highGrowth = calculateFinancialFreedomYears(100000, 500, 0.15);
      expect(highGrowth).toBeGreaterThan(10);
    });

    it('should throw error for invalid monthly expenses', () => {
      expect(() => calculateFinancialFreedomYears(100000, 0)).toThrow(
        'Monthly expenses must be greater than 0'
      );
      expect(() => calculateFinancialFreedomYears(100000, -100)).toThrow(
        'Monthly expenses must be greater than 0'
      );
    });

    it('should have maximum boundary of 50 years', () => {
      // Test with very high savings and low expenses
      const result = calculateFinancialFreedomYears(10000000, 1000, 0.08);
      expect(result).toBeLessThanOrEqual(50);
    });
  });

  describe('calculateROI', () => {
    it('should calculate positive ROI correctly', () => {
      // Test case from documentation: $1000 -> $1200 = 20%
      expect(calculateROI(1000, 1200)).toBe(20.0);

      // Double investment
      expect(calculateROI(1000, 2000)).toBe(100.0);

      // 50% gain
      expect(calculateROI(500, 750)).toBe(50.0);
    });

    it('should calculate negative ROI correctly', () => {
      // 50% loss
      expect(calculateROI(1000, 500)).toBe(-50.0);

      // Total loss
      expect(calculateROI(1000, 0)).toBe(-100.0);
    });

    it('should handle edge cases', () => {
      // No change
      expect(calculateROI(1000, 1000)).toBe(0.0);

      // Small amounts
      expect(calculateROI(0.01, 0.02)).toBe(100.0);
    });

    it('should throw error for zero initial investment', () => {
      expect(() => calculateROI(0, 1000)).toThrow(
        'Initial investment cannot be 0'
      );
    });

    it('should handle very large numbers', () => {
      const result = calculateROI(1000000, 1500000);
      expect(result).toBe(50.0);
    });
  });

  describe('calculateLoanPayment', () => {
    it('should calculate correct monthly payments for standard mortgages', () => {
      // Test case from documentation: $300,000 at 4.5% for 30 years
      const result = calculateLoanPayment(300000, 4.5, 30);
      expect(result).toBeCloseTo(1520.06, 2);
    });

    it('should handle zero interest rate', () => {
      // 0% interest should be principal/months
      expect(calculateLoanPayment(12000, 0, 1)).toBe(1000.0);
    });

    it('should calculate payments for different loan terms', () => {
      // 15-year mortgage should have higher payments
      const payment30yr = calculateLoanPayment(200000, 4.0, 30);
      const payment15yr = calculateLoanPayment(200000, 4.0, 15);
      expect(payment15yr).toBeGreaterThan(payment30yr);
    });

    it('should handle small loans', () => {
      const result = calculateLoanPayment(1000, 5.0, 1);
      expect(result).toBeCloseTo(85.61, 2);
    });

    it('should handle high interest rates', () => {
      const result = calculateLoanPayment(100000, 20.0, 10);
      expect(result).toBeGreaterThan(1000);
    });
  });

  describe('calculateInflationAdjustedValue', () => {
    it('should calculate inflation-adjusted values correctly', () => {
      // Test case from documentation: $100 with 3% inflation over 10 years
      const result = calculateInflationAdjustedValue(100, 3, 10);
      expect(result).toBeCloseTo(134.39, 2);
    });

    it('should handle zero inflation', () => {
      expect(calculateInflationAdjustedValue(100, 0, 10)).toBe(100.0);
    });

    it('should handle high inflation', () => {
      const result = calculateInflationAdjustedValue(100, 10, 5);
      expect(result).toBeCloseTo(161.05, 2);
    });

    it('should handle zero years', () => {
      expect(calculateInflationAdjustedValue(100, 5, 0)).toBe(100.0);
    });

    it('should handle deflation (negative inflation)', () => {
      const result = calculateInflationAdjustedValue(100, -2, 5);
      expect(result).toBeLessThan(100);
    });
  });

  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest correctly', () => {
      // Test case from documentation: $10,000 at 6% for 5 years, monthly compounding
      const result = calculateCompoundInterest(10000, 6, 5, 12);
      expect(result).toBeCloseTo(13488.5, 2);
    });

    it('should handle annual compounding', () => {
      const result = calculateCompoundInterest(1000, 10, 2, 1);
      expect(result).toBe(1210.0);
    });

    it('should handle daily compounding', () => {
      const monthly = calculateCompoundInterest(1000, 5, 1, 12);
      const daily = calculateCompoundInterest(1000, 5, 1, 365);
      expect(daily).toBeGreaterThan(monthly);
    });

    it('should handle zero interest', () => {
      expect(calculateCompoundInterest(1000, 0, 5, 12)).toBe(1000.0);
    });

    it('should handle large principals', () => {
      const result = calculateCompoundInterest(1000000, 7, 10, 12);
      expect(result).toBeGreaterThan(1000000);
    });
  });

  describe('calculate401kBalance', () => {
    it('should calculate 401k balance with employer match', () => {
      // Test case from documentation: $50,000 current, $6,000 annual, 50% match, 7% return, 25 years
      const result = calculate401kBalance(50000, 6000, 0.5, 7, 25);
      expect(result).toBeCloseTo(1091234.56, 0); // Allow some variance due to rounding
    });

    it('should handle no employer match', () => {
      const withMatch = calculate401kBalance(10000, 5000, 0.5, 7, 10);
      const withoutMatch = calculate401kBalance(10000, 5000, 0, 7, 10);
      expect(withMatch).toBeGreaterThan(withoutMatch);
    });

    it('should handle zero starting balance', () => {
      const result = calculate401kBalance(0, 6000, 0.5, 7, 10);
      expect(result).toBeGreaterThan(0);
    });

    it('should handle zero contributions', () => {
      const result = calculate401kBalance(10000, 0, 0.5, 7, 10);
      expect(result).toBeCloseTo(19671.51, 2);
    });

    it('should handle 100% employer match', () => {
      const result = calculate401kBalance(0, 5000, 1.0, 8, 5);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('calculateThreeFundPortfolioReturn', () => {
    it('should calculate three-fund portfolio returns correctly', () => {
      // Test case from documentation: 7% US, 6% intl, 3% bonds over 10 years
      const result = calculateThreeFundPortfolioReturn(7, 6, 3, 10);
      expect(result).toBeCloseTo(69.74, 1);
    });

    it('should handle custom allocations', () => {
      const conservative = calculateThreeFundPortfolioReturn(7, 6, 3, 10, {
        us: 0.2,
        intl: 0.1,
        bonds: 0.7,
      });
      const aggressive = calculateThreeFundPortfolioReturn(7, 6, 3, 10, {
        us: 0.7,
        intl: 0.3,
        bonds: 0.0,
      });
      expect(aggressive).toBeGreaterThan(conservative);
    });

    it('should handle zero returns', () => {
      const result = calculateThreeFundPortfolioReturn(0, 0, 0, 10);
      expect(result).toBe(0.0);
    });

    it('should handle negative returns', () => {
      const result = calculateThreeFundPortfolioReturn(-5, -3, 2, 5);
      expect(result).toBeLessThan(0);
    });

    it('should validate allocation percentages work correctly', () => {
      // 100% US stocks
      const result = calculateThreeFundPortfolioReturn(10, 5, 2, 5, {
        us: 1.0,
        intl: 0.0,
        bonds: 0.0,
      });
      const expected = Math.pow(1.1, 5) - 1;
      expect(result).toBeCloseTo(expected * 100, 2);
    });
  });

  describe('calculateMaximumHomePrice', () => {
    it('should calculate maximum home price using the 28% rule', () => {
      // Test case from documentation: $80,000 income, $500 debts, 4.5% rate, 30 years, $20,000 down
      const result = calculateMaximumHomePrice(80000, 500, 4.5, 30, 20000);
      expect(result).toBeCloseTo(245000, -3); // Within $1000
    });

    it('should handle higher incomes', () => {
      const result = calculateMaximumHomePrice(150000, 1000, 4.0, 30, 50000);
      expect(result).toBeGreaterThan(300000);
    });

    it('should handle zero down payment', () => {
      const result = calculateMaximumHomePrice(100000, 500, 5.0, 30, 0);
      expect(result).toBeGreaterThan(0);
    });

    it('should handle different property tax rates', () => {
      const lowTax = calculateMaximumHomePrice(
        100000,
        500,
        4.5,
        30,
        20000,
        0.5
      );
      const highTax = calculateMaximumHomePrice(
        100000,
        500,
        4.5,
        30,
        20000,
        2.0
      );
      expect(lowTax).toBeGreaterThan(highTax);
    });

    it('should handle different loan terms', () => {
      const result15yr = calculateMaximumHomePrice(100000, 500, 4.5, 15, 20000);
      const result30yr = calculateMaximumHomePrice(100000, 500, 4.5, 30, 20000);
      expect(result30yr).toBeGreaterThan(result15yr);
    });
  });

  describe('calculateMortgagePayoffSavings', () => {
    it('should calculate mortgage payoff savings correctly', () => {
      // Test case from documentation: $300,000 at 4.5% for 30 years with $200 extra
      const result = calculateMortgagePayoffSavings(300000, 4.5, 30, 200);
      expect(result.originalYears).toBe(30);
      expect(result.newYears).toBeCloseTo(24.1, 1);
      expect(result.interestSaved).toBeCloseTo(48532.21, 0);
    });

    it('should handle zero extra payment', () => {
      const result = calculateMortgagePayoffSavings(200000, 5.0, 30, 0);
      expect(result.originalYears).toBe(result.newYears);
      expect(result.interestSaved).toBe(0);
    });

    it('should handle large extra payments', () => {
      const result = calculateMortgagePayoffSavings(200000, 5.0, 30, 1000);
      expect(result.newYears).toBeLessThan(15);
      expect(result.interestSaved).toBeGreaterThan(50000);
    });

    it('should handle small loans', () => {
      const result = calculateMortgagePayoffSavings(50000, 4.0, 10, 100);
      expect(result.originalYears).toBe(10);
      expect(result.newYears).toBeLessThan(10);
      expect(result.interestSaved).toBeGreaterThan(0);
    });

    it('should handle high interest rates', () => {
      const result = calculateMortgagePayoffSavings(100000, 10.0, 30, 200);
      expect(result.interestSaved).toBeGreaterThan(10000);
    });
  });

  describe('calculatePortfolioBacktest', () => {
    it('should calculate portfolio backtest correctly', () => {
      // Test case from documentation: $10,000 with returns of 10%, -5%, 15%, 8%
      const result = calculatePortfolioBacktest(10000, [10, -5, 15, 8]);
      expect(result).toBeCloseTo(13234.6, 2);
    });

    it('should handle all positive returns', () => {
      const result = calculatePortfolioBacktest(1000, [10, 10, 10]);
      expect(result).toBe(1331.0);
    });

    it('should handle all negative returns', () => {
      const result = calculatePortfolioBacktest(1000, [-10, -10, -10]);
      expect(result).toBe(729.0);
    });

    it('should handle empty returns array', () => {
      const result = calculatePortfolioBacktest(1000, []);
      expect(result).toBe(1000.0);
    });

    it('should handle zero returns', () => {
      const result = calculatePortfolioBacktest(1000, [0, 0, 0]);
      expect(result).toBe(1000.0);
    });

    it('should handle extreme returns', () => {
      const result = calculatePortfolioBacktest(1000, [100, -50]);
      expect(result).toBe(1000.0); // 100% gain then 50% loss = break even
    });
  });

  describe('convertCurrency', () => {
    it('should convert currency correctly', () => {
      // Test case from documentation: $100 USD to EUR at 0.85 rate
      const result = convertCurrency(100, 0.85);
      expect(result).toBe(85.0);
    });

    it('should handle rate of 1.0', () => {
      expect(convertCurrency(100, 1.0)).toBe(100.0);
    });

    it('should handle rates greater than 1', () => {
      const result = convertCurrency(100, 1.5);
      expect(result).toBe(150.0);
    });

    it('should handle zero amount', () => {
      expect(convertCurrency(0, 0.85)).toBe(0.0);
    });

    it('should handle very small amounts', () => {
      const result = convertCurrency(0.01, 0.85);
      expect(result).toBe(0.01);
    });

    it('should handle large amounts', () => {
      const result = convertCurrency(1000000, 0.85);
      expect(result).toBe(850000.0);
    });

    it('should handle very low exchange rates', () => {
      const result = convertCurrency(100, 0.001);
      expect(result).toBe(0.1);
    });
  });

  // Integration tests - testing multiple calculators together
  describe('Calculator Integration Tests', () => {
    it('should handle complex financial planning scenario', () => {
      // Real-world scenario: retirement planning
      const salary = 80000;
      const current401k = 50000;
      const annual401kContrib = 6000;
      const employerMatch = 0.5;
      const expectedReturn = 7;
      const yearsToRetirement = 25;

      const future401k = calculate401kBalance(
        current401k,
        annual401kContrib,
        employerMatch,
        expectedReturn,
        yearsToRetirement
      );
      const monthlyExpenses = 4000;
      const yearsOfFreedom = calculateFinancialFreedomYears(
        future401k,
        monthlyExpenses,
        0.04
      );

      expect(future401k).toBeGreaterThan(current401k);
      expect(yearsOfFreedom).toBeGreaterThan(0);
    });

    it('should handle home buying scenario', () => {
      const income = 100000;
      const debts = 800;
      const downPayment = 50000;
      const maxPrice = calculateMaximumHomePrice(
        income,
        debts,
        4.5,
        30,
        downPayment
      );

      const loanAmount = maxPrice - downPayment;
      const monthlyPayment = calculateLoanPayment(loanAmount, 4.5, 30);

      // Monthly payment + taxes should be ~28% of gross monthly income
      const maxHousingPayment = (income / 12) * 0.28;
      expect(monthlyPayment).toBeLessThan(maxHousingPayment);
    });

    it('should validate mortgage payoff strategy', () => {
      const principal = 300000;
      const rate = 4.5;
      const years = 30;
      const extraPayment = 300;

      const savings = calculateMortgagePayoffSavings(
        principal,
        rate,
        years,
        extraPayment
      );
      const originalPayment = calculateLoanPayment(principal, rate, years);

      expect(savings.newYears).toBeLessThan(savings.originalYears);
      expect(savings.interestSaved).toBeGreaterThan(0);
      expect(originalPayment).toBeGreaterThan(0);
    });
  });

  // Edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    it('should handle extreme input values', () => {
      // Very large numbers
      expect(() => calculateCompoundInterest(1e10, 5, 10)).not.toThrow();

      // Very small numbers
      expect(() => calculateLoanPayment(0.01, 1, 1)).not.toThrow();

      // Zero values where appropriate
      expect(calculateROI(1000, 0)).toBe(-100.0);
    });

    it('should maintain precision with financial calculations', () => {
      // Ensure calculations maintain appropriate precision for financial data
      const result = calculateCompoundInterest(1000.33, 5.555, 10, 12);
      expect(result.toString()).toMatch(/^\d+\.\d{2}$/); // Should have exactly 2 decimal places
    });

    it('should handle boundary conditions', () => {
      // Test boundary conditions for each calculator
      expect(calculateInflationAdjustedValue(100, 0, 0)).toBe(100.0);
      expect(calculatePortfolioBacktest(1000, [])).toBe(1000.0);
      expect(convertCurrency(0, 1.5)).toBe(0.0);
    });
  });
});
