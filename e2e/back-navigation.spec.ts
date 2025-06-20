import { test, expect } from '@playwright/test';

test.describe('Back Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate back through history stack correctly', async ({ page }) => {
    // Start at dashboard
    await expect(page).toHaveURL('/');
    
    // Navigate to accounts list
    await page.goto('/accounts');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/accounts');
    
    // Click on an account to go to detail page
    await page.click('[data-testid="account-card"], .cursor-pointer:has(h3):first');
    await page.waitForLoadState('networkidle');
    
    // Should be on account detail page
    await expect(page.url()).toMatch(/\/accounts\/[^\/]+$/);
    
    // Click back button
    await page.click('button:has-text("Back")');
    await page.waitForLoadState('networkidle');
    
    // Should return to accounts list
    await expect(page).toHaveURL('/accounts');
  });

  test('should handle deep links with fallback navigation', async ({ page }) => {
    // Direct navigation to account detail (simulating deep link)
    await page.goto('/accounts/acc_001');
    await page.waitForLoadState('networkidle');
    
    // Should be on account detail page
    await expect(page.url()).toMatch(/\/accounts\/acc_001$/);
    
    // Click back button - should fallback to accounts list since no history
    await page.click('button:has-text("Back")');
    await page.waitForLoadState('networkidle');
    
    // Should go to accounts list page (fallback)
    await expect(page).toHaveURL('/accounts');
  });

  test('should handle browser back button correctly', async ({ page }) => {
    // Navigate through multiple pages
    await page.goto('/accounts');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/accounts/acc_001');
    await page.waitForLoadState('networkidle');
    
    // Use browser back button
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Should be back at accounts list
    await expect(page).toHaveURL('/accounts');
    
    // Go back again
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Should be back at dashboard
    await expect(page).toHaveURL('/');
  });

  test('should work correctly from dashboard account cards', async ({ page }) => {
    // Start at dashboard
    await expect(page).toHaveURL('/');
    
    // Click on an account card from dashboard
    const accountCard = page.locator('[data-testid="account-card"]').first();
    if (await accountCard.count() > 0) {
      await accountCard.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on account detail page
      await expect(page.url()).toMatch(/\/accounts\/[^\/]+$/);
      
      // Click back button
      await page.click('button:has-text("Back")');
      await page.waitForLoadState('networkidle');
      
      // Should return to dashboard (since that's where we came from)
      await expect(page).toHaveURL('/');
    }
  });

  test('should work from feature pages', async ({ page }) => {
    // Test budget page back navigation
    await page.goto('/budget-planner');
    await page.waitForLoadState('networkidle');
    
    // Click back button
    await page.click('button:has-text("Back")');
    await page.waitForLoadState('networkidle');
    
    // Should go to dashboard (fallback)
    await expect(page).toHaveURL('/');
  });

  test('should maintain navigation state across page refreshes', async ({ page }) => {
    // Navigate to account detail through accounts list
    await page.goto('/accounts');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/accounts/acc_001');
    await page.waitForLoadState('networkidle');
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be on account detail page
    await expect(page.url()).toMatch(/\/accounts\/acc_001$/);
    
    // Back button should now use fallback (since refresh cleared history)
    await page.click('button:has-text("Back")');
    await page.waitForLoadState('networkidle');
    
    // Should go to accounts list (fallback)
    await expect(page).toHaveURL('/accounts');
  });

  test('should handle error states correctly', async ({ page }) => {
    // Navigate to non-existent account
    await page.goto('/accounts/nonexistent');
    await page.waitForLoadState('networkidle');
    
    // Should show error state
    await expect(page.locator('text=Account Not Found')).toBeVisible();
    
    // Error state back button should work
    const backButton = page.locator('button:has-text("Back")');
    if (await backButton.count() > 0) {
      await backButton.click();
      await page.waitForLoadState('networkidle');
      
      // Should go to accounts list
      await expect(page).toHaveURL('/accounts');
    }
  });
}); 