import { test, expect } from '@playwright/test';

test.describe('Mobile UI Validation - iOS26 Design Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Toggle Styling Fixes', () => {
    test('theme toggle should have iOS26 styling', async ({ page }) => {
      // Find the theme toggle
      const themeToggle = page.locator('[aria-label*="Switch to"]');
      await expect(themeToggle).toBeVisible();

      // Check that the toggle has proper iOS26 styling
      const toggleRoot = themeToggle.locator('xpath=..');
      await expect(toggleRoot).toHaveCSS('border-radius', '9999px'); // Fully rounded
      
      // Verify switch dimensions (h-7 w-12 = 28px height, 48px width)
      const boundingBox = await themeToggle.boundingBox();
      expect(boundingBox?.height).toBeCloseTo(28, 3);
      expect(boundingBox?.width).toBeCloseTo(48, 3);
    });

    test('toggle should not have background bleed', async ({ page }) => {
      const themeToggle = page.locator('[aria-label*="Switch to"]');
      
      // Get computed styles to check for proper background containment
      const styles = await themeToggle.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return {
          overflow: computedStyle.overflow,
          borderRadius: computedStyle.borderRadius,
          border: computedStyle.border
        };
      });

      // Should have proper containment
      expect(styles.overflow).toBe('hidden');
      expect(styles.borderRadius).toContain('9999px');
    });

    test('toggle colors should match Vueni dark theme', async ({ page }) => {
      const themeToggle = page.locator('[aria-label*="Switch to"]');
      
      // Test initial unchecked state (should be gray)
      const uncheckedColor = await themeToggle.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      // Should be gray-ish (not green)
      expect(uncheckedColor).not.toContain('rgb(34, 197, 94)'); // Not green-500
      
      // Click to check state
      await themeToggle.click();
      await page.waitForTimeout(300); // Wait for transition
      
      // Test checked state (should be blue)
      const checkedColor = await themeToggle.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      // Should be blue-ish
      expect(checkedColor).toMatch(/rgb\(\s*(?:37|59|99),\s*(?:82|130|102),\s*(?:246|235|241)\s*\)/);
    });
  });

  test.describe('Mobile Navigation Bar Responsiveness', () => {
    test('top navigation should not overlap on mobile screens', async ({ page }) => {
      // Test on various mobile viewport sizes
      const mobileViewports = [
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 390, height: 844, name: 'iPhone 12' },
        { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
        { width: 320, height: 568, name: 'iPhone 5' }
      ];

      for (const viewport of mobileViewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(100);

        const topNav = page.locator('[class*="liquid-glass-nav"]').first();
        await expect(topNav).toBeVisible();

        // Check that navigation elements don't overflow
        const navBoundingBox = await topNav.boundingBox();
        expect(navBoundingBox?.width).toBeLessThanOrEqual(viewport.width);

        // Verify no horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBeFalsy();

        console.log(`✓ ${viewport.name} (${viewport.width}x${viewport.height}) - Navigation fits properly`);
      }
    });

    test('navigation elements should be touch-friendly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Find all interactive navigation elements
      const navButtons = page.locator('[class*="liquid-glass-nav"] button');
      const buttonCount = await navButtons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = navButtons.nth(i);
        const boundingBox = await button.boundingBox();
        
        if (boundingBox) {
          // WCAG AA: Touch targets should be at least 44px
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('mobile menu should open correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Find and click mobile menu button (should be visible on mobile)
      const mobileMenuButton = page.locator('button[aria-label="Open menu"]');
      
      // Should be visible on mobile
      await expect(mobileMenuButton).toBeVisible();
      
      // Click to open menu
      await mobileMenuButton.click();
      
      // Menu sheet should appear
      const menuSheet = page.locator('[class*="sheet-content"]');
      await expect(menuSheet).toBeVisible();
      
      // Should contain menu sections
      await expect(page.locator('text=File')).toBeVisible();
      await expect(page.locator('text=View')).toBeVisible();
      await expect(page.locator('text=Tools')).toBeVisible();
    });

    test('desktop menubar should be hidden on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Desktop menubar should be hidden on mobile
      const desktopMenubar = page.locator('[class*="menubar"]');
      
      // Should either not exist or be hidden
      const isVisible = await desktopMenubar.isVisible().catch(() => false);
      expect(isVisible).toBeFalsy();
    });

    test('elements should wrap appropriately on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const topNav = page.locator('[class*="liquid-glass-nav"]').first();
      await expect(topNav).toBeVisible();

      // Check that elements don't overflow on tablet
      const navBoundingBox = await topNav.boundingBox();
      expect(navBoundingBox?.width).toBeLessThanOrEqual(768);

      // Mobile menu should still be visible on tablet (until lg breakpoint)
      const mobileMenuButton = page.locator('button[aria-label="Open menu"]');
      await expect(mobileMenuButton).toBeVisible();
    });

    test('desktop layout should show all elements', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      // Desktop menubar should be visible
      const desktopMenubar = page.locator('[class*="menubar"]');
      await expect(desktopMenubar).toBeVisible();

      // Mobile menu button should be hidden
      const mobileMenuButton = page.locator('button[aria-label="Open menu"]');
      const isVisible = await mobileMenuButton.isVisible().catch(() => false);
      expect(isVisible).toBeFalsy();

      // Quick navigation pills should be visible on large screens
      const quickNavButtons = page.locator('button[aria-label="Dashboard"], button[aria-label="Insights"], button[aria-label="Transactions"], button[aria-label="Reports"]');
      const quickNavCount = await quickNavButtons.count();
      expect(quickNavCount).toBeGreaterThan(0);
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('navigation should be keyboard accessible', async ({ page }) => {
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      
      // Should be able to navigate through elements
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('toggle should have proper ARIA labels', async ({ page }) => {
      const themeToggle = page.locator('[aria-label*="Switch to"]');
      
      const ariaLabel = await themeToggle.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/Switch to (light|dark) mode/);
    });

    test('navigation buttons should have proper ARIA labels', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      const navButtons = page.locator('button[aria-label]');
      const buttonCount = await navButtons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = navButtons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel?.length).toBeGreaterThan(3);
      }
    });
  });

  test.describe('Visual Regression Prevention', () => {
    test('toggle should have smooth animations', async ({ page }) => {
      const themeToggle = page.locator('[aria-label*="Switch to"]');
      
      // Get initial position
      const initialState = await themeToggle.evaluate((el) => {
        const thumb = el.querySelector('[class*="thumb"]');
        return {
          transform: thumb ? window.getComputedStyle(thumb).transform : '',
          transition: window.getComputedStyle(el).transition
        };
      });

      // Click toggle
      await themeToggle.click();
      await page.waitForTimeout(50); // Small delay to catch transition

      // Check that transition is defined
      expect(initialState.transition).toContain('0.3s');
    });

    test('no visual overflow or clipping', async ({ page }) => {
      const mobileViewports = [
        { width: 320, height: 568 },
        { width: 375, height: 667 },
        { width: 768, height: 1024 }
      ];

      for (const viewport of mobileViewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(100);

        // Check for any elements that might be clipped
        const clippedElements = await page.evaluate(() => {
          const elements = document.querySelectorAll('*');
          const clipped = [];
          
          for (const el of elements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
              if (el.tagName !== 'HTML' && el.tagName !== 'BODY') {
                clipped.push({
                  tag: el.tagName,
                  class: el.className,
                  right: rect.right,
                  bottom: rect.bottom,
                  windowWidth: window.innerWidth,
                  windowHeight: window.innerHeight
                });
              }
            }
          }
          return clipped;
        });

        // Filter out acceptable overflows (like modals, dropdowns)
        const problematicClipping = clippedElements.filter(el => 
          !el.class.includes('fixed') && 
          !el.class.includes('absolute') &&
          !el.class.includes('modal') &&
          !el.class.includes('dropdown')
        );

        expect(problematicClipping).toHaveLength(0);
      }
    });
  });
}); 