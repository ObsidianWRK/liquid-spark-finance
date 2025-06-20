/**
 * Financial Calculator Utilities
 * Comprehensive collection of financial calculation functions
 */

export interface MortgagePayoffResult {
  originalYears: number;
  newYears: number;
  interestSaved: number;
}

export interface ThreeFundAllocation {
  us: number;
  intl: number;
  bonds: number;
}

/**
 * Calculates the number of years to achieve financial freedom
 * @param currentSavings - Current amount saved
 * @param monthlyExpenses - Monthly living expenses
 * @param withdrawalRate - Safe withdrawal rate (default 4%)
 * @returns Number of years to financial freedom
 */
export function calculateFinancialFreedomYears(
  currentSavings: number,
  monthlyExpenses: number,
  withdrawalRate: number = 0.04
): number {
  if (monthlyExpenses <= 0) {
    throw new Error('Monthly expenses must be greater than 0');
  }

  const annualExpenses = monthlyExpenses * 12;
  const targetAmount = annualExpenses / withdrawalRate;
  
  if (currentSavings >= targetAmount) {
    return 0;
  }

  // Simple calculation assuming no additional savings
  // In reality, this would need additional parameters for savings rate
  const yearsNeeded = (targetAmount - currentSavings) / (annualExpenses * 0.1); // Assume 10% savings rate
  
  return Math.min(yearsNeeded, 50); // Cap at 50 years
}

/**
 * Calculates Return on Investment (ROI) percentage
 * @param initialInvestment - Initial investment amount
 * @param finalValue - Final value of investment
 * @returns ROI as a percentage
 */
export function calculateROI(initialInvestment: number, finalValue: number): number {
  if (initialInvestment === 0) {
    throw new Error('Initial investment cannot be 0');
  }

  const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
  return Math.round(roi * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculates monthly loan payment
 * @param principal - Loan principal amount
 * @param annualRate - Annual interest rate as percentage
 * @param years - Loan term in years
 * @returns Monthly payment amount
 */
export function calculateLoanPayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) {
    return principal / (years * 12);
  }

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                  (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Math.round(payment * 100) / 100;
}

/**
 * Calculates inflation-adjusted value
 * @param currentValue - Current value
 * @param inflationRate - Annual inflation rate as percentage
 * @param years - Number of years
 * @returns Inflation-adjusted value
 */
export function calculateInflationAdjustedValue(
  currentValue: number,
  inflationRate: number,
  years: number
): number {
  if (years === 0) return currentValue;
  
  const adjustedValue = currentValue * Math.pow(1 + inflationRate / 100, years);
  return Math.round(adjustedValue * 100) / 100;
}

/**
 * Calculates compound interest
 * @param principal - Initial principal amount
 * @param annualRate - Annual interest rate as percentage
 * @param years - Number of years
 * @param compoundingFrequency - Number of times interest compounds per year
 * @returns Final amount after compound interest
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number = 1
): number {
  if (annualRate === 0) return principal;
  
  const rate = annualRate / 100;
  const amount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * years);
  
  return Math.round(amount * 100) / 100;
}

/**
 * Calculates 401k balance with employer matching
 * @param currentBalance - Current 401k balance
 * @param annualContribution - Annual contribution amount
 * @param employerMatchRate - Employer match rate (0.5 = 50% match)
 * @param annualReturn - Expected annual return as percentage
 * @param years - Number of years
 * @returns Projected 401k balance
 */
export function calculate401kBalance(
  currentBalance: number,
  annualContribution: number,
  employerMatchRate: number,
  annualReturn: number,
  years: number
): number {
  const rate = annualReturn / 100;
  const totalAnnualContribution = annualContribution * (1 + employerMatchRate);
  
  // Future value of current balance
  const futureCurrentBalance = currentBalance * Math.pow(1 + rate, years);
  
  // Future value of annuity (contributions)
  const futureContributions = totalAnnualContribution * 
    ((Math.pow(1 + rate, years) - 1) / rate);
  
  return Math.round((futureCurrentBalance + futureContributions) * 100) / 100;
}

/**
 * Calculates three-fund portfolio return
 * @param usReturn - US stock return percentage
 * @param intlReturn - International stock return percentage
 * @param bondReturn - Bond return percentage
 * @param years - Number of years
 * @param allocation - Portfolio allocation (default: 60% US, 20% Intl, 20% Bonds)
 * @returns Total portfolio return percentage
 */
export function calculateThreeFundPortfolioReturn(
  usReturn: number,
  intlReturn: number,
  bondReturn: number,
  years: number,
  allocation: ThreeFundAllocation = { us: 0.6, intl: 0.2, bonds: 0.2 }
): number {
  const weightedReturn = (usReturn * allocation.us + 
                         intlReturn * allocation.intl + 
                         bondReturn * allocation.bonds) / 100;
  
  const totalReturn = (Math.pow(1 + weightedReturn, years) - 1) * 100;
  
  return Math.round(totalReturn * 100) / 100;
}

/**
 * Calculates maximum home price based on 28% rule
 * @param annualIncome - Annual gross income
 * @param monthlyDebts - Monthly debt payments
 * @param interestRate - Mortgage interest rate as percentage
 * @param years - Loan term in years
 * @param downPayment - Down payment amount
 * @param propertyTaxRate - Annual property tax rate as percentage (default 1.2%)
 * @returns Maximum affordable home price
 */
export function calculateMaximumHomePrice(
  annualIncome: number,
  monthlyDebts: number,
  interestRate: number,
  years: number,
  downPayment: number,
  propertyTaxRate: number = 1.2
): number {
  const monthlyIncome = annualIncome / 12;
  const maxHousingPayment = monthlyIncome * 0.28; // 28% rule
  const availableForPrincipalAndInterest = maxHousingPayment - monthlyDebts;
  
  // Estimate property taxes and insurance (typically 0.3-0.5% monthly)
  const estimatedTaxesInsurance = 0.004; // 0.4% monthly
  const availableForPI = availableForPrincipalAndInterest * (1 - estimatedTaxesInsurance);
  
  // Calculate maximum loan amount
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = years * 12;
  
  const maxLoanAmount = availableForPI * (Math.pow(1 + monthlyRate, numPayments) - 1) / 
                        (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
  
  return Math.round(maxLoanAmount + downPayment);
}

/**
 * Calculates mortgage payoff savings with extra payments
 * @param principal - Loan principal
 * @param interestRate - Annual interest rate as percentage
 * @param years - Original loan term in years
 * @param extraPayment - Additional monthly payment
 * @returns Mortgage payoff savings details
 */
export function calculateMortgagePayoffSavings(
  principal: number,
  interestRate: number,
  years: number,
  extraPayment: number
): MortgagePayoffResult {
  if (extraPayment === 0) {
    return {
      originalYears: years,
      newYears: years,
      interestSaved: 0
    };
  }

  const monthlyRate = interestRate / 100 / 12;
  const originalPayment = calculateLoanPayment(principal, interestRate, years);
  const newPayment = originalPayment + extraPayment;
  
  // Calculate new payoff time
  const newMonths = -Math.log(1 - (principal * monthlyRate) / newPayment) / Math.log(1 + monthlyRate);
  const newYears = newMonths / 12;
  
  // Calculate interest saved
  const originalTotalInterest = (originalPayment * years * 12) - principal;
  const newTotalInterest = (newPayment * newMonths) - principal;
  const interestSaved = originalTotalInterest - newTotalInterest;
  
  return {
    originalYears: years,
    newYears: Math.round(newYears * 10) / 10,
    interestSaved: Math.round(interestSaved * 100) / 100
  };
}

/**
 * Calculates portfolio backtest with historical returns
 * @param initialValue - Initial portfolio value
 * @param returns - Array of annual return percentages
 * @returns Final portfolio value
 */
export function calculatePortfolioBacktest(initialValue: number, returns: number[]): number {
  if (returns.length === 0) return initialValue;
  
  let value = initialValue;
  for (const returnPct of returns) {
    value = value * (1 + returnPct / 100);
  }
  
  return Math.round(value * 100) / 100;
}

/**
 * Converts currency using exchange rate
 * @param amount - Amount to convert
 * @param exchangeRate - Exchange rate
 * @returns Converted amount
 */
export function convertCurrency(amount: number, exchangeRate: number): number {
  const converted = amount * exchangeRate;
  return Math.round(converted * 100) / 100;
} 