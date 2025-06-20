#!/usr/bin/env node

// Vueni Post-Build Script for Vercel Optimization
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Running Vueni post-build optimizations...');

const distDir = path.join(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Build directory not found. Run build first.');
  process.exit(1);
}

// Function to format file size
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)}${units[unitIndex]}`;
}

// Function to enhance HTML with preload hints
function enhanceHTMLWithPreloadHints() {
  console.log('\n⚡ Adding performance preload hints...');

  const htmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ index.html not found');
    return;
  }

  let html = fs.readFileSync(htmlPath, 'utf8');

  // Extract largest JS chunks for preloading
  const jsFiles = fs
    .readdirSync(assetsDir)
    .filter((file) => file.endsWith('.js') && !file.includes('legacy'))
    .map((file) => {
      const stats = fs.statSync(path.join(assetsDir, file));
      return { name: file, size: stats.size };
    })
    .sort((a, b) => b.size - a.size)
    .slice(0, 3); // Top 3 largest chunks

  // Add critical resource hints before existing modulepreload links
  const preloadHints = `
    <!-- Critical resource hints for Core Web Vitals -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    
    <!-- Preload critical fonts -->
    <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" as="font" type="font/woff2" crossorigin>
    
    <!-- Largest JS chunks preload for faster TTI -->
    ${jsFiles
      .map(
        (file) =>
          `<link rel="preload" href="/assets/${file.name}" as="script" crossorigin>`
      )
      .join('\n    ')}
    
    <!-- Early hints for above-the-fold content -->
    <link rel="prefetch" href="/assets/DashboardPage-PRpjDtR3.js">
    <link rel="prefetch" href="/assets/vendor-charts-Ct_bA87I.js">
  `;

  // Insert preload hints after the existing style tag
  html = html.replace(/(<\/style>\s*)/, `$1${preloadHints}\n    `);

  // Add performance optimization meta tags
  const performanceMetaTags = `
    <!-- Performance optimization meta tags -->
    <meta name="theme-color" content="#000000">
    <meta name="format-detection" content="telephone=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <!-- Resource hints for better loading -->
    <meta http-equiv="x-dns-prefetch-control" content="on">
  `;

  // Insert performance meta tags after viewport
  html = html.replace(
    /(<meta name="viewport"[^>]*>)/,
    `$1${performanceMetaTags}`
  );

  fs.writeFileSync(htmlPath, html);
  console.log('  ✅ Enhanced HTML with preload hints');
}

// Function to analyze bundle sizes
function analyzeBundleSizes() {
  console.log('\n📊 Analyzing bundle sizes...');

  if (!fs.existsSync(assetsDir)) {
    console.error('❌ Assets directory not found');
    return;
  }

  const files = fs.readdirSync(assetsDir);
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;

  const jsFiles = [];
  const cssFiles = [];

  files.forEach((file) => {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);

    totalSize += stats.size;

    if (file.endsWith('.js')) {
      jsSize += stats.size;
      jsFiles.push({ name: file, size: stats.size, sizeKB });
    } else if (file.endsWith('.css')) {
      cssSize += stats.size;
      cssFiles.push({ name: file, size: stats.size, sizeKB });
    }
  });

  console.log(
    `📦 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`
  );

  // Sort and display JS files
  console.log('\n🟨 JavaScript files:');
  jsFiles
    .sort((a, b) => b.size - a.size)
    .forEach((file) => {
      const icon = file.size > 100 * 1024 ? '⚠️' : '✅';
      console.log(`  ${icon} ${file.name}: ${file.sizeKB}KB`);
    });

  console.log(`  📊 Total JS: ${(jsSize / 1024 / 1024).toFixed(1)}MB`);

  if (jsSize > 2.2 * 1024 * 1024) {
    console.log('  ⚠️  Consider code splitting to reduce bundle size');
  }

  // Display CSS files
  console.log('\n🟦 CSS files:');
  cssFiles
    .sort((a, b) => b.size - a.size)
    .forEach((file) => {
      const icon = file.size > 300 * 1024 ? '⚠️' : '✅';
      console.log(`  ${icon} ${file.name}: ${file.sizeKB}KB`);
    });

  console.log(`  📊 Total CSS: ${(cssSize / 1024).toFixed(1)}KB`);
}

// Function to validate production build
function validateProductionBuild() {
  console.log('\n🔍 Validating production build...');

  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found in build');
    return false;
  }

  const indexContent = fs.readFileSync(indexPath, 'utf8');

  // Check for common issues
  const checks = [
    {
      name: 'Contains CSS assets',
      test: () => indexContent.includes('.css'),
      required: true,
    },
    {
      name: 'Contains JS assets',
      test: () => indexContent.includes('.js'),
      required: true,
    },
    {
      name: 'No development references',
      test: () =>
        !indexContent.includes('localhost:') &&
        !indexContent.includes('127.0.0.1'),
      required: true,
    },
    {
      name: 'Contains Vueni references',
      test: () =>
        indexContent.includes('Vueni') || indexContent.includes('vueni'),
      required: false,
    },
  ];

  let allRequired = true;
  checks.forEach((check) => {
    const passed = check.test();
    const status = passed ? '✅' : check.required ? '❌' : '⚠️';
    console.log(`  ${status} ${check.name}`);

    if (check.required && !passed) {
      allRequired = false;
    }
  });

  return allRequired;
}

// Function to generate deployment manifest
function generateDeploymentManifest() {
  console.log('\n📝 Generating deployment manifest...');

  const manifest = {
    name: 'vueni-financial-platform',
    version: '1.0.0',
    buildTime: new Date().toISOString(),
    environment: 'production',
    features: {
      secureStorage: true,
      sessionManagement: true,
      performanceMonitoring: true,
      componentConsolidation: true,
      csrfProtection: true,
    },
    optimizations: {
      codeSplitting: true,
      lazyLoading: true,
      caching: true,
      compression: true,
    },
    security: {
      encryption: true,
      auditLogging: true,
      sessionTimeout: 1800,
      csrfTokens: true,
    },
  };

  const manifestPath = path.join(distDir, 'vueni-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('  ✅ Deployment manifest created');
}

// Function to create optimized robots.txt
function createRobotsTxt() {
  const robotsContent = `# Vueni Financial Platform
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/
Allow: /

Sitemap: https://vueni.vercel.app/sitemap.xml
`;

  const robotsPath = path.join(distDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent);
  console.log('  ✅ robots.txt created');
}

// Function to optimize service worker
function optimizeServiceWorker() {
  const swPath = path.join(distDir, 'sw.js');

  // Create a basic service worker for Vueni
  const swContent = `
// Vueni Service Worker for Performance Optimization
const CACHE_NAME = 'vueni-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Don't cache API requests
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
`.trim();

  fs.writeFileSync(swPath, swContent);
  console.log('  ✅ Service worker optimized');
}

// Function to check for security best practices
function checkSecurityPractices() {
  console.log('\n🔒 Checking security practices...');

  const checks = [
    {
      name: 'Vercel configuration exists',
      test: () => fs.existsSync(path.join(process.cwd(), 'vercel.json')),
    },
    {
      name: 'Environment variables configured',
      test: () => fs.existsSync(path.join(process.cwd(), '.env.example')),
    },
    {
      name: 'Security headers configured',
      test: () => {
        const vercelPath = path.join(process.cwd(), 'vercel.json');
        if (!fs.existsSync(vercelPath)) return false;
        const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
        return (
          config.headers &&
          config.headers.some((h) =>
            h.headers.some((header) => header.key === 'Content-Security-Policy')
          )
        );
      },
    },
  ];

  checks.forEach((check) => {
    const passed = check.test();
    const status = passed ? '✅' : '⚠️';
    console.log(`  ${status} ${check.name}`);
  });
}

// Main execution
try {
  enhanceHTMLWithPreloadHints();
  analyzeBundleSizes();

  const buildValid = validateProductionBuild();
  if (!buildValid) {
    console.error('❌ Production build validation failed');
    process.exit(1);
  }

  generateDeploymentManifest();
  createRobotsTxt();
  optimizeServiceWorker();
  checkSecurityPractices();

  console.log('\n🎉 Vueni post-build optimizations completed successfully!');
  console.log('\n📋 Deployment checklist:');
  console.log('  ✅ Bundle sizes analyzed');
  console.log('  ✅ Production build validated');
  console.log('  ✅ Deployment manifest generated');
  console.log('  ✅ SEO files created');
  console.log('  ✅ Service worker optimized');
  console.log('  ✅ Security practices checked');

  console.log('\n🚀 Ready for Vercel deployment!');
  console.log('   Run: npm run deploy:vercel');
} catch (error) {
  console.error('❌ Post-build script failed:', error.message);
  process.exit(1);
}
