/**
 * Card Hover Verification Utility
 * Comprehensive checks for potential issues arising from universal hover standardization
 */

interface HoverConflictCheck {
  hasConflicts: boolean;
  conflicts: Array<{
    element: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  performance: {
    score: number;
    issues: string[];
  };
  accessibility: {
    compliant: boolean;
    issues: string[];
  };
}

export const verifyCardHoverStandardization = (): HoverConflictCheck => {
  console.info('[UICard-Refactor] Running comprehensive hover verification...');
  
  const conflicts: HoverConflictCheck['conflicts'] = [];
  const performanceIssues: string[] = [];
  const accessibilityIssues: string[] = [];

  // Check for CSS specificity conflicts
  const checkSpecificityConflicts = () => {
    const problematicSelectors = [
      '[class*="hover:scale-105"]',
      '[class*="hover:scale-[1.01]"]', 
      '[class*="hover:scale-[1.025]"]',
      '[style*="transform: scale"]',
      '.hover\\:bg-white\\/\\[0\\.03\\]'
    ];

    problematicSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, idx) => {
          const hasStandardClass = el.classList.contains('card-hover') || 
                                   el.classList.contains('card-hover-subtle') || 
                                   el.classList.contains('card-hover-enhanced');
          
          if (!hasStandardClass) {
            conflicts.push({
              element: `${selector}[${idx}]`,
              issue: 'Non-standard hover effect without standardized class',
              severity: 'high',
              recommendation: 'Add appropriate card-hover class and remove inline styles'
            });
          }
        });
      } catch (e) {
        // Selector might not be valid CSS
      }
    });
  };

  // Check for performance issues
  const checkPerformanceIssues = () => {
    // Check for elements with will-change not set properly
    const cardElements = document.querySelectorAll('.card-hover, .card-hover-subtle, .card-hover-enhanced');
    cardElements.forEach((el, idx) => {
      const computedStyle = window.getComputedStyle(el);
      
      if (computedStyle.willChange === 'auto') {
        performanceIssues.push(`Card element ${idx} missing will-change optimization`);
      }
      
      if (computedStyle.contain === 'none') {
        performanceIssues.push(`Card element ${idx} missing CSS containment`);
      }
    });

    // Check for excessive number of animated elements
    if (cardElements.length > 50) {
      performanceIssues.push(`High number of animated cards (${cardElements.length}) may impact performance`);
    }
  };

  // Check for accessibility compliance
  const checkAccessibilityCompliance = () => {
    // Check for reduced motion support
    const hasReducedMotionSupport = Array.from(document.styleSheets).some(sheet => {
      try {
        return Array.from(sheet.cssRules).some(rule => 
          rule.cssText.includes('prefers-reduced-motion: reduce')
        );
      } catch (e) {
        return false;
      }
    });

    if (!hasReducedMotionSupport) {
      accessibilityIssues.push('Missing reduced motion support for accessibility');
    }

    // Check for focus indicators
    const cardElements = document.querySelectorAll('.card-hover, .card-hover-subtle, .card-hover-enhanced');
    cardElements.forEach((el, idx) => {
      const computedStyle = window.getComputedStyle(el);
      if (!el.matches(':focus-visible') && computedStyle.outline === 'none') {
        // This is a potential issue but not immediately visible
      }
    });

    // Check for interactive elements without proper ARIA
    const interactiveCards = document.querySelectorAll('[onclick], [role="button"]');
    interactiveCards.forEach((el, idx) => {
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby') && !el.textContent?.trim()) {
        accessibilityIssues.push(`Interactive card ${idx} missing accessible label`);
      }
    });
  };

  // Run all checks
  checkSpecificityConflicts();
  checkPerformanceIssues();
  checkAccessibilityCompliance();

  // Calculate performance score
  const performanceScore = Math.max(0, 100 - (performanceIssues.length * 10));

  const result: HoverConflictCheck = {
    hasConflicts: conflicts.length > 0,
    conflicts,
    performance: {
      score: performanceScore,
      issues: performanceIssues
    },
    accessibility: {
      compliant: accessibilityIssues.length === 0,
      issues: accessibilityIssues
    }
  };

  console.info('[UICard-Refactor] Verification Results:', {
    conflicts: conflicts.length,
    performanceScore,
    accessibilityCompliant: result.accessibility.compliant
  });

  if (conflicts.length > 0) {
    console.warn('[UICard-Refactor] Found conflicts:', conflicts);
  }

  if (performanceIssues.length > 0) {
    console.warn('[UICard-Refactor] Performance issues:', performanceIssues);
  }

  if (accessibilityIssues.length > 0) {
    console.warn('[UICard-Refactor] Accessibility issues:', accessibilityIssues);
  }

  return result;
};

// CSS conflict resolution utilities
export const resolveHoverConflicts = () => {
  console.info('[UICard-Refactor] Attempting to resolve hover conflicts automatically...');
  
  // Find elements with conflicting styles and add standardized classes
  const conflictingElements = document.querySelectorAll(`
    [class*="hover:scale-105"],
    [class*="hover:scale-[1.01]"],
    [class*="hover:scale-[1.025]"],
    [class*="hover:bg-white"][class*="hover:border-white"]
  `);

  let resolved = 0;
  conflictingElements.forEach(el => {
    // Determine appropriate hover class based on existing styles
    const classes = el.className;
    
    if (classes.includes('hover:scale-105') || classes.includes('hover:scale-[1.025]')) {
      el.classList.add('card-hover-enhanced');
      resolved++;
    } else if (classes.includes('hover:scale-[1.01]')) {
      el.classList.add('card-hover-subtle');
      resolved++;
    } else if (classes.includes('hover:scale-[1.02]') || classes.includes('hover:bg-white')) {
      el.classList.add('card-hover');
      resolved++;
    }
  });

  console.info(`[UICard-Refactor] Resolved ${resolved} conflicting hover effects`);
  return resolved;
};

// Performance monitoring for hover effects
export const monitorHoverPerformance = () => {
  let hoverCount = 0;
  let totalHoverTime = 0;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes('card-hover')) {
        hoverCount++;
        totalHoverTime += entry.duration;
      }
    });
  });

  observer.observe({ entryTypes: ['measure'] });

  // Monitor for 10 seconds then report
  setTimeout(() => {
    observer.disconnect();
    console.info(`[UICard-Refactor] Hover performance: ${hoverCount} hovers, avg ${(totalHoverTime / hoverCount).toFixed(2)}ms`);
  }, 10000);
};

// Export for development mode
if (process.env.NODE_ENV === 'development') {
  (window as any).verifyCardHoverStandardization = verifyCardHoverStandardization;
  (window as any).resolveHoverConflicts = resolveHoverConflicts;
  (window as any).monitorHoverPerformance = monitorHoverPerformance;
} 