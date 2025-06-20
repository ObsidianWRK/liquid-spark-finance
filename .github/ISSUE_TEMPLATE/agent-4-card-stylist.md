---
name: '🎨 Agent 4: Card-Stylist'
about: Build unified CardShell component and migrate all cards
title: '[Agent 4] Create CardShell component & design tokens'
labels: agent-4, design, ui
assignees: ''
---

# 🎨 Agent 4: Card-Stylist Task

## Overview

Build a unified `<CardShell>` component that matches the Eco Impact & Wellness Score card design, then migrate all existing cards to use it.

## Reference Design (from Eco/Wellness cards)

- Rounded corners with `rounded-xl`
- Dark glass base: `bg-zinc-800/40 backdrop-blur`
- Subtle ring: `ring-1 ring-zinc-700/60`
- Inner shadow: `shadow-[inset_0_0_0_1px_rgba(255,255,255,.05)]`
- Gradient accent overlay

## Tasks

- [ ] Create `src/components/ui/CardShell.tsx`:

  ```typescript
  export interface CardShellProps {
    accent: 'green' | 'yellow' | 'blue' | 'red' | 'purple';
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
  }

  export const CardShell: FC<CardShellProps> = ({
    accent,
    children,
    className,
    onClick,
    hoverable = false,
  }) => {
    // Base classes + gradient overlay
  };
  ```

- [ ] Define gradient classes in Tailwind config:

  ```css
  .gradient-green {
    background: radial-gradient(
      circle at top right,
      rgba(34, 197, 94, 0.1),
      transparent
    );
  }
  .gradient-yellow {
    background: radial-gradient(
      circle at top right,
      rgba(250, 204, 21, 0.1),
      transparent
    );
  }
  .gradient-blue {
    background: radial-gradient(
      circle at top right,
      rgba(59, 130, 246, 0.1),
      transparent
    );
  }
  ```

- [ ] Update design tokens in `src/theme/tokens.ts`:

  - [ ] Card border radius: `radius.lg`
  - [ ] Glass effect opacity values
  - [ ] Shadow definitions
  - [ ] Gradient color mappings

- [ ] Migrate existing cards:

  - [ ] All insight cards (Financial, Wellness, Eco)
  - [ ] Account cards
  - [ ] Transaction list container
  - [ ] Savings goal cards
  - [ ] Budget tracker cards
  - [ ] Investment portfolio cards
  - [ ] Dashboard summary cards

- [ ] Replace inconsistent backgrounds:
  - [ ] Remove flat `bg-black` cards
  - [ ] Replace `bg-white/[0.02]` with CardShell
  - [ ] Fix grey square boxes
  - [ ] Ensure consistent elevation

## Components to Update

- `src/components/insights/components/*.tsx`
- `src/components/financial/*.tsx`
- `src/components/savings/*.tsx`
- `src/components/budget/*.tsx`
- `src/components/AccountCard.tsx`
- `src/components/GlassCard.tsx` (deprecate in favor of CardShell)

## Definition of Done

- [ ] CardShell component supports all accent colors
- [ ] Gradient overlays properly positioned
- [ ] All cards have consistent border-radius
- [ ] Glass morphism effect working
- [ ] Hover states properly implemented
- [ ] No remaining flat/grey cards
- [ ] Responsive on all screen sizes
