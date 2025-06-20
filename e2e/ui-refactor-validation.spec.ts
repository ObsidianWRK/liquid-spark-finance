import { test, expect } from '@playwright/test';

test.describe('UI Refactor Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Financial Health Score Formatting', () => {
    test('should display Financial Health score with exactly 1 decimal place', async ({
      page,
    }) => {
      // Navigate to dashboard
      await page.waitForSelector(
        '[data-testid="financial-health-score"], .text-4xl.font-bold',
        { timeout: 10000 }
      );

      // Check Financial Health score format
      const scoreElement = await page
        .locator('[data-testid="financial-health-score"], .text-4xl.font-bold')
        .first();
      const scoreText = await scoreElement.textContent();

      // Verify score has correct format (XX.X%)
      expect(scoreText).toMatch(/^\d{1,3}\.\d%$/);

      // Verify no excessive decimals
      expect(scoreText).not.toMatch(/\.\d{2,}%/);
    });

    test('should format all percentage values correctly', async ({ page }) => {
      // Check all percentage values on the page
      const percentageElements = await page.locator('text=/%/').all();

      for (const element of percentageElements) {
        const text = await element.textContent();
        // Should either be X%, XX%, XXX%, X.X%, XX.X%, or XXX.X%
        expect(text).toMatch(/\d{1,3}(\.\d)?%/);
      }
    });
  });

  test.describe('Total Wealth Calculation', () => {
    test('should display accurate Total Wealth on Insights page', async ({
      page,
    }) => {
      // Navigate to Insights page
      await page.click('text=Insights');
      await page.waitForLoadState('networkidle');

      // Check Total Wealth display
      const totalWealthElement = await page
        .locator('text=/Total Wealth.*\\$[\\d,]+/')
        .first();
      const totalWealthText = await totalWealthElement.textContent();

      // Verify currency formatting
      expect(totalWealthText).toMatch(/\$[\d,]+(\.\d{0,2})?/);

      // Verify no calculation errors or NaN
      expect(totalWealthText).not.toContain('NaN');
      expect(totalWealthText).not.toContain('undefined');
      expect(totalWealthText).not.toContain('null');
    });

    test('should calculate Total Wealth from all account types', async ({
      page,
    }) => {
      // Navigate to dashboard to see account totals
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get individual account values
      const accountCards = await page
        .locator('[data-testid="account-card"], .bg-white\\/\\[0\\.03\\]')
        .all();
      let calculatedTotal = 0;

      for (const card of accountCards) {
        const valueText = await card
          .locator('text=/\\$[\\d,]+/')
          .first()
          .textContent();
        if (valueText) {
          const value = parseFloat(valueText.replace(/[$,]/g, ''));
          if (!isNaN(value)) {
            calculatedTotal += value;
          }
        }
      }

      // Navigate to Insights and verify total
      await page.click('text=Insights');
      await page.waitForLoadState('networkidle');

      const displayedTotal = await page
        .locator('text=/Total Wealth.*\\$[\\d,]+/')
        .first()
        .textContent();
      const displayedValue = parseFloat(
        displayedTotal?.replace(/[^0-9.-]+/g, '') || '0'
      );

      // Allow for small rounding differences
      expect(Math.abs(displayedValue - calculatedTotal)).toBeLessThan(1);
    });
  });

  test.describe('Transaction List Styling', () => {
    test('should display transactions with proper CardShell styling', async ({
      page,
    }) => {
      // Navigate to transactions view
      await page.click('text=Transactions');
      await page.waitForLoadState('networkidle');

      // Check transaction list container
      const transactionList = await page
        .locator('[data-testid="transaction-list"], .max-h-\\[600px\\]')
        .first();

      // Verify CardShell application
      const cardShellClasses = await transactionList.getAttribute('class');
      expect(cardShellClasses).toContain('rounded-xl');
      expect(cardShellClasses).toContain('backdrop-blur');

      // Verify no grey square background
      expect(cardShellClasses).not.toContain('bg-gray');
      expect(cardShellClasses).not.toContain('bg-grey');

      // Check for gradient accent
      const hasGradient =
        cardShellClasses?.includes('gradient-accent-blue') ||
        cardShellClasses?.includes('from-blue') ||
        cardShellClasses?.includes('bg-gradient');
      expect(hasGradient).toBe(true);
    });

    test('should maintain rounded corners with scroll', async ({ page }) => {
      await page.click('text=Transactions');
      await page.waitForLoadState('networkidle');

      // Check for mask-image CSS property
      const scrollContainer = await page
        .locator('.overflow-y-auto.scrollbar-thin')
        .first();
      const styles = await scrollContainer.evaluate((el) =>
        window.getComputedStyle(el)
      );

      // Verify rounded corners preservation
      expect(styles.borderRadius).not.toBe('0px');
    });
  });

  test.describe('Card Design Consistency', () => {
    test('should apply consistent glass morphism to all cards', async ({
      page,
    }) => {
      const cardSelectors = [
        '[data-testid="balance-card"]',
        '[data-testid="account-card"]',
        '[data-testid="credit-score-card"]',
        '.bg-white\\/\\[0\\.03\\]',
        '.backdrop-blur',
      ];

      for (const selector of cardSelectors) {
        const cards = await page.locator(selector).all();

        for (const card of cards) {
          const classes = await card.getAttribute('class');

          // Should have glass morphism properties
          expect(classes).toMatch(
            /(backdrop-blur|bg-white\/\[0\.03\]|bg-opacity-)/
          );

          // Should have proper border
          expect(classes).toMatch(/border/);

          // Should have rounded corners
          expect(classes).toMatch(/rounded/);

          // Should not be flat black or grey
          expect(classes).not.toMatch(/bg-(black|gray-\d{3}|grey)/);
        }
      }
    });

    test('should have proper hover states on interactive cards', async ({
      page,
    }) => {
      const interactiveCard = await page.locator('.cursor-pointer').first();

      // Get initial styles
      const initialStyles = await interactiveCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          transform: styles.transform,
          boxShadow: styles.boxShadow,
        };
      });

      // Hover over card
      await interactiveCard.hover();

      // Get hover styles
      const hoverStyles = await interactiveCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          transform: styles.transform,
          boxShadow: styles.boxShadow,
        };
      });

      // Verify hover effect is applied
      expect(hoverStyles).not.toEqual(initialStyles);
    });
  });

  test.describe('Savings Goals Progress Bars', () => {
    test('should display gradient progress bars', async ({ page }) => {
      // Navigate to Savings Goals
      await page.click('text=Savings');
      await page.waitForLoadState('networkidle');

      // Check progress bars
      const progressBars = await page
        .locator('[role="progressbar"], .h-2.bg-gradient-to-r')
        .all();

      expect(progressBars.length).toBeGreaterThan(0);

      for (const bar of progressBars) {
        const classes = await bar.getAttribute('class');

        // Should have gradient
        expect(classes).toMatch(/bg-gradient-to-r|from-|to-/);

        // Should not be flat color
        expect(classes).not.toMatch(/bg-(gray|grey)-\d{3}$/);
      }
    });

    test('should show dynamic gradient based on progress', async ({ page }) => {
      await page.click('text=Savings');
      await page.waitForLoadState('networkidle');

      // Find goals with different progress levels
      const goalCards = await page
        .locator('[data-testid="goal-card"], .border.border-white\\/10')
        .all();

      for (const card of goalCards) {
        const progressBar = await card.locator('.h-2.bg-gradient-to-r').first();
        const classes = await progressBar.getAttribute('class');

        // Check for progress-based gradient colors
        expect(classes).toMatch(/from-(red|orange|yellow|lime|green)/);
      }
    });

    test('should display "Overdue" badge for overdue goals', async ({
      page,
    }) => {
      await page.click('text=Savings');
      await page.waitForLoadState('networkidle');

      // Check for overdue badges
      const overdueBadges = await page.locator('text=Overdue').all();

      for (const badge of overdueBadges) {
        const classes = await badge.getAttribute('class');

        // Should have animated pulse effect
        expect(classes).toContain('animate-pulse');

        // Should have red styling
        expect(classes).toMatch(/bg-red|text-red/);
      }
    });
  });

  test.describe('Accessibility Audit', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Check main navigation
      const nav = await page.locator('nav, [role="navigation"]').first();
      expect(nav).toBeTruthy();

      // Check buttons have accessible text
      const buttons = await page.locator('button').all();
      for (const button of buttons.slice(0, 5)) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');

        // Button should have some form of accessible text
        expect(text || ariaLabel || title).toBeTruthy();
      }
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // Check text contrast on glass morphism backgrounds
      const textElements = await page
        .locator('.backdrop-blur p, .backdrop-blur span')
        .all();

      for (const element of textElements.slice(0, 5)) {
        // Check first 5 elements
        const color = await element.evaluate(
          (el) => window.getComputedStyle(el).color
        );
        const bgColor = await element.evaluate((el) => {
          let parent = el.parentElement;
          while (parent) {
            const bg = window.getComputedStyle(parent).backgroundColor;
            if (bg !== 'rgba(0, 0, 0, 0)') return bg;
            parent = parent.parentElement;
          }
          return 'rgb(0, 0, 0)';
        });

        // Text should not be too transparent
        expect(color).not.toMatch(/rgba\(.*,.*,.*,\s*0\.[0-4]/);
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Test tab navigation
      await page.keyboard.press('Tab');
      let focusedElement = await page.evaluate(
        () => document.activeElement?.tagName
      );
      expect(focusedElement).toBeTruthy();

      // Tab through first 5 interactive elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        focusedElement = await page.evaluate(() => ({
          tag: document.activeElement?.tagName,
          visible: document.activeElement?.offsetParent !== null,
        }));

        // Focused element should be visible
        expect(focusedElement.visible).toBe(true);
      }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      let lastLevel = 0;

      for (const heading of headings) {
        const tagName = await heading.evaluate((el) => el.tagName);
        const level = parseInt(tagName.substring(1));

        // Heading levels should not skip (e.g., h1 -> h3)
        if (lastLevel > 0) {
          expect(level - lastLevel).toBeLessThanOrEqual(1);
        }
        lastLevel = level;
      }
    });
  });

  test.describe('Component Integration', () => {
    test('should use centralized data selectors', async ({ page }) => {
      // Check that financial metrics are consistent across pages
      const dashboard = await page
        .locator('text=/Total Wealth.*\\$[\\d,]+/')
        .first()
        .textContent();

      await page.click('text=Insights');
      await page.waitForLoadState('networkidle');

      const insights = await page
        .locator('text=/Total Wealth.*\\$[\\d,]+/')
        .first()
        .textContent();

      // Values should match between pages
      expect(dashboard).toBe(insights);
    });

    test('should apply consistent number formatting', async ({ page }) => {
      // Check currency values
      const currencyValues = await page.locator('text=/\\$[\\d,]+/').all();

      for (const element of currencyValues.slice(0, 5)) {
        const text = await element.textContent();

        // Should use thousand separators
        if (
          text &&
          text.includes('$') &&
          parseFloat(text.replace(/[$,]/g, '')) >= 1000
        ) {
          expect(text).toMatch(/\$\d{1,3}(,\d{3})*/);
        }
      }
    });
  });
});
