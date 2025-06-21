/**
 * Phase 7 - Navigation Integration E2E Tests
 * Tests for adaptive navigation and viewport responsiveness
 */

import { test, expect } from '@playwright/test';

// Viewport configurations for testing
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
} as const;

test.describe('Phase 7 - Navigation Integration', () => {
  test.describe('Dashboard → Transactions → Back Navigation', () => {
    test('should navigate from dashboard to transactions and back', async ({ page }) => {
      // Start on dashboard
      await page.goto('/');
      await expect(page).toHaveTitle(/Vueni/);
      
      // Verify we're on dashboard
      await expect(page.locator('h2:has-text("Personal Finance Management")')).toBeVisible();
      
      // Navigate to transactions (via adaptive navigation)
      await page.click('[aria-label*="Transactions"]');
      await page.waitForURL('/transactions');
      
      // Verify transactions page loaded
      await expect(page.locator('h1:has-text("Transaction Components")')).toBeVisible();
      await expect(page.locator('text=Recurring Subscriptions')).toBeVisible();
      
      // Navigate back to dashboard
      await page.click('[aria-label*="Dashboard"]');
      await page.waitForURL('/');
      
      // Verify back on dashboard
      await expect(page.locator('h2:has-text("Personal Finance Management")')).toBeVisible();
    });

    test('should maintain PFM features during navigation', async ({ page }) => {
      await page.goto('/');
      
      // Verify PFM features are present on dashboard
      await expect(page.locator('text=Linked Bank Accounts')).toBeVisible();
      await expect(page.locator('text=Recurring Subscriptions')).toBeVisible();
      await expect(page.locator('text=Bill Negotiation Concierge')).toBeVisible();
      
      // Navigate to transactions
      await page.click('[aria-label*="Transactions"]');
      await page.waitForURL('/transactions');
      
      // Verify subscriptions feature is present on transactions page
      await expect(page.locator('text=Recurring Subscriptions')).toBeVisible();
      
      // Navigate back
      await page.click('[aria-label*="Dashboard"]');
      await page.waitForURL('/');
      
      // Verify PFM features still present
      await expect(page.locator('text=Linked Bank Accounts')).toBeVisible();
    });
  });

  test.describe('Adaptive Navigation - Viewport Responsiveness', () => {
    test('should use bottom navigation on mobile (375px)', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/');
      
      // Mobile should show bottom navigation
      await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
      
      // Bottom nav should be fixed at bottom
      const nav = page.locator('nav[aria-label="Main navigation"]');
      await expect(nav).toHaveCSS('position', 'fixed');
      
      // Should show primary navigation items (limited to 4-5 items on mobile)
      await expect(page.locator('[aria-label*="Dashboard"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Accounts"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Transactions"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Insights"]')).toBeVisible();
      
      // Test navigation functionality
      await page.click('[aria-label*="Accounts"]');
      await page.waitForURL('/accounts');
      await expect(page.locator('h2:has-text("All Accounts")')).toBeVisible();
    });

    test('should use navigation rail on tablet (768px)', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto('/');
      
      // Tablet should show navigation rail or adapted navigation
      await expect(page.locator('[data-testid="adaptive-navigation"]')).toBeVisible();
      
      // Should show more navigation items than mobile
      await expect(page.locator('[aria-label*="Dashboard"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Accounts"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Transactions"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Insights"]')).toBeVisible();
      
      // Test navigation
      await page.click('[aria-label*="Insights"]');
      await page.waitForURL('/insights');
      await expect(page.locator('text=Age of Money')).toBeVisible();
    });

    test('should use full navigation on desktop (1280px)', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/');
      
      // Desktop should show full navigation with all options
      await expect(page.locator('[data-testid="adaptive-navigation"]')).toBeVisible();
      
      // Should show all navigation items including secondary ones
      await expect(page.locator('[aria-label*="Dashboard"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Accounts"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Transactions"]')).toBeVisible();
      await expect(page.locator('[aria-label*="Insights"]')).toBeVisible();
      
      // Test expanded navigation capabilities
      await page.click('[aria-label*="Accounts"]');
      await page.waitForURL('/accounts');
      await expect(page.locator('text=Linked Bank Accounts')).toBeVisible();
    });

    test('should adapt navigation when viewport changes', async ({ page }) => {
      // Start with desktop
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/');
      
      // Verify desktop navigation
      await expect(page.locator('[data-testid="adaptive-navigation"]')).toBeVisible();
      
      // Resize to mobile
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.waitForTimeout(500); // Allow time for responsive adaptation
      
      // Should adapt to mobile navigation
      await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
      
      // Resize back to desktop
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.waitForTimeout(500);
      
      // Should adapt back to desktop navigation
      await expect(page.locator('[data-testid="adaptive-navigation"]')).toBeVisible();
    });
  });

  test.describe('PFM Features Integration', () => {
    test('should display all PFM features on dashboard', async ({ page }) => {
      await page.goto('/');
      
      // Verify all 11 PFM Gap-10 features are present
      const expectedFeatures = [
        'Linked Bank Accounts',
        'Recurring Subscriptions', 
        'Bill Negotiation Concierge',
        'Smart Automated Savings Plans',
        'Household Collaboration',
        'Age of Money',
        'Privacy Settings',
        'Ask-an-Advisor',
        'Safe to Spend',
        'Home-Screen Widgets',
        'Biometric Monitor',
      ];
      
      for (const feature of expectedFeatures) {
        await expect(page.locator(`text=${feature}`)).toBeVisible();
      }
    });

    test('should show feature-specific PFM components on pages', async ({ page }) => {
      // Test accounts page shows bank linking
      await page.goto('/accounts');
      await expect(page.locator('text=Linked Bank Accounts')).toBeVisible();
      
      // Test transactions page shows subscriptions
      await page.goto('/transactions');  
      await expect(page.locator('text=Recurring Subscriptions')).toBeVisible();
      
      // Test insights page shows age of money
      await page.goto('/insights');
      await expect(page.locator('text=Age of Money')).toBeVisible();
    });
  });

  test.describe('Accessibility and Performance', () => {
    test('should have proper ARIA labels and keyboard navigation', async ({ page }) => {
      await page.goto('/');
      
      // Check for proper ARIA attributes
      await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Should be able to navigate with keyboard
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['BUTTON', 'A', 'DIV']).toContain(focusedElement);
    });

    test('should load pages within performance targets', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await expect(page.locator('h2:has-text("Personal Finance Management")')).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds (reasonable for E2E test)
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle lazy-loaded components', async ({ page }) => {
      await page.goto('/calculators');
      
      // Click on a calculator to trigger lazy loading
      await page.click('text=Financial Freedom');
      
      // Should show loading state then load calculator
      await expect(page.locator('text=Loading calculator...')).toBeVisible();
      await expect(page.locator('text=Financial Freedom')).toBeVisible();
    });
  });

  test.describe('Touch and Mobile Interactions', () => {
    test('should have proper touch targets on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/');
      
      // Navigation buttons should be properly sized for touch
      const navButtons = page.locator('nav[aria-label="Main navigation"] button');
      const buttonCount = await navButtons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = navButtons.nth(i);
        const box = await button.boundingBox();
        
        if (box) {
          // WCAG requires minimum 44x44px touch targets
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });
});