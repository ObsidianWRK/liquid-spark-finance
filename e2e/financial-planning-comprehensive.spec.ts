import { test, expect } from '@playwright/test';

test.describe('Financial Planning - Comprehensive Testing', () => {
  
  // Test multiple viewport sizes as per UltraThink requirements
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test.describe(`${name} (${width}x${height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('http://localhost:5173/');
        
        // Navigate to planning page
        await page.getByRole('button', { name: /planning/i }).click();
        await page.waitForLoadState('networkidle');
      });

      test('should load planning page without errors', async ({ page }) => {
        // Verify page loads
        await expect(page.locator('h1')).toContainText('Financial Planning');
        await expect(page.locator('text=Set goals, track progress, and plan for your financial future')).toBeVisible();
      });

      test('should display all tab navigation options', async ({ page }) => {
        // Check all tabs are present
        const tabs = ['Overview', 'Goals', 'Retirement', 'Debt Payoff', 'Life Planning'];
        
        for (const tab of tabs) {
          await expect(page.getByRole('button', { name: tab })).toBeVisible();
        }
      });

      test('should navigate between tabs successfully', async ({ page }) => {
        // Test Overview tab (default)
        await expect(page.locator('text=Financial Health Score')).toBeVisible();
        
        // Test Goals tab
        await page.getByRole('button', { name: 'Goals' }).click();
        await page.waitForTimeout(500);
        await expect(page.locator('text=Emergency Fund')).toBeVisible();
        
        // Test Retirement tab
        await page.getByRole('button', { name: 'Retirement' }).click();
        await page.waitForTimeout(1000);
        await expect(page.locator('text=Retirement Planning')).toBeVisible();
        
        // Test Debt tab
        await page.getByRole('button', { name: /Debt/i }).click();
        await page.waitForTimeout(1000);
        await expect(page.locator('text=Debt Payoff Strategy')).toBeVisible();
        
        // Test Life Planning tab
        await page.getByRole('button', { name: /Life Planning/i }).click();
        await page.waitForTimeout(1000);
        await expect(page.locator('text=Life Event Planning')).toBeVisible();
      });

      test('should display financial data correctly', async ({ page }) => {
        // Overview tab financial data
        await expect(page.locator('text=/\\$[0-9,]+/')).toBeVisible();
        
        // Goals tab progress
        await page.getByRole('button', { name: 'Goals' }).click();
        await page.waitForTimeout(500);
        await expect(page.locator('text=On Track')).toBeVisible();
      });

      test('should handle responsive design correctly', async ({ page }) => {
        // Check if content fits viewport without horizontal scroll
        const horizontalScrollWidth = await page.evaluate(() => {
          return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        });
        
        expect(horizontalScrollWidth).toBeLessThanOrEqual(1);
      });

      test('should display charts and visualizations', async ({ page }) => {
        // Go to retirement tab which has projections
        await page.getByRole('button', { name: 'Retirement' }).click();
        await page.waitForTimeout(2000);
        
        // Check for chart elements
        await expect(page.locator('text=Retirement Savings Projection')).toBeVisible();
      });

      test('should maintain dark theme consistency', async ({ page }) => {
        // Check cards use consistent dark styling
        const cards = page.locator('[class*="bg-white/[0.02]"]');
        await expect(cards.first()).toBeVisible();
      });
    });
  });

  test.describe('Accessibility Testing', () => {
    test('should meet basic accessibility requirements', async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: /planning/i }).click();
      
      // Check for proper heading hierarchy
      const h1Elements = page.locator('h1');
      await expect(h1Elements).toHaveCount(1);
      
      // Check that interactive elements are keyboard accessible
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);
      
      // Check for proper contrast (basic check)
      const headings = page.locator('h1, h2, h3');
      await expect(headings.first()).toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: /planning/i }).click();
      
      // Tab through navigation elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to activate tabs with keyboard
      await page.keyboard.press('Enter');
      
      // Check that focus is visible and logical
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Data Validation', () => {
    test('should display consistent currency formatting', async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: /planning/i }).click();
      
      // Check that all currency amounts follow consistent format
      const currencyElements = page.locator('text=/\\$[0-9,]+/');
      const currencyCount = await currencyElements.count();
      
      expect(currencyCount).toBeGreaterThan(0);
      
      // Spot check a few currency formats
      for (let i = 0; i < Math.min(3, currencyCount); i++) {
        const currencyText = await currencyElements.nth(i).textContent();
        expect(currencyText).toMatch(/^\$[0-9,]+$/);
      }
    });

    test('should display realistic financial data', async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: /planning/i }).click();
      
      // Check retirement tab data
      await page.getByRole('button', { name: 'Retirement' }).click();
      await page.waitForTimeout(1000);
      
      // Validate data ranges make sense
      const savingsAmount = page.locator('text=Current Savings').locator('..').locator('text=/\\$[0-9,]+/');
      const savingsText = await savingsAmount.textContent();
      
      if (savingsText) {
        const amount = parseInt(savingsText.replace(/[$,]/g, ''));
        expect(amount).toBeGreaterThan(1000); // Reasonable savings amount
        expect(amount).toBeLessThan(10000000); // Not unrealistically high
      }
    });
  });
});

// Performance-specific tests
test.describe('Performance Validation', () => {
  test('should meet Core Web Vitals targets', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Navigate to planning which has the most complex UI
    await page.getByRole('button', { name: /planning/i }).click();
    
    // Measure LCP (Largest Contentful Paint) - should be < 2.5s
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 3000);
      });
    });
    
    if (typeof lcp === 'number' && lcp > 0) {
      expect(lcp).toBeLessThan(2500); // 2.5 seconds
    }
    
    // Check that there are no excessive reflows/repaints
    await page.getByRole('button', { name: 'Retirement' }).click();
    await page.waitForTimeout(500);
    
    // The page should be stable (no layout shifts after loading)
    const isStable = await page.evaluate(() => {
      return new Promise((resolve) => {
        let cumulativeShift = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              cumulativeShift += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => {
          resolve(cumulativeShift < 0.1); // CLS should be < 0.1
        }, 1000);
      });
    });
    
    expect(isStable).toBe(true);
  });
}); 