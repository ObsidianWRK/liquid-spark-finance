import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys E2E Tests', () => {
  test.describe('New User Onboarding Journey', () => {
    test('should complete first-time user experience', async ({ page }) => {
      await page.goto('/');

      // Check if onboarding flow starts for new users
      const welcomeModal = page.locator('[data-testid="welcome-modal"]');
      if (await welcomeModal.isVisible()) {
        await expect(welcomeModal).toContainText('Welcome to Vueni');

        // Step through onboarding
        await page.click('[data-testid="start-tour"]');

        // Tour should highlight key features
        await expect(
          page.locator('[data-testid="tour-tooltip"]')
        ).toBeVisible();

        await page.click('[data-testid="next-step"]');
        await page.click('[data-testid="next-step"]');
        await page.click('[data-testid="finish-tour"]');

        await expect(welcomeModal).not.toBeVisible();
      }

      // Should land on dashboard
      await expect(
        page.locator('h1').filter({ hasText: 'Dashboard' })
      ).toBeVisible();
    });

    test('should guide user through adding first account', async ({ page }) => {
      await page.goto('/');

      // Look for add account prompt
      const addAccountCTA = page.locator('[data-testid="add-first-account"]');
      if (await addAccountCTA.isVisible()) {
        await addAccountCTA.click();

        // Should open account creation flow
        await expect(
          page.locator('[data-testid="account-setup-modal"]')
        ).toBeVisible();

        // Fill in demo account details
        await page.fill('[data-testid="account-name"]', 'Main Checking');
        await page.selectOption('[data-testid="account-type"]', 'checking');
        await page.fill('[data-testid="initial-balance"]', '5000');

        await page.click('[data-testid="create-account"]');

        // Should show success and close modal
        await expect(
          page.locator('text=Account created successfully')
        ).toBeVisible();
        await expect(
          page.locator('[data-testid="account-setup-modal"]')
        ).not.toBeVisible();

        // Account should appear on dashboard
        await expect(
          page.locator('[data-testid="account-card"]')
        ).toBeVisible();
        await expect(page.locator('text=Main Checking')).toBeVisible();
      }
    });
  });

  test.describe('Daily Financial Management Journey', () => {
    test('should complete transaction entry and categorization workflow', async ({
      page,
    }) => {
      await page.goto('/transactions');

      // Add new transaction
      await page.click('[data-testid="add-transaction"]');

      await expect(
        page.locator('[data-testid="transaction-modal"]')
      ).toBeVisible();

      // Fill transaction details
      await page.fill('[data-testid="merchant-input"]', 'Whole Foods Market');
      await page.fill('[data-testid="amount-input"]', '45.67');
      await page.selectOption('[data-testid="category-select"]', 'groceries');
      await page.fill('[data-testid="date-input"]', '2024-01-15');

      // Add optional notes
      await page.fill('[data-testid="notes-input"]', 'Weekly grocery shopping');

      await page.click('[data-testid="save-transaction"]');

      // Verify transaction appears in list
      await expect(page.locator('text=Whole Foods Market')).toBeVisible();
      await expect(page.locator('text=$45.67')).toBeVisible();

      // Check that scores were calculated
      await page.hover(
        '[data-testid="transaction-item"]:has-text("Whole Foods")'
      );
      await expect(page.locator('[data-testid="health-score"]')).toBeVisible();
      await expect(page.locator('[data-testid="eco-score"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="financial-score"]')
      ).toBeVisible();
    });

    test('should edit existing transaction', async ({ page }) => {
      await page.goto('/transactions');

      // Find and edit a transaction
      const firstTransaction = page
        .locator('[data-testid="transaction-item"]')
        .first();
      await firstTransaction.click();

      await expect(
        page.locator('[data-testid="transaction-details-modal"]')
      ).toBeVisible();

      await page.click('[data-testid="edit-transaction"]');

      // Modify amount
      await page.fill('[data-testid="amount-input"]', '52.34');
      await page.selectOption('[data-testid="category-select"]', 'dining');

      await page.click('[data-testid="save-changes"]');

      // Verify changes
      await expect(page.locator('text=$52.34')).toBeVisible();
      await expect(
        page.locator('[data-testid="transaction-details-modal"]')
      ).not.toBeVisible();
    });

    test('should filter and search transactions', async ({ page }) => {
      await page.goto('/transactions');

      // Test search functionality
      await page.fill('[data-testid="search-input"]', 'Amazon');
      await page.waitForTimeout(500); // Debounced search

      // Should only show Amazon transactions
      const visibleTransactions = page.locator(
        '[data-testid="transaction-item"]'
      );
      const count = await visibleTransactions.count();

      for (let i = 0; i < count; i++) {
        const transaction = visibleTransactions.nth(i);
        await expect(transaction).toContainText('Amazon');
      }

      // Clear search
      await page.fill('[data-testid="search-input"]', '');

      // Test category filter
      await page.click('[data-testid="category-filter"]');
      await page.click('[data-testid="filter-groceries"]');

      // Should only show grocery transactions
      const groceryTransactions = page.locator(
        '[data-testid="transaction-item"]'
      );
      const groceryCount = await groceryTransactions.count();
      expect(groceryCount).toBeGreaterThan(0);

      // Test date range filter
      await page.click('[data-testid="date-filter"]');
      await page.fill('[data-testid="start-date"]', '2024-01-01');
      await page.fill('[data-testid="end-date"]', '2024-01-31');
      await page.click('[data-testid="apply-date-filter"]');

      // Should filter by date range
      await expect(
        page.locator('[data-testid="transaction-item"]')
      ).toHaveCount({ min: 1 });
    });
  });

  test.describe('Budget Planning Journey', () => {
    test('should create and manage budget categories', async ({ page }) => {
      await page.goto('/budget');

      // Check if budget planning page loads
      await expect(
        page.locator('h1').filter({ hasText: 'Budget' })
      ).toBeVisible();

      // Create new budget category
      await page.click('[data-testid="add-budget-category"]');

      await page.fill('[data-testid="category-name"]', 'Entertainment');
      await page.fill('[data-testid="monthly-limit"]', '200');
      await page.selectOption('[data-testid="category-type"]', 'entertainment');

      await page.click('[data-testid="create-category"]');

      // Verify category appears
      await expect(page.locator('text=Entertainment')).toBeVisible();
      await expect(page.locator('text=$200')).toBeVisible();

      // Check progress bar
      await expect(
        page.locator('[data-testid="budget-progress"]')
      ).toBeVisible();
    });

    test('should show budget alerts when approaching limits', async ({
      page,
    }) => {
      await page.goto('/budget');

      // If there are budget alerts, they should be visible
      const alertsSection = page.locator('[data-testid="budget-alerts"]');
      if (await alertsSection.isVisible()) {
        await expect(alertsSection).toContainText('Budget Alert');

        // Click on alert to see details
        await page.click('[data-testid="budget-alert-item"]');
        await expect(
          page.locator('[data-testid="alert-details"]')
        ).toBeVisible();
      }
    });

    test('should generate budget reports', async ({ page }) => {
      await page.goto('/budget');

      // Navigate to reports section
      await page.click('[data-testid="budget-reports"]');

      // Generate monthly report
      await page.click('[data-testid="generate-monthly-report"]');

      // Verify report is displayed
      await expect(
        page.locator('[data-testid="budget-report-chart"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="spending-breakdown"]')
      ).toBeVisible();

      // Test export functionality
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="export-report"]');
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toContain('budget-report');
    });
  });

  test.describe('Investment Tracking Journey', () => {
    test('should add and track investment portfolio', async ({ page }) => {
      await page.goto('/investments');

      // Add new investment
      await page.click('[data-testid="add-investment"]');

      await page.fill('[data-testid="symbol-input"]', 'VTSAX');
      await page.fill('[data-testid="shares-input"]', '100');
      await page.fill('[data-testid="purchase-price"]', '85.50');
      await page.fill('[data-testid="purchase-date"]', '2024-01-01');

      await page.click('[data-testid="add-investment-confirm"]');

      // Verify investment appears in portfolio
      await expect(page.locator('text=VTSAX')).toBeVisible();
      await expect(page.locator('text=100 shares')).toBeVisible();

      // Check portfolio summary
      await expect(
        page.locator('[data-testid="portfolio-value"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="total-gain-loss"]')
      ).toBeVisible();
    });

    test('should view investment performance charts', async ({ page }) => {
      await page.goto('/investments');

      // View performance chart
      await expect(
        page.locator('[data-testid="performance-chart"]')
      ).toBeVisible();

      // Change time period
      await page.click('[data-testid="time-period-1y"]');
      await expect(
        page.locator('[data-testid="performance-chart"]')
      ).toBeVisible();

      // View allocation chart
      await page.click('[data-testid="allocation-tab"]');
      await expect(
        page.locator('[data-testid="allocation-chart"]')
      ).toBeVisible();
    });
  });

  test.describe('Financial Insights Journey', () => {
    test('should explore comprehensive financial insights', async ({
      page,
    }) => {
      await page.goto('/insights');

      // Verify insights page loads with data
      await expect(
        page.locator('h1').filter({ hasText: 'Financial Insights' })
      ).toBeVisible();

      // Check score displays
      await expect(
        page.locator('[data-testid="health-score-card"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="eco-score-card"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="financial-score-card"]')
      ).toBeVisible();

      // Verify charts are rendered
      await expect(
        page.locator('[data-testid="spending-trends-chart"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="category-breakdown-chart"]')
      ).toBeVisible();

      // Test interactive chart features
      await page.hover('[data-testid="chart-data-point"]');
      await expect(page.locator('[data-testid="chart-tooltip"]')).toBeVisible();
    });

    test('should switch between different insight views', async ({ page }) => {
      await page.goto('/insights');

      // Test different view modes
      const viewButtons = ['overview', 'trends', 'health', 'eco', 'financial'];

      for (const view of viewButtons) {
        const button = page.locator(`[data-testid="view-${view}"]`);
        if (await button.isVisible()) {
          await button.click();
          await expect(
            page.locator(`[data-testid="${view}-content"]`)
          ).toBeVisible();
        }
      }
    });

    test('should customize insight preferences', async ({ page }) => {
      await page.goto('/insights');

      // Open preferences
      await page.click('[data-testid="insight-preferences"]');

      await expect(
        page.locator('[data-testid="preferences-modal"]')
      ).toBeVisible();

      // Toggle settings
      await page.click('[data-testid="show-projections"]');
      await page.click('[data-testid="enable-alerts"]');

      await page.click('[data-testid="save-preferences"]');

      // Verify preferences are applied
      await expect(
        page.locator('[data-testid="projections-section"]')
      ).toBeVisible();
    });
  });

  test.describe('Mobile User Journey', () => {
    test('should handle mobile transaction entry', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Open mobile menu
      await page.click('[data-testid="mobile-menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();

      // Navigate to transactions
      await page.click('[data-testid="mobile-nav-transactions"]');

      // Quick add transaction on mobile
      await page.click('[data-testid="mobile-quick-add"]');

      await page.fill('[data-testid="quick-merchant"]', 'Coffee Shop');
      await page.fill('[data-testid="quick-amount"]', '4.50');
      await page.click('[data-testid="quick-save"]');

      // Verify transaction added
      await expect(page.locator('text=Coffee Shop')).toBeVisible();
    });

    test('should handle mobile navigation and gestures', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Test swipe gestures on cards
      const accountCard = page.locator('[data-testid="account-card"]').first();
      if (await accountCard.isVisible()) {
        // Simulate swipe gesture
        await accountCard.hover();
        await page.mouse.down();
        await page.mouse.move(100, 0);
        await page.mouse.up();

        // Should reveal action buttons
        await expect(
          page.locator('[data-testid="card-actions"]')
        ).toBeVisible();
      }

      // Test pull-to-refresh
      await page.touchscreen.tap(200, 100);
      await page.mouse.move(200, 200);

      // Should trigger refresh animation
      await expect(
        page.locator('[data-testid="refresh-indicator"]')
      ).toBeVisible();
    });
  });

  test.describe('Data Export and Backup Journey', () => {
    test('should export financial data', async ({ page }) => {
      await page.goto('/profile');

      // Navigate to data export
      await page.click('[data-testid="data-export"]');

      // Select export options
      await page.check('[data-testid="export-transactions"]');
      await page.check('[data-testid="export-budgets"]');
      await page.check('[data-testid="export-investments"]');

      await page.selectOption('[data-testid="export-format"]', 'csv');

      // Start export
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="start-export"]');
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toContain('vueni-data-export');
      expect(download.suggestedFilename()).toMatch(/\.zip$/);
    });

    test('should backup user preferences', async ({ page }) => {
      await page.goto('/profile');

      // Backup settings
      await page.click('[data-testid="backup-settings"]');

      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="download-backup"]');
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toContain('settings-backup');
      expect(download.suggestedFilename()).toMatch(/\.json$/);
    });
  });

  test.describe('Error Recovery Journey', () => {
    test('should handle network connectivity issues', async ({ page }) => {
      await page.goto('/');

      // Simulate offline mode
      await page.context().setOffline(true);

      // Try to navigate
      await page.click('[data-testid="nav-transactions"]');

      // Should show offline message
      await expect(
        page.locator('[data-testid="offline-indicator"]')
      ).toBeVisible();
      await expect(
        page.locator('text=You are currently offline')
      ).toBeVisible();

      // Restore connection
      await page.context().setOffline(false);

      // Should automatically sync when back online
      await expect(
        page.locator('[data-testid="sync-indicator"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="offline-indicator"]')
      ).not.toBeVisible();
    });

    test('should recover from corrupted data', async ({ page }) => {
      await page.goto('/');

      // Simulate corrupted local storage
      await page.evaluate(() => {
        localStorage.setItem('vueni:transactions', 'corrupted-data');
      });

      // Refresh page
      await page.reload();

      // Should detect corruption and offer recovery
      const recoveryModal = page.locator('[data-testid="data-recovery-modal"]');
      if (await recoveryModal.isVisible()) {
        await expect(recoveryModal).toContainText('Data corruption detected');

        // Choose recovery option
        await page.click('[data-testid="restore-from-backup"]');

        // Should restore to working state
        await expect(
          page.locator('[data-testid="recovery-success"]')
        ).toBeVisible();
      }
    });
  });

  test.describe('Performance Under Load', () => {
    test('should handle large datasets efficiently', async ({ page }) => {
      await page.goto('/transactions');

      // Load page with many transactions
      await page.evaluate(() => {
        // Simulate adding many transactions to test virtual scrolling
        const event = new CustomEvent('loadTestData', {
          detail: { transactionCount: 5000 },
        });
        window.dispatchEvent(event);
      });

      await page.waitForTimeout(1000);

      // Should still be responsive
      await expect(
        page.locator('[data-testid="transaction-list"]')
      ).toBeVisible();

      // Test scrolling performance
      const startTime = Date.now();
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(100);
      await page.mouse.wheel(0, -1000);
      const endTime = Date.now();

      // Scrolling should be smooth (under 500ms for round trip)
      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});
