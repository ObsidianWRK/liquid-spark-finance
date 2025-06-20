# 🎭 Vueni UI Refactor - Agent Coordination

## Overview

This document coordinates the work of 8 specialized agents to unify Vueni's UI design language and fix data integrity issues.

## Agent Workflow

### Phase 1: Foundation (Parallel)

**Agents 2 & 3 can work simultaneously**

#### 🔢 Agent 2: Data-Integrity

- **Branch**: `feat/agent-2/totalwealth-selector`
- **Priority**: HIGH
- **Duration**: 4 hours
- **Deliverables**:
  - `src/selectors/financialSelectors.ts`
  - `src/hooks/useFinancialMetrics.ts`
  - Unit tests with 100% coverage

#### 💯 Agent 3: Numeric-Formatter

- **Branch**: `feat/agent-3/format-utilities`
- **Priority**: HIGH
- **Duration**: 3 hours
- **Deliverables**:
  - Enhanced `src/utils/format.ts`
  - All `.toFixed()` replaced
  - ESLint rule configured

### Phase 2: Design System

**Agent 4 must complete before Agents 5 & 6**

#### 🎨 Agent 4: Card-Stylist

- **Branch**: `feat/agent-4/cardshell-component`
- **Priority**: CRITICAL
- **Duration**: 5 hours
- **Dependencies**: None
- **Deliverables**:
  - `src/components/ui/CardShell.tsx`
  - Tailwind gradient classes
  - Design tokens updated

### Phase 3: UI Implementation (Parallel)

**Agents 5 & 6 can work simultaneously after Agent 4**

#### 📋 Agent 5: Transactions-Stylist

- **Branch**: `feat/agent-5/transaction-list-styling`
- **Priority**: MEDIUM
- **Duration**: 3 hours
- **Dependencies**: Agent 4 (CardShell)
- **Deliverables**:
  - Styled transaction lists
  - Scroll container fixes

#### 💰 Agent 6: Savings-Goals-Stylist

- **Branch**: `feat/agent-6/savings-ui-update`
- **Priority**: MEDIUM
- **Duration**: 3 hours
- **Dependencies**: Agent 4 (CardShell)
- **Deliverables**:
  - Gradient progress bars
  - Modern tab styling

### Phase 4: Quality Assurance

#### 🧪 Agent 7: Visual-QA

- **Branch**: `feat/agent-7/visual-tests`
- **Priority**: HIGH
- **Duration**: 4 hours
- **Dependencies**: Agents 4, 5, 6 complete
- **Deliverables**:
  - Playwright visual tests
  - Accessibility audit
  - Golden screenshots

### Phase 5: Cleanup

#### 🧹 Agent 8: Refactor-Linter

- **Branch**: `feat/agent-8/cleanup`
- **Priority**: LOW
- **Duration**: 2 hours
- **Dependencies**: All UI work complete
- **Deliverables**:
  - Zero lint errors
  - Dead code removed
  - Bundle optimized

## Merge Order

1. **Phase 1 Merges** (can be any order):

   - PR #1: `feat/agent-2/totalwealth-selector`
   - PR #2: `feat/agent-3/format-utilities`

2. **Phase 2 Merge**:

   - PR #3: `feat/agent-4/cardshell-component` ⚠️ BLOCKING

3. **Phase 3 Merges** (can be any order):

   - PR #4: `feat/agent-5/transaction-list-styling`
   - PR #5: `feat/agent-6/savings-ui-update`

4. **Phase 4 Merge**:

   - PR #6: `feat/agent-7/visual-tests`

5. **Phase 5 Merge**:
   - PR #7: `feat/agent-8/cleanup`

## Critical Path

```
Agent 2 ──┐
          ├─→ Agent 4 ─→ Agent 5 ──┐
Agent 3 ──┘               Agent 6 ──┼─→ Agent 7 ─→ Agent 8
                                   ┘
```

## Success Metrics

- ✅ All cards use unified CardShell component
- ✅ totalWealth shows accurate sum across all views
- ✅ No numbers with excessive decimal places
- ✅ Visual regression tests passing
- ✅ Axe accessibility score > 90
- ✅ Zero ESLint errors
- ✅ Bundle size < 1MB

## Communication

- **Slack Channel**: #vueni-ui-refactor
- **Daily Standup**: 10 AM
- **PR Reviews**: Within 2 hours
- **Blockers**: Tag @pm-conductor immediately

## Risk Mitigation

1. **CardShell delays**: If Agent 4 is delayed, Agents 5 & 6 can start with mock component
2. **Test failures**: Agent 7 should create issues for any regressions, not fix them
3. **Merge conflicts**: Rebase frequently, especially after Phase 2

## Timeline

- **Start**: Monday 9 AM
- **Phase 1 Complete**: Monday 5 PM
- **Phase 2 Complete**: Tuesday 2 PM
- **Phase 3 Complete**: Wednesday 12 PM
- **Phase 4 Complete**: Wednesday 5 PM
- **Phase 5 Complete**: Thursday 12 PM
- **Deploy**: Thursday 2 PM
