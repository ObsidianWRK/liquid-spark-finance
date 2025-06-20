---
name: '🔢 Agent 2: Data-Integrity'
about: Fix totalWealth calculation and create centralized selector
title: '[Agent 2] Fix totalWealth selector & add unit tests'
labels: agent-2, bug, data
assignees: ''
---

# 🔢 Agent 2: Data-Integrity Task

## Overview

Fix the `totalWealth` calculation to ensure it accurately sums all visible account balances, and create a centralized, tested selector for consistent use across the app.

## Current Issues

- totalWealth calculation is duplicated in multiple components
- No centralized selector exists
- Calculations differ between NetWorthSummary, InsightsPage, and other components
- Credit card debt handling is inconsistent

## Tasks

- [ ] Create `src/selectors/financialSelectors.ts` with:
  ```typescript
  export const selectTotalWealth = (accounts: Account[]) => {
    // Assets: all non-credit accounts
    // Liabilities: credit card balances (as positive values)
    // Net worth = Assets - Liabilities
  };
  ```
- [ ] Create `src/hooks/useFinancialMetrics.ts` with `useTotalWealth()` hook
- [ ] Write comprehensive unit tests in `src/test/selectors.test.ts`:
  - [ ] Test with empty accounts array
  - [ ] Test with only asset accounts
  - [ ] Test with mixed assets and credit cards
  - [ ] Test with negative balances
  - [ ] Test with inactive accounts (should be excluded)
- [ ] Update all components using totalWealth to use the new selector:
  - [ ] NetWorthSummary
  - [ ] InsightsPage variants
  - [ ] FinancialDashboard
  - [ ] CleanDashboard
- [ ] Ensure consistent handling of:
  - [ ] Credit card debt (negative balances)
  - [ ] Inactive accounts
  - [ ] Investment accounts
  - [ ] Loan accounts

## Definition of Done

- [ ] Single source of truth for totalWealth calculation
- [ ] All unit tests passing with 100% coverage
- [ ] All components updated to use new selector
- [ ] No calculation discrepancies between different views
- [ ] TypeScript types properly defined
