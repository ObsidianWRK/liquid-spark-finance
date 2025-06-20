# API Reference Documentation

## Overview

This document provides comprehensive API documentation for the Vueni application, covering all financial calculation functions, service methods, and utility functions.

## Financial Calculators API

### Compound Interest Calculator

#### `calculateCompoundInterest(principal, annualRate, years, compoundsPerYear?)`

Calculates future value with compound interest, supporting different compounding frequencies.

**Parameters:**

- `principal` (number): Initial investment amount in dollars
- `annualRate` (number): Annual interest rate as percentage (e.g., 5.5 for 5.5%)
- `years` (number): Investment period in years
- `compoundsPerYear` (number, optional): Compounding frequency per year (default: 12)

**Returns:** `number` - Future value with compound interest (rounded to 2 decimal places)

**Throws:** `Error` - When parameters are invalid

**Example:**

```typescript
// $10,000 at 6% annually for 5 years, compounded monthly
const futureValue = calculateCompoundInterest(10000, 6, 5, 12);
console.log(futureValue); // 13488.50
```

**Formula:**

```
FV = P(1 + r/n)^(nt)
Where:
- FV = Future Value
- P = Principal
- r = Annual interest rate (decimal)
- n = Compounding frequency per year
- t = Time in years
```

---

### Loan Payment Calculator

#### `calculateLoanPayment(principal, annualRate, years)`

Calculates monthly payment for an amortizing loan using the standard amortization formula.

**Parameters:**

- `principal` (number): Loan amount in dollars
- `annualRate` (number): Annual interest rate as percentage
- `years` (number): Loan term in years

**Returns:** `number` - Monthly payment amount (rounded to 2 decimal places)

**Example:**

```typescript
// $300,000 loan at 4.5% for 30 years
const payment = calculateLoanPayment(300000, 4.5, 30);
console.log(payment); // 1520.06
```

**Formula:**

```
M = P [ r(1+r)^n ] / [ (1+r)^n – 1 ]
Where:
- M = Monthly payment
- P = Principal loan amount
- r = Monthly interest rate
- n = Total number of months
```

---

### ROI Calculator

#### `calculateROI(initialInvestment, currentValue)`

Calculates Return on Investment as a percentage.

**Parameters:**

- `initialInvestment` (number): Original investment amount (cannot be 0)
- `currentValue` (number): Current value of the investment

**Returns:** `number` - ROI as a percentage (rounded to 2 decimal places)

**Throws:** `Error` - When initialInvestment is 0

**Example:**

```typescript
// Invested $1000, now worth $1200
const roi = calculateROI(1000, 1200);
console.log(roi); // 20.00 (20% return)
```

**Formula:**

```
ROI = ((Current Value - Initial Investment) / Initial Investment) × 100
```

---

### Financial Freedom Calculator

#### `calculateFinancialFreedomYears(initialSavings, monthlyExpenses, annualGrowthRate?)`

Calculates how many years savings will last given monthly expenses and growth rate.

**Parameters:**

- `initialSavings` (number): Starting savings balance in dollars
- `monthlyExpenses` (number): Monthly living expenses (must be > 0)
- `annualGrowthRate` (number, optional): Expected annual return rate as decimal (default: 0.04)

**Returns:** `number` - Years the savings will last (rounded to 2 decimal places)

**Throws:** `Error` - When monthlyExpenses is 0 or negative

**Example:**

```typescript
// $500,000 savings, $4,000/month expenses, 4% annual growth
const years = calculateFinancialFreedomYears(500000, 4000, 0.04);
console.log(years); // ~25.67 years
```

---

### 401k Retirement Calculator

#### `calculate401kBalance(currentBalance, annualContribution, employerMatchRate, annualReturnRate, years)`

Projects future 401k balance with contributions and employer matching.

**Parameters:**

- `currentBalance` (number): Current 401k balance in dollars
- `annualContribution` (number): Annual employee contribution in dollars
- `employerMatchRate` (number): Employer match rate as decimal (e.g., 0.5 for 50%)
- `annualReturnRate` (number): Expected annual return rate as percentage
- `years` (number): Number of years until retirement

**Returns:** `number` - Projected 401k balance (rounded to 2 decimal places)

**Example:**

```typescript
// $50,000 current, $6,000 annual, 50% match, 7% return, 25 years
const balance = calculate401kBalance(50000, 6000, 0.5, 7, 25);
console.log(balance); // ~1,091,234.56
```

---

### Mortgage Payoff Calculator

#### `calculateMortgagePayoffSavings(principal, annualRate, years, extraMonthlyPayment)`

Calculates interest savings from extra mortgage payments.

**Parameters:**

- `principal` (number): Original loan amount in dollars
- `annualRate` (number): Annual interest rate as percentage
- `years` (number): Original loan term in years
- `extraMonthlyPayment` (number): Additional monthly payment in dollars

**Returns:** `object` - Contains originalYears, newYears, and interestSaved

**Example:**

```typescript
// $300,000 mortgage at 4.5% for 30 years with $200 extra monthly
const savings = calculateMortgagePayoffSavings(300000, 4.5, 30, 200);
console.log(savings);
// { originalYears: 30, newYears: 24.1, interestSaved: 48532.21 }
```

---

### Home Affordability Calculator

#### `calculateMaximumHomePrice(annualIncome, monthlyDebts, annualInterestRate, loanTermYears, downPayment, propertyTaxRate?)`

Calculates maximum affordable home price using the 28/36 rule.

**Parameters:**

- `annualIncome` (number): Gross annual income in dollars
- `monthlyDebts` (number): Existing monthly debt payments in dollars
- `annualInterestRate` (number): Mortgage interest rate as percentage
- `loanTermYears` (number): Mortgage term in years
- `downPayment` (number): Available down payment in dollars
- `propertyTaxRate` (number, optional): Annual property tax rate as percentage (default: 1.1%)

**Returns:** `number` - Maximum affordable home price (rounded to nearest dollar)

**Example:**

```typescript
// $80,000 income, $500 debts, 4.5% rate, 30 years, $20,000 down
const maxPrice = calculateMaximumHomePrice(80000, 500, 4.5, 30, 20000);
console.log(maxPrice); // ~245,000
```

---

### Three-Fund Portfolio Calculator

#### `calculateThreeFundPortfolioReturn(usStockReturn, internationalStockReturn, bondReturn, years, allocation?)`

Calculates total return for a three-fund portfolio over time using the Bogleheads strategy.

**Parameters:**

- `usStockReturn` (number): Expected annual return for US stocks as percentage
- `internationalStockReturn` (number): Expected annual return for international stocks as percentage
- `bondReturn` (number): Expected annual return for bonds as percentage
- `years` (number): Investment time horizon in years
- `allocation` (object, optional): Portfolio allocation {us, intl, bonds} (default: 40/20/40)

**Returns:** `number` - Total portfolio growth as percentage (rounded to 2 decimal places)

**Example:**

```typescript
// 7% US, 6% intl, 3% bonds over 10 years with default allocation
const totalReturn = calculateThreeFundPortfolioReturn(7, 6, 3, 10);
console.log(totalReturn); // ~69.74% total growth
```

---

### Inflation Calculator

#### `calculateInflationAdjustedValue(currentPrice, annualInflationRate, years)`

Calculates future value adjusted for inflation.

**Parameters:**

- `currentPrice` (number): Current price or value in dollars
- `annualInflationRate` (number): Expected annual inflation rate as percentage
- `years` (number): Number of years in the future

**Returns:** `number` - Future value adjusted for inflation (rounded to 2 decimal places)

**Example:**

```typescript
// $100 item with 3% inflation over 10 years
const futurePrice = calculateInflationAdjustedValue(100, 3, 10);
console.log(futurePrice); // 134.39
```

---

### Stock Portfolio Backtest

#### `calculatePortfolioBacktest(initialInvestment, annualReturns)`

Performs a hypothetical portfolio backtest with historical returns.

**Parameters:**

- `initialInvestment` (number): Starting investment amount in dollars
- `annualReturns` (number[]): Array of annual return percentages

**Returns:** `number` - Final portfolio value (rounded to 2 decimal places)

**Example:**

```typescript
// $10,000 with returns of 10%, -5%, 15%, 8%
const finalValue = calculatePortfolioBacktest(10000, [10, -5, 15, 8]);
console.log(finalValue); // ~13,234.60
```

---

### Currency Converter

#### `convertCurrency(amount, rate)`

Converts currency using a given exchange rate.

**Parameters:**

- `amount` (number): Amount to convert in base currency
- `rate` (number): Exchange rate (target currency per unit of base currency)

**Returns:** `number` - Converted amount in target currency (rounded to 2 decimal places)

**Example:**

```typescript
// Convert $100 USD to EUR with rate 0.85
const euros = convertCurrency(100, 0.85);
console.log(euros); // 85.00
```

## Service Layer API

### EcoScore Service

#### `calculateEcoScore(transactions)`

Calculates environmental impact score based on transaction data.

**Parameters:**

- `transactions` (Transaction[]): Array of financial transactions to analyze

**Returns:** `EcoBreakdown` - Object with CO2 emissions, sustainable spending ratio, and overall score

**EcoBreakdown Interface:**

```typescript
interface EcoBreakdown {
  totalKgCO2e: number; // Total carbon footprint in kg CO2 equivalent
  transportKg: number; // Transportation emissions
  foodKg: number; // Food-related emissions
  shoppingKg: number; // Shopping emissions
  utilitiesKg: number; // Utilities emissions
  sustainableSpendRatio: number; // Percentage of sustainable spending
  score: number; // Overall eco score 0-100 (higher is better)
}
```

**Example:**

```typescript
const transactions = [
  {
    id: '1',
    merchant: 'Gas Station',
    category: { name: 'Transportation' },
    amount: -50,
  },
  {
    id: '2',
    merchant: 'Whole Foods',
    category: { name: 'Food' },
    amount: -120,
  },
];
const ecoData = calculateEcoScore(transactions);
console.log(ecoData.score); // Environmental score 0-100
```

---

### Credit Score Service

#### `calculateCreditScore(transactions, accounts, paymentHistory)`

Simulates credit score calculation based on financial data.

**Parameters:**

- `transactions` (Transaction[]): Transaction history
- `accounts` (Account[]): Account information
- `paymentHistory` (PaymentRecord[]): Payment history records

**Returns:** `CreditScoreData` - Credit score and contributing factors

**Example:**

```typescript
const creditData = calculateCreditScore(transactions, accounts, paymentHistory);
console.log(creditData.score); // Credit score 300-850
```

---

### Budget Service

#### `calculateBudgetAnalysis(transactions, budgets)`

Analyzes spending against budget allocations.

**Parameters:**

- `transactions` (Transaction[]): Recent transactions
- `budgets` (BudgetCategory[]): Budget category limits

**Returns:** `BudgetAnalysis` - Spending analysis and recommendations

**Example:**

```typescript
const analysis = calculateBudgetAnalysis(transactions, budgets);
console.log(analysis.overBudgetCategories); // Categories exceeding budget
```

---

### Investment Service

#### `calculatePortfolioPerformance(holdings, marketData)`

Calculates investment portfolio performance metrics.

**Parameters:**

- `holdings` (Holding[]): Current investment holdings
- `marketData` (MarketData[]): Current market prices

**Returns:** `PortfolioMetrics` - Performance metrics and analysis

**Example:**

```typescript
const metrics = calculatePortfolioPerformance(holdings, marketData);
console.log(metrics.totalReturn); // Overall portfolio return percentage
```

## Utility Functions API

### Formatters

#### `formatCurrency(amount, currency?)`

Formats numeric values as currency strings.

**Parameters:**

- `amount` (number): Amount to format
- `currency` (string, optional): Currency code (default: 'USD')

**Returns:** `string` - Formatted currency string

**Example:**

```typescript
const formatted = formatCurrency(1234.56);
console.log(formatted); // "$1,234.56"
```

---

#### `formatPercentage(value, decimals?)`

Formats numeric values as percentage strings.

**Parameters:**

- `value` (number): Value to format (as decimal, e.g., 0.1234 for 12.34%)
- `decimals` (number, optional): Number of decimal places (default: 2)

**Returns:** `string` - Formatted percentage string

**Example:**

```typescript
const formatted = formatPercentage(0.1234);
console.log(formatted); // "12.34%"
```

---

### Performance Optimizers

#### `memoizeCalculation(fn, keyGenerator?)`

Memoizes expensive calculation functions for performance.

**Parameters:**

- `fn` (Function): Function to memoize
- `keyGenerator` (Function, optional): Custom key generation function

**Returns:** `Function` - Memoized version of the function

**Example:**

```typescript
const memoizedCompoundInterest = memoizeCalculation(calculateCompoundInterest);
const result = memoizedCompoundInterest(10000, 5, 10); // Cached after first call
```

---

#### `debounceCalculation(fn, delay)`

Debounces calculation functions to prevent excessive calls.

**Parameters:**

- `fn` (Function): Function to debounce
- `delay` (number): Delay in milliseconds

**Returns:** `Function` - Debounced version of the function

**Example:**

```typescript
const debouncedCalculation = debounceCalculation(
  calculateCompoundInterest,
  300
);
// Will only execute after 300ms of no new calls
```

## Error Handling

### Common Error Types

#### `ValidationError`

Thrown when input validation fails.

```typescript
interface ValidationError extends Error {
  name: 'ValidationError';
  field: string;
  value: any;
  constraint: string;
}
```

#### `CalculationError`

Thrown when mathematical calculations fail or produce invalid results.

```typescript
interface CalculationError extends Error {
  name: 'CalculationError';
  operation: string;
  inputs: any[];
}
```

#### `SecurityError`

Thrown when security violations are detected.

```typescript
interface SecurityError extends Error {
  name: 'SecurityError';
  violation: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
```

### Error Handling Best Practices

```typescript
// Always wrap calculations in try-catch blocks
try {
  const result = calculateCompoundInterest(principal, rate, years);
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
    console.error('Invalid input:', error.field, error.value);
  } else if (error instanceof CalculationError) {
    // Handle calculation errors
    console.error('Calculation failed:', error.operation);
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error.message);
  }
  throw error;
}
```

## Type Definitions

### Core Types

```typescript
interface Transaction {
  id: string;
  merchant: string;
  category: {
    name: string;
    color: string;
  };
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

interface Account {
  id: string;
  type: string;
  nickname: string;
  balance: number;
  availableBalance: number;
  currency: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

interface Holding {
  symbol: string;
  shares: number;
  costBasis: number;
  currentPrice: number;
}
```

### Calculator Types

```typescript
interface CalculatorInput {
  principal?: number;
  rate?: number;
  years?: number;
  payment?: number;
  frequency?: number;
}

interface CalculatorResult {
  value: number;
  breakdown?: {
    principal: number;
    interest: number;
    total: number;
  };
  metadata?: {
    calculationType: string;
    timestamp: Date;
    inputs: CalculatorInput;
  };
}
```

## Usage Examples

### Complete Calculator Implementation

```typescript
import {
  calculateCompoundInterest,
  calculateLoanPayment,
  formatCurrency,
  memoizeCalculation
} from '@/utils/calculators';

// Create a memoized calculator for better performance
const memoizedCompoundInterest = memoizeCalculation(calculateCompoundInterest);

// Calculator component usage
const CompoundInterestCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    principal: 10000,
    rate: 5,
    years: 10,
    compounds: 12
  });

  const result = useMemo(() => {
    try {
      return memoizedCompoundInterest(
        inputs.principal,
        inputs.rate,
        inputs.years,
        inputs.compounds
      );
    } catch (error) {
      console.error('Calculation error:', error);
      return 0;
    }
  }, [inputs]);

  return (
    <div>
      <h2>Compound Interest Calculator</h2>
      <p>Future Value: {formatCurrency(result)}</p>
      <p>Interest Earned: {formatCurrency(result - inputs.principal)}</p>
    </div>
  );
};
```

### Service Integration Example

```typescript
import { calculateEcoScore } from '@/services/ecoScoreService';
import { calculateBudgetAnalysis } from '@/services/budgetService';

// Comprehensive financial analysis
const FinancialAnalysis: React.FC<{ transactions: Transaction[] }> = ({
  transactions
}) => {
  const ecoData = useMemo(() =>
    calculateEcoScore(transactions),
    [transactions]
  );

  const budgetData = useMemo(() =>
    calculateBudgetAnalysis(transactions, budgets),
    [transactions, budgets]
  );

  return (
    <div>
      <EcoScoreCard data={ecoData} />
      <BudgetAnalysisCard data={budgetData} />
    </div>
  );
};
```

## Testing Guidelines

### Unit Testing Calculators

```typescript
describe('calculateCompoundInterest', () => {
  test('should calculate correct compound interest', () => {
    const result = calculateCompoundInterest(1000, 5, 10, 12);
    expect(result).toBeCloseTo(1643.62, 2);
  });

  test('should handle edge cases', () => {
    expect(() => calculateCompoundInterest(-1000, 5, 10)).toThrow();
    expect(calculateCompoundInterest(0, 5, 10)).toBe(0);
  });

  test('should produce consistent results', () => {
    const result1 = calculateCompoundInterest(5000, 3.5, 15, 4);
    const result2 = calculateCompoundInterest(5000, 3.5, 15, 4);
    expect(result1).toBe(result2);
  });
});
```

### Integration Testing Services

```typescript
describe('EcoScore Service Integration', () => {
  test('should calculate realistic eco scores', () => {
    const transactions = generateMockTransactions();
    const result = calculateEcoScore(transactions);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.totalKgCO2e).toBeGreaterThan(0);
  });
});
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Use for expensive calculations that may be called repeatedly with the same inputs
2. **Debouncing**: Implement for real-time calculations as users type
3. **Lazy Loading**: Load calculator modules only when needed
4. **Web Workers**: Use for complex calculations that might block the UI
5. **Caching**: Cache calculation results for common scenarios

### Performance Monitoring

```typescript
// Add performance monitoring to critical calculations
const performanceWrapper = <T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    if (end - start > 100) {
      // Log slow calculations
      console.warn(`Slow calculation detected: ${name} took ${end - start}ms`);
    }

    return result;
  }) as T;
};

// Usage
const monitoredCalculateCompoundInterest = performanceWrapper(
  calculateCompoundInterest,
  'CompoundInterest'
);
```

This API reference provides comprehensive documentation for all financial calculation functions and services in the Vueni application. Each function includes detailed parameter descriptions, return types, usage examples, and error handling information to support development and integration efforts.
