---
name: "🧪 Agent 7: Visual-QA"
about: Write visual regression tests and accessibility audits
title: "[Agent 7] Create Playwright tests & run Axe audit"
labels: agent-7, testing, accessibility
assignees: ''
---

# 🧪 Agent 7: Visual-QA Task

## Overview
Create comprehensive Playwright visual regression tests and run accessibility audits to ensure UI consistency and compliance.

## Tasks
- [ ] Create `e2e/visual-regression.spec.ts`:
  ```typescript
  import { test, expect } from '@playwright/test';
  import AxeBuilder from '@axe-core/playwright';
  
  const viewports = {
    mobile: { width: 390, height: 844 },
    desktop: { width: 1440, height: 900 }
  };
  
  const pages = [
    '/dashboard',
    '/accounts', 
    '/transactions',
    '/insights',
    '/savings',
    '/budget',
    '/investments'
  ];
  ```

- [ ] Visual regression tests:
  - [ ] Capture baseline screenshots for all pages
  - [ ] Test both mobile (390×844) and desktop (1440×900)
  - [ ] Verify card styling consistency
  - [ ] Check hover states
  - [ ] Validate gradient overlays
  - [ ] Ensure no layout shifts

- [ ] Accessibility tests:
  ```typescript
  test('should pass accessibility audit', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
      
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  ```

- [ ] Specific visual checks:
  - [ ] All cards have rounded corners
  - [ ] Consistent glass morphism effects
  - [ ] Progress bars show gradients
  - [ ] Tab active states
  - [ ] Transaction list scrolling
  - [ ] Number formatting (no excessive decimals)

- [ ] Create golden screenshots:
  ```bash
  # Generate baseline images
  npm run test:e2e -- --update-snapshots
  ```

- [ ] Configure test thresholds:
  ```typescript
  expect(await page.screenshot()).toMatchSnapshot('dashboard.png', {
    maxDiffPixels: 100,
    threshold: 0.1 // 0.1% difference allowed
  });
  ```

- [ ] Performance checks:
  - [ ] No layout shifts (CLS < 0.1)
  - [ ] Fast interaction readiness (FID < 100ms)
  - [ ] Good visual stability

## Test Matrix
| Page | Mobile | Desktop | Axe Score |
|------|--------|---------|-----------|
| Dashboard | ✓ | ✓ | > 90 |
| Insights | ✓ | ✓ | > 90 |
| Transactions | ✓ | ✓ | > 90 |
| Savings | ✓ | ✓ | > 90 |

## Definition of Done
- [ ] All pages have visual regression coverage
- [ ] Baseline screenshots committed
- [ ] Axe score > 90 on all pages
- [ ] CI pipeline configured
- [ ] Documentation for running tests
- [ ] No false positives in diff detection 