// Debug script to test Vueni app loading - CommonJS format
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testWhiteScreen() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // Capture JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    // Capture network failures
    const networkErrors = [];
    page.on('requestfailed', request => {
      networkErrors.push(`Failed: ${request.url()} - ${request.failure().errorText}`);
    });
    
    // Navigate to app
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
    
    // Wait for potential React rendering (using setTimeout instead of waitForTimeout)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if main app elements are present
    const rootElement = await page.$('#root');
    const hasContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.innerHTML.trim().length > 0;
    });
    
    // Check if any React components rendered
    const hasReactComponents = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && (root.innerHTML.includes('data-react') || root.innerHTML.includes('react'));
    });
    
    console.log('\n=== DEBUG RESULTS ===');
    console.log('Root element found:', !!rootElement);
    console.log('Has content in root:', hasContent);
    console.log('Has React components:', hasReactComponents);
    
    if (networkErrors.length > 0) {
      console.log('\n=== NETWORK ERRORS ===');
      networkErrors.forEach(error => console.log(error));
    }
    
    if (consoleMessages.length > 0) {
      console.log('\n=== CONSOLE MESSAGES ===');
      consoleMessages.forEach(msg => console.log(msg));
    }
    
    if (jsErrors.length > 0) {
      console.log('\n=== JAVASCRIPT ERRORS ===');
      jsErrors.forEach(error => console.log('ERROR:', error));
    }
    
    // Get page content for analysis
    const content = await page.content();
    const rootContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.innerHTML : 'No root element found';
    });
    
    console.log('\n=== ROOT CONTENT ===');
    console.log(rootContent.substring(0, 500) + (rootContent.length > 500 ? '...' : ''));
    
    // Save debug files
    fs.writeFileSync('debug-page-content.html', content);
    console.log('\nPage content saved as debug-page-content.html');
    
  } catch (error) {
    console.error('Debug script failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testWhiteScreen(); 