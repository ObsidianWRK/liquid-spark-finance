import { test, expect } from '@playwright/test';

test.describe('FeatureCloud Debug', () => {
  test('Debug - Check FeatureCloud visibility', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'feature-cloud-debug.png', fullPage: true });
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for the FeatureCloud component
    const featureCloudHeadline = page.locator('h1:has-text("Intelligence you can bank on")');
    const isVisible = await featureCloudHeadline.isVisible({ timeout: 5000 }).catch(() => false);
    
    console.log('FeatureCloud headline visible:', isVisible);
    
    // If not visible, check what's on the page
    if (!isVisible) {
      const pageContent = await page.content();
      console.log('Page title:', await page.title());
      console.log('Page URL:', page.url());
      console.log('Body text sample:', await page.locator('body').textContent().then(text => text?.substring(0, 500)));
    }
    
    // Try to find any buttons
    const buttons = await page.locator('button').all();
    console.log('Number of buttons found:', buttons.length);
    
    // Check for feature buttons specifically
    const featureButtons = [
      'Smart Banking',
      'AI Insights',
      'Investment',
      'Budgeting',
      'Goals',
      'Analytics',
      'Security',
      'Planning',
      'Savings',
      'Credit'
    ];
    
    for (const buttonText of featureButtons) {
      const button = page.locator(`button:has-text("${buttonText}")`);
      const exists = await button.count() > 0;
      console.log(`Button "${buttonText}" exists:`, exists);
    }
    
    // Check if we're on the dashboard
    const currentTab = await page.evaluate(() => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('tab') || 'dashboard';
    });
    console.log('Current tab:', currentTab);
  });
}); 