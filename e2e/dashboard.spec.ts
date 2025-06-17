import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display dashboard with all key components', async ({ page }) => {
    // Verify main dashboard elements
    await expect(page.locator('h1').filter({ hasText: 'Dashboard' })).toBeVisible();
    
    // Check for account cards
    await expect(page.locator('[data-testid="account-card"]')).toHaveCount(4);
    
    // Verify total balance is displayed
    await expect(page.locator('[data-testid="total-balance"]')).toBeVisible();
    
    // Check for quick actions
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible();
  });

  test('should display transaction list with proper data', async ({ page }) => {
    // Navigate to transactions
    await page.click('text=Recent Transactions');
    
    // Verify transaction list loads
    await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();
    
    // Check for transaction items
    const transactions = page.locator('[data-testid="transaction-item"]');
    const transactionCount = await transactions.count();
    expect(transactionCount).toBeGreaterThan(0);
    
    // Verify transaction has required fields
    const firstTransaction = transactions.first();
    await expect(firstTransaction.locator('[data-testid="transaction-merchant"]')).toBeVisible();
    await expect(firstTransaction.locator('[data-testid="transaction-amount"]')).toBeVisible();
    await expect(firstTransaction.locator('[data-testid="transaction-date"]')).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    // Test navigation to Insights
    await page.click('text=Insights');
    await expect(page).toHaveURL(/\/insights/);
    await expect(page.locator('h1').filter({ hasText: 'Financial Insights' })).toBeVisible();
    
    // Test navigation to Budget
    await page.click('text=Budget');
    await expect(page).toHaveURL(/\/budget/);
    
    // Test navigation to Calculators
    await page.click('text=Calculators');
    await expect(page).toHaveURL(/\/calculators/);
  });

  test('should show transaction scores on hover', async ({ page }) => {
    // Find a transaction item
    const transaction = page.locator('[data-testid="transaction-item"]').first();
    
    // Hover over transaction
    await transaction.hover();
    
    // Check for score tooltips
    await expect(page.locator('[data-testid="health-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="eco-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="financial-score"]')).toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    // Get initial theme
    const htmlElement = page.locator('html');
    const initialTheme = await htmlElement.getAttribute('class');
    
    // Click theme toggle
    await page.click('[data-testid="theme-toggle"]');
    
    // Verify theme changed
    const newTheme = await htmlElement.getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should display account details correctly', async ({ page }) => {
    // Check each account card
    const accountCards = page.locator('[data-testid="account-card"]');
    const count = await accountCards.count();
    
    for (let i = 0; i < count; i++) {
      const card = accountCards.nth(i);
      await expect(card.locator('[data-testid="account-name"]')).toBeVisible();
      await expect(card.locator('[data-testid="account-balance"]')).toBeVisible();
      await expect(card.locator('[data-testid="account-type"]')).toBeVisible();
    }
  });

  test('mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile menu toggle
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-toggle"]');
    
    // Verify navigation items are visible
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    
    // Check that layout adapts properly
    const accountCards = page.locator('[data-testid="account-card"]');
    const firstCardBox = await accountCards.first().boundingBox();
    const secondCardBox = await accountCards.nth(1).boundingBox();
    
    // Cards should stack vertically on mobile
    expect(firstCardBox?.y).toBeLessThan(secondCardBox?.y || 0);
  });
}); 