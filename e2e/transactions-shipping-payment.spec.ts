import { test, expect } from '@playwright/test';

// Basic end-to-end check ensuring that restored shipping & payment details are visible
// Assumes default route displays a transactions list utilizing OptimizedTransactionList

test('shows shipping + payment in transactions', async ({ page }) => {
  // Navigate to the app (root path)
  await page.goto('/');

  // Wait for transactions list to render
  await page.waitForSelector('text=Recent Transactions');

  // Confirm at least one payment method visible (account name portion)
  await expect(page.locator('text=/Card|Checking|Savings/')).toBeVisible();

  // Confirm at least one shipping status link visible (Delivered/In Transit etc.)
  await expect(
    page.getByRole('link', { name: /Delivered|Out for Delivery|In Transit|Pending/ })
  ).toBeVisible();
}); 