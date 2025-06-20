---
name: '📋 Agent 5: Transactions-Stylist'
about: Style transaction list with rounded corners and glass morphism
title: '[Agent 5] Apply CardShell to transaction list'
labels: agent-5, ui, transactions
assignees: ''
---

# 📋 Agent 5: Transactions-Stylist Task

## Overview

Wrap the transaction list in the new `<CardShell>` component and fix the overflow scrolling to maintain rounded corners.

## Current Issues

- Transaction list uses flat `bg-white/5` background
- Square corners don't match app design
- No gradient overlay or glass effect
- Scroll area breaks corner radius

## Tasks

- [ ] Update `src/components/transactions/OptimizedTransactionList.tsx`:

  - [ ] Replace `UniversalCard` wrapper with `<CardShell accent="blue">`
  - [ ] Apply proper glass morphism effects
  - [ ] Ensure header stays within rounded corners

- [ ] Fix scroll container styling:

  ```css
  /* Maintain rounded corners with scroll */
  .transaction-scroll-container {
    mask-image: radial-gradient(white, white);
    -webkit-mask-image: radial-gradient(white, white);
    border-radius: inherit;
  }
  ```

- [ ] Update transaction item styling:

  - [ ] Use consistent hover states: `hover:bg-white/5`
  - [ ] Proper border colors: `border-white/10`
  - [ ] Ensure last item has no bottom border

- [ ] Add subtle animations:

  - [ ] Fade in on mount
  - [ ] Smooth hover transitions
  - [ ] Category icon subtle glow

- [ ] Update all transaction list variants:
  - [ ] `TransactionList.tsx`
  - [ ] `UnifiedTransactionList.tsx`
  - [ ] `VueniUnifiedTransactionList.tsx`
  - [ ] `MobileTransactionScreen.tsx`

## Design Requirements

- Blue gradient accent (matches financial theme)
- Max height with internal scroll
- Sticky date headers with blur backdrop
- Smooth transitions on all interactions
- Mobile-responsive with proper touch targets

## Definition of Done

- [ ] Transaction list wrapped in CardShell
- [ ] Rounded corners maintained during scroll
- [ ] Glass morphism effects applied
- [ ] All hover/active states working
- [ ] Mobile view properly styled
- [ ] No visual regression in transaction display
