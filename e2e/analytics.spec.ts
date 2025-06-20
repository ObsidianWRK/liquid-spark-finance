import { test, expect } from '@playwright/test';

test.describe('🛡️ Final Analytics Bulletproof Verification', () => {
  const DESTRUCTURING_ERROR_PATTERNS = [
    'Right side of assignment cannot be destructured',
    'Cannot read property',
    'Cannot read properties of undefined',
    'Cannot read properties of null',
    'TypeError: Cannot destructure',
    'undefined is not an object',
    'null is not an object',
  ];

  test('✅ Analytics tab loads without any destructuring crashes', async ({ page }) => {
    const capturedErrors: { type: string, text: string }[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        capturedErrors.push({ type: 'console', text: msg.text() });
      }
    });
    
    page.on('pageerror', error => {
      capturedErrors.push({ type: 'pageerror', text: error.message });
    });

    await page.goto('/?tab=analytics', { waitUntil: 'networkidle' });
    
    await expect(page.locator('h1:has-text("Financial Analytics Dashboard")')).toBeVisible({ timeout: 15000 });
    
    await page.waitForTimeout(3000);
    
    await expect(page.locator('.recharts-wrapper').first()).toBeVisible();

    const destructuringErrors = capturedErrors.filter(({ text }) =>
      DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
        text.toLowerCase().includes(pattern.toLowerCase())
      )
    );

    expect(destructuringErrors, `Destructuring errors found: ${JSON.stringify(destructuringErrors, null, 2)}`).toHaveLength(0);
  });
}); 