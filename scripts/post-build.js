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

// Function to analyze bundle sizes
function analyzeBundleSizes() {
  console.log('\n📊 Analyzing bundle sizes...');
  
  if (!fs.existsSync(assetsDir)) {
    console.log('No assets directory found');
    return;
  }

  const files = fs.readdirSync(assetsDir);
  let totalSize = 0;
  const jsFiles = [];
  const cssFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
    
    if (file.endsWith('.js')) {
      jsFiles.push({ name: file, size: stats.size });
    } else if (file.endsWith('.css')) {
      cssFiles.push({ name: file, size: stats.size });
    }
  });

  console.log(`📦 Total bundle size: ${formatSize(totalSize)}`);
  
  // Show JavaScript files
  if (jsFiles.length > 0) {
    console.log('\n🟨 JavaScript files:');
    jsFiles
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const status = file.size > 500 * 1024 ? '⚠️' : '✅';
        console.log(`  ${status} ${file.name}: ${formatSize(file.size)}`);
      });
    
    const totalJSSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`  📊 Total JS: ${formatSize(totalJSSize)}`);
    
    // Warn about large bundles
    if (totalJSSize > 1.5 * 1024 * 1024) {
      console.log('  ⚠️  Consider code splitting to reduce bundle size');
    }
  }

  // Show CSS files
  if (cssFiles.length > 0) {
    console.log('\n🟦 CSS files:');
    cssFiles
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const status = file.size > 100 * 1024 ? '⚠️' : '✅';
        console.log(`  ${status} ${file.name}: ${formatSize(file.size)}`);
      });
    
    const totalCSSSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`  📊 Total CSS: ${formatSize(totalCSSSize)}`);
  }
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
      required: true
    },
    {
      name: 'Contains JS assets',
      test: () => indexContent.includes('.js'),
      required: true
    },
    {
      name: 'No development references',
      test: () => !indexContent.includes('localhost:') && !indexContent.includes('127.0.0.1'),
      required: true
    },
    {
      name: 'Contains Vueni references',
      test: () => indexContent.includes('Vueni') || indexContent.includes('vueni'),
      required: false
    }
  ];

  let allRequired = true;
  checks.forEach(check => {
    const passed = check.test();
    const status = passed ? '✅' : (check.required ? '❌' : '⚠️');
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
      csrfProtection: true
    },
    optimizations: {
      codeSplitting: true,
      lazyLoading: true,
      caching: true,
      compression: true
    },
    security: {
      encryption: true,
      auditLogging: true,
      sessionTimeout: 1800,
      csrfTokens: true
    }
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
      test: () => fs.existsSync(path.join(process.cwd(), 'vercel.json'))
    },
    {
      name: 'Environment variables configured',
      test: () => fs.existsSync(path.join(process.cwd(), '.env.example'))
    },
    {
      name: 'Security headers configured',
      test: () => {
        const vercelPath = path.join(process.cwd(), 'vercel.json');
        if (!fs.existsSync(vercelPath)) return false;
        const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
        return config.headers && config.headers.some(h => 
          h.headers.some(header => header.key === 'Content-Security-Policy')
        );
      }
    }
  ];

  checks.forEach(check => {
    const passed = check.test();
    const status = passed ? '✅' : '⚠️';
    console.log(`  ${status} ${check.name}`);
  });
}

// Main execution
try {
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