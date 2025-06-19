/**
 * Domain Exports - New Domain-Driven Architecture
 * Provides clean import paths for all domain components
 */

// Dashboard Domain
export * from './dashboard/DashboardPage';
export * from './dashboard/FinancialDashboard';

// Accounts Domain  
export * from './accounts/AccountCard';
export * from './accounts/AccountLinking';

// Budgets Domain
export * from './budgets/BudgetPlannerPage';
export * from './budgets/BudgetTracker';
export * from './budgets/SpendingBreakdownChart';

// Transactions Domain
export * from './transactions/OptimizedTransactionList';
export * from './transactions/TransactionManager';

// Investments Domain
export * from './investments/InvestmentTrackerPage';
export * from './investments/InvestmentPortfolio';
export * from './investments/PortfolioAllocationChart';

// Reports Domain
export * from './reports/BudgetReportsPage';
export * from './reports/UnifiedReportsPage'; 