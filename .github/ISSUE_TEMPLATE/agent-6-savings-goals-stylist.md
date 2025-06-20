---
name: '💰 Agent 6: Savings-Goals-Stylist'
about: Update savings goals tabs and progress bars with modern styling
title: '[Agent 6] Modernize savings goals UI components'
labels: agent-6, ui, savings
assignees: ''
---

# 💰 Agent 6: Savings-Goals-Stylist Task

## Overview

Update the Savings Goals tabs and progress bars to use modern design tokens, gradient effects, and consistent styling.

## Current Issues

- Tab navigation uses basic flat colors
- Progress bars are flat `bg-green-500` without gradients
- Emergency Fund progress lacks visual appeal
- "Overdue" badges use inconsistent styling

## Tasks

- [ ] Update GoalsTabs in `src/components/savings/SavingsGoals.tsx`:

  ```typescript
  // Current flat style:
  activeTab === tab.id
    ? 'bg-blue-500 text-white'
    : 'text-gray-400 hover:text-white';

  // New gradient style:
  activeTab === tab.id
    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
    : 'text-white/60 hover:text-white hover:bg-white/10';
  ```

- [ ] Replace progress bars with gradient versions:

  - [ ] Create reusable `<GradientProgress>` component
  - [ ] Use dynamic gradient based on progress percentage:
    - 0-25%: Red to orange gradient
    - 26-50%: Orange to yellow gradient
    - 51-75%: Yellow to lime gradient
    - 76-100%: Lime to green gradient
  - [ ] Add subtle animation on value change
  - [ ] Rounded ends with proper overflow handling

- [ ] Style Emergency Fund component:

  - [ ] Use CardShell with red accent
  - [ ] Gradient progress bar
  - [ ] Animated milestone markers
  - [ ] Glass morphism for fund status

- [ ] Update "Overdue" badges:

  - [ ] Define in tokens: `text-warning-fg`, `bg-warning-bg`
  - [ ] Add subtle pulse animation
  - [ ] Consistent border styling

- [ ] Files to update:
  - [ ] `src/components/savings/SavingsGoals.tsx`
  - [ ] `src/components/savings/GoalCard.tsx`
  - [ ] `src/components/savings/SavingsInsights.tsx`
  - [ ] `src/components/budget/BudgetTracker.tsx`

## Design Tokens to Add

```typescript
export const progressColors = {
  low: 'from-red-500 to-orange-500',
  medium: 'from-orange-500 to-yellow-500',
  high: 'from-yellow-500 to-lime-500',
  complete: 'from-lime-500 to-green-500',
};

export const badgeStyles = {
  overdue: {
    text: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
  },
};
```

## Definition of Done

- [ ] All tabs use gradient active states
- [ ] Progress bars show dynamic gradients
- [ ] Emergency Fund has premium feel
- [ ] Overdue badges consistently styled
- [ ] Smooth animations on all transitions
- [ ] Mobile-responsive tab navigation
