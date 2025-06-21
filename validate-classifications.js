#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Validating File Classifications');
console.log('===================================\n');

// Read our classifications
const csv = fs.readFileSync('file-status.csv', 'utf8');
const lines = csv.split('\n').slice(1); // Skip header

// Parse CSV
const files = lines.filter(line => line.trim()).map(line => {
    const [path, status, reason, size, imports, imported_by] = line.split(',');
    return {
        path: path,
        status: status,
        reason: reason.replace(/"/g, ''),
        size: parseInt(size) || 0,
        imports: parseInt(imports) || 0,
        imported_by: parseInt(imported_by) || 0
    };
});

// Validation checks
console.log('🔍 VALIDATION CHECKS');
console.log('====================\n');

// 1. Config files should be ACTIVE
const configFiles = files.filter(f => 
    f.path.includes('.config.') || 
    f.path.includes('eslint.') ||
    f.path.includes('playwright.') ||
    f.path.includes('postcss.')
);

console.log('1. Config File Validation:');
configFiles.forEach(f => {
    const shouldBeActive = !f.path.includes('accessibility-audit') && !f.path.includes('bundle-analyzer');
    if (shouldBeActive && f.status === 'ORPHANED') {
        console.log(`   ⚠️  ${f.path} - Config file marked as ORPHANED (should be ACTIVE)`);
    } else if (f.status === 'ACTIVE') {
        console.log(`   ✅ ${f.path} - Correctly marked as ACTIVE`);
    }
});
console.log('');

// 2. Test files should be ACTIVE
const testFiles = files.filter(f => 
    f.path.includes('.test.') || 
    f.path.includes('/__tests__/') ||
    f.path.includes('/test/') ||
    f.path.includes('.spec.')
);

console.log('2. Test File Validation:');
const orphanedTests = testFiles.filter(f => f.status === 'ORPHANED');
if (orphanedTests.length > 0) {
    orphanedTests.forEach(f => {
        console.log(`   ⚠️  ${f.path} - Test file marked as ORPHANED`);
    });
} else {
    console.log(`   ✅ All ${testFiles.length} test files correctly marked as ACTIVE`);
}
console.log('');

// 3. Files with dependencies marked as orphaned
console.log('3. Dependency Validation:');
const suspiciousOrphans = files.filter(f => 
    f.status === 'ORPHANED' && 
    (f.imports > 0 || f.imported_by > 0)
);

if (suspiciousOrphans.length > 0) {
    console.log(`   ⚠️  Found ${suspiciousOrphans.length} orphaned files with dependencies:`);
    suspiciousOrphans.slice(0, 10).forEach(f => {
        console.log(`      ${f.path} - imports: ${f.imports}, imported_by: ${f.imported_by}`);
    });
    if (suspiciousOrphans.length > 10) {
        console.log(`      ... and ${suspiciousOrphans.length - 10} more`);
    }
} else {
    console.log('   ✅ All orphaned files have zero dependencies');
}
console.log('');

// 4. Entry points should be ACTIVE
const entryPoints = files.filter(f => 
    f.path === 'src/App.tsx' || 
    f.path === 'src/main.tsx' ||
    f.path.includes('index.tsx')
);

console.log('4. Entry Point Validation:');
const orphanedEntries = entryPoints.filter(f => f.status === 'ORPHANED');
if (orphanedEntries.length > 0) {
    orphanedEntries.forEach(f => {
        console.log(`   ⚠️  ${f.path} - Entry point marked as ORPHANED`);
    });
} else {
    console.log(`   ✅ All entry points correctly classified`);
}
console.log('');

// 5. Summary statistics
const totalFiles = files.length;
const activeFiles = files.filter(f => f.status === 'ACTIVE').length;
const orphanedFiles = files.filter(f => f.status === 'ORPHANED').length;
const uncertainFiles = files.filter(f => f.status === 'UNCERTAIN').length;

console.log('📊 CLASSIFICATION SUMMARY');
console.log('=========================');
console.log(`Total files classified: ${totalFiles}`);
console.log(`ACTIVE: ${activeFiles} (${(activeFiles/totalFiles*100).toFixed(1)}%)`);
console.log(`ORPHANED: ${orphanedFiles} (${(orphanedFiles/totalFiles*100).toFixed(1)}%)`);
console.log(`UNCERTAIN: ${uncertainFiles} (${(uncertainFiles/totalFiles*100).toFixed(1)}%)`);
console.log('');

// 6. Size analysis
const activeSizeKB = files.filter(f => f.status === 'ACTIVE').reduce((sum, f) => sum + f.size, 0) / 1024;
const orphanedSizeKB = files.filter(f => f.status === 'ORPHANED').reduce((sum, f) => sum + f.size, 0) / 1024;

console.log('💾 SIZE ANALYSIS');
console.log('================');
console.log(`Active files: ${activeSizeKB.toFixed(0)} KB`);
console.log(`Orphaned files: ${orphanedSizeKB.toFixed(0)} KB`);
console.log(`Potential savings: ${orphanedSizeKB.toFixed(0)} KB (${(orphanedSizeKB/(activeSizeKB+orphanedSizeKB)*100).toFixed(1)}%)`);
console.log('');

// 7. Safety recommendations
console.log('🛡️  SAFETY RECOMMENDATIONS');
console.log('===========================');

const zeroDependencyOrphans = files.filter(f => 
    f.status === 'ORPHANED' && 
    f.imports === 0 && 
    f.imported_by === 0 &&
    !f.path.includes('.config.') &&
    !f.path.includes('eslint.') &&
    !f.path.includes('playwright.') &&
    !f.path.includes('postcss.')
);

console.log(`✅ ${zeroDependencyOrphans.length} files are completely safe to delete (zero dependencies)`);
console.log(`⚠️  ${suspiciousOrphans.length} orphaned files have dependencies - review carefully`);
console.log(`🔧 ${configFiles.filter(f => f.status === 'ORPHANED').length} config files marked orphaned - DO NOT DELETE`);

const largestOrphans = files
    .filter(f => f.status === 'ORPHANED')
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

console.log('\n🎯 TOP 10 LARGEST ORPHANED FILES (Highest Impact):');
largestOrphans.forEach((f, i) => {
    const sizeKB = (f.size / 1024).toFixed(1);
    console.log(`${(i+1).toString().padStart(2)}. ${f.path} - ${sizeKB} KB`);
});

console.log('\n✨ Validation complete! Check warnings above before proceeding with deletions.');