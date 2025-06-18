import { describe, test, expect } from 'vitest';
import {
  formatScore,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatDecimal,
  formatLargeNumber
} from '@/utils/formatters';

describe('Formatter Functions', () => {
  describe('formatScore', () => {
    test('formats score with exactly 1 decimal place', () => {
      expect(formatScore(85.73829)).toBe('85.7');
      expect(formatScore(92)).toBe('92.0');
      expect(formatScore(100)).toBe('100.0');
      expect(formatScore(0)).toBe('0.0');
      expect(formatScore(45.95)).toBe('46.0'); // Rounds up
      expect(formatScore(45.94)).toBe('45.9'); // Rounds down
    });

    test('handles edge cases', () => {
      expect(formatScore(-10)).toBe('-10.0');
      expect(formatScore(999.99)).toBe('1000.0');
      expect(formatScore(0.1)).toBe('0.1');
    });
  });

  describe('formatCurrency', () => {
    test('formats whole dollar amounts without decimals', () => {
      expect(formatCurrency(12450)).toBe('$12,450');
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(50)).toBe('$50');
    });

    test('formats amounts with cents when needed', () => {
      expect(formatCurrency(12450.50)).toBe('$12,450.50');
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(0.50)).toBe('$0.50');
    });

    test('respects decimal option', () => {
      expect(formatCurrency(12450.50, { decimals: 0 })).toBe('$12,450');
      expect(formatCurrency(12450, { decimals: 2 })).toBe('$12,450.00');
    });

    test('handles different currencies', () => {
      expect(formatCurrency(1000, { currency: 'EUR', locale: 'en-US' })).toBe('€1,000');
      expect(formatCurrency(1000, { currency: 'GBP', locale: 'en-US' })).toBe('£1,000');
    });

    test('handles negative values', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000');
      expect(formatCurrency(-50.99)).toBe('-$50.99');
    });

    test('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(0, { decimals: 2 })).toBe('$0.00');
    });
  });

  describe('formatPercentage', () => {
    test('formats percentage with 1 decimal by default', () => {
      expect(formatPercentage(85.7)).toBe('85.7%');
      expect(formatPercentage(100)).toBe('100.0%');
      expect(formatPercentage(0)).toBe('0.0%');
    });

    test('respects decimal parameter', () => {
      expect(formatPercentage(85.789, 0)).toBe('86%');
      expect(formatPercentage(85.789, 2)).toBe('85.79%');
      expect(formatPercentage(85.789, 3)).toBe('85.789%');
    });

    test('handles edge cases', () => {
      expect(formatPercentage(-25.5)).toBe('-25.5%');
      expect(formatPercentage(150)).toBe('150.0%');
      expect(formatPercentage(0.1)).toBe('0.1%');
    });
  });

  describe('formatCompactNumber', () => {
    test('formats thousands with K suffix', () => {
      expect(formatCompactNumber(1000)).toBe('1.0K');
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(999)).toBe('999');
      expect(formatCompactNumber(12345)).toBe('12.3K');
    });

    test('formats millions with M suffix', () => {
      expect(formatCompactNumber(1000000)).toBe('1.0M');
      expect(formatCompactNumber(2500000)).toBe('2.5M');
      expect(formatCompactNumber(999999)).toBe('1000.0K');
      expect(formatCompactNumber(12345678)).toBe('12.3M');
    });

    test('formats billions with B suffix', () => {
      expect(formatCompactNumber(1000000000)).toBe('1.0B');
      expect(formatCompactNumber(2500000000)).toBe('2.5B');
      expect(formatCompactNumber(999999999)).toBe('1000.0M');
    });

    test('formats small numbers without suffix', () => {
      expect(formatCompactNumber(0)).toBe('0');
      expect(formatCompactNumber(100)).toBe('100');
      expect(formatCompactNumber(999)).toBe('999');
    });

    test('handles negative numbers', () => {
      expect(formatCompactNumber(-1000)).toBe('-1.0K');
      expect(formatCompactNumber(-1000000)).toBe('-1.0M');
    });
  });

  describe('formatDecimal', () => {
    test('formats with 1 decimal by default', () => {
      expect(formatDecimal(10.789)).toBe('10.8');
      expect(formatDecimal(5)).toBe('5.0');
    });

    test('respects decimal parameter', () => {
      expect(formatDecimal(10.789, 0)).toBe('11');
      expect(formatDecimal(10.789, 2)).toBe('10.79');
      expect(formatDecimal(10.789, 3)).toBe('10.789');
    });
  });

  describe('formatLargeNumber', () => {
    test('formats with appropriate suffix', () => {
      expect(formatLargeNumber(1234)).toBe('1.2K');
      expect(formatLargeNumber(1234567)).toBe('1.2M');
      expect(formatLargeNumber(1234567890)).toBe('1.2B');
    });

    test('respects decimal parameter', () => {
      expect(formatLargeNumber(1234, 0)).toBe('1K');
      expect(formatLargeNumber(1234, 2)).toBe('1.23K');
      expect(formatLargeNumber(1234567, 3)).toBe('1.235M');
    });

    test('handles small numbers', () => {
      expect(formatLargeNumber(999)).toBe('999');
      expect(formatLargeNumber(0)).toBe('0');
    });
  });
}); 