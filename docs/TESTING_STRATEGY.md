# Testing Strategy & Implementation Guide

## Overview

This document outlines a comprehensive testing strategy for the Liquid Spark Finance application, addressing the current 0% test coverage and establishing a robust testing framework to achieve 80% coverage target.

## Current State Analysis

### Testing Infrastructure: ❌ Missing
- **No testing framework** installed
- **No test files** present in codebase
- **No CI/CD testing** pipeline
- **No test coverage** reporting

### Risk Assessment: 🔴 Critical
- **Financial calculations** have no validation
- **User input handling** is untested
- **Component rendering** has no regression protection
- **Security features** are unverified

## Testing Framework Setup

### 1. Core Testing Dependencies

```bash
# Unit & Integration Testing
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E Testing
npm install -D @playwright/test

# Coverage & Reporting
npm install -D @vitest/coverage-v8 @storybook/testing-library

# Mocking & Utilities
npm install -D msw@latest happy-dom
```

### 2. Configuration Files

#### Vitest Configuration (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.storybook'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.stories.{js,jsx,ts,tsx}',
        '**/index.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

#### Test Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock crypto for tests
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn(() => new Uint8Array(32)),
    subtle: {
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      generateKey: vi.fn(),
    }
  }
});
```

#### Playwright Configuration (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Unit Testing Strategy

### 1. Financial Calculators (Priority: Critical)

#### Test Coverage Requirements: 100%

```typescript
// src/utils/__tests__/calculators.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateCompoundInterest,
  calculateLoanPayment,
  calculateROI,
  calculateFinancialFreedomYears,
  calculate401kBalance,
  calculateMortgagePayoffSavings,
  calculateThreeFundPortfolioReturn,
  calculateMaximumHomePrice,
  calculateInflationAdjustedValue,
  calculatePortfolioBacktest,
  convertCurrency
} from '../calculators';

describe('Financial Calculators', () => {
  describe('calculateCompoundInterest', () => {
    it('should calculate correct compound interest with monthly compounding', () => {
      const result = calculateCompoundInterest(10000, 5, 10, 12);
      expect(result).toBeCloseTo(16470.09, 2);
    });

    it('should calculate correct compound interest with annual compounding', () => {
      const result = calculateCompoundInterest(10000, 5, 10, 1);
      expect(result).toBeCloseTo(16288.95, 2);
    });

    it('should handle zero principal', () => {
      const result = calculateCompoundInterest(0, 5, 10, 12);
      expect(result).toBe(0);
    });

    it('should handle zero interest rate', () => {
      const result = calculateCompoundInterest(10000, 0, 10, 12);
      expect(result).toBe(10000);
    });

    it('should handle zero years', () => {
      const result = calculateCompoundInterest(10000, 5, 0, 12);
      expect(result).toBe(10000);
    });

    it('should throw error for negative principal', () => {
      expect(() => calculateCompoundInterest(-1000, 5, 10, 12)).toThrow();
    });

    it('should handle high frequency compounding', () => {
      const daily = calculateCompoundInterest(10000, 5, 10, 365);
      const monthly = calculateCompoundInterest(10000, 5, 10, 12);
      expect(daily).toBeGreaterThan(monthly);
    });
  });

  describe('calculateLoanPayment', () => {
    it('should calculate correct monthly payment for 30-year mortgage', () => {
      const payment = calculateLoanPayment(300000, 4.5, 30);
      expect(payment).toBeCloseTo(1520.06, 2);
    });

    it('should calculate correct monthly payment for 15-year mortgage', () => {
      const payment = calculateLoanPayment(300000, 4.5, 15);
      expect(payment).toBeCloseTo(2294.98, 2);
    });

    it('should handle zero interest rate', () => {
      const payment = calculateLoanPayment(12000, 0, 12);
      expect(payment).toBe(1000); // Simple division
    });

    it('should throw error for negative principal', () => {
      expect(() => calculateLoanPayment(-100000, 4.5, 30)).toThrow();
    });

    it('should throw error for negative rate', () => {
      expect(() => calculateLoanPayment(100000, -4.5, 30)).toThrow();
    });
  });

  describe('calculateROI', () => {
    it('should calculate positive ROI correctly', () => {
      const roi = calculateROI(1000, 1200);
      expect(roi).toBe(20);
    });

    it('should calculate negative ROI correctly', () => {
      const roi = calculateROI(1000, 800);
      expect(roi).toBe(-20);
    });

    it('should handle zero gain/loss', () => {
      const roi = calculateROI(1000, 1000);
      expect(roi).toBe(0);
    });

    it('should throw error for zero initial investment', () => {
      expect(() => calculateROI(0, 1000)).toThrow('Initial investment cannot be 0');
    });
  });

  describe('calculateFinancialFreedomYears', () => {
    it('should calculate years until depletion with growth', () => {
      const years = calculateFinancialFreedomYears(500000, 4000, 0.04);
      expect(years).toBeGreaterThan(20);
      expect(years).toBeLessThan(30);
    });

    it('should handle scenario where expenses exceed growth', () => {
      const years = calculateFinancialFreedomYears(100000, 10000, 0.02);
      expect(years).toBeGreaterThan(0);
    });

    it('should return 0 for zero savings', () => {
      const years = calculateFinancialFreedomYears(0, 4000, 0.04);
      expect(years).toBe(0);
    });

    it('should throw error for zero or negative expenses', () => {
      expect(() => calculateFinancialFreedomYears(500000, 0, 0.04))
        .toThrow('Monthly expenses must be greater than 0');
      expect(() => calculateFinancialFreedomYears(500000, -1000, 0.04))
        .toThrow('Monthly expenses must be greater than 0');
    });
  });

  // Additional comprehensive tests for all other calculators...
});
```

### 2. Service Layer Testing

```typescript
// src/services/__tests__/ecoScoreService.test.ts
import { describe, it, expect } from 'vitest';
import { calculateEcoScore } from '../ecoScoreService';

describe('EcoScore Service', () => {
  const mockTransactions = [
    {
      id: '1',
      merchant: 'Gas Station',
      category: { name: 'Transportation' },
      amount: -50
    },
    {
      id: '2',
      merchant: 'Whole Foods',
      category: { name: 'Food' },
      amount: -100
    },
    {
      id: '3',
      merchant: 'Amazon',
      category: { name: 'Shopping' },
      amount: -75
    }
  ];

  it('should calculate eco score from transactions', () => {
    const result = calculateEcoScore(mockTransactions);
    
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.totalKgCO2e).toBeGreaterThan(0);
    expect(result.transportKg).toBeGreaterThan(0);
    expect(result.foodKg).toBeGreaterThan(0);
    expect(result.shoppingKg).toBeGreaterThan(0);
  });

  it('should handle empty transaction list', () => {
    const result = calculateEcoScore([]);
    
    expect(result.score).toBe(0);
    expect(result.totalKgCO2e).toBe(0);
    expect(result.sustainableSpendRatio).toBe(0);
  });

  it('should identify sustainable merchants', () => {
    const sustainableTransactions = [
      {
        id: '1',
        merchant: 'Whole Foods Market',
        category: { name: 'Food' },
        amount: -100
      }
    ];
    
    const result = calculateEcoScore(sustainableTransactions);
    expect(result.sustainableSpendRatio).toBeGreaterThan(0);
  });

  it('should ignore positive amounts (income)', () => {
    const mixedTransactions = [
      ...mockTransactions,
      {
        id: '4',
        merchant: 'Employer',
        category: { name: 'Income' },
        amount: 5000
      }
    ];
    
    const result = calculateEcoScore(mixedTransactions);
    const originalResult = calculateEcoScore(mockTransactions);
    
    expect(result.totalKgCO2e).toBe(originalResult.totalKgCO2e);
  });
});
```

### 3. Component Testing

```typescript
// src/components/__tests__/TransactionList.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionList } from '../TransactionList';

const mockTransactions = [
  {
    id: 'trans_001',
    merchant: 'Apple Store',
    category: { name: 'Shopping', color: '#FF6B6B' },
    amount: -299.99,
    date: '2024-01-15',
    status: 'completed' as const
  },
  {
    id: 'trans_002',
    merchant: 'Starbucks',
    category: { name: 'Food', color: '#4ECDC4' },
    amount: -5.50,
    date: '2024-01-14',
    status: 'completed' as const
  }
];

describe('TransactionList Component', () => {
  it('should render transaction list correctly', () => {
    render(<TransactionList transactions={mockTransactions} />);
    
    expect(screen.getByText('Apple Store')).toBeInTheDocument();
    expect(screen.getByText('Starbucks')).toBeInTheDocument();
    expect(screen.getByText('-$299.99')).toBeInTheDocument();
    expect(screen.getByText('-$5.50')).toBeInTheDocument();
  });

  it('should handle empty transaction list', () => {
    render(<TransactionList transactions={[]} />);
    
    expect(screen.getByText(/no transactions/i)).toBeInTheDocument();
  });

  it('should call onTransactionClick when transaction is clicked', async () => {
    const onTransactionClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TransactionList 
        transactions={mockTransactions}
        onTransactionClick={onTransactionClick}
      />
    );
    
    const firstTransaction = screen.getByTestId('transaction-trans_001');
    await user.click(firstTransaction);
    
    expect(onTransactionClick).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it('should filter transactions when search is used', async () => {
    const user = userEvent.setup();
    
    render(<TransactionList transactions={mockTransactions} searchable />);
    
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'Apple');
    
    expect(screen.getByText('Apple Store')).toBeInTheDocument();
    expect(screen.queryByText('Starbucks')).not.toBeInTheDocument();
  });

  it('should group transactions by date when enabled', () => {
    render(
      <TransactionList 
        transactions={mockTransactions}
        groupByDate 
      />
    );
    
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('January 14, 2024')).toBeInTheDocument();
  });
});
```

### 4. Hook Testing

```typescript
// src/hooks/__tests__/useLiquidGlass.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLiquidGlass } from '../useLiquidGlass';

describe('useLiquidGlass Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default settings', () => {
    const { result } = renderHook(() => useLiquidGlass());
    
    expect(result.current.settings.opacity).toBe(0.1);
    expect(result.current.settings.blur).toBe(20);
    expect(result.current.settings.enabled).toBe(true);
  });

  it('should update settings and persist to localStorage', () => {
    const { result } = renderHook(() => useLiquidGlass());
    
    act(() => {
      result.current.updateSettings({ opacity: 0.5 });
    });
    
    expect(result.current.settings.opacity).toBe(0.5);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'liquidGlassSettings',
      expect.stringContaining('0.5')
    );
  });

  it('should load settings from localStorage', () => {
    localStorage.setItem('liquidGlassSettings', JSON.stringify({
      opacity: 0.3,
      blur: 15,
      enabled: false
    }));
    
    const { result } = renderHook(() => useLiquidGlass());
    
    expect(result.current.settings.opacity).toBe(0.3);
    expect(result.current.settings.blur).toBe(15);
    expect(result.current.settings.enabled).toBe(false);
  });
});
```

## Integration Testing Strategy

### 1. Calculator Flow Integration

```typescript
// src/__tests__/integration/calculator-flow.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CompoundInterestCalculator } from '@/components/calculators/CompoundInterestCalculator';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Calculator Flow Integration', () => {
  it('should complete compound interest calculation flow', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<CompoundInterestCalculator />);
    
    // Fill in form inputs
    const principalInput = screen.getByLabelText(/principal/i);
    const rateInput = screen.getByLabelText(/interest rate/i);
    const yearsInput = screen.getByLabelText(/years/i);
    
    await user.clear(principalInput);
    await user.type(principalInput, '10000');
    
    await user.clear(rateInput);
    await user.type(rateInput, '5');
    
    await user.clear(yearsInput);
    await user.type(yearsInput, '10');
    
    // Submit calculation
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);
    
    // Verify results
    await waitFor(() => {
      expect(screen.getByTestId('result-value')).toHaveTextContent('$16,470.09');
    });
    
    // Verify breakdown is shown
    expect(screen.getByText(/interest earned/i)).toBeInTheDocument();
    expect(screen.getByText(/total amount/i)).toBeInTheDocument();
  });

  it('should handle input validation errors', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<CompoundInterestCalculator />);
    
    const principalInput = screen.getByLabelText(/principal/i);
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    
    // Enter invalid input
    await user.clear(principalInput);
    await user.type(principalInput, '-1000');
    await user.click(calculateButton);
    
    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/principal must be positive/i)).toBeInTheDocument();
    });
  });
});
```

### 2. Data Flow Integration

```typescript
// src/__tests__/integration/data-flow.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard';

describe('Data Flow Integration', () => {
  it('should load and display dashboard data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    // Verify loading state
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('balance-card')).toBeInTheDocument();
    });

    // Verify data is displayed
    expect(screen.getByText(/total balance/i)).toBeInTheDocument();
    expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
  });
});
```

## End-to-End Testing Strategy

### 1. Critical User Journeys

```typescript
// e2e/calculator-journeys.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Calculator User Journeys', () => {
  test('Complete compound interest calculation journey', async ({ page }) => {
    await page.goto('/calculators');
    
    // Navigate to compound interest calculator
    await page.click('[data-testid="compound-interest-card"]');
    
    // Verify page loaded
    await expect(page.locator('h1')).toContainText('Compound Interest Calculator');
    
    // Fill in form
    await page.fill('[data-testid="principal-input"]', '10000');
    await page.fill('[data-testid="rate-input"]', '5');
    await page.fill('[data-testid="years-input"]', '10');
    await page.selectOption('[data-testid="compounds-select"]', '12');
    
    // Calculate
    await page.click('[data-testid="calculate-button"]');
    
    // Verify result
    await expect(page.locator('[data-testid="result-value"]')).toContainText('$16,470.09');
    
    // Verify chart is displayed
    await expect(page.locator('[data-testid="growth-chart"]')).toBeVisible();
    
    // Test saving calculation
    await page.click('[data-testid="save-calculation-button"]');
    await page.fill('[data-testid="calculation-name-input"]', 'My Retirement Fund');
    await page.click('[data-testid="save-confirm-button"]');
    
    // Verify saved calculation appears in history
    await expect(page.locator('[data-testid="saved-calculations"]')).toContainText('My Retirement Fund');
  });

  test('Multi-calculator comparison journey', async ({ page }) => {
    await page.goto('/calculators');
    
    // Calculate compound interest
    await page.click('[data-testid="compound-interest-card"]');
    await page.fill('[data-testid="principal-input"]', '10000');
    await page.fill('[data-testid="rate-input"]', '5');
    await page.fill('[data-testid="years-input"]', '10');
    await page.click('[data-testid="calculate-button"]');
    
    const compoundResult = await page.textContent('[data-testid="result-value"]');
    
    // Navigate to loan calculator
    await page.click('[data-testid="back-button"]');
    await page.click('[data-testid="loan-calculator-card"]');
    
    // Calculate loan payment
    await page.fill('[data-testid="principal-input"]', '300000');
    await page.fill('[data-testid="rate-input"]', '4.5');
    await page.fill('[data-testid="years-input"]', '30');
    await page.click('[data-testid="calculate-button"]');
    
    const loanResult = await page.textContent('[data-testid="result-value"]');
    
    // Verify both calculations are different and valid
    expect(compoundResult).not.toBe(loanResult);
    expect(compoundResult).toMatch(/\$[\d,]+\.\d{2}/);
    expect(loanResult).toMatch(/\$[\d,]+\.\d{2}/);
  });
});
```

### 2. Responsive Design Testing

```typescript
// e2e/responsive.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('Calculator works on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/calculators/compound-interest');
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-calculator-layout"]')).toBeVisible();
    
    // Test form interactions on mobile
    await page.fill('[data-testid="principal-input"]', '5000');
    await page.fill('[data-testid="rate-input"]', '3.5');
    await page.fill('[data-testid="years-input"]', '15');
    
    // Scroll to calculate button (might be below fold on mobile)
    await page.locator('[data-testid="calculate-button"]').scrollIntoViewIfNeeded();
    await page.click('[data-testid="calculate-button"]');
    
    // Verify result is displayed
    await expect(page.locator('[data-testid="result-value"]')).toBeVisible();
  });

  test('Navigation works across different screen sizes', async ({ page }) => {
    // Test desktop navigation
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    await expect(page.locator('[data-testid="desktop-navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu-button"]')).not.toBeVisible();
    
    // Test tablet navigation
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    await expect(page.locator('[data-testid="tablet-navigation"]')).toBeVisible();
    
    // Test mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-navigation-menu"]')).toBeVisible();
  });
});
```

### 3. Security Testing

```typescript
// e2e/security.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Security Testing', () => {
  test('Should prevent XSS attacks in transaction descriptions', async ({ page }) => {
    await page.goto('/transactions');
    
    // Attempt to inject XSS
    const xssPayload = '<script>window.xssTriggered = true;</script>';
    
    await page.click('[data-testid="add-transaction-button"]');
    await page.fill('[data-testid="merchant-input"]', xssPayload);
    await page.fill('[data-testid="description-input"]', xssPayload);
    await page.fill('[data-testid="amount-input"]', '-50');
    await page.click('[data-testid="save-transaction-button"]');
    
    // Verify XSS was not executed
    const xssTriggered = await page.evaluate(() => window.xssTriggered);
    expect(xssTriggered).toBeUndefined();
    
    // Verify content is safely displayed
    await expect(page.locator('[data-testid="transaction-list"]')).toContainText(xssPayload);
  });

  test('Should implement rate limiting on calculations', async ({ page }) => {
    await page.goto('/calculators/compound-interest');
    
    // Attempt rapid-fire calculations
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(
        page.fill('[data-testid="principal-input"]', `${1000 + i}`)
          .then(() => page.click('[data-testid="calculate-button"]'))
      );
    }
    
    await Promise.all(promises);
    
    // Should see rate limiting message
    await expect(page.locator('[data-testid="rate-limit-warning"]')).toBeVisible();
  });
});
```

## Performance Testing

### 1. Load Testing

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Testing', () => {
  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // Check Lighthouse metrics
    const performance = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });
    
    expect(performance.domContentLoaded).toBeLessThan(1500);
    expect(performance.loadComplete).toBeLessThan(3000);
  });

  test('Large transaction list performance', async ({ page }) => {
    // Navigate to page with large dataset
    await page.goto('/transactions?mock=large');
    
    const startTime = Date.now();
    
    // Wait for virtual scrolling to initialize
    await page.waitForSelector('[data-testid="virtualized-list"]');
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1000); // Should render within 1 second
    
    // Test scrolling performance
    const scrollStart = Date.now();
    await page.mouse.wheel(0, 5000); // Scroll down
    await page.waitForTimeout(100); // Allow for scroll to complete
    const scrollTime = Date.now() - scrollStart;
    
    expect(scrollTime).toBeLessThan(200); // Scrolling should be smooth
  });
});
```

## Test Data Management

### 1. Mock Data Factory

```typescript
// src/test/factories.ts
import { faker } from '@faker-js/faker';

export const createMockTransaction = (overrides = {}) => ({
  id: faker.string.uuid(),
  merchant: faker.company.name(),
  category: {
    name: faker.helpers.arrayElement(['Food', 'Transportation', 'Shopping', 'Utilities']),
    color: faker.color.rgb()
  },
  amount: faker.number.float({ min: -500, max: -0.01, fractionDigits: 2 }),
  date: faker.date.recent().toISOString(),
  status: faker.helpers.arrayElement(['completed', 'pending', 'failed']),
  description: faker.lorem.sentence(),
  ...overrides
});

export const createMockTransactions = (count: number) => 
  Array.from({ length: count }, () => createMockTransaction());

export const createMockAccount = (overrides = {}) => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(['Checking', 'Savings', 'Credit Card', 'Investment']),
  nickname: faker.finance.accountName(),
  balance: faker.number.float({ min: 0, max: 100000, fractionDigits: 2 }),
  availableBalance: faker.number.float({ min: 0, max: 100000, fractionDigits: 2 }),
  currency: 'USD',
  ...overrides
});
```

### 2. Test Utilities

```typescript
// src/test/utils.ts
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';

export const createTestQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

export const renderWithProviders = (
  ui: React.ReactElement,
  options: { queryClient?: QueryClient } = {}
) => {
  const queryClient = options.queryClient ?? createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper });
};
```

## Continuous Integration Setup

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### 2. Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:unit && npm run test:e2e"
  }
}
```

## Coverage Goals & Metrics

### 1. Coverage Targets

| Component Type | Target Coverage | Priority |
|----------------|----------------|----------|
| Financial Calculators | 100% | Critical |
| Service Layer | 90% | High |
| UI Components | 80% | Medium |
| Utility Functions | 95% | High |
| Integration Flows | 70% | Medium |

### 2. Quality Gates

```typescript
// vitest.config.ts coverage thresholds
coverage: {
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    'src/utils/calculators.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    'src/services/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
```

## Implementation Timeline

### Week 1: Foundation
- [ ] Set up testing framework (Vitest, Playwright)
- [ ] Configure test environment and CI/CD
- [ ] Create test utilities and factories
- [ ] Write first calculator tests (compound interest)

### Week 2: Core Testing
- [ ] Complete all calculator tests (100% coverage)
- [ ] Implement service layer tests
- [ ] Create component test templates
- [ ] Set up performance testing baseline

### Week 3: Component Testing
- [ ] Test critical UI components
- [ ] Implement integration tests
- [ ] Add responsive design tests
- [ ] Create security test suite

### Week 4: E2E & Polish
- [ ] Complete end-to-end test scenarios
- [ ] Add performance regression tests
- [ ] Implement load testing
- [ ] Documentation and training

## Success Metrics

### Quantitative Goals
- **80% overall test coverage** across codebase
- **100% calculator function coverage** (critical business logic)
- **Zero critical security vulnerabilities** in automated scans
- **Sub-3-second page load times** on 3G networks
- **95% test reliability** (passing rate in CI/CD)

### Qualitative Goals
- **Developer confidence** in making changes
- **Regression prevention** for critical features
- **Documentation coverage** for all test scenarios
- **Maintainable test suite** with clear patterns
- **Security assurance** through automated testing

This comprehensive testing strategy will transform the Liquid Spark Finance application from an untested codebase to a robust, reliable financial platform with confidence in all critical functionality.