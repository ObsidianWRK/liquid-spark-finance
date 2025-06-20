---
name: '💯 Agent 3: Numeric-Formatter'
about: Create centralized number formatting utilities
title: '[Agent 3] Build formatScore & formatCurrency utilities'
labels: agent-3, enhancement, formatting
assignees: ''
---

# 💯 Agent 3: Numeric-Formatter Task

## Overview

Create centralized, i18n-safe number formatting utilities and replace all inline `.toFixed()` calls across the codebase.

## Current Issues

- 50+ instances of `.toFixed()` scattered across components
- Inconsistent decimal places (some use 0, 1, or 2 decimals)
- No thousands separators in large numbers
- Financial Health score shows too many decimals

## Tasks

- [ ] Enhance `src/utils/format.ts` with:

  ```typescript
  export const formatScore = (value: number): string => {
    // Returns score with exactly 1 decimal place
    // e.g., 85.7, 92.0
  };

  export const formatCurrency = (
    value: number,
    options?: { decimals?: number; currency?: string }
  ): string => {
    // Returns formatted currency with thousands separators
    // Default: $12,450 (no decimals for whole dollars)
    // With decimals: $12,450.50
  };

  export const formatPercentage = (value: number): string => {
    // Returns percentage with 1 decimal
    // e.g., 85.7%
  };

  export const formatCompactNumber = (value: number): string => {
    // Returns compact format for large numbers
    // e.g., 1.2K, 3.4M
  };
  ```

- [ ] Replace all `.toFixed()` calls:
  - [ ] Search and replace in services/ directory
  - [ ] Update all components/ files
  - [ ] Fix utils/ calculations
  - [ ] Update test files
- [ ] Specific fixes:
  - [ ] Financial Health score (use formatScore)
  - [ ] All currency displays (use formatCurrency)
  - [ ] All percentage displays (use formatPercentage)
  - [ ] Memory/bundle size displays (use formatCompactNumber)
- [ ] Add unit tests for all formatters:
  - [ ] Test edge cases (0, negative, very large numbers)
  - [ ] Test locale handling
  - [ ] Test custom options

## Files to Update (partial list)

- `src/components/insights/*.tsx` - score displays
- `src/components/dashboard/FinancialDashboard.tsx`
- `src/components/savings/GoalCard.tsx`
- `src/components/investments/InvestmentPortfolio.tsx`
- `src/services/*.ts` - all service files with toFixed

## Definition of Done

- [ ] All formatters properly handle edge cases
- [ ] No remaining `.toFixed()` calls in production code
- [ ] Consistent decimal places across all displays
- [ ] All numbers properly formatted with separators
- [ ] Unit tests with 100% coverage
- [ ] ESLint rule added to prevent future `.toFixed()` usage
