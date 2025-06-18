# 🎨 Unified Card Design & Data Fix Project

## Executive Summary

This project brings coherent design language to every screen of the Vueni web app through a coordinated 8-agent refactor. The initiative addresses critical UI inconsistencies and data integrity issues that impact user experience.

## Project Scope

### Primary Goals
1. **Unified Visual Design**: Implement consistent card styling based on Eco Impact & Wellness Score cards
2. **Data Integrity**: Fix totalWealth calculations to show accurate financial data
3. **Number Formatting**: Standardize all numeric displays with proper formatting
4. **Accessibility**: Achieve Axe score > 90 across all pages

### Known Issues Being Fixed
- ❌ Financial Health score showing excessive decimals (e.g., 85.73829%)
- ❌ Total Wealth miscalculation on Insights page
- ❌ Grey square transaction lists lacking rounded corners
- ❌ Inconsistent card colors (black, grey, flat)
- ❌ Flat progress bars in Savings Goals

## Technical Architecture

### New Components
```typescript
// Core design component
<CardShell accent="green|yellow|blue|red|purple">
  {children}
</CardShell>

// Formatting utilities
formatScore(85.73829) → "85.7"
formatCurrency(12450.50) → "$12,450"
formatPercentage(85.73829) → "85.7%"
```

### Design Tokens
- **Border Radius**: `theme('radius.lg')` (12px)
- **Glass Effect**: `bg-zinc-800/40 backdrop-blur`
- **Ring**: `ring-1 ring-zinc-700/60`
- **Shadow**: `shadow-[inset_0_0_0_1px_rgba(255,255,255,.05)]`

## Agent Responsibilities

| Agent | Focus Area | Key Deliverables |
|-------|------------|------------------|
| 1. PM-Conductor | Orchestration | Epic tracking, PR coordination |
| 2. Data-Integrity | Selectors | `selectTotalWealth()`, unit tests |
| 3. Numeric-Formatter | Utilities | Format functions, `.toFixed()` removal |
| 4. Card-Stylist | Components | CardShell, gradient classes |
| 5. Transactions-Stylist | Lists | Rounded containers, scroll fixes |
| 6. Savings-Goals-Stylist | Progress | Gradient bars, tab styling |
| 7. Visual-QA | Testing | Playwright tests, Axe audit |
| 8. Refactor-Linter | Cleanup | ESLint fixes, dead code removal |

## Implementation Timeline

```
Day 1: Foundation
├─ Morning: Agents 2 & 3 (Data & Formatting)
└─ Afternoon: Agent 4 begins (CardShell)

Day 2: UI Implementation  
├─ Morning: Agent 4 completes
└─ Afternoon: Agents 5 & 6 (parallel)

Day 3: Quality & Cleanup
├─ Morning: Agent 7 (Testing)
├─ Afternoon: Agent 8 (Linting)
└─ Deploy: 2 PM
```

## Quality Gates

### Pre-Merge Checklist
- [ ] Unit tests passing
- [ ] TypeScript no errors
- [ ] ESLint clean
- [ ] Visual review complete
- [ ] Mobile + Desktop tested

### Definition of Done
- ✅ Unified card design across all pages
- ✅ Accurate totalWealth calculations
- ✅ Consistent number formatting
- ✅ Playwright visual tests passing
- ✅ Axe score > 90
- ✅ Bundle size < 1MB

## Risk Management

### Identified Risks
1. **CardShell Delays**: Blocks 2 agents
   - *Mitigation*: Mock component ready
   
2. **Merge Conflicts**: Multiple UI changes
   - *Mitigation*: Frequent rebasing
   
3. **Visual Regressions**: Design changes
   - *Mitigation*: Comprehensive screenshots

## Success Metrics

### User Experience
- 100% consistent card styling
- 0 decimal formatting errors
- < 100ms interaction response

### Code Quality
- 0 ESLint errors
- 100% test coverage on new code
- 0 accessibility violations

### Performance
- No increase in bundle size
- No new render blocking resources
- Lighthouse score maintained

## Communication Plan

- **GitHub**: All work tracked in issues
- **PRs**: 2-hour review SLA
- **Blockers**: Immediate escalation
- **Updates**: Daily progress in epic

## Post-Launch

### Monitoring
- Error tracking for formatting issues
- Performance metrics on card renders
- User feedback on visual changes

### Documentation
- Updated component library
- Design system guidelines
- Developer onboarding guide

---

**Project Status**: 🚀 Ready to Launch
**Epic Issue**: #[TBD]
**Start Date**: [Date]
**Target Completion**: [Date + 3 days] 