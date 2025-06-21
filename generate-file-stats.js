#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 File Classification Statistics Generator');
console.log('==========================================\n');

// Read the analysis files
let depGraph, bundleAnalysis, bundledFiles, dynamicFiles, testFiles;

try {
    depGraph = JSON.parse(fs.readFileSync('dep-graph.json', 'utf8'));
    bundleAnalysis = JSON.parse(fs.readFileSync('bundle-analysis.json', 'utf8'));
    bundledFiles = fs.readFileSync('bundled-files.txt', 'utf8').split('\n').filter(f => f.trim());
    dynamicFiles = fs.readFileSync('dynamic-files.txt', 'utf8').split('\n').filter(f => f.trim());
    testFiles = fs.readFileSync('test-files.txt', 'utf8').split('\n').filter(f => f.trim());
} catch (error) {
    console.error('❌ Error reading analysis files:', error.message);
    process.exit(1);
}

// Create file classification maps
const bundledSet = new Set(bundledFiles);
const dynamicSet = new Set(dynamicFiles);
const testSet = new Set(testFiles);

// Analyze dependency graph
const totalNodes = depGraph.nodes.length;
const orphanedNodes = depGraph.nodes.filter(node => node.is_orphaned);
const activeNodes = depGraph.nodes.filter(node => !node.is_orphaned);

console.log('📊 OVERALL STATISTICS');
console.log('=====================');
console.log(`Total files analyzed: ${totalNodes}`);
console.log(`Active files: ${activeNodes.length} (${(activeNodes.length/totalNodes*100).toFixed(1)}%)`);
console.log(`Orphaned files: ${orphanedNodes.length} (${(orphanedNodes.length/totalNodes*100).toFixed(1)}%)`);
console.log('');

// Analyze by file type
const typeStats = {};
depGraph.nodes.forEach(node => {
    const type = node.type || 'unknown';
    if (!typeStats[type]) {
        typeStats[type] = { total: 0, orphaned: 0, active: 0 };
    }
    typeStats[type].total++;
    if (node.is_orphaned) {
        typeStats[type].orphaned++;
    } else {
        typeStats[type].active++;
    }
});

console.log('📁 BREAKDOWN BY FILE TYPE');
console.log('=========================');
Object.entries(typeStats)
    .sort(([,a], [,b]) => b.total - a.total)
    .forEach(([type, stats]) => {
        const orphanedPct = (stats.orphaned / stats.total * 100).toFixed(1);
        console.log(`${type.padEnd(12)}: ${stats.total.toString().padStart(3)} total, ${stats.orphaned.toString().padStart(3)} orphaned (${orphanedPct}%)`);
    });
console.log('');

// Find largest orphaned files by import count (complexity)
console.log('🚨 TOP 15 COMPLEX ORPHANED FILES');
console.log('=================================');
const complexOrphans = orphanedNodes
    .filter(node => node.imports > 0)
    .sort((a, b) => b.imports - a.imports)
    .slice(0, 15);

complexOrphans.forEach((node, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${node.id}`);
    console.log(`    Imports: ${node.imports}, Type: ${node.type}`);
});
console.log('');

// Find zero-dependency orphans (safest to delete)
const safeDeletions = orphanedNodes.filter(node => node.imports === 0 && node.imported_by === 0);
console.log('✅ ZERO-DEPENDENCY ORPHANS (SAFEST TO DELETE)');
console.log('==============================================');
console.log(`Found ${safeDeletions.length} files with no dependencies:`);
safeDeletions.slice(0, 20).forEach((node, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${node.id} (${node.type})`);
});
if (safeDeletions.length > 20) {
    console.log(`... and ${safeDeletions.length - 20} more`);
}
console.log('');

// Bundle analysis
console.log('📦 BUNDLE ANALYSIS');
console.log('==================');
console.log(`Total bundle size: ${(bundleAnalysis.buildStats.totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`JavaScript size: ${(bundleAnalysis.buildStats.jsSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`CSS size: ${(bundleAnalysis.buildStats.cssSize / 1024).toFixed(0)} KB`);
console.log(`Files included in bundle: ${bundleAnalysis.buildStats.filesIncluded}`);
console.log(`Files excluded from bundle: ${bundleAnalysis.buildStats.filesExcluded}`);
console.log(`Number of chunks: ${bundleAnalysis.buildStats.chunks}`);
console.log('');

// Largest bundles
console.log('📊 LARGEST BUNDLE CHUNKS');
console.log('========================');
const sortedBundles = Object.entries(bundleAnalysis.bundles)
    .sort(([,a], [,b]) => b.size - a.size)
    .slice(0, 10);

sortedBundles.forEach(([name, info], i) => {
    const sizeKB = (info.size / 1024).toFixed(0);
    console.log(`${(i+1).toString().padStart(2)}. ${name} - ${sizeKB} KB (${info.type})`);
});
console.log('');

// Cross-reference with bundle analysis
const notInBundle = depGraph.nodes.filter(node => 
    node.id.startsWith('src/') && 
    !bundledSet.has(node.id) && 
    !testSet.has(node.id) &&
    !node.id.includes('.test.') &&
    !node.id.includes('/__tests__/')
);

console.log('❓ FILES NOT IN BUNDLE (POTENTIAL ORPHANS)');
console.log('==========================================');
console.log(`Found ${notInBundle.length} source files not in production bundle:`);
notInBundle.slice(0, 15).forEach((node, i) => {
    const status = node.is_orphaned ? '🔴 ORPHANED' : '🟡 MARKED ACTIVE';
    console.log(`${(i+1).toString().padStart(2)}. ${node.id} - ${status}`);
});
if (notInBundle.length > 15) {
    console.log(`... and ${notInBundle.length - 15} more`);
}
console.log('');

// Dynamic imports analysis
console.log('⚡ DYNAMIC LOADING ANALYSIS');
console.log('============================');
console.log(`Files loaded dynamically: ${dynamicFiles.length}`);
console.log(`Files used by tests: ${testFiles.length}`);
console.log('');

// Generate recommendations
console.log('💡 CLEANUP RECOMMENDATIONS');
console.log('===========================');
console.log(`1. 🎯 High Priority: Delete ${safeDeletions.length} zero-dependency orphaned files`);
console.log(`2. 🔍 Medium Priority: Review ${complexOrphans.length} complex orphaned files`);
console.log(`3. 📋 Low Priority: Audit ${notInBundle.length} files not in production bundle`);
console.log('');

const estimatedSavings = safeDeletions.length * 2; // Estimate 2KB per file
console.log(`💾 Estimated space savings: ~${estimatedSavings}KB from zero-dependency deletions`);
console.log(`🏗️ Build performance: Removing orphaned files will improve build times`);
console.log(`📚 Code maintainability: Cleaner codebase with ${(orphanedNodes.length/totalNodes*100).toFixed(0)}% fewer files`);

console.log('\n✨ Analysis complete! Review the generated file-status.csv for detailed file-by-file analysis.');