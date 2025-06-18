import { test, expect } from '@playwright/test';
import { HookValidationMonitor, NavigationTester, ComponentValidator, TEST_CONFIG } from './hook-validation-config';

test.describe('React Hook Violations Detection', () => {
  let hookMonitor: HookValidationMonitor;
  let navigator: NavigationTester;
  let validator: ComponentValidator;

  test.beforeEach(async ({ page }) => {
    hookMonitor = new HookValidationMonitor(page);
    navigator = new NavigationTester(page, hookMonitor);
    validator = new ComponentValidator(page);
    
    await hookMonitor.startMonitoring();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage without hook violations', async ({ page }) => {
    // Wait for initial render
    await page.waitForTimeout(2000);
    
    // Check for hook violations
    const errors = hookMonitor.getErrors();
    expect(errors).toHaveLength(0);
    
    // Verify React is working
    const hasReact = await validator.hasReactComponents();
    expect(hasReact).toBe(true);
  });

  test('should navigate to all tabs without hook violations', async ({ page }) => {
    for (const tab of TEST_CONFIG.tabs) {
      hookMonitor.reset();
      
      try {
        await navigator.navigateToTab(tab);
        
        // Wait for tab to fully load
        await page.waitForTimeout(1000);
        
        // Check for hook violations
        const errors = hookMonitor.getErrors();
        expect(errors, `Hook violations found on ${tab} tab: ${errors.join(', ')}`).toHaveLength(0);
        
        // Verify tab content is visible
        await expect(page.locator('main')).toBeVisible();
        
      } catch (error) {
        throw new Error(`Failed on ${tab} tab: ${error.message}`);
      }
    }
  });

  test('should handle rapid navigation without hook violations', async ({ page }) => {
    const rapidTabs = ['dashboard', 'accounts', 'transactions', 'dashboard', 'profile', 'insights'];
    
    hookMonitor.reset();
    await navigator.testRapidNavigation(rapidTabs);
    
    // Check for accumulated hook violations
    const errors = hookMonitor.getErrors();
    expect(errors, `Hook violations during rapid navigation: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('should handle URL parameter navigation without hook violations', async ({ page }) => {
    for (const tab of ['dashboard', 'accounts', 'transactions', 'profile']) {
      hookMonitor.reset();
      
      await navigator.testUrlParameterNavigation(tab);
      
      const errors = hookMonitor.getErrors();
      expect(errors, `Hook violations with URL param navigation to ${tab}: ${errors.join(', ')}`).toHaveLength(0);
    }
  });

  test('should handle page refresh without hook violations', async ({ page }) => {
    // Navigate to a specific tab first
    await navigator.navigateToTab('accounts');
    
    hookMonitor.reset();
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const errors = hookMonitor.getErrors();
    expect(errors, `Hook violations after page refresh: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('should validate Index.tsx hook order fix', async ({ page }) => {
    // This test specifically validates that the Index.tsx fix is working
    
    // Navigate to page and trigger potential hook order issues
    await page.goto('/?tab=dashboard');
    await page.waitForLoadState('networkidle');
    
    // Wait for any async effects
    await page.waitForTimeout(2000);
    
    // Check specifically for the "rendered more hooks" error
    const errors = hookMonitor.getErrors();
    const hookOrderErrors = errors.filter(error => 
      error.includes('rendered more hooks') || 
      error.includes('hook order')
    );
    
    expect(hookOrderErrors, `Hook order violations detected: ${hookOrderErrors.join(', ')}`).toHaveLength(0);
  });

  test('should validate ThemeToggle component hook fix', async ({ page }) => {
    // Look for theme toggle component
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[title*="theme"]');
    
    if (await themeToggle.count() > 0) {
      hookMonitor.reset();
      
      // Interact with theme toggle
      await themeToggle.first().click();
      await page.waitForTimeout(500);
      
      const errors = hookMonitor.getErrors();
      expect(errors, `ThemeToggle hook violations: ${errors.join(', ')}`).toHaveLength(0);
    }
  });

  test('should validate PerformanceMonitor component hook fix', async ({ page }) => {
    // Check if performance monitor is enabled (development mode)
    const perfMonitor = page.locator('[data-testid="performance-monitor"], .performance-monitor');
    
    if (await perfMonitor.count() > 0) {
      hookMonitor.reset();
      
      // Wait for performance monitor initialization
      await page.waitForTimeout(2000);
      
      const errors = hookMonitor.getErrors();
      expect(errors, `PerformanceMonitor hook violations: ${errors.join(', ')}`).toHaveLength(0);
    }
  });

  test('should handle error boundary scenarios without hook violations', async ({ page }) => {
    // Test that error boundaries don't cause hook violations
    hookMonitor.reset();
    
    // Try to navigate to a potentially problematic route
    await page.goto('/non-existent-route');
    await page.waitForTimeout(1000);
    
    // Should show 404 page without hook violations
    const errors = hookMonitor.getErrors();
    expect(errors, `Hook violations in error boundary: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('should validate component mounting/unmounting', async ({ page }) => {
    // Test mounting and unmounting of components through navigation
    const tabs = ['dashboard', 'wrapped', 'profile', 'dashboard'];
    
    for (const tab of tabs) {
      hookMonitor.reset();
      
      await navigator.navigateToTab(tab);
      await page.waitForTimeout(500);
      
      const errors = hookMonitor.getErrors();
      expect(errors, `Hook violations during ${tab} mount/unmount: ${errors.join(', ')}`).toHaveLength(0);
    }
  });

  test('should validate Suspense boundaries work correctly', async ({ page }) => {
    // Test that Suspense boundaries don't cause hook violations
    hookMonitor.reset();
    
    // Navigate to wrapped page which was previously nested in Suspense
    await navigator.navigateToTab('wrapped');
    await page.waitForTimeout(2000);
    
    const errors = hookMonitor.getErrors();
    expect(errors, `Hook violations with Suspense boundaries: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('should validate context providers are working', async ({ page }) => {
    // Test that the new context providers don't cause issues
    hookMonitor.reset();
    
    // Navigate through all tabs to test context usage
    for (const tab of ['dashboard', 'accounts', 'insights']) {
      await navigator.navigateToTab(tab);
      await page.waitForTimeout(500);
    }
    
    const errors = hookMonitor.getErrors();
    expect(errors, `Hook violations with context providers: ${errors.join(', ')}`).toHaveLength(0);
  });
});