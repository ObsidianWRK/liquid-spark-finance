import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load the manifest generated during globalSetup.
const manifestPath = path.resolve(process.cwd(), 'ui-map.json');
if (!fs.existsSync(manifestPath)) {
  throw new Error(
    'UI interaction manifest not found – make sure globalSetup generated ui-map.json before running this test.'
  );
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const manifest: Array<{
  selector: string;
  type: string;
  originPage: string;
  expectUrlChange: boolean;
}> = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

async function captureErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return errors;
}

test.describe('🧭 UI Interaction Map', () => {
  for (const item of manifest) {
    test(`${item.type}: ${item.selector} (from ${item.originPage})`, async ({ page }, testInfo) => {
      const errors = await captureErrors(page);
      await page.goto(item.originPage);

      const locator = page.locator(item.selector);
      await expect(locator).toBeVisible();

      // Perform a trial click first to ensure the element is actionable without side-effects.
      await locator.click({ trial: true }).catch(() => {
        /* noop – some elements may not allow trial clicks (e.g., anchor without href) */
      });

      // Real click.
      await locator.click();

      if (item.expectUrlChange) {
        // Wait for navigation away from the origin URL.
        await expect(page).not.toHaveURL(item.originPage, { timeout: 5000 });
      }

      try {
        // Assert no JS errors were captured during the interaction.
        expect(errors, 'console errors or pageerrors').toHaveLength(0);
      } catch (err) {
        const screenshotPath = `test-results/${testInfo.project.name}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });
        await testInfo.attach('screenshot', {
          path: screenshotPath,
          contentType: 'image/png',
        });
        throw err;
      }
    });
  }
}); 