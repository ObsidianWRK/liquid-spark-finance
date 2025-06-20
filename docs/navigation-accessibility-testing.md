# Navigation Accessibility Testing Guidelines

## Overview

This document provides comprehensive testing guidelines for the accessibility features implemented in the Liquid Spark Finance navigation system. The implementation follows WCAG 2.1 AA standards and supports all major assistive technologies.

## Automated Testing

### 1. Accessibility Auditing Tools

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/playwright @testing-library/jest-dom

# Run accessibility audit
npm run test:a11y
```

### 2. Lighthouse Accessibility Scores

- **Target Score**: 100/100
- **Critical Issues**: 0
- **Minimum Contrast Ratio**: 4.5:1 (AA standard)
- **Touch Target Size**: Minimum 44x44px

### 3. ESLint Accessibility Rules

```javascript
// .eslintrc.js accessibility rules
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "rules": {
    "jsx-a11y/no-noninteractive-element-interactions": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-static-element-interactions": "error",
    "jsx-a11y/anchor-is-valid": "error"
  }
}
```

## Manual Testing Procedures

### 1. Screen Reader Testing

#### VoiceOver (macOS)

```bash
# Enable VoiceOver
System Preferences → Accessibility → VoiceOver → Enable

# Key Commands:
# VO + Right Arrow: Next item
# VO + Left Arrow: Previous item
# VO + Space: Activate item
# VO + U: Rotor menu
```

**Test Checklist:**

- [ ] Navigation is announced as "Main navigation"
- [ ] Each tab is announced with role and state
- [ ] Active tab is announced as "selected"
- [ ] Badge notifications are properly announced
- [ ] Skip link is discoverable and functional
- [ ] Live region announcements work correctly

#### NVDA (Windows)

```bash
# Key Commands:
# Arrow Keys: Navigate items
# Tab: Move to next focusable element
# Space/Enter: Activate item
# Insert + F7: Elements list
```

**Test Checklist:**

- [ ] Navigation landmarks are identified
- [ ] Tab role and selected state are announced
- [ ] Keyboard shortcuts are properly announced
- [ ] All interactive elements are accessible

#### JAWS (Windows)

```bash
# Key Commands:
# Virtual cursor mode for navigation
# Tab for form elements
# Space/Enter for activation
# Insert + F3: Elements list
```

### 2. Keyboard Navigation Testing

#### Tab Order Test

```javascript
// Test tab order programmatically
const getFocusableElements = () => {
  return Array.from(
    document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  );
};

// Expected tab order:
// 1. Skip link (when focused)
// 2. Main content area
// 3. Bottom navigation (roving tabindex)
```

**Test Checklist:**

- [ ] Tab order is logical and predictable
- [ ] Skip link appears on focus
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are clearly visible
- [ ] Roving tabindex works correctly in navigation

#### Arrow Key Navigation Test

```javascript
// Test arrow key navigation
const testArrowNavigation = () => {
  // Focus first nav item
  const firstNavItem = document.querySelector('[role="tab"]');
  firstNavItem.focus();

  // Simulate arrow key presses
  const rightArrow = new KeyboardEvent('keydown', { key: 'ArrowRight' });
  firstNavItem.dispatchEvent(rightArrow);

  // Verify focus moved to next item
  expect(document.activeElement).toBe(secondNavItem);
};
```

**Test Checklist:**

- [ ] Arrow keys navigate between tabs
- [ ] Home/End keys work correctly
- [ ] Enter/Space activate selected tab
- [ ] Disabled items are skipped
- [ ] Focus wraps around at boundaries

### 3. Assistive Technology Testing

#### Voice Control (macOS)

```bash
# Enable Voice Control
System Preferences → Accessibility → Voice Control → Enable

# Test Commands:
# "Show numbers" - Display clickable numbers
# "Click [number]" - Click numbered element
# "Show grid" - Display grid overlay
```

**Test Checklist:**

- [ ] All navigation items have voice control numbers
- [ ] Voice commands successfully activate navigation
- [ ] Labels are clearly spoken
- [ ] Interactive elements are properly identified

#### Switch Control (iOS/macOS)

```bash
# Enable Switch Control
Settings → Accessibility → Switch Control → Enable

# Test with external switch or space bar
```

**Test Checklist:**

- [ ] Switch navigation works with all nav items
- [ ] Proper highlighting of focusable elements
- [ ] Activation works correctly
- [ ] Timing is appropriate for all users

### 4. Visual Accessibility Testing

#### High Contrast Mode

```css
/* Test high contrast mode */
@media (prefers-contrast: high) {
  /* Verify enhanced contrast styles are applied */
}
```

**Test Checklist:**

- [ ] Text contrast ratio ≥ 4.5:1 (AA) or ≥ 7:1 (AAA)
- [ ] Focus indicators are clearly visible
- [ ] Interactive elements have enhanced borders
- [ ] Icons have adequate contrast
- [ ] Background/foreground separation is clear

#### Reduced Motion

```css
/* Test reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  /* Verify animations are disabled */
}
```

**Test Checklist:**

- [ ] All transitions are disabled or minimal
- [ ] Animations respect user preferences
- [ ] Essential motion (focus indicators) still works
- [ ] Loading states are accessible without animation

#### Reduced Transparency

```css
/* Test reduced transparency preferences */
@media (prefers-reduced-transparency: reduce) {
  /* Verify solid backgrounds are used */
}
```

**Test Checklist:**

- [ ] Glass/blur effects are replaced with solid backgrounds
- [ ] Transparency is reduced to minimum
- [ ] Readability is maintained
- [ ] Visual hierarchy remains clear

### 5. Mobile Accessibility Testing

#### Touch Target Testing

```javascript
// Verify minimum touch target sizes
const testTouchTargets = () => {
  const navButtons = document.querySelectorAll('.bottom-nav button');
  navButtons.forEach((button) => {
    const rect = button.getBoundingClientRect();
    expect(rect.width).toBeGreaterThanOrEqual(44);
    expect(rect.height).toBeGreaterThanOrEqual(44);
  });
};
```

**Test Checklist:**

- [ ] All touch targets are ≥ 44x44px
- [ ] Adequate spacing between touch targets
- [ ] Touch feedback is provided
- [ ] Gestures work with assistive touch

#### Screen Reader Testing (Mobile)

- **iOS VoiceOver**: Test with iPhone/iPad
- **Android TalkBack**: Test with Android device

**Test Checklist:**

- [ ] Swipe navigation works correctly
- [ ] Tap to activate functions properly
- [ ] Rotor navigation includes all elements
- [ ] Custom actions are available when needed

## Automated Test Suite

### Playwright Accessibility Tests

```javascript
// tests/accessibility/navigation.spec.ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Navigation Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('should not have any accessibility violations', async ({ page }) => {
    await checkA11y(page, '.bottom-nav', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav item

    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('role', 'tab');

    // Test arrow key navigation
    await page.keyboard.press('ArrowRight');
    const nextFocused = await page.locator(':focus');
    await expect(nextFocused).not.toBe(focusedElement);
  });

  test('should announce navigation changes', async ({ page }) => {
    // Simulate screen reader interaction
    await page.click('[role="tab"][aria-selected="false"]');

    const liveRegion = await page.locator('[aria-live="polite"]');
    await expect(liveRegion).toHaveText(/Navigated to/);
  });
});
```

### Jest Accessibility Tests

```javascript
// tests/unit/navigation-accessibility.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import BottomNav from '../components/BottomNav';

expect.extend(toHaveNoViolations);

describe('BottomNav Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(<BottomNav />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<BottomNav />);

    const firstTab = screen.getByRole('tab', { name: /dashboard/i });
    await user.tab();

    expect(firstTab).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    const secondTab = screen.getByRole('tab', { name: /accounts/i });
    expect(secondTab).toHaveFocus();
  });
});
```

## Performance Impact Testing

### 1. Bundle Size Analysis

```bash
# Analyze bundle size impact of accessibility features
npm run build:analyze

# Expected impact: < 5KB additional bundle size
```

### 2. Runtime Performance

```javascript
// Measure performance impact
const measureA11yPerformance = () => {
  performance.mark('a11y-start');

  // Render navigation with accessibility features

  performance.mark('a11y-end');
  performance.measure('a11y-duration', 'a11y-start', 'a11y-end');

  const measure = performance.getEntriesByName('a11y-duration')[0];
  console.log('A11y overhead:', measure.duration, 'ms');
};
```

## Regression Testing

### Continuous Integration

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests
on: [push, pull_request]

jobs:
  a11y-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run accessibility tests
        run: |
          npm run test:a11y
          npm run test:lighthouse
```

### Pre-commit Hooks

```bash
# Install pre-commit accessibility checks
npx husky add .husky/pre-commit "npm run test:a11y"
```

## Documentation and Training

### Developer Guidelines

1. **Always test with screen readers** during development
2. **Use semantic HTML** and ARIA attributes correctly
3. **Test keyboard navigation** before code review
4. **Verify color contrast** meets WCAG standards
5. **Consider reduced motion** preferences

### User Testing

1. **Recruit users with disabilities** for testing
2. **Test with actual assistive technologies** in use
3. **Gather feedback** on usability and accessibility
4. **Iterate based on real-world usage** patterns

## Compliance Checklist

### WCAG 2.1 AA Requirements

- [ ] **1.1.1** Non-text Content: Alt text for images
- [ ] **1.3.1** Info and Relationships: Proper markup
- [ ] **1.4.3** Contrast: 4.5:1 minimum ratio
- [ ] **1.4.11** Non-text Contrast: 3:1 for UI components
- [ ] **2.1.1** Keyboard: All functionality via keyboard
- [ ] **2.1.2** No Keyboard Trap: Focus can be moved away
- [ ] **2.4.3** Focus Order: Logical tab sequence
- [ ] **2.4.7** Focus Visible: Clear focus indicators
- [ ] **3.2.1** On Focus: No unexpected context changes
- [ ] **4.1.2** Name, Role, Value: Proper ARIA implementation

### Apple Accessibility Guidelines

- [ ] **VoiceOver** support with proper announcements
- [ ] **Voice Control** compatibility
- [ ] **Switch Control** support
- [ ] **Reduced Motion** preference respected
- [ ] **High Contrast** mode support
- [ ] **44pt minimum** touch targets

### Platform-Specific Testing

- [ ] **iOS**: VoiceOver, Voice Control, Switch Control
- [ ] **Android**: TalkBack, Select to Speak, Switch Access
- [ ] **Windows**: NVDA, JAWS, Narrator
- [ ] **macOS**: VoiceOver, Voice Control
- [ ] **Linux**: Orca screen reader

## Reporting and Monitoring

### Accessibility Metrics

1. **Lighthouse Accessibility Score**: Target 100/100
2. **axe-core Violations**: Target 0 violations
3. **Manual Test Pass Rate**: Target 100%
4. **User Feedback**: Collect and address issues

### Issue Tracking

1. **Label accessibility issues** appropriately
2. **Prioritize based on severity** and user impact
3. **Track remediation efforts** and timeline
4. **Verify fixes** with affected users

This comprehensive testing approach ensures that the navigation system meets the highest accessibility standards and provides an excellent experience for all users, regardless of their abilities or assistive technologies used.
