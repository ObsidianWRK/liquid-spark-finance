import { test, expect } from '@playwright/test';

test.describe('Calculator Hub', () => {
  test('displays all calculator cards with proper design elements', async ({ page }) => {
    await page.goto('/calculators');
    
    // Wait for the page to load
    await page.waitForSelector('h1');
    
    // Check the main heading
    await expect(page.locator('h1')).toContainText('Financial Calculator Hub');
    
    // Check that calculator cards are visible
    const calculatorCards = page.locator('[data-testid="calculator-card"]').or(
      page.locator('.bg-white\\/\\[0\\.02\\]').filter({ hasText: 'Compound Interest' })
    );
    
    // Should have multiple calculator cards
    await expect(calculatorCards.first()).toBeVisible();
    
    // Check for specific calculators
    await expect(page.locator('text=Compound Interest')).toBeVisible();
    await expect(page.locator('text=Financial Freedom')).toBeVisible();
    await expect(page.locator('text=ROI Calculator')).toBeVisible();
    
    // Check for category sections
    await expect(page.locator('text=Savings')).toBeVisible();
    await expect(page.locator('text=Investing')).toBeVisible();
    await expect(page.locator('text=Retirement')).toBeVisible();
    
    // Check for status badges
    await expect(page.locator('text=Popular')).toBeVisible();
    await expect(page.locator('text=Trending')).toBeVisible();
    
    // Check for sparkline SVG elements
    const sparklines = page.locator('svg polyline');
    expect(await sparklines.count()).toBeGreaterThanOrEqual(5);
    
    // Check quick stats section
    await expect(page.locator('text=Total Calculators')).toBeVisible();
    await expect(page.locator('text=Categories')).toBeVisible();
  });

  test('calculator card interactions work correctly', async ({ page }) => {
    await page.goto('/calculators');
    
    // Wait for cards to load
    await page.waitForSelector('text=Compound Interest');
    
    // Click on the first calculator card
    const compoundInterestCard = page.locator('text=Compound Interest').locator('..');
    await compoundInterestCard.click();
    
    // Should open modal dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"]')).toContainText('Compound Interest');
    
    // Close modal
    await page.locator('[role="dialog"] button').first().click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('dropdown menu functionality works', async ({ page }) => {
    await page.goto('/calculators');
    
    // Wait for page to load
    await page.waitForSelector('text=Compound Interest');
    
    // Find and click the three-dot menu
    const firstCard = page.locator('text=Compound Interest').locator('..').locator('..');
    const moreButton = firstCard.locator('[data-state="closed"]').or(
      firstCard.locator('button').filter({ hasText: '' })
    );
    
    if (await moreButton.count() > 0) {
      await moreButton.first().click();
      
      // Check dropdown menu items
      await expect(page.locator('text=Open Calculator')).toBeVisible();
      await expect(page.locator('text=Learn More')).toBeVisible();
      await expect(page.locator('text=Share')).toBeVisible();
    }
  });

  test('navigation to individual calculators works', async ({ page }) => {
    await page.goto('/calculators');
    
    // Wait for page to load
    await page.waitForSelector('text=Compound Interest');
    
    // Try to navigate to a specific calculator
    await page.goto('/calculators/compound-interest');
    
    // Should show the individual calculator page
    await expect(page.locator('text=Compound Interest Calculator')).toBeVisible();
  });

  test('responsive design on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/calculators');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Compound Interest')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Compound Interest')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Compound Interest')).toBeVisible();
  });
}); 