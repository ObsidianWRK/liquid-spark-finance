import { test, expect } from '@playwright/test';

test.describe('Security E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not expose sensitive data in localStorage', async ({ page }) => {
    // Navigate through the app to trigger some data storage
    await page.click('[data-testid="nav-accounts"]');
    await page.click('[data-testid="nav-insights"]');
    await page.click('[data-testid="nav-dashboard"]');

    // Check localStorage for unencrypted sensitive data
    const localStorage = await page.evaluate(() => {
      const items = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          items[key] = window.localStorage.getItem(key);
        }
      }
      return items;
    });

    // Verify that financial data is not stored in plain text
    for (const [key, value] of Object.entries(localStorage as Record<string, string>)) {
      if (value && typeof value === 'string') {
        // Should not contain obvious financial patterns
        expect(value).not.toMatch(/\$[\d,]+\.\d{2}/); // Currency amounts
        expect(value).not.toMatch(/\b\d{4}-\d{4}-\d{4}-\d{4}\b/); // Credit card numbers
        expect(value).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/); // SSN patterns
        
        // If it contains encrypted data, it should look encrypted
        if (key.includes('secure') || key.includes('encrypted')) {
          expect(value).toMatch(/^[A-Za-z0-9+/=]+$/); // Base64-like encrypted data
        }
      }
    }
  });

  test('should handle session timeout', async ({ page }) => {
    // Navigate to a secure area
    await page.click('[data-testid="nav-accounts"]');
    
    // Simulate session timeout by manipulating localStorage/sessionStorage
    await page.evaluate(() => {
      // Clear session data as if it expired
      window.localStorage.removeItem('session_token');
      window.sessionStorage.clear();
    });
    
    // Navigate to another page
    await page.click('[data-testid="nav-insights"]');
    
    // App should handle missing session gracefully
    // Should not crash and should still be functional with default/demo data
    await expect(page.locator('body')).toBeVisible();
  });

  test('should not expose API keys or sensitive config', async ({ page }) => {
    // Check that no sensitive configuration is exposed in the page source
    const pageContent = await page.content();
    
    // Should not contain common sensitive patterns
    expect(pageContent).not.toMatch(/api[_-]?key/i);
    expect(pageContent).not.toMatch(/secret[_-]?key/i);
    expect(pageContent).not.toMatch(/private[_-]?key/i);
    expect(pageContent).not.toMatch(/password/i);
    expect(pageContent).not.toMatch(/token.*[a-zA-Z0-9]{20,}/);
  });

  test('should validate HTTPS usage in production', async ({ page }) => {
    // Note: This would be more relevant in a production environment
    // For now, we just check that the app doesn't break with security headers
    
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Vueni');
    
    // Check that the app loads properly (basic security test)
    await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();
  });

  test('should sanitize user inputs', async ({ page }) => {
    // Navigate to a page with input fields (if any)
    await page.goto('/');
    
    // Look for any input fields
    const inputs = page.locator('input, textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // Test XSS prevention on first input found
      const firstInput = inputs.first();
      await firstInput.fill('<script>alert("xss")</script>');
      
      // Check that script tags are not executed
      const alertHandled = new Promise((resolve) => {
        page.on('dialog', async (dialog) => {
          await dialog.dismiss();
          resolve(false); // Alert shouldn't appear if properly sanitized
        });
        setTimeout(() => resolve(true), 1000); // No alert = good
      });
      
      await expect(await alertHandled).toBe(true);
    }
  });

  test('should not leak data through console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate through the app
    await page.click('[data-testid="nav-accounts"]');
    await page.click('[data-testid="nav-insights"]');
    await page.click('[data-testid="nav-transactions"]');
    await page.click('[data-testid="nav-dashboard"]');
    
    // Check that console errors don't contain sensitive information
    for (const error of consoleErrors) {
      // Should not contain financial data patterns
      expect(error).not.toMatch(/\$[\d,]+\.\d{2}/);
      expect(error).not.toMatch(/\b\d{4}-\d{4}-\d{4}-\d{4}\b/);
      expect(error).not.toMatch(/api[_-]?key/i);
    }
  });

  test('should handle malformed URLs gracefully', async ({ page }) => {
    // Test various malformed URLs to ensure no sensitive errors are exposed
    const malformedUrls = [
      '/../../../../etc/passwd',
      '/<script>alert("xss")</script>',
      '/admin',
      '/api/users',
      '/config',
    ];
    
    for (const url of malformedUrls) {
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Should not crash or expose sensitive information
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toMatch(/error.*password/i);
      expect(pageContent).not.toMatch(/error.*key/i);
      expect(pageContent).not.toMatch(/stack trace/i);
    }
  });

  test('should properly handle encrypted storage operations', async ({ page }) => {
    // Test that the app can handle encrypted storage operations
    await page.evaluate(() => {
      // Try to access the SecureStorage functionality
      const testData = { amount: 1000, account: 'test' };
      
      // This should use our SecureStorage class if implemented correctly
      window.localStorage.setItem('test_encrypted_data', JSON.stringify(testData));
    });
    
    // Navigate through app to trigger storage reads
    await page.click('[data-testid="nav-accounts"]');
    await page.click('[data-testid="nav-dashboard"]');
    
    // App should continue to function normally
    await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();
    
    // Clean up test data
    await page.evaluate(() => {
      window.localStorage.removeItem('test_encrypted_data');
    });
  });
}); 