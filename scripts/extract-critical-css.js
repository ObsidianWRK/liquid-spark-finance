#!/usr/bin/env node
/**
 * Critical CSS Extraction for Vueni
 * Extracts above-the-fold CSS for critical performance paths
 */

const critical = require('critical');
const fs = require('fs');
const path = require('path');

// Critical routes for CSS extraction
const criticalRoutes = [
  { url: '/', name: 'home' },
  { url: '/accounts', name: 'accounts' },
  { url: '/transactions', name: 'transactions' },
  { url: '/analytics', name: 'analytics' },
  { url: '/insights', name: 'insights' },
  { url: '/budget-planner', name: 'budget' },
  { url: '/calculators', name: 'calculators' },
  { url: '/savings', name: 'savings' }
];

const extractCriticalCSS = async () => {
  console.log('🎯 Starting Critical CSS extraction for Vueni...');
  
  const baseUrl = 'http://localhost:5000';
  const distPath = path.join(__dirname, '../dist');
  const criticalPath = path.join(distPath, 'critical');
  
  // Create critical CSS directory
  if (!fs.existsSync(criticalPath)) {
    fs.mkdirSync(criticalPath, { recursive: true });
  }

  const criticalMap = {};

  try {
    for (const route of criticalRoutes) {
      console.log(`📱 Extracting critical CSS for ${route.name} (${route.url})`);
      
      const result = await critical.generate({
        base: distPath,
        src: `${baseUrl}${route.url}`,
        target: {
          css: `critical/${route.name}.css`,
          html: `${route.name}.html`,
          uncritical: `critical/${route.name}-uncritical.css`
        },
        width: 375,   // Mobile first
        height: 812,  // iPhone X viewport
        dimensions: [
          { width: 375, height: 812 },   // Mobile
          { width: 768, height: 1024 },  // Tablet
          { width: 1440, height: 900 }   // Desktop
        ],
        penthouse: {
          timeout: 30000,
          pageLoadSkipTimeout: 10000,
          renderWaitTime: 2000,
          blockJSRequests: false,
          puppeteer: {
            getBrowser: undefined
          }
        },
        ignore: {
          atrule: ['@font-face'],
          rule: [/\.sr-only/],
          decl: (node, value) => {
            // Ignore dark mode only rules since we're dark-mode only
            return false;
          }
        },
        minify: true,
        extract: true,
        inlineImages: false,
        maxImageFileSize: 10240, // 10KB
        includeBase64: false,
        assetPaths: ['dist/assets'],
        pathPrefix: '/assets/'
      });

      // Store critical CSS info
      criticalMap[route.name] = {
        url: route.url,
        criticalCSS: `critical/${route.name}.css`,
        uncriticalCSS: `critical/${route.name}-uncritical.css`,
        size: result.css ? result.css.length : 0
      };

      console.log(`✅ ${route.name}: ${criticalMap[route.name].size} bytes critical CSS`);
    }

    // Generate critical CSS map
    const mapPath = path.join(criticalPath, 'crit-map.json');
    fs.writeFileSync(mapPath, JSON.stringify(criticalMap, null, 2));
    
    console.log('📊 Critical CSS extraction complete!');
    console.log(`📁 Files saved to: ${criticalPath}`);
    console.log(`🗺️  Route mapping: ${mapPath}`);

    // Generate performance summary
    const totalCritical = Object.values(criticalMap).reduce((sum, route) => sum + route.size, 0);
    console.log(`📈 Total critical CSS: ${(totalCritical / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Critical CSS extraction failed:', error);
    process.exit(1);
  }
};

// Self-executing async function
(async () => {
  try {
    await extractCriticalCSS();
  } catch (error) {
    console.error('Critical CSS extraction error:', error);
    process.exit(1);
  }
})(); 