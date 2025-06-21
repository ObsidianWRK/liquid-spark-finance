import { test, expect } from '@playwright/test';

test.describe('FeatureCloud Navigation Fix Verification', () => {
  test.setTimeout(60000);

  // Define button-to-route mappings
  const navigationTests = [
    { button: 'Smart Banking', expectedPath: '/accounts', expectedTitle: /accounts/i },
    { button: 'AI Insights', expectedPath: '/insights', expectedTitle: /insights/i },
    { button: 'Investment', expectedPath: '/investment-tracker', expectedTitle: /investment/i },
    { button: 'Budgeting', expectedPath: '/budget-planner', expectedTitle: /budget/i },
    { button: 'Goals', expectedPath: '/savings', expectedTitle: /savings/i },
    { button: 'Analytics', expectedPath: '/reports', expectedTitle: /reports/i },
    { button: 'Security', expectedPath: '/', expectedTitle: /intelligence|dashboard/i },
    { button: 'Planning', expectedPath: '/budget-planner', expectedTitle: /budget|planning/i },
    { button: 'Savings', expectedPath: '/savings', expectedTitle: /savings/i },
    { button: 'Credit', expectedPath: '/credit', expectedTitle: /credit/i },
  ];

  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('h1:has-text("Intelligence you can bank on")', {
      timeout: 30000,
    });
    
    // Wait for FeatureCloud buttons to be visible
    await page.waitForSelector('button:has-text("Smart Banking")', {
      timeout: 10000,
    });
  });

  for (const navTest of navigationTests) {
    test(`${navTest.button} button navigates to ${navTest.expectedPath}`, async ({ page }) => {
      // Click the button
      await page.click(`button:has-text("${navTest.button}")`);
      
      // Wait for navigation
      await page.waitForURL(`**${navTest.expectedPath}`, { timeout: 10000 });
      
      // Verify URL
      expect(page.url()).toContain(navTest.expectedPath);
      
      // Verify page content loads (wait for title or main content)
      await page.waitForLoadState('networkidle');
      
      // Optional: Check page title contains expected text
      const title = await page.title();
      const headingText = await page.textContent('h1, h2, h3').catch(() => '');
      const pageText = `${title} ${headingText}`.toLowerCase();
      
      console.log(`${navTest.button}: Navigated to ${page.url()}, page content: "${pageText}"`);
    });
  }

  test('All FeatureCloud buttons are clickable and visible', async ({ page }) => {
    for (const navTest of navigationTests) {
      const button = page.locator(`button:has-text("${navTest.button}")`);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  });

  test('Navigation preserves back functionality', async ({ page }) => {
    // Test navigation flow: Dashboard → Accounts → Back → Dashboard
    
    // Click Smart Banking
    await page.click('button:has-text("Smart Banking")');
    await page.waitForURL('**/accounts');
    
    // Go back to dashboard
    await page.goBack();
    await page.waitForURL('**/');
    
    // Verify we're back on dashboard
    await expect(page.locator('h1:has-text("Intelligence you can bank on")')).toBeVisible();
  });
}); 