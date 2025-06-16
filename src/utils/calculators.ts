// Financial Freedom Calculator: calculates how many years your savings will last given monthly expenses and an annual growth rate.
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

// ROI Calculator: (gain - cost) / cost -> percentage
export function calculateROI(initialInvestment: number, currentValue: number): number {
  if (initialInvestment === 0) throw new Error("Initial investment cannot be 0");
  return +(((currentValue - initialInvestment) / initialInvestment) * 100).toFixed(2);
}

// Loan Calculator: monthly payment for amortizing loan
export function calculateLoanPayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 12 / 100;
  const n = years * 12;
  if (monthlyRate === 0) return +(principal / n).toFixed(2);
  const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  return +payment.toFixed(2);
}

// Inflation Calculator: future price/value adjusted for inflation
export function calculateInflationAdjustedValue(currentPrice: number, annualInflationRate: number, years: number): number {
  const futureValue = currentPrice * Math.pow(1 + annualInflationRate / 100, years);
  return +futureValue.toFixed(2);
}

// Compound Interest Calculator: FV with compounding frequency per year
export function calculateCompoundInterest(principal: number, annualRate: number, years: number, compoundsPerYear = 12): number {
  const fv = principal * Math.pow(1 + annualRate / 100 / compoundsPerYear, compoundsPerYear * years);
  return +fv.toFixed(2);
}

// 401k Retirement Calculator: future balance given contributions & growth
export function calculate401kBalance(
  currentBalance: number,
  annualContribution: number,
  employerMatchRate: number, // e.g. 0.5 for 50% match
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

// Bogleheads 3-Fund Portfolio Calculator: weighted average return over N years
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

// Home Affordability Calculator (simple 28/36 rule)
export function calculateMaximumHomePrice(
  annualIncome: number,
  monthlyDebts: number,
  annualInterestRate: number,
  loanTermYears: number,
  downPayment: number,
  propertyTaxRate = 1.1 // percent of home value per year
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

// Early Mortgage Payoff Calculator: interest saved by extra monthly payment
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

// Stock Portfolio Backtest (hypothetical): future value given array of annual returns
export function calculatePortfolioBacktest(initialInvestment: number, annualReturns: number[]): number {
  let balance = initialInvestment;
  annualReturns.forEach((r) => {
    balance *= 1 + r / 100;
  });
  return +balance.toFixed(2);
}

// Exchange Rate Calculator
export function convertCurrency(amount: number, rate: number): number {
  return +(amount * rate).toFixed(2);
} 