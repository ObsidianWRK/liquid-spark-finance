#!/usr/bin/env node

/**
 * Comprehensive Card Hover Effects Audit Script
 * 
 * This script scans the entire Vueni codebase to ensure ALL cards have proper hover effects.
 * It identifies card components by:
 * 1. File naming patterns (Card.tsx, *Card.tsx, etc.)
 * 2. CSS class patterns (bg-white/[0.02], rounded-, border-, etc.)
 * 3. Component naming patterns in JSX
 * 4. UniversalCard and UnifiedCard usage
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SRC_DIR = './src';
const CARD_HOVER_CLASSES = [
  'hover:bg-white',
  'hover:border-white',
  'hover:scale-',
  'transition-all',
  'card-hover',
  'hover:shadow'
];

const CARD_IDENTIFYING_PATTERNS = [
  /bg-white\/\[0\.\d+\]/,
  /border-white\/\[0\.\d+\]/,
  /rounded-\w+/,
  /p-\d+.*rounded/,
  /UniversalCard/,
  /UnifiedCard/,
  /GlassCard/,
  /Card.*className/
];

const CARD_COMPONENT_PATTERNS = [
  '*Card.tsx',
  '**/components/*Card*.tsx',
  '**/ui/*Card*.tsx',
  '**/shared/ui/*.tsx'
];

// Results storage
const auditResults = {
  cardsWithHover: [],
  cardsWithoutHover: [],
  universalCardUsage: [],
  unifiedCardUsage: [],
  customCards: [],
  totalScanned: 0,
  summary: {}
};

/**
 * Check if file content has hover effects
 */
function hasHoverEffects(content, filePath) {
  const hasAnyHover = CARD_HOVER_CLASSES.some(hoverClass => 
    content.includes(hoverClass)
  );
  
  const hasUniversalCard = content.includes('UniversalCard');
  const hasUnifiedCard = content.includes('UnifiedCard');
  
  // If using UniversalCard or UnifiedCard, it automatically has hover effects
  if (hasUniversalCard || hasUnifiedCard) {
    return {
      hasHover: true,
      type: hasUniversalCard ? 'UniversalCard' : 'UnifiedCard',
      reason: 'Uses enhanced card component with built-in hover effects'
    };
  }
  
  if (hasAnyHover) {
    const foundClasses = CARD_HOVER_CLASSES.filter(cls => content.includes(cls));
    return {
      hasHover: true,
      type: 'custom',
      reason: `Has hover classes: ${foundClasses.join(', ')}`
    };
  }
  
  return {
    hasHover: false,
    type: 'none',
    reason: 'No hover effects detected'
  };
}

/**
 * Check if file appears to be a card component
 */
function isCardComponent(content, filePath) {
  const fileName = path.basename(filePath);
  
  // Check filename patterns
  if (fileName.includes('Card') || fileName.includes('card')) {
    return true;
  }
  
  // Check content patterns
  const matchesPattern = CARD_IDENTIFYING_PATTERNS.some(pattern => 
    pattern.test(content)
  );
  
  return matchesPattern;
}

/**
 * Extract component information from file
 */
function analyzeCardComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    
    if (!isCardComponent(content, filePath)) {
      return null;
    }
    
    const hoverAnalysis = hasHoverEffects(content, filePath);
    const componentName = fileName.replace('.tsx', '').replace('.jsx', '');
    
    // Extract any className props for analysis
    const classNameMatches = content.match(/className=["'`][^"'`]*["'`]/g) || [];
    const hasCardLikeClasses = classNameMatches.some(className => 
      CARD_IDENTIFYING_PATTERNS.some(pattern => pattern.test(className))
    );
    
    return {
      filePath: relativePath,
      fileName,
      componentName,
      hasHover: hoverAnalysis.hasHover,
      hoverType: hoverAnalysis.type,
      hoverReason: hoverAnalysis.reason,
      hasCardLikeClasses,
      classNameExamples: classNameMatches.slice(0, 3), // First 3 examples
      linesOfCode: content.split('\n').length
    };
  } catch (error) {
    console.warn(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Scan all TypeScript/React files for card components
 */
function scanForCardComponents() {
  const patterns = [
    `${SRC_DIR}/**/*.tsx`,
    `${SRC_DIR}/**/*.jsx`,
    `${SRC_DIR}/**/*.ts`
  ];
  
  const allFiles = [];
  patterns.forEach(pattern => {
    const files = glob.sync(pattern, { ignore: ['**/node_modules/**', '**/*.test.*', '**/*.spec.*'] });
    allFiles.push(...files);
  });
  
  console.log(`📝 Scanning ${allFiles.length} files for card components...`);
  
  allFiles.forEach(filePath => {
    auditResults.totalScanned++;
    const analysis = analyzeCardComponent(filePath);
    
    if (analysis) {
      if (analysis.hasHover) {
        auditResults.cardsWithHover.push(analysis);
        
        if (analysis.hoverType === 'UniversalCard') {
          auditResults.universalCardUsage.push(analysis);
        } else if (analysis.hoverType === 'UnifiedCard') {
          auditResults.unifiedCardUsage.push(analysis);
        } else {
          auditResults.customCards.push(analysis);
        }
      } else {
        auditResults.cardsWithoutHover.push(analysis);
      }
    }
  });
}

/**
 * Generate recommendations for cards without hover effects
 */
function generateRecommendations() {
  const recommendations = [];
  
  auditResults.cardsWithoutHover.forEach(card => {
    let recommendation = '';
    
    if (card.hasCardLikeClasses) {
      recommendation = `Add hover classes: hover:bg-white/[0.05] hover:border-white/[0.15] hover:scale-[1.02] transition-all duration-300 ease-out`;
    } else {
      recommendation = `Consider converting to UniversalCard or UnifiedCard for consistent hover effects`;
    }
    
    recommendations.push({
      filePath: card.filePath,
      componentName: card.componentName,
      recommendation,
      priority: card.fileName.includes('Card') ? 'HIGH' : 'MEDIUM'
    });
  });
  
  return recommendations;
}

/**
 * Generate comprehensive audit report
 */
function generateReport() {
  const recommendations = generateRecommendations();
  
  auditResults.summary = {
    totalCards: auditResults.cardsWithHover.length + auditResults.cardsWithoutHover.length,
    cardsWithHover: auditResults.cardsWithHover.length,
    cardsWithoutHover: auditResults.cardsWithoutHover.length,
    universalCardUsage: auditResults.universalCardUsage.length,
    unifiedCardUsage: auditResults.unifiedCardUsage.length,
    customCards: auditResults.customCards.length,
    hoverCoverage: ((auditResults.cardsWithHover.length / (auditResults.cardsWithHover.length + auditResults.cardsWithoutHover.length)) * 100).toFixed(1)
  };
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 COMPREHENSIVE CARD HOVER EFFECTS AUDIT REPORT');
  console.log('='.repeat(80));
  
  console.log('\n📊 SUMMARY');
  console.log(`Total files scanned: ${auditResults.totalScanned}`);
  console.log(`Total card components found: ${auditResults.summary.totalCards}`);
  console.log(`Cards WITH hover effects: ${auditResults.summary.cardsWithHover} ✅`);
  console.log(`Cards WITHOUT hover effects: ${auditResults.summary.cardsWithoutHover} ❌`);
  console.log(`Hover effects coverage: ${auditResults.summary.hoverCoverage}%`);
  
  console.log('\n🔧 COMPONENT BREAKDOWN');
  console.log(`UniversalCard usage: ${auditResults.summary.universalCardUsage}`);
  console.log(`UnifiedCard usage: ${auditResults.summary.unifiedCardUsage}`);
  console.log(`Custom cards with hover: ${auditResults.summary.customCards}`);
  
  if (auditResults.cardsWithoutHover.length > 0) {
    console.log('\n❌ CARDS MISSING HOVER EFFECTS');
    auditResults.cardsWithoutHover.forEach((card, index) => {
      console.log(`${index + 1}. ${card.componentName}`);
      console.log(`   📁 ${card.filePath}`);
      console.log(`   💡 ${card.hoverReason}`);
      console.log(`   🎨 Classes: ${card.hasCardLikeClasses ? 'Has card-like classes' : 'No card-like classes detected'}`);
      console.log('');
    });
    
    console.log('\n🛠️  RECOMMENDATIONS');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority}] ${rec.componentName}`);
      console.log(`   📁 ${rec.filePath}`);
      console.log(`   💡 ${rec.recommendation}`);
      console.log('');
    });
  }
  
  if (auditResults.cardsWithHover.length > 0) {
    console.log('\n✅ CARDS WITH PROPER HOVER EFFECTS');
    auditResults.cardsWithHover.slice(0, 10).forEach((card, index) => {
      console.log(`${index + 1}. ${card.componentName} (${card.hoverType})`);
      console.log(`   📁 ${card.filePath}`);
      console.log(`   💡 ${card.hoverReason}`);
      console.log('');
    });
    
    if (auditResults.cardsWithHover.length > 10) {
      console.log(`... and ${auditResults.cardsWithHover.length - 10} more cards with hover effects ✅`);
    }
  }
  
  console.log('\n🎉 SCREENSHOT COMPONENTS STATUS');
  const screenshotComponents = [
    'SmartSavingsPanel',
    'SharedBudgetsPanel', 
    'AdvisorChatPanel',
    'SafeToSpendCard',
    'AgeOfMoneyCard',
    'BiometricMonitorCard',
    'WidgetsPanel',
    'LinkedAccountsCard'
  ];
  
  screenshotComponents.forEach(compName => {
    const found = auditResults.cardsWithHover.find(card => 
      card.componentName.includes(compName) || card.filePath.includes(compName)
    );
    console.log(`${found ? '✅' : '❌'} ${compName}: ${found ? 'HAS HOVER EFFECTS' : 'NEEDS ATTENTION'}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('🚀 AUDIT COMPLETE - ALL COMPONENTS ANALYZED');
  console.log('='.repeat(80));
  
  // Save detailed results to file
  const outputPath = 'card-hover-audit-results.json';
  fs.writeFileSync(outputPath, JSON.stringify(auditResults, null, 2));
  console.log(`\n📄 Detailed results saved to: ${outputPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting comprehensive card hover effects audit...\n');
  
  try {
    scanForCardComponents();
    generateReport();
    
    // Exit with error code if cards are missing hover effects
    if (auditResults.cardsWithoutHover.length > 0) {
      console.log(`\n⚠️  Warning: ${auditResults.cardsWithoutHover.length} cards need hover effects!`);
      process.exit(0); // Don't fail the build, just warn
    } else {
      console.log('\n🎉 Success: All card components have proper hover effects!');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Run the audit
main(); 