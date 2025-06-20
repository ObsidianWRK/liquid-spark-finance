---
name: '🎨 Unified Card Design & Data Fix Epic'
about: Coordinated 8-agent refactor to unify UI and fix data integrity
title: '[EPIC] Unified Card Design & Data Fix'
labels: epic, design, bug, refactor
assignees: pm-conductor
---

# 🎨 Unified Card Design & Data Fix Epic

## Overview

Bring every screen of the Vueni web app into one coherent design language, remove data-formatting bugs, and tighten the Financial Insights maths — all in one coordinated refactor executed by ≤ 8 background agents.

## Goal UI Reference

The visual style of the **Eco Impact** & **Wellness Score** cards (rounded corners, subtle radial gradient, coloured accent icon, dark "glass" base).

## Known Issues

1. ❌ _Financial Health_ score prints too many decimals.
2. ❌ _Total Wealth_ value on **Insights** pane doesn't equal the sum of connected accounts.
3. ❌ Transactions list wrapper is a grey _square_; should match app-wide rounded card radius.
4. ❌ Card colour & elevation inconsistent (black, grey, flat boxes).
5. ❌ Savings-Goals tabs and "Emergency Fund" progress bar use legacy colours.

## Success Criteria ✅

- [ ] All cards share identical border-radius = `theme('radius.lg')`, gradient overlay, and soft inner shadow
- [ ] Number formatting: all monetary & score values use helpers in `utils/format.ts` (1 decimal for scores, thousands-sep for currency)
- [ ] `selectTotalWealth()` selector returns the exact sum of visible account balances; unit-tested
- [ ] No visual regressions on mobile < 430 px & desktop ≥ 1440 px (Playwright goldens)
- [ ] All lint / type errors resolved

## Agent Task Breakdown

### 🎭 Agent 1: PM-Conductor

- [ ] Create sub-issues for each agent
- [ ] Track progress on project board
- [ ] Coordinate merge order
- [ ] Final QA smoke test

### 🔢 Agent 2: Data-Integrity (#TBD)

- [ ] Fix `selectTotalWealth()` calculation
- [ ] Create unit tests with mock state
- [ ] Implement `useTotalWealth()` hook

### 💯 Agent 3: Numeric-Formatter (#TBD)

- [ ] Create `formatScore()` and `formatCurrency()` utilities
- [ ] Replace all `.toFixed()` calls across codebase
- [ ] Ensure i18n-safe formatting

### 🎨 Agent 4: Card-Stylist (#TBD)

- [ ] Build `<CardShell>` component with gradient variants
- [ ] Define Tailwind gradient-{accent} classes
- [ ] Migrate all cards to use CardShell

### 📋 Agent 5: Transactions-Stylist (#TBD)

- [ ] Wrap transaction list in `<CardShell accent="blue">`
- [ ] Fix overflow scrolling with rounded corners
- [ ] Apply glass morphism effects

### 💰 Agent 6: Savings-Goals-Stylist (#TBD)

- [ ] Update GoalsTabs typography & colors
- [ ] Replace flat progress bars with gradients
- [ ] Style "Overdue" badges with design tokens

### 🧪 Agent 7: Visual-QA (#TBD)

- [ ] Write Playwright visual regression tests
- [ ] Capture baseline screenshots
- [ ] Run Axe accessibility audit

### 🧹 Agent 8: Refactor-Linter (#TBD)

- [ ] Run ESLint auto-fix
- [ ] Remove unused imports/variables
- [ ] Update lint rules to forbid `.toFixed()`

## Timeline

- **Start**: [Date]
- **Target Completion**: [Date + 2 days]
- **Deployment**: [Date + 3 days]

## Dependencies

- Design tokens must be defined before Card-Stylist begins
- Data-Integrity and Numeric-Formatter can work in parallel
- Visual-QA must run after all UI changes complete

## Links

- [Figma Design Reference](#)
- [PR Template](.github/pull_request_template.md)
- [Project Board](#)
