import { test, expect } from '@playwright/test';

test.describe('Profile Navigation Test', () => {
  test('Back to Dashboard button should be clickable and functional', async ({
    page,
  }) => {
    console.log('🧪 Testing Profile Back to Dashboard button functionality...');

    // Start from dashboard
    await page.goto('/');
    await expect(page).toHaveTitle(/Vueni/i);

    // Navigate to profile
    console.log('📱 Navigating to Profile page...');
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Verify we're on the profile page
    await expect(page.locator('h1')).toContainText('Profile Settings');
    console.log('✅ Successfully loaded Profile page');

    // Test the main Back to Dashboard button
    console.log('🎯 Testing main Back to Dashboard button...');
    const backButton = page
      .locator('button:has-text("Back to Dashboard")')
      .first();

    // Verify button is visible and clickable
    await expect(backButton).toBeVisible();
    await expect(backButton).toBeEnabled();
    console.log('✅ Back button is visible and enabled');

    // Click the button
    await backButton.click();
    await page.waitForLoadState('networkidle');

    // Verify we're back on dashboard
    await expect(page).toHaveURL('/');
    console.log('✅ Successfully navigated back to dashboard');

    // Test keyboard shortcut (Escape key)
    console.log('⌨️ Testing Escape key shortcut...');
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Escape');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
    console.log('✅ Escape key navigation working');

    // Test sidebar Dashboard button
    console.log('📋 Testing sidebar Dashboard button...');
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const sidebarDashboardButton = page.locator(
      '.lg\\:col-span-1 button:has-text("Dashboard")'
    );
    await expect(sidebarDashboardButton).toBeVisible();
    await sidebarDashboardButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
    console.log('✅ Sidebar Dashboard button working');

    // Test section-level dashboard buttons
    console.log('🔧 Testing section-level Dashboard buttons...');
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Navigate to Preferences section
    await page.locator('button:has-text("Preferences")').click();
    await page.waitForTimeout(500);

    // Find and click the section Dashboard button
    const sectionDashboardButton = page
      .locator('h2:has-text("Preferences")')
      .locator('..')
      .locator('button:has-text("Dashboard")');
    await expect(sectionDashboardButton).toBeVisible();
    await sectionDashboardButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
    console.log('✅ Section Dashboard button working');

    console.log('🎉 All Profile navigation tests passed!');
  });

  test('Navigation buttons have proper accessibility', async ({ page }) => {
    console.log('♿ Testing navigation accessibility...');

    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const backButton = page
      .locator('button:has-text("Back to Dashboard")')
      .first();

    // Check aria-label
    const ariaLabel = await backButton.getAttribute('aria-label');
    expect(ariaLabel).toContain('Back to Dashboard');
    console.log('✅ Aria-label is properly set');

    // Check title attribute
    const title = await backButton.getAttribute('title');
    expect(title).toContain('Back to Dashboard');
    console.log('✅ Title attribute is properly set');

    // Check button type
    const buttonType = await backButton.getAttribute('type');
    expect(buttonType).toBe('button');
    console.log('✅ Button type is properly set');

    // Test focus behavior
    await backButton.focus();
    await expect(backButton).toBeFocused();
    console.log('✅ Button can receive focus');

    console.log('🎉 Navigation accessibility tests passed!');
  });
});
