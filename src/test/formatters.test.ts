import { describe, test, expect } from 'vitest';
import {
  formatScore,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatDecimal,
  formatLargeNumber,
  formatFinancialScore,
  safeRatio,
  formatPercent
} from '@/utils/formatters';

describe('Formatter Functions', () => {
  describe('safeRatio', () => {
    test('calculates ratio correctly for normal cases', () => {
      expect(safeRatio(10, 2)).toBe(5);
      expect(safeRatio(100, 50)).toBe(2);
      expect(safeRatio(-10, 2)).toBe(-5);
      expect(safeRatio(0, 10)).toBe(0);
    });

    test('returns null for division by zero', () => {
      expect(safeRatio(10, 0)).toBe(null);
      expect(safeRatio(-10, 0)).toBe(null);
      expect(safeRatio(0, 0)).toBe(null);
    });

    test('handles infinite values', () => {
      expect(safeRatio(10, Infinity)).toBe(null);
      expect(safeRatio(10, -Infinity)).toBe(null);
      expect(safeRatio(Infinity, 10)).toBe(null);
    });

    test('handles NaN values', () => {
      expect(safeRatio(10, NaN)).toBe(null);
      expect(safeRatio(NaN, 10)).toBe(null);
    });
  });

  describe('formatPercent', () => {
    test('formats percentages correctly', () => {
      expect(formatPercent(0.25)).toBe('25.0%');
      expect(formatPercent(0.5)).toBe('50.0%');
      expect(formatPercent(1.0)).toBe('100.0%');
      expect(formatPercent(-0.1)).toBe('-10.0%');
    });

    test('clamps extreme percentage values', () => {
      expect(formatPercent(30.8)).toBe('999.0%'); // 3080% clamped to 999%
      expect(formatPercent(70.12)).toBe('999.0%'); // 7012% clamped to 999%
      expect(formatPercent(-30.8)).toBe('-999.0%'); // -3080% clamped to -999%
    });

    test('handles null and invalid values', () => {
      expect(formatPercent(null)).toBe('--');
      expect(formatPercent(Infinity)).toBe('--');
      expect(formatPercent(-Infinity)).toBe('--');
      expect(formatPercent(NaN)).toBe('--');
    });

    test('respects decimal places', () => {
      expect(formatPercent(0.123, 0)).toBe('12%');
      expect(formatPercent(0.123, 1)).toBe('12.3%');
      expect(formatPercent(0.123, 2)).toBe('12.30%');
    });

    test('respects custom clamp values', () => {
      expect(formatPercent(5.0, 1, 100)).toBe('100.0%'); // 500% clamped to 100%
      expect(formatPercent(-5.0, 1, 100)).toBe('-100.0%'); // -500% clamped to -100%
    });
  });

  describe('formatScore', () => {
    test('formats score with default precision', () => {
      expect(formatScore(85.73829)).toBe('85.7');
      expect(formatScore(92)).toBe('92.0');
      expect(formatScore(100)).toBe('100.0');
      expect(formatScore(0)).toBe('0.0');
      expect(formatScore(45.95)).toBe('46.0');
      expect(formatScore(45.94)).toBe('45.9');
    });

    test('respects precision parameter', () => {
      expect(formatScore(85.789, 0)).toBe('86');
      expect(formatScore(85.789, 1)).toBe('85.8');
      expect(formatScore(85.789, 2)).toBe('85.79');
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

  describe('formatScore utility', () => {
    describe('integer formatting (precision = 0)', () => {
      test('should format to integer by default', () => {
        expect(formatScore(79.374449477564985)).toBe('79');
        expect(formatScore(79.9999)).toBe('80');
        expect(formatScore(79.1)).toBe('79');
        expect(formatScore(79.5)).toBe('80'); // Rounds up
      });

      test('should handle edge cases for integer formatting', () => {
        expect(formatScore(0)).toBe('0');
        expect(formatScore(100)).toBe('100');
        expect(formatScore(0.4)).toBe('0');
        expect(formatScore(0.5)).toBe('1'); // Rounds up
      });
    });

    describe('single decimal formatting (precision = 1)', () => {
      test('should format to 1 decimal place', () => {
        expect(formatScore(79.3, 1)).toBe('79.3');
        expect(formatScore(79.37, 1)).toBe('79.4'); // Rounds up
        expect(formatScore(79.0, 1)).toBe('79.0');
        expect(formatScore(79.95, 1)).toBe('80.0');
      });

      test('should handle edge cases for single decimal', () => {
        expect(formatScore(0, 1)).toBe('0.0');
        expect(formatScore(100, 1)).toBe('100.0');
        expect(formatScore(99.99, 1)).toBe('100.0');
      });
    });

    describe('double decimal formatting (precision = 2)', () => {
      test('should format to 2 decimal places', () => {
        expect(formatScore(79.34, 2)).toBe('79.34');
        expect(formatScore(79.349, 2)).toBe('79.35'); // Rounds up
        expect(formatScore(79.0, 2)).toBe('79.00');
        expect(formatScore(79.999, 2)).toBe('80.00');
      });

      test('should handle edge cases for double decimal', () => {
        expect(formatScore(0, 2)).toBe('0.00');
        expect(formatScore(100, 2)).toBe('100.00');
        expect(formatScore(99.995, 2)).toBe('100.00');
      });
    });

    describe('precision validation', () => {
      test('should clamp invalid precision values', () => {
        // @ts-expect-error Testing invalid precision values
        expect(formatScore(79.374, -1)).toBe('79'); // Clamped to 0
        // @ts-expect-error Testing invalid precision values  
        expect(formatScore(79.374, 5)).toBe('79.37'); // Clamped to 2
      });
    });

    describe('locale support', () => {
      test('should respect locale formatting', () => {
        // German locale uses comma as decimal separator
        expect(formatScore(79.34, 2, 'de-DE')).toBe('79,34');
        expect(formatScore(79.3, 1, 'de-DE')).toBe('79,3');
        
        // French locale
        expect(formatScore(79.34, 2, 'fr-FR')).toBe('79,34');
      });

      test('should not use thousands separators', () => {
        expect(formatScore(1000, 0)).toBe('1000'); // No comma
        expect(formatScore(1000.5, 1)).toBe('1000.5'); // No comma
      });
    });

    describe('financial score specific formatting', () => {
      test('should always format financial scores as integers', () => {
        expect(formatFinancialScore(79.374449477564985)).toBe('79');
        expect(formatFinancialScore(79.9999)).toBe('80');
        expect(formatFinancialScore(0.5)).toBe('1');
        expect(formatFinancialScore(100)).toBe('100');
      });
    });

    describe('problematic values from actual usage', () => {
      test('should handle the exact problematic value from Financial Health card', () => {
        expect(formatScore(79.60230617161903)).toBe('80'); // Integer default
        expect(formatScore(79.60230617161903, 1)).toBe('79.6'); // 1 decimal
        expect(formatScore(79.60230617161903, 2)).toBe('79.60'); // 2 decimals
      });

      test('should handle bill payment score calculations', () => {
        // Simulating: (completedTransactions / totalTransactions) * 100
        const score = (27 / 34) * 100; // This produces decimals
        expect(formatScore(score)).toBe('79'); // Clean integer
      });

      test('should handle weighted financial score calculations', () => {
        // Simulating complex weighted calculations
        const complexScore = 79.37449477564985 * 0.4 + 82.15 * 0.3 + 76.23 * 0.3;
        expect(formatScore(complexScore)).toBe('79'); // Clean integer
      });
    });
  });
}); 