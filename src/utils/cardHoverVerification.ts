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
      '.hover\\:bg-white\\/\\[0\\.03\\]',
    ];

    problematicSelectors.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, idx) => {
          const hasStandardClass =
            el.classList.contains('card-hover') ||
            el.classList.contains('card-hover-subtle') ||
            el.classList.contains('card-hover-enhanced');

          if (!hasStandardClass) {
            conflicts.push({
              element: `${selector}[${idx}]`,
              issue: 'Non-standard hover effect without standardized class',
              severity: 'high',
              recommendation:
                'Add appropriate card-hover class and remove inline styles',
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
    const cardElements = document.querySelectorAll(
      '.card-hover, .card-hover-subtle, .card-hover-enhanced'
    );
    cardElements.forEach((el, idx) => {
      const computedStyle = window.getComputedStyle(el);

      if (computedStyle.willChange === 'auto') {
        performanceIssues.push(
          `Card element ${idx} missing will-change optimization`
        );
      }

      if (computedStyle.contain === 'none') {
        performanceIssues.push(`Card element ${idx} missing CSS containment`);
      }
    });

    // Check for excessive number of animated elements
    if (cardElements.length > 50) {
      performanceIssues.push(
        `High number of animated cards (${cardElements.length}) may impact performance`
      );
    }
  };

  // Check for accessibility compliance
  const checkAccessibilityCompliance = () => {
    // Check for reduced motion support
    const hasReducedMotionSupport = Array.from(document.styleSheets).some(
      (sheet) => {
        try {
          return Array.from(sheet.cssRules).some((rule) =>
            rule.cssText.includes('prefers-reduced-motion: reduce')
          );
        } catch (e) {
          return false;
        }
      }
    );

    if (!hasReducedMotionSupport) {
      accessibilityIssues.push(
        'Missing reduced motion support for accessibility'
      );
    }

    // Check for focus indicators
    const cardElements = document.querySelectorAll(
      '.card-hover, .card-hover-subtle, .card-hover-enhanced'
    );
    cardElements.forEach((el, idx) => {
      const computedStyle = window.getComputedStyle(el);
      if (!el.matches(':focus-visible') && computedStyle.outline === 'none') {
        // This is a potential issue but not immediately visible
      }
    });

    // Check for interactive elements without proper ARIA
    const interactiveCards = document.querySelectorAll(
      '[onclick], [role="button"]'
    );
    interactiveCards.forEach((el, idx) => {
      if (
        !el.hasAttribute('aria-label') &&
        !el.hasAttribute('aria-labelledby') &&
        !el.textContent?.trim()
      ) {
        accessibilityIssues.push(
          `Interactive card ${idx} missing accessible label`
        );
      }
    });
  };

  // Run all checks
  checkSpecificityConflicts();
  checkPerformanceIssues();
  checkAccessibilityCompliance();

  // Calculate performance score
  const performanceScore = Math.max(0, 100 - performanceIssues.length * 10);

  const result: HoverConflictCheck = {
    hasConflicts: conflicts.length > 0,
    conflicts,
    performance: {
      score: performanceScore,
      issues: performanceIssues,
    },
    accessibility: {
      compliant: accessibilityIssues.length === 0,
      issues: accessibilityIssues,
    },
  };

  console.info('[UICard-Refactor] Verification Results:', {
    conflicts: conflicts.length,
    performanceScore,
    accessibilityCompliant: result.accessibility.compliant,
  });

  if (conflicts.length > 0) {
    console.warn('[UICard-Refactor] Found conflicts:', conflicts);
  }

  if (performanceIssues.length > 0) {
    console.warn('[UICard-Refactor] Performance issues:', performanceIssues);
  }

  if (accessibilityIssues.length > 0) {
    console.warn(
      '[UICard-Refactor] Accessibility issues:',
      accessibilityIssues
    );
  }

  return result;
};

// CSS conflict resolution utilities
export const resolveHoverConflicts = () => {
  console.info(
    '[UICard-Refactor] Attempting to resolve hover conflicts automatically...'
  );

  // Find elements with conflicting styles and add standardized classes
  const conflictingElements = document.querySelectorAll(`
    [class*="hover:scale-105"],
    [class*="hover:scale-[1.01]"],
    [class*="hover:scale-[1.025]"],
    [class*="hover:bg-white"][class*="hover:border-white"]
  `);

  let resolved = 0;
  conflictingElements.forEach((el) => {
    // Determine appropriate hover class based on existing styles
    const classes = el.className;

    if (
      classes.includes('hover:scale-105') ||
      classes.includes('hover:scale-[1.025]')
    ) {
      el.classList.add('card-hover-enhanced');
      resolved++;
    } else if (classes.includes('hover:scale-[1.01]')) {
      el.classList.add('card-hover-subtle');
      resolved++;
    } else if (
      classes.includes('hover:scale-[1.02]') ||
      classes.includes('hover:bg-white')
    ) {
      el.classList.add('card-hover');
      resolved++;
    }
  });

  console.info(
    `[UICard-Refactor] Resolved ${resolved} conflicting hover effects`
  );
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
    console.info(
      `[UICard-Refactor] Hover performance: ${hoverCount} hovers, avg ${(totalHoverTime / hoverCount).toFixed(2)}ms`
    );
  }, 10000);
};

// Export for development mode
if (process.env.NODE_ENV === 'development') {
  (window as any).verifyCardHoverStandardization =
    verifyCardHoverStandardization;
  (window as any).resolveHoverConflicts = resolveHoverConflicts;
  (window as any).monitorHoverPerformance = monitorHoverPerformance;
}

/**
 * Card Hover Effects Standardization
 * Ensures all cards throughout the Vueni application have consistent hover effects
 */

// Standard hover effect classes used throughout Vueni
export const VUENI_CARD_HOVER_CLASSES = {
  // The standard hover class already used in LinkedAccountsCard and other components
  subtle: 'card-hover-subtle',
  
  // Enhanced hover for interactive elements
  enhanced: 'hover:bg-white/[0.05] hover:border-white/[0.15] hover:scale-[1.02] transition-all duration-300 ease-out',
  
  // Action hover for clickable cards
  action: 'hover:bg-white/[0.08] hover:border-white/[0.25] hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 ease-out cursor-pointer',
  
  // Glow effect for special cards
  glow: 'hover:bg-white/[0.06] hover:border-blue-400/[0.30] hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-400 ease-out',
  
  // Minimal for widgets
  minimal: 'hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200 ease-out'
} as const;

// Components that need hover effects based on the screenshot
export const SCREENSHOT_COMPONENTS = [
  'SmartAutomatedSavings',
  'SharedBudgets', 
  'AskAnAdvisor',
  'SafeToSpend',
  'HomeScreenWidgets',
  'AgeOfMoney',
  'BiometricMonitor'
] as const;

// All card components throughout the application that should have hover effects
export const ALL_CARD_COMPONENTS = [
  // Dashboard cards (from screenshot)
  'SmartAutomatedSavings',
  'SharedBudgets',
  'AskAnAdvisor', 
  'SafeToSpend',
  'HomeScreenWidgets',
  'AgeOfMoney',
  'BiometricMonitor',
  'LinkedAccountsCard',
  
  // Account cards
  'AccountCard',
  'AccountOverviewCard',
  'AccountSummaryCard',
  'CompactAccountCard',
  
  // Transaction cards
  'TransactionCard',
  'TransactionListItem',
  'TransactionSummaryCard',
  
  // Budget & Goals cards
  'BudgetCard',
  'BudgetCategoryCard',
  'SavingsGoalCard',
  'GoalProgressCard',
  
  // Credit & Investment cards
  'CreditScoreCard',
  'CreditMetricCard', 
  'InvestmentCard',
  'PortfolioCard',
  
  // Insights & Analytics cards
  'InsightsCard',
  'MetricCard',
  'AnalyticsCard',
  'TrendCard',
  
  // Health & Wellness cards
  'HealthCard',
  'WellnessCard',
  'BiometricCard',
  'EcoCard',
  
  // UI framework cards
  'UniversalCard',
  'UnifiedCard',
  'GlassCard',
  'EnhancedGlassCard',
  
  // Widget cards
  'WidgetCard',
  'CompactWidget',
  'DashboardWidget',
  
  // Feature-specific cards
  'CalculatorCard',
  'PlannerCard',
  'ReportCard',
  'ProfileCard',
  'SettingsCard',
  'NotificationCard'
] as const;

// Check if element has proper hover effects
export function hasProperHoverEffects(className: string): boolean {
  const requiredPatterns = [
    /hover:bg-/, // Background hover
    /hover:border-/, // Border hover  
    /transition/, // Smooth transitions
  ];
  
  return requiredPatterns.every(pattern => pattern.test(className));
}

// Get standardized hover classes for different card types
export function getStandardHoverClasses(cardType: 'dashboard' | 'widget' | 'action' | 'feature' = 'dashboard'): string {
  switch (cardType) {
    case 'dashboard':
      return VUENI_CARD_HOVER_CLASSES.enhanced;
    case 'widget':
      return VUENI_CARD_HOVER_CLASSES.minimal;
    case 'action':
      return VUENI_CARD_HOVER_CLASSES.action;
    case 'feature':
      return VUENI_CARD_HOVER_CLASSES.glow;
    default:
      return VUENI_CARD_HOVER_CLASSES.subtle;
  }
}

// Apply standard hover effects to a card component
export function standardizeCardHoverClasses(
  currentClasses: string,
  cardType: 'dashboard' | 'widget' | 'action' | 'feature' = 'dashboard'
): string {
  // Remove existing hover classes
  const baseClasses = currentClasses
    .replace(/hover:[\w-\[\]\/\.]+/g, '')
    .replace(/transition[\w-\[\]\/\.]*(\s+duration[\w-\[\]\/\.]*)?(\s+ease[\w-\[\]\/\.]*)?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
    
  // Add standard hover classes
  const hoverClasses = getStandardHoverClasses(cardType);
  
  return `${baseClasses} ${hoverClasses}`.replace(/\s+/g, ' ').trim();
}

export default {
  VUENI_CARD_HOVER_CLASSES,
  SCREENSHOT_COMPONENTS,
  ALL_CARD_COMPONENTS,
  hasProperHoverEffects,
  getStandardHoverClasses,
  standardizeCardHoverClasses
};
