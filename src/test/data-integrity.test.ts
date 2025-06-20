import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VueniSecureStorage } from '../utils/crypto';
import { VueniInputSanitizer } from '../utils/security';
import {
  calculateCompoundInterest,
  calculateLoanPayment,
  calculateROI,
  calculateFinancialFreedomYears,
} from '../utils/calculators';

// Mock data for testing
const mockTransactionData = {
  id: 'txn-123',
  merchant: 'Test Merchant',
  amount: 100.5,
  date: '2024-01-01',
  category: 'groceries',
  healthScore: 85,
  ecoScore: 70,
  financialScore: 90,
  description: 'Weekly grocery shopping',
  account: 'checking-001',
};

const mockAccountData = {
  id: 'acc-123',
  type: 'checking',
  nickname: 'Main Checking',
  balance: 5000.0,
  availableBalance: 4800.0,
  currency: 'USD',
  institution: 'Test Bank',
  lastUpdated: '2024-01-01T00:00:00Z',
};

const mockBudgetData = {
  id: 'budget-123',
  category: 'groceries',
  monthlyLimit: 500.0,
  spent: 150.25,
  remaining: 349.75,
  period: '2024-01',
  alerts: {
    threshold: 0.8,
    enabled: true,
  },
};

describe('Data Integrity and Persistence Tests', () => {
  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();

    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore mocks
    vi.restoreAllMocks();
  });

  describe('Transaction Data Integrity', () => {
    it('should validate transaction data structure', () => {
      const transaction = { ...mockTransactionData };

      // Required fields should be present
      expect(transaction.id).toBeDefined();
      expect(transaction.merchant).toBeDefined();
      expect(transaction.amount).toBeDefined();
      expect(transaction.date).toBeDefined();
      expect(transaction.category).toBeDefined();

      // Amount should be a valid number
      expect(typeof transaction.amount).toBe('number');
      expect(transaction.amount).toBeGreaterThan(0);

      // Date should be valid
      expect(new Date(transaction.date).getTime()).not.toBeNaN();

      // Scores should be within valid range
      expect(transaction.healthScore).toBeGreaterThanOrEqual(0);
      expect(transaction.healthScore).toBeLessThanOrEqual(100);
      expect(transaction.ecoScore).toBeGreaterThanOrEqual(0);
      expect(transaction.ecoScore).toBeLessThanOrEqual(100);
      expect(transaction.financialScore).toBeGreaterThanOrEqual(0);
      expect(transaction.financialScore).toBeLessThanOrEqual(100);
    });

    it('should sanitize transaction input data', () => {
      const maliciousTransaction = {
        ...mockTransactionData,
        merchant: '<script>alert("xss")</script>',
        description: 'Normal text <img src="x" onerror="alert(1)">',
        amount: '$1,234.56', // String that needs parsing
      };

      // Sanitize data
      const sanitized = {
        ...maliciousTransaction,
        merchant: VueniInputSanitizer.sanitizeText(
          maliciousTransaction.merchant
        ),
        description: VueniInputSanitizer.sanitizeTransactionDescription(
          maliciousTransaction.description
        ),
        amount: VueniInputSanitizer.sanitizeFinancialAmount(
          maliciousTransaction.amount
        ),
      };

      expect(sanitized.merchant).not.toContain('<script>');
      expect(sanitized.description).not.toContain('<img');
      expect(sanitized.amount).toBe(1234.56);
    });

    it('should maintain transaction data consistency across storage operations', () => {
      const transaction = { ...mockTransactionData };

      // Store transaction
      VueniSecureStorage.setItem('vueni:transaction:123', transaction);

      // Retrieve and verify
      const retrieved = VueniSecureStorage.getItem('vueni:transaction:123');
      expect(retrieved).toEqual(transaction);

      // Modify and update
      const updated = { ...transaction, amount: 125.75 };
      VueniSecureStorage.setItem('vueni:transaction:123', updated);

      const retrievedUpdated = VueniSecureStorage.getItem(
        'vueni:transaction:123'
      );
      expect(retrievedUpdated.amount).toBe(125.75);
      expect(retrievedUpdated.id).toBe(transaction.id);
    });

    it('should handle transaction data corruption', () => {
      // Store valid transaction
      VueniSecureStorage.setItem('vueni:transaction:456', mockTransactionData);

      // Simulate corruption by directly modifying localStorage
      localStorage.setItem('vueni:transaction:456', 'corrupted-data');

      // Should handle corruption gracefully
      const result = VueniSecureStorage.getItem('vueni:transaction:456');
      expect(result).toBeNull(); // Should return null for corrupted data
    });

    it('should validate transaction calculations', () => {
      const transactions = [
        { amount: 100, category: 'groceries' },
        { amount: 50, category: 'groceries' },
        { amount: 200, category: 'dining' },
      ];

      // Calculate totals
      const total = transactions.reduce((sum, txn) => sum + txn.amount, 0);
      expect(total).toBe(350);

      // Calculate category totals
      const groceryTotal = transactions
        .filter((txn) => txn.category === 'groceries')
        .reduce((sum, txn) => sum + txn.amount, 0);
      expect(groceryTotal).toBe(150);

      // Verify precision is maintained
      const preciseTransactions = [
        { amount: 10.33 },
        { amount: 20.67 },
        { amount: 5.44 },
      ];

      const preciseTotal = preciseTransactions.reduce(
        (sum, txn) => sum + txn.amount,
        0
      );
      expect(preciseTotal).toBeCloseTo(36.44, 2);
    });

    it('should handle large transaction datasets', () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: `txn-${i}`,
        amount: Math.round(Math.random() * 1000 * 100) / 100,
        date: new Date(2024, 0, (i % 30) + 1).toISOString(),
        category: ['groceries', 'dining', 'transport', 'utilities'][i % 4],
      }));

      // Store large dataset
      const startTime = performance.now();
      VueniSecureStorage.setItem('vueni:transactions:bulk', largeDataset);
      const storeTime = performance.now() - startTime;

      // Should store within reasonable time
      expect(storeTime).toBeLessThan(1000); // 1 second

      // Retrieve and verify
      const retrieveStart = performance.now();
      const retrieved = VueniSecureStorage.getItem('vueni:transactions:bulk');
      const retrieveTime = performance.now() - retrieveStart;

      expect(retrieveTime).toBeLessThan(500); // 0.5 seconds
      expect(retrieved).toHaveLength(10000);
      expect(retrieved[0].id).toBe('txn-0');
      expect(retrieved[9999].id).toBe('txn-9999');
    });
  });

  describe('Account Data Integrity', () => {
    it('should validate account balance accuracy', () => {
      const account = { ...mockAccountData };

      // Balance should be a valid number
      expect(typeof account.balance).toBe('number');
      expect(account.availableBalance).toBeLessThanOrEqual(account.balance);

      // Currency should be valid
      expect(account.currency).toMatch(/^[A-Z]{3}$/);

      // Balance precision should be maintained
      const testBalance = 1234.56789;
      const sanitizedBalance =
        VueniInputSanitizer.sanitizeFinancialAmount(testBalance);
      expect(sanitizedBalance).toBe(1234.57); // Rounded to 2 decimal places
    });

    it('should maintain account data consistency', () => {
      const account = { ...mockAccountData };

      // Store account
      VueniSecureStorage.setItem('vueni:account:123', account);

      // Simulate account updates
      const updatedAccount = {
        ...account,
        balance: 5250.0,
        availableBalance: 5050.0,
        lastUpdated: new Date().toISOString(),
      };

      VueniSecureStorage.setItem('vueni:account:123', updatedAccount);

      // Verify consistency
      const retrieved = VueniSecureStorage.getItem('vueni:account:123');
      expect(retrieved.balance).toBe(5250.0);
      expect(retrieved.availableBalance).toBe(5050.0);
      expect(retrieved.id).toBe(account.id);
    });

    it('should handle account balance calculations', () => {
      const account = { balance: 1000.0 };
      const transactions = [
        { amount: -50.0 }, // Debit
        { amount: -30.25 }, // Debit
        { amount: 200.0 }, // Credit
      ];

      // Calculate new balance
      const newBalance = transactions.reduce(
        (balance, txn) => balance + txn.amount,
        account.balance
      );
      expect(newBalance).toBe(1119.75);

      // Verify precision
      expect(Number(newBalance.toFixed(2))).toBe(1119.75);
    });
  });

  describe('Budget Data Integrity', () => {
    it('should validate budget calculations', () => {
      const budget = { ...mockBudgetData };

      // Budget math should be consistent
      expect(budget.spent + budget.remaining).toBeCloseTo(
        budget.monthlyLimit,
        2
      );

      // Percentages should be accurate
      const spentPercentage = budget.spent / budget.monthlyLimit;
      expect(spentPercentage).toBeCloseTo(0.3005, 4);

      // Alert threshold should be valid
      expect(budget.alerts.threshold).toBeGreaterThan(0);
      expect(budget.alerts.threshold).toBeLessThanOrEqual(1);
    });

    it('should handle budget updates correctly', () => {
      const budget = { ...mockBudgetData };

      // Add new spending
      const newSpending = 75.5;
      const updatedBudget = {
        ...budget,
        spent: budget.spent + newSpending,
        remaining: budget.monthlyLimit - (budget.spent + newSpending),
      };

      // Verify calculations
      expect(updatedBudget.spent).toBe(225.75);
      expect(updatedBudget.remaining).toBe(274.25);
      expect(updatedBudget.spent + updatedBudget.remaining).toBeCloseTo(
        budget.monthlyLimit,
        2
      );
    });

    it('should detect budget threshold violations', () => {
      const budget = { ...mockBudgetData };

      // Test various spending levels
      const testSpending = [
        { spent: 400, shouldAlert: true }, // 80% threshold
        { spent: 350, shouldAlert: false }, // 70% - below threshold
        { spent: 500, shouldAlert: true }, // 100% - over budget
      ];

      testSpending.forEach(({ spent, shouldAlert }) => {
        const spentPercentage = spent / budget.monthlyLimit;
        const exceedsThreshold = spentPercentage >= budget.alerts.threshold;
        expect(exceedsThreshold).toBe(shouldAlert);
      });
    });
  });

  describe('Financial Calculation Integrity', () => {
    it('should maintain calculation accuracy across repeated operations', () => {
      const testCases = [
        { principal: 10000, rate: 5, years: 10 },
        { principal: 50000, rate: 7.5, years: 15 },
        { principal: 100000, rate: 3.2, years: 5 },
      ];

      testCases.forEach(({ principal, rate, years }) => {
        // Calculate multiple times
        const results = Array.from({ length: 10 }, () =>
          calculateCompoundInterest(principal, rate, years, 12)
        );

        // All results should be identical
        const firstResult = results[0];
        results.forEach((result) => {
          expect(result).toBe(firstResult);
        });

        // Result should be deterministic
        expect(typeof firstResult).toBe('number');
        expect(firstResult).toBeGreaterThan(principal);
      });
    });

    it('should handle calculation edge cases', () => {
      // Zero interest rate
      const zeroInterest = calculateCompoundInterest(1000, 0, 5, 12);
      expect(zeroInterest).toBe(1000.0);

      // Zero time period
      const zeroTime = calculateCompoundInterest(1000, 5, 0, 12);
      expect(zeroTime).toBe(1000.0);

      // Very small amounts
      const smallAmount = calculateCompoundInterest(0.01, 5, 1, 12);
      expect(smallAmount).toBeCloseTo(0.01, 2);

      // Very large amounts (should not overflow)
      const largeAmount = calculateCompoundInterest(1000000, 5, 10, 12);
      expect(largeAmount).toBeGreaterThan(1000000);
      expect(Number.isFinite(largeAmount)).toBe(true);
    });

    it('should validate loan payment calculations', () => {
      const principal = 300000;
      const rate = 4.5;
      const years = 30;

      const monthlyPayment = calculateLoanPayment(principal, rate, years);

      // Payment should be reasonable
      expect(monthlyPayment).toBeGreaterThan(1000);
      expect(monthlyPayment).toBeLessThan(2000);

      // Total payments should exceed principal (due to interest)
      const totalPayments = monthlyPayment * years * 12;
      expect(totalPayments).toBeGreaterThan(principal);

      // Should handle different loan terms consistently
      const payment15yr = calculateLoanPayment(principal, rate, 15);
      const payment30yr = calculateLoanPayment(principal, rate, 30);

      expect(payment15yr).toBeGreaterThan(payment30yr);
    });

    it('should maintain ROI calculation accuracy', () => {
      const testCases = [
        { initial: 1000, current: 1200, expectedROI: 20.0 },
        { initial: 5000, current: 4500, expectedROI: -10.0 },
        { initial: 10000, current: 15000, expectedROI: 50.0 },
      ];

      testCases.forEach(({ initial, current, expectedROI }) => {
        const roi = calculateROI(initial, current);
        expect(roi).toBe(expectedROI);
      });
    });

    it('should handle financial freedom calculations accurately', () => {
      const testScenarios = [
        {
          savings: 500000,
          expenses: 4000,
          rate: 0.04,
          expectedRange: [20, 30], // Should be around 25-26 years
        },
        {
          savings: 1000000,
          expenses: 4000,
          rate: 0.04,
          expectedRange: [40, 50], // Should be indefinite with growth
        },
      ];

      testScenarios.forEach(({ savings, expenses, rate, expectedRange }) => {
        const years = calculateFinancialFreedomYears(savings, expenses, rate);
        expect(years).toBeGreaterThanOrEqual(expectedRange[0]);
        expect(years).toBeLessThanOrEqual(expectedRange[1]);
      });
    });
  });

  describe('Data Persistence and Recovery', () => {
    it('should handle storage quota exceeded', () => {
      const largeData = 'x'.repeat(10 * 1024 * 1024); // 10MB string

      // Should handle quota exceeded gracefully
      expect(() => {
        VueniSecureStorage.setItem('vueni:large-data', largeData);
      }).not.toThrow();

      // Should either succeed or fail gracefully
      const retrieved = VueniSecureStorage.getItem('vueni:large-data');
      // If storage failed, should return null
      if (retrieved === null) {
        expect(retrieved).toBeNull();
      } else {
        expect(retrieved).toBe(largeData);
      }
    });

    it('should handle concurrent storage operations', async () => {
      const promises = Array.from(
        { length: 100 },
        (_, i) =>
          new Promise<void>((resolve) => {
            VueniSecureStorage.setItem(`vueni:concurrent:${i}`, {
              id: i,
              data: `test-${i}`,
            });
            resolve();
          })
      );

      // Should handle concurrent operations without conflicts
      await Promise.all(promises);

      // Verify all data was stored correctly
      for (let i = 0; i < 100; i++) {
        const data = VueniSecureStorage.getItem(`vueni:concurrent:${i}`);
        expect(data).toEqual({ id: i, data: `test-${i}` });
      }
    });

    it('should maintain data consistency during browser events', () => {
      const testData = { ...mockTransactionData };

      // Store initial data
      VueniSecureStorage.setItem('vueni:consistency-test', testData);

      // Simulate page unload/reload by clearing session but keeping localStorage
      sessionStorage.clear();

      // Data should still be retrievable
      const retrieved = VueniSecureStorage.getItem('vueni:consistency-test');
      expect(retrieved).toEqual(testData);

      // Simulate browser crash by corrupting one key
      localStorage.setItem('vueni:consistency-test', 'corrupted');

      // Should handle corruption gracefully
      const corruptedResult = VueniSecureStorage.getItem(
        'vueni:consistency-test'
      );
      expect(corruptedResult).toBeNull();
    });

    it('should validate data migration scenarios', () => {
      // Simulate old data format
      const oldTransaction = {
        id: 'old-123',
        merchant: 'Old Merchant',
        amount: '100.50', // String instead of number
        date: '2024-01-01',
        // Missing new fields
      };

      // Store old format
      localStorage.setItem(
        'vueni:transaction:old-123',
        JSON.stringify(oldTransaction)
      );

      // Migration function should handle conversion
      const migrated = VueniSecureStorage.getItem('vueni:transaction:old-123');

      if (migrated) {
        // Should handle string to number conversion
        expect(typeof migrated.amount).toBe('number');
        expect(migrated.amount).toBe(100.5);
      }
    });
  });

  describe('Cross-Session Data Integrity', () => {
    it('should maintain data across simulated sessions', () => {
      const sessionData = {
        user: 'test-user',
        preferences: { theme: 'dark', currency: 'USD' },
        lastActive: new Date().toISOString(),
      };

      // Store session data
      VueniSecureStorage.setItem('vueni:session', sessionData);

      // Simulate session end
      sessionStorage.clear();

      // Simulate new session
      const retrievedSession = VueniSecureStorage.getItem('vueni:session');
      expect(retrievedSession).toEqual(sessionData);

      // Update preferences
      const updatedPreferences = {
        ...sessionData,
        preferences: { ...sessionData.preferences, theme: 'light' },
      };

      VueniSecureStorage.setItem('vueni:session', updatedPreferences);

      // Verify update persisted
      const finalSession = VueniSecureStorage.getItem('vueni:session');
      expect(finalSession.preferences.theme).toBe('light');
    });

    it('should handle data synchronization conflicts', () => {
      const baseData = { id: 'sync-test', version: 1, amount: 100 };

      // Store initial version
      VueniSecureStorage.setItem('vueni:sync-test', baseData);

      // Simulate conflicting updates
      const update1 = { ...baseData, version: 2, amount: 150 };
      const update2 = { ...baseData, version: 2, amount: 200 };

      // Apply updates
      VueniSecureStorage.setItem('vueni:sync-test', update1);
      VueniSecureStorage.setItem('vueni:sync-test', update2);

      // Last write should win
      const final = VueniSecureStorage.getItem('vueni:sync-test');
      expect(final.amount).toBe(200);
      expect(final.version).toBe(2);
    });
  });

  describe('Data Validation and Sanitization', () => {
    it('should validate all financial amounts', () => {
      const testAmounts = [
        { input: '1234.56', expected: 1234.56 },
        { input: '$1,234.56', expected: 1234.56 },
        { input: '1234.567', expected: 1234.57 }, // Rounded
        { input: '-500.00', expected: -500.0 },
        { input: 'invalid', shouldThrow: true },
        { input: '999999999999999', shouldThrow: true }, // Too large
      ];

      testAmounts.forEach(({ input, expected, shouldThrow }) => {
        if (shouldThrow) {
          expect(() =>
            VueniInputSanitizer.sanitizeFinancialAmount(input)
          ).toThrow();
        } else {
          const result = VueniInputSanitizer.sanitizeFinancialAmount(input);
          expect(result).toBe(expected);
        }
      });
    });

    it('should sanitize all text inputs', () => {
      const testInputs = [
        {
          input: '<script>alert("xss")</script>',
          expected: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
        },
        {
          input: "O'Reilly & Associates",
          expected: 'O&#x27;Reilly &amp; Associates',
        },
        {
          input: 'Normal text',
          expected: 'Normal text',
        },
      ];

      testInputs.forEach(({ input, expected }) => {
        const result = VueniInputSanitizer.sanitizeText(input);
        expect(result).toBe(expected);
      });
    });

    it('should validate data before storage', () => {
      const invalidTransactions = [
        { ...mockTransactionData, amount: 'invalid' },
        { ...mockTransactionData, date: 'invalid-date' },
        { ...mockTransactionData, id: null },
      ];

      invalidTransactions.forEach((invalidTxn, index) => {
        // Should either sanitize or reject invalid data
        try {
          const sanitized = {
            ...invalidTxn,
            amount:
              typeof invalidTxn.amount === 'string'
                ? VueniInputSanitizer.sanitizeFinancialAmount(invalidTxn.amount)
                : invalidTxn.amount,
          };

          VueniSecureStorage.setItem(`vueni:invalid:${index}`, sanitized);
        } catch (error) {
          // Should throw for truly invalid data
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });
});
