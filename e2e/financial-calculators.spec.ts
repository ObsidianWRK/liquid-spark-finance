import { test, expect } from '@playwright/test';

test.describe('Financial Calculators E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');
  });

  test('should display all calculator options', async ({ page }) => {
    // Verify all 11 calculators are present
    const calculators = [
      'Compound Interest Calculator',
      'Loan Payment Calculator',
      'ROI Calculator',
      'Inflation Calculator',
      'Retirement 401k Calculator',
      'Three Fund Portfolio Calculator',
      'Home Affordability Calculator',
      'Mortgage Payoff Calculator',
      'Financial Freedom Calculator',
      'Stock Backtest Calculator',
      'Exchange Rate Calculator',
    ];

    for (const calculator of calculators) {
      await expect(page.locator(`text=${calculator}`)).toBeVisible();
    }
  });

  test('should calculate compound interest correctly', async ({ page }) => {
    await page.click('text=Compound Interest Calculator');

    // Input test values
    await page.fill('[data-testid="principal-input"]', '10000');
    await page.fill('[data-testid="rate-input"]', '6');
    await page.fill('[data-testid="years-input"]', '5');
    await page.selectOption('[data-testid="frequency-select"]', '12'); // Monthly

    await page.click('[data-testid="calculate-button"]');

    // Verify result is approximately $13,488.50
    await expect(page.locator('[data-testid="result"]')).toContainText(
      '13,488'
    );

    // Verify chart is displayed
    await expect(page.locator('[data-testid="compound-chart"]')).toBeVisible();
  });

  test('should calculate loan payment correctly', async ({ page }) => {
    await page.click('text=Loan Payment Calculator');

    // Input mortgage scenario: $300k at 4.5% for 30 years
    await page.fill('[data-testid="principal-input"]', '300000');
    await page.fill('[data-testid="rate-input"]', '4.5');
    await page.fill('[data-testid="years-input"]', '30');

    await page.click('[data-testid="calculate-button"]');

    // Verify result is approximately $1,520.06
    await expect(page.locator('[data-testid="monthly-payment"]')).toContainText(
      '1,520'
    );

    // Verify amortization schedule
    await expect(
      page.locator('[data-testid="amortization-table"]')
    ).toBeVisible();
  });

  test('should calculate ROI correctly', async ({ page }) => {
    await page.click('text=ROI Calculator');

    // Test scenario: $1000 investment now worth $1200
    await page.fill('[data-testid="initial-investment"]', '1000');
    await page.fill('[data-testid="current-value"]', '1200');

    await page.click('[data-testid="calculate-button"]');

    // Verify 20% ROI
    await expect(page.locator('[data-testid="roi-percentage"]')).toContainText(
      '20.00%'
    );
    await expect(page.locator('[data-testid="profit-amount"]')).toContainText(
      '$200.00'
    );
  });

  test('should handle validation errors properly', async ({ page }) => {
    await page.click('text=Compound Interest Calculator');

    // Try to calculate without inputs
    await page.click('[data-testid="calculate-button"]');

    // Should show validation errors
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'required'
    );

    // Test invalid inputs
    await page.fill('[data-testid="principal-input"]', '-1000');
    await page.fill('[data-testid="rate-input"]', '150'); // Too high

    await page.click('[data-testid="calculate-button"]');

    // Should show specific validation messages
    await expect(page.locator('text=must be positive')).toBeVisible();
    await expect(page.locator('text=too high')).toBeVisible();
  });

  test('should save and load calculations', async ({ page }) => {
    await page.click('text=Compound Interest Calculator');

    // Input and calculate
    await page.fill('[data-testid="principal-input"]', '50000');
    await page.fill('[data-testid="rate-input"]', '7');
    await page.fill('[data-testid="years-input"]', '20');

    await page.click('[data-testid="calculate-button"]');

    // Save calculation
    await page.click('[data-testid="save-calculation"]');
    await page.fill('[data-testid="calculation-name"]', 'Retirement Scenario');
    await page.click('[data-testid="confirm-save"]');

    // Verify save success
    await expect(page.locator('text=Calculation saved')).toBeVisible();

    // Navigate away and back
    await page.goto('/dashboard');
    await page.goto('/calculators');
    await page.click('text=Compound Interest Calculator');

    // Load saved calculation
    await page.click('[data-testid="load-calculation"]');
    await page.click('text=Retirement Scenario');

    // Verify inputs are restored
    await expect(page.locator('[data-testid="principal-input"]')).toHaveValue(
      '50000'
    );
    await expect(page.locator('[data-testid="rate-input"]')).toHaveValue('7');
    await expect(page.locator('[data-testid="years-input"]')).toHaveValue('20');
  });

  test('should compare multiple scenarios', async ({ page }) => {
    await page.click('text=Retirement 401k Calculator');

    // Create first scenario
    await page.fill('[data-testid="current-balance"]', '50000');
    await page.fill('[data-testid="annual-contribution"]', '6000');
    await page.fill('[data-testid="employer-match"]', '0.5');
    await page.fill('[data-testid="return-rate"]', '7');
    await page.fill('[data-testid="years"]', '25');

    await page.click('[data-testid="calculate-button"]');
    await page.click('[data-testid="add-to-comparison"]');

    // Create second scenario with higher contribution
    await page.fill('[data-testid="annual-contribution"]', '10000');
    await page.click('[data-testid="calculate-button"]');
    await page.click('[data-testid="add-to-comparison"]');

    // View comparison
    await page.click('[data-testid="view-comparison"]');

    // Verify comparison chart and table
    await expect(
      page.locator('[data-testid="comparison-chart"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="scenario-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="scenario-2"]')).toBeVisible();

    // Second scenario should show higher result
    const scenario1Result = await page
      .locator('[data-testid="scenario-1-result"]')
      .textContent();
    const scenario2Result = await page
      .locator('[data-testid="scenario-2-result"]')
      .textContent();

    const value1 = parseFloat(scenario1Result?.replace(/[$,]/g, '') || '0');
    const value2 = parseFloat(scenario2Result?.replace(/[$,]/g, '') || '0');

    expect(value2).toBeGreaterThan(value1);
  });

  test('should export calculation results', async ({ page }) => {
    await page.click('text=Mortgage Payoff Calculator');

    // Input mortgage details
    await page.fill('[data-testid="principal-input"]', '300000');
    await page.fill('[data-testid="rate-input"]', '4.5');
    await page.fill('[data-testid="years-input"]', '30');
    await page.fill('[data-testid="extra-payment"]', '200');

    await page.click('[data-testid="calculate-button"]');

    // Start download of results
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-results"]');
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toContain('mortgage-payoff');
    expect(download.suggestedFilename()).toMatch(/\.(pdf|csv|json)$/);
  });

  test('should handle currency conversion in calculators', async ({ page }) => {
    await page.click('text=Exchange Rate Calculator');

    // Convert USD to EUR
    await page.fill('[data-testid="amount-input"]', '1000');
    await page.selectOption('[data-testid="from-currency"]', 'USD');
    await page.selectOption('[data-testid="to-currency"]', 'EUR');

    await page.click('[data-testid="convert-button"]');

    // Verify conversion result
    await expect(
      page.locator('[data-testid="converted-amount"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="exchange-rate"]')).toBeVisible();

    // Verify historical chart
    await expect(
      page.locator('[data-testid="rate-history-chart"]')
    ).toBeVisible();
  });

  test('should validate security measures', async ({ page }) => {
    await page.click('text=Compound Interest Calculator');

    // Test XSS prevention
    await page.fill(
      '[data-testid="principal-input"]',
      '<script>alert("xss")</script>'
    );

    // Should not execute script
    const alertHandled = new Promise((resolve) => {
      page.on('dialog', async (dialog) => {
        await dialog.dismiss();
        resolve(false); // Alert shouldn't appear
      });
      setTimeout(() => resolve(true), 1000);
    });

    await page.click('[data-testid="calculate-button"]');
    expect(await alertHandled).toBe(true);

    // Input should be sanitized
    const inputValue = await page
      .locator('[data-testid="principal-input"]')
      .inputValue();
    expect(inputValue).not.toContain('<script>');
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    await page.click('text=Compound Interest Calculator');

    // Fill in valid inputs
    await page.fill('[data-testid="principal-input"]', '10000');
    await page.fill('[data-testid="rate-input"]', '5');
    await page.fill('[data-testid="years-input"]', '10');

    // Rapidly click calculate button
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="calculate-button"]');
      await page.waitForTimeout(50);
    }

    // Should still function or show rate limit message
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    await page.click('text=Loan Payment Calculator');

    // Navigate using Tab key
    await page.keyboard.press('Tab'); // Principal input
    await page.keyboard.type('200000');

    await page.keyboard.press('Tab'); // Rate input
    await page.keyboard.type('4.5');

    await page.keyboard.press('Tab'); // Years input
    await page.keyboard.type('30');

    await page.keyboard.press('Tab'); // Calculate button
    await page.keyboard.press('Enter');

    // Should calculate successfully
    await expect(page.locator('[data-testid="monthly-payment"]')).toBeVisible();
  });

  test('should display help and tooltips', async ({ page }) => {
    await page.click('text=Three Fund Portfolio Calculator');

    // Hover over help icons
    await page.hover('[data-testid="us-stocks-help"]');
    await expect(page.locator('[data-testid="tooltip"]')).toBeVisible();
    await expect(page.locator('[data-testid="tooltip"]')).toContainText(
      'U.S. stock market'
    );

    await page.hover('[data-testid="bonds-help"]');
    await expect(page.locator('[data-testid="tooltip"]')).toContainText('bond');

    // Test help modal
    await page.click('[data-testid="help-button"]');
    await expect(page.locator('[data-testid="help-modal"]')).toBeVisible();
    await expect(page.locator('text=How to use this calculator')).toBeVisible();

    // Close modal
    await page.click('[data-testid="close-help"]');
    await expect(page.locator('[data-testid="help-modal"]')).not.toBeVisible();
  });
});
