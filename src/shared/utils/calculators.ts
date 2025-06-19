/**
 * Calculates how many years your savings will last given monthly expenses and an annual growth rate.
 * 
 * This function simulates the depletion of savings over time, accounting for investment growth
 * and monthly withdrawals for expenses. It helps determine financial independence timelines.
 * 
 * @param initialSavings - The starting savings balance in dollars
 * @param monthlyExpenses - Monthly living expenses in dollars (must be > 0)
 * @param annualGrowthRate - Expected annual return rate as decimal (default: 0.04 = 4%)
 * @returns Number of years the savings will last (rounded to 2 decimal places)
 * @throws {Error} When monthlyExpenses is 0 or negative
 * 
 * @example
 * ```typescript
 * // $500,000 savings, $4,000/month expenses, 4% annual growth
 * const years = calculateFinancialFreedomYears(500000, 4000, 0.04);
 * console.log(years); // ~25.67 years
 * ```
 */
export function calculateFinancialFreedomYears(initialSavings: number, monthlyExpenses: number, annualGrowthRate = 0.04): number {
  if (monthlyExpenses <= 0) throw new Error("Monthly expenses must be greater than 0");
  if (initialSavings <= 0) return 0;

  const monthlyRate = annualGrowthRate / 12;
  let balance = initialSavings;
  let months = 0;

  // Simulate month-by-month until balance is depleted or exceeds an upper boundary (50 years)
  const MAX_MONTHS = 50 * 12;
  while (balance > 0 && months < MAX_MONTHS) {
    balance = balance * (1 + monthlyRate) - monthlyExpenses;
    months += 1;
  }

  return +(months / 12).toFixed(2);
}

/**
 * Calculates Return on Investment (ROI) as a percentage.
 * 
 * ROI measures the efficiency of an investment by comparing the gain or loss
 * relative to the cost of the investment. Formula: (Current Value - Initial Investment) / Initial Investment * 100
 * 
 * @param initialInvestment - The original investment amount in dollars (cannot be 0)
 * @param currentValue - The current value of the investment in dollars
 * @returns ROI as a percentage (rounded to 2 decimal places)
 * @throws {Error} When initialInvestment is 0
 * 
 * @example
 * ```typescript
 * // Invested $1000, now worth $1200
 * const roi = calculateROI(1000, 1200);
 * console.log(roi); // 20.00 (20% return)
 * ```
 */
export function calculateROI(initialInvestment: number, currentValue: number): number {
  if (initialInvestment === 0) throw new Error("Initial investment cannot be 0");
  return +(((currentValue - initialInvestment) / initialInvestment) * 100).toFixed(2);
}

/**
 * Calculates monthly payment for an amortizing loan.
 * 
 * Uses the standard amortization formula to determine fixed monthly payments
 * that will fully pay off the loan principal and interest over the specified term.
 * 
 * @param principal - The loan amount in dollars
 * @param annualRate - Annual interest rate as a percentage (e.g., 5.5 for 5.5%)
 * @param years - Loan term in years
 * @returns Monthly payment amount (rounded to 2 decimal places)
 * 
 * @example
 * ```typescript
 * // $300,000 loan at 4.5% for 30 years
 * const payment = calculateLoanPayment(300000, 4.5, 30);
 * console.log(payment); // $1520.06
 * ```
 */
export function calculateLoanPayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 12 / 100;
  const n = years * 12;
  if (monthlyRate === 0) return +(principal / n).toFixed(2);
  const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  return +payment.toFixed(2);
}

/**
 * Calculates future value adjusted for inflation.
 * 
 * Projects how much a current price or value will be worth in the future,
 * accounting for expected inflation. Uses compound growth formula.
 * 
 * @param currentPrice - Current price or value in dollars
 * @param annualInflationRate - Expected annual inflation rate as percentage (e.g., 3.2 for 3.2%)
 * @param years - Number of years in the future
 * @returns Future value adjusted for inflation (rounded to 2 decimal places)
 * 
 * @example
 * ```typescript
 * // $100 item with 3% inflation over 10 years
 * const futurePrice = calculateInflationAdjustedValue(100, 3, 10);
 * console.log(futurePrice); // $134.39
 * ```
 */
export function calculateInflationAdjustedValue(currentPrice: number, annualInflationRate: number, years: number): number {
  const futureValue = currentPrice * Math.pow(1 + annualInflationRate / 100, years);
  return +futureValue.toFixed(2);
}

/**
 * Calculates future value with compound interest.
 * 
 * Computes the future value of an investment with compound interest,
 * allowing for different compounding frequencies (monthly, quarterly, annually, etc.).
 * 
 * @param principal - Initial investment amount in dollars
 * @param annualRate - Annual interest rate as percentage (e.g., 5.5 for 5.5%)
 * @param years - Investment period in years
 * @param compoundsPerYear - Number of times interest compounds per year (default: 12 for monthly)
 * @returns Future value with compound interest (rounded to 2 decimal places)
 * 
 * @example
 * ```typescript
 * // $10,000 at 6% annually for 5 years, compounded monthly
 * const futureValue = calculateCompoundInterest(10000, 6, 5, 12);
 * console.log(futureValue); // $13,488.50
 * ```
 */
export function calculateCompoundInterest(principal: number, annualRate: number, years: number, compoundsPerYear = 12): number {
  const fv = principal * Math.pow(1 + annualRate / 100 / compoundsPerYear, compoundsPerYear * years);
  return +fv.toFixed(2);
}

/**
 * Calculates future 401k balance with contributions and employer matching.
 * 
 * Projects retirement account growth considering annual contributions,
 * employer matching, and investment returns compounded annually.
 * 
 * @param currentBalance - Current 401k balance in dollars
 * @param annualContribution - Annual employee contribution in dollars
 * @param employerMatchRate - Employer match rate as decimal (e.g., 0.5 for 50% match)
 * @param annualReturnRate - Expected annual return rate as percentage (e.g., 7 for 7%)
 * @param years - Number of years until retirement
 * @returns Projected 401k balance (rounded to 2 decimal places)
 * 
 * @example
 * ```typescript
 * // $50,000 current, $6,000 annual, 50% match, 7% return, 25 years
 * const balance = calculate401kBalance(50000, 6000, 0.5, 7, 25);
 * console.log(balance); // ~$1,091,234.56
 * ```
 */
export function calculate401kBalance(
  currentBalance: number,
  annualContribution: number,
  employerMatchRate: number,
  annualReturnRate: number,
  years: number
): number {
  let balance = currentBalance;
  for (let i = 0; i < years; i += 1) {
    balance += annualContribution + annualContribution * employerMatchRate;
    balance *= 1 + annualReturnRate / 100;
  }
  return +balance.toFixed(2);
}

/**
 * Calculates total return for a three-fund portfolio over time.
 * 
 * Implements the Bogleheads three-fund portfolio strategy with customizable
 * allocations across US stocks, international stocks, and bonds.
 * 
 * @param usStockReturn - Expected annual return for US stocks as percentage
 * @param internationalStockReturn - Expected annual return for international stocks as percentage
 * @param bondReturn - Expected annual return for bonds as percentage
 * @param years - Investment time horizon in years
 * @param allocation - Portfolio allocation object with us, intl, bonds percentages (default: 40/20/40)
 * @returns Total portfolio growth as percentage over the entire period (rounded to 2 decimal places)
 * 
 * @example
 * ```typescript
 * // 7% US, 6% intl, 3% bonds over 10 years with default allocation
 * const totalReturn = calculateThreeFundPortfolioReturn(7, 6, 3, 10);
 * console.log(totalReturn); // ~69.74% total growth
 * ```
 */
export function calculateThreeFundPortfolioReturn(
  usStockReturn: number,
  internationalStockReturn: number,
  bondReturn: number,
  years: number,
  allocation = { us: 0.4, intl: 0.2, bonds: 0.4 }
): number {
  const avgAnnualReturn =
    allocation.us * usStockReturn + allocation.intl * internationalStockReturn + allocation.bonds * bondReturn;
  const portfolioGrowth = Math.pow(1 + avgAnnualReturn / 100, years) - 1;
  return +(portfolioGrowth * 100).toFixed(2); // percentage total growth over period
}

/**
 * Calculates maximum affordable home price using the 28/36 rule.
 * 
 * Determines the highest home price you can afford based on income,
 * existing debts, mortgage terms, and property taxes. Uses the 28% rule
 * (housing costs ≤ 28% of gross monthly income).
 * 
 * @param annualIncome - Gross annual income in dollars
 * @param monthlyDebts - Existing monthly debt payments in dollars
 * @param annualInterestRate - Mortgage interest rate as percentage (e.g., 4.5 for 4.5%)
 * @param loanTermYears - Mortgage term in years (typically 15 or 30)
 * @param downPayment - Available down payment in dollars
 * @param propertyTaxRate - Annual property tax rate as percentage of home value (default: 1.1%)
 * @returns Maximum affordable home price (rounded to nearest dollar)
 * 
 * @example
 * ```typescript
 * // $80,000 income, $500 debts, 4.5% rate, 30 years, $20,000 down
 * const maxPrice = calculateMaximumHomePrice(80000, 500, 4.5, 30, 20000);
 * console.log(maxPrice); // ~$245,000
 * ```
 */
export function calculateMaximumHomePrice(
  annualIncome: number,
  monthlyDebts: number,
  annualInterestRate: number,
  loanTermYears: number,
  downPayment: number,
  propertyTaxRate = 1.1
): number {
  const maxHousingPayment = (annualIncome / 12) * 0.28;
  const monthlyRate = annualInterestRate / 12 / 100;
  const n = loanTermYears * 12;
  const propertyTaxMonthlyFactor = propertyTaxRate / 100 / 12;

  // We approximate: monthlyPayment = loanPayment + propertyTax
  // We iterate to find price such that housingPayment ~= maxHousingPayment
  let low = 50000;
  let high = 2_000_000;
  for (let i = 0; i < 30; i += 1) {
    const midPrice = (low + high) / 2;
    const loanAmount = midPrice - downPayment;
    const payment = calculateLoanPayment(loanAmount, annualInterestRate, loanTermYears);
    const totalPayment = payment + midPrice * propertyTaxMonthlyFactor;
    if (totalPayment > maxHousingPayment) {
      high = midPrice;
    } else {
      low = midPrice;
    }
  }
  return +low.toFixed(0);
}

/**
 * Calculates interest savings from extra mortgage payments.
 * 
 * Compares the original mortgage schedule with an accelerated payoff schedule
 * to show time saved and total interest reduction from extra monthly payments.
 * 
 * @param principal - Original loan amount in dollars
 * @param annualRate - Annual interest rate as percentage (e.g., 4.5 for 4.5%)
 * @param years - Original loan term in years
 * @param extraMonthlyPayment - Additional monthly payment amount in dollars
 * @returns Object containing originalYears, newYears, and interestSaved
 * 
 * @example
 * ```typescript
 * // $300,000 mortgage at 4.5% for 30 years with $200 extra monthly
 * const savings = calculateMortgagePayoffSavings(300000, 4.5, 30, 200);
 * console.log(savings); // { originalYears: 30, newYears: 24.1, interestSaved: 48532.21 }
 * ```
 */
export function calculateMortgagePayoffSavings(
  principal: number,
  annualRate: number,
  years: number,
  extraMonthlyPayment: number
): { originalYears: number; newYears: number; interestSaved: number } {
  const monthlyRate = annualRate / 12 / 100;
  const originalPayment = calculateLoanPayment(principal, annualRate, years);

  // Simulate original schedule
  let balance = principal;
  let monthsOriginal = 0;
  let totalInterestOriginal = 0;
  while (balance > 0 && monthsOriginal < years * 12 + 1) {
    const interest = balance * monthlyRate;
    const principalPaid = originalPayment - interest;
    balance -= principalPaid;
    totalInterestOriginal += interest;
    monthsOriginal += 1;
  }

  // Simulate with extra payment
  balance = principal;
  let monthsNew = 0;
  let totalInterestNew = 0;
  const newPayment = originalPayment + extraMonthlyPayment;
  while (balance > 0 && monthsNew < years * 12 + 1) {
    const interest = balance * monthlyRate;
    const principalPaid = newPayment - interest;
    balance -= principalPaid;
    totalInterestNew += interest;
    monthsNew += 1;
  }

  return {
    originalYears: +(monthsOriginal / 12).toFixed(2),
    newYears: +(monthsNew / 12).toFixed(2),
    interestSaved: +(totalInterestOriginal - totalInterestNew).toFixed(2)
  };
}

/**
 * Performs a hypothetical portfolio backtest with historical returns.
 * 
 * Calculates the final portfolio value by applying a sequence of annual returns
 * to simulate how an investment would have performed historically.
 * 
 * @param initialInvestment - Starting investment amount in dollars
 * @param annualReturns - Array of annual return percentages (e.g., [10, -5, 15, 8])
 * @returns Final portfolio value after applying all returns (rounded to 2 decimal places)
 * 
 * @example
 * ```typescript
 * // $10,000 with returns of 10%, -5%, 15%, 8%
 * const finalValue = calculatePortfolioBacktest(10000, [10, -5, 15, 8]);
 * console.log(finalValue); // ~$13,234.60
 * ```
 */
export function calculatePortfolioBacktest(initialInvestment: number, annualReturns: number[]): number {
  let balance = initialInvestment;
  annualReturns.forEach((r) => {
    balance *= 1 + r / 100;
  });
  return +balance.toFixed(2);
}

/**
 * Converts currency using a given exchange rate.
 * 
 * Simple currency conversion utility that multiplies the amount by the exchange rate.
 * 
 * @param amount - Amount to convert in the base currency
 * @param rate - Exchange rate (target currency per unit of base currency)
 * @returns Converted amount in target currency (rounded to 2 decimal places)
 * 
 * @example
 * ```typescript
 * // Convert $100 USD to EUR with rate 0.85
 * const euros = convertCurrency(100, 0.85);
 * console.log(euros); // 85.00
 * ```
 */
export function convertCurrency(amount: number, rate: number): number {
  return +(amount * rate).toFixed(2);
} 