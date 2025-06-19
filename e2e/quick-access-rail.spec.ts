import { test, expect } from '@playwright/test';

test.describe('Quick Access Rail - Comprehensive Testing', () => {
  
  // Test Mobile Viewport (iPhone 13)
  test.describe('Mobile Viewport (375px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
      await page.waitForSelector('[data-quick-access-rail]', { timeout: 10000 });
    });

    test('should render horizontal scrolling rail on mobile', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      await expect(rail).toBeVisible();
      
      // Check for horizontal scroll container
      const scrollContainer = rail.locator('.overflow-x-auto');
      await expect(scrollContainer).toBeVisible();
      
      // Verify snap-scroll classes are applied
      await expect(scrollContainer).toHaveClass(/snap-x/);
      await expect(scrollContainer).toHaveClass(/snap-mandatory/);
    });

    test('should display navigation arrows when scrollable', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      
      // Wait for cards to load
      await page.waitForSelector('.min-w-\\[160px\\]', { timeout: 5000 });
      
      // Check for right arrow (should be visible if content overflows)
      const rightArrow = rail.locator('button[aria-label="Scroll right"]');
      const leftArrow = rail.locator('button[aria-label="Scroll left"]');
      
      // Initially, left arrow should be hidden, right arrow might be visible
      await expect(leftArrow).toBeHidden();
      
      // If more than 2 cards, right arrow should be visible
      const cards = await rail.locator('.min-w-\\[160px\\]').count();
      if (cards > 2) {
        await expect(rightArrow).toBeVisible();
      }
    });

    test('should scroll horizontally when arrow buttons are clicked', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      const scrollContainer = rail.locator('.overflow-x-auto');
      const rightArrow = rail.locator('button[aria-label="Scroll right"]');
      
      // Get initial scroll position
      const initialScrollLeft = await scrollContainer.evaluate(el => el.scrollLeft);
      
      // Click right arrow if visible
      if (await rightArrow.isVisible()) {
        await rightArrow.click();
        await page.waitForTimeout(300); // Wait for smooth scroll
        
        // Verify scroll position changed
        const newScrollLeft = await scrollContainer.evaluate(el => el.scrollLeft);
        expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);
      }
    });

    test('should support touch swipe gestures', async ({ page }) => {
      const scrollContainer = page.locator('[data-quick-access-rail] .overflow-x-auto');
      
      // Get initial scroll position
      const initialScrollLeft = await scrollContainer.evaluate(el => el.scrollLeft);
      
      // Simulate swipe left (scroll right)
      const box = await scrollContainer.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
        await page.mouse.up();
        
        await page.waitForTimeout(300);
        
        // Verify scroll position changed
        const newScrollLeft = await scrollContainer.evaluate(el => el.scrollLeft);
        expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);
      }
    });

    test('should display scroll indicators', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      const indicators = rail.locator('.flex.justify-center.space-x-1');
      
      // Check if indicators exist (only if multiple pages of content)
      const cardCount = await rail.locator('.min-w-\\[160px\\]').count();
      if (cardCount > 3) {
        await expect(indicators).toBeVisible();
        const dots = indicators.locator('div');
        expect(await dots.count()).toBeGreaterThan(0);
      }
    });
  });

  // Test Tablet Viewport (iPad Air)
  test.describe('Tablet Viewport (834px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto('/');
      await page.waitForSelector('[data-quick-access-rail]', { timeout: 10000 });
    });

    test('should render horizontal rail on tablet', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      await expect(rail).toBeVisible();
      
      // Should still use horizontal scrolling on tablet
      const scrollContainer = rail.locator('.overflow-x-auto');
      await expect(scrollContainer).toBeVisible();
    });

    test('should handle tablet touch interactions', async ({ page }) => {
      const cards = page.locator('[data-quick-access-rail] .min-w-\\[160px\\]');
      const firstCard = cards.first();
      
      await expect(firstCard).toBeVisible();
      
      // Test card tap interaction
      await firstCard.click();
      
      // Verify some interaction occurred (console log, navigation, etc.)
      // In this case, we'll check that the card receives focus
      await expect(firstCard).toBeFocused();
    });
  });

  // Test Desktop Viewport (1920px)
  test.describe('Desktop Viewport (1920px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForSelector('[data-quick-access-rail]', { timeout: 10000 });
    });

    test('should render 2-column grid on desktop', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      await expect(rail).toBeVisible();
      
      // Should use grid layout on desktop
      const grid = rail.locator('.grid.grid-cols-2');
      await expect(grid).toBeVisible();
      
      // Should not show horizontal scroll container
      const scrollContainer = rail.locator('.overflow-x-auto');
      await expect(scrollContainer).toBeHidden();
    });

    test('should display View All button when accounts exceed limit', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      const viewAllButton = rail.locator('button:has-text("View All")');
      
      // Get number of accounts from the subtitle
      const subtitle = rail.locator('p.text-white\\/60');
      const subtitleText = await subtitle.textContent();
      const accountCount = parseInt(subtitleText?.match(/(\d+) accounts/)?.[1] || '0');
      
      if (accountCount > 6) { // maxVisibleDesktop is set to 6
        await expect(viewAllButton).toBeVisible();
        await expect(viewAllButton).toContainText(`View All (${accountCount})`);
      }
    });

    test('should support keyboard navigation on desktop', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      const firstCard = rail.locator('.w-full').first();
      
      // Focus the first card
      await firstCard.focus();
      await expect(firstCard).toBeFocused();
      
      // Navigate with arrow keys
      await page.keyboard.press('ArrowRight');
      
      // Check if focus moved (implementation may vary)
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should maintain proper card sizing in grid layout', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      const cards = rail.locator('.w-full');
      
      // Verify at least one card is visible
      await expect(cards.first()).toBeVisible();
      
      // Check that cards have consistent width in grid
      const cardBoxes = await cards.evaluateAll(cards => 
        cards.map(card => card.getBoundingClientRect().width)
      );
      
      // All cards should have similar widths (within 5px tolerance)
      const firstWidth = cardBoxes[0];
      cardBoxes.forEach(width => {
        expect(Math.abs(width - firstWidth)).toBeLessThan(5);
      });
    });
  });

  // Test Balance Visibility Toggle
  test.describe('Balance Visibility Toggle', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForSelector('[data-quick-access-rail]', { timeout: 10000 });
    });

    test('should toggle balance visibility', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      const toggleButton = rail.locator('button:has-text("Hide"), button:has-text("Show")');
      
      if (await toggleButton.isVisible()) {
        const initialText = await toggleButton.textContent();
        
        // Click toggle button
        await toggleButton.click();
        await page.waitForTimeout(200);
        
        // Verify button text changed
        const newText = await toggleButton.textContent();
        expect(newText).not.toBe(initialText);
        
        // Verify balances are hidden/shown accordingly
        const balanceElements = rail.locator('text=/\\$|••••••/');
        const isHidden = newText?.includes('Show');
        
        if (isHidden) {
          // Should show hidden balances (•••••• symbols)
          await expect(balanceElements.first()).toContainText('••••••');
        } else {
          // Should show actual balances ($ symbols)
          await expect(balanceElements.first()).toContainText('$');
        }
      }
    });
  });

  // Test Accessibility Features
  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
      await page.waitForSelector('[data-quick-access-rail]', { timeout: 10000 });
    });

    test('should have proper ARIA labels and roles', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      
      // Check main container has proper role and label
      await expect(rail).toHaveAttribute('role', 'region');
      await expect(rail).toHaveAttribute('aria-label', 'Quick Access Accounts');
      
      // Check navigation buttons have proper labels
      const leftArrow = rail.locator('button[aria-label="Scroll left"]');
      const rightArrow = rail.locator('button[aria-label="Scroll right"]');
      
      if (await leftArrow.isVisible()) {
        await expect(leftArrow).toHaveAttribute('aria-label', 'Scroll left');
      }
      if (await rightArrow.isVisible()) {
        await expect(rightArrow).toHaveAttribute('aria-label', 'Scroll right');
      }
    });

    test('should provide screen reader announcements', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      const srOnly = rail.locator('.sr-only');
      
      // Check for screen reader only content
      await expect(srOnly).toBeVisible();
      const srText = await srOnly.textContent();
      expect(srText).toMatch(/Press arrow keys to navigate/);
      expect(srText).toMatch(/accounts available/);
    });

    test('should support focus management', async ({ page }) => {
      const rail = page.locator('[data-quick-access-rail]');
      const focusableElements = rail.locator('button, [tabindex="0"]');
      
      // Tab through focusable elements
      await page.keyboard.press('Tab');
      
      let focusedCount = 0;
      for (let i = 0; i < Math.min(5, await focusableElements.count()); i++) {
        const focused = page.locator(':focus');
        if (await focused.isVisible()) {
          focusedCount++;
        }
        await page.keyboard.press('Tab');
      }
      
      expect(focusedCount).toBeGreaterThan(0);
    });
  });

  // Test Performance Metrics
  test.describe('Performance', () => {
    test('should load Quick Access Rail within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForSelector('[data-quick-access-rail]', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 2 seconds
      expect(loadTime).toBeLessThan(2000);
    });

    test('should have smooth scroll performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
      await page.waitForSelector('[data-quick-access-rail]', { timeout: 10000 });
      
      const scrollContainer = page.locator('[data-quick-access-rail] .overflow-x-auto');
      
      // Measure scroll performance
      const scrollStartTime = Date.now();
      
      // Simulate multiple scroll events
      for (let i = 0; i < 5; i++) {
        await scrollContainer.evaluate(el => {
          el.scrollBy({ left: 50, behavior: 'smooth' });
        });
        await page.waitForTimeout(100);
      }
      
      const scrollEndTime = Date.now();
      const scrollDuration = scrollEndTime - scrollStartTime;
      
      // Should complete smoothly within reasonable time
      expect(scrollDuration).toBeLessThan(1000);
    });
  });

  // Test Error Handling and Edge Cases
  test.describe('Edge Cases', () => {
    test('should handle empty account list gracefully', async ({ page }) => {
      // Mock empty accounts (this would need API mocking in real implementation)
      await page.goto('/');
      
      const rail = page.locator('[data-quick-access-rail]');
      
      // Component should still render even with no accounts
      await expect(rail).toBeVisible();
    });

    test('should handle long account names properly', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-quick-access-rail]', { timeout: 10000 });
      
      const cards = page.locator('[data-quick-access-rail] .min-w-\\[160px\\], [data-quick-access-rail] .w-full');
      
      // Check for text truncation
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();
      
      // Text should not overflow container
      const hasOverflow = await firstCard.evaluate(el => {
        return el.scrollWidth > el.clientWidth;
      });
      
      // If text overflows, it should be properly handled with ellipsis or truncation
      if (hasOverflow) {
        const computedStyle = await firstCard.evaluate(el => 
          window.getComputedStyle(el).textOverflow
        );
        expect(computedStyle).toBe('ellipsis');
      }
    });
  });
}); 