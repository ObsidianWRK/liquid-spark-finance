/**
 * 🐌 SlowMo StackTracer - Delayed Analytics Crash Reproduction
 *
 * This script reproduces the "Right-side of assignment cannot be destructured"
 * crash on /?tab=analytics under slow network conditions.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function reproduceAnalyticsCrash() {
  console.log('🔥 Starting SlowMo StackTracer - Analytics Crash Reproduction');

  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    devtools: true, // Open DevTools
    slowMo: 100, // Slow down actions
    args: [
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--window-size=1440,900',
    ],
  });

  const page = await browser.newPage();

  // Set up slow network conditions (4 Mb/s, 300ms RTT as per requirements)
  await page.emulateNetworkConditions({
    offline: false,
    downloadThroughput: 500 * 1024, // 4 Mbps = 500 KB/s
    uploadThroughput: 500 * 1024,
    latency: 300, // 300ms RTT
  });

  // Capture console logs and errors
  const logs = [];
  const errors = [];

  page.on('console', (msg) => {
    const logEntry = `[${new Date().toISOString()}] ${msg.type()}: ${msg.text()}`;
    logs.push(logEntry);
    console.log(logEntry);
  });

  page.on('pageerror', (error) => {
    const errorEntry = `[${new Date().toISOString()}] PAGE ERROR: ${error.message}\n${error.stack}`;
    errors.push(errorEntry);
    console.error('💥 PAGE ERROR:', error.message);
  });

  // Track network requests
  const networkLogs = [];
  page.on('response', (response) => {
    networkLogs.push({
      timestamp: new Date().toISOString(),
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      timing: response.timing(),
    });
  });

  try {
    console.log('📍 Navigating to dashboard...');
    await page.goto('http://localhost:8080', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log('⏱️  Waiting 2 seconds for initial load...');
    await page.waitForTimeout(2000);

    console.log('🎯 Clicking Analytics tab...');
    // Try multiple ways to navigate to analytics
    try {
      // Method 1: Direct URL navigation
      await page.goto('http://localhost:8080/?tab=analytics', {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
    } catch (e) {
      console.log('⚠️ Direct URL failed, trying navigation click...');

      // Method 2: Click navigation if available
      const analyticsButton =
        (await page.$('[data-tab="analytics"]')) ||
        (await page.$('button:contains("Analytics")')) ||
        (await page.$('a[href*="analytics"]'));

      if (analyticsButton) {
        await analyticsButton.click();
      } else {
        // Method 3: Set URL parameters
        await page.evaluate(() => {
          window.location.search = '?tab=analytics';
        });
      }
    }

    console.log(
      '⏳ Waiting 15 seconds for delayed crash (monitoring for errors)...'
    );

    // Monitor for errors during the 15-second window
    let crashDetected = false;
    const startTime = Date.now();

    while (Date.now() - startTime < 15000 && !crashDetected) {
      await page.waitForTimeout(1000);

      // Check if any destructuring errors occurred
      const hasDestructuringError =
        logs.some(
          (log) =>
            log.includes('cannot be destructured') ||
            log.includes('Cannot destructure') ||
            log.includes('TypeError') ||
            log.includes('undefined is not iterable')
        ) ||
        errors.some(
          (error) =>
            error.includes('cannot be destructured') ||
            error.includes('Cannot destructure') ||
            error.includes('TypeError') ||
            error.includes('undefined is not iterable')
        );

      if (hasDestructuringError) {
        crashDetected = true;
        console.log('💥 CRASH DETECTED! Destructuring error found.');
        break;
      }

      // Check for React errors in the page
      const reactErrors = await page.evaluate(() => {
        const errorBoundaries = document.querySelectorAll(
          '[data-error-boundary]'
        );
        const errorMessages = Array.from(errorBoundaries).map(
          (el) => el.textContent
        );
        return errorMessages.filter((msg) => msg && msg.includes('error'));
      });

      if (reactErrors.length > 0) {
        crashDetected = true;
        console.log('💥 REACT ERROR DETECTED!', reactErrors);
        break;
      }

      console.log(
        `⏱️  ${Math.floor((Date.now() - startTime) / 1000)}s elapsed...`
      );
    }

    // Capture final page state
    console.log('📸 Capturing final page state...');

    // Take screenshot
    await page.screenshot({
      path: 'reports/stack/crash-screenshot.png',
      fullPage: true,
    });

    // Get React component tree
    const reactTree = await page.evaluate(() => {
      // Try to get React DevTools info if available
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        return 'React DevTools detected';
      }
      return 'No React DevTools available';
    });

    // Get performance metrics
    const performanceMetrics = await page.metrics();

    // Capture detailed stack trace
    const stackTrace = await page.evaluate(() => {
      try {
        throw new Error('Stack trace capture');
      } catch (e) {
        return e.stack;
      }
    });

    console.log(
      crashDetected
        ? '💥 CRASH REPRODUCTION SUCCESSFUL!'
        : '✅ No crash detected in 15 seconds'
    );

    // Write detailed report
    const report = {
      timestamp: new Date().toISOString(),
      crashDetected,
      testDuration: Date.now() - startTime,
      networkConditions: {
        throughput: '4 Mbps',
        latency: '300ms',
        offline: false,
      },
      logs,
      errors,
      networkLogs: networkLogs.slice(-20), // Last 20 requests
      performanceMetrics,
      reactTree,
      stackTrace,
      url: page.url(),
      userAgent: await page.evaluate(() => navigator.userAgent),
    };

    // Save reports
    const reportsDir = 'reports/stack';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(reportsDir, 'analytics-delayed.txt'),
      JSON.stringify(report, null, 2)
    );

    fs.writeFileSync(
      path.join(reportsDir, 'console-logs.txt'),
      logs.join('\n')
    );

    fs.writeFileSync(
      path.join(reportsDir, 'error-logs.txt'),
      errors.join('\n')
    );

    console.log('📄 Reports saved to reports/stack/');

    return report;
  } catch (error) {
    console.error('🚨 Error during crash reproduction:', error);
    throw error;
  } finally {
    console.log('🔚 Closing browser...');
    await browser.close();
  }
}

// Export for use in other scripts
module.exports = { reproduceAnalyticsCrash };

// Run if called directly
if (require.main === module) {
  reproduceAnalyticsCrash()
    .then((result) => {
      console.log('✅ Crash reproduction complete!');
      process.exit(result.crashDetected ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Crash reproduction failed:', error);
      process.exit(1);
    });
}
