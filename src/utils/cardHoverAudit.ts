/**
 * Card Hover Effects Audit Utility
 * Comprehensive utility to ensure all cards throughout the application have proper hover effects
 */

export interface CardHoverConfig {
  baseClasses: string;
  hoverClasses: string;
  transitionClasses: string;
  description: string;
}

// Standard hover effect configurations for different card types
export const CARD_HOVER_CONFIGS: Record<string, CardHoverConfig> = {
  // Subtle hover for main dashboard cards
  subtle: {
    baseClasses: 'bg-white/[0.02] border-white/[0.08]',
    hoverClasses: 'hover:bg-white/[0.05] hover:border-white/[0.15] hover:scale-[1.02]',
    transitionClasses: 'transition-all duration-300 ease-out',
    description: 'Subtle hover with slight scale and brightness increase'
  },
  
  // Enhanced hover for interactive cards
  enhanced: {
    baseClasses: 'bg-white/[0.02] border-white/[0.08]',
    hoverClasses: 'hover:bg-white/[0.06] hover:border-white/[0.20] hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/10',
    transitionClasses: 'transition-all duration-300 ease-out',
    description: 'Enhanced hover with scale, glow, and shadow effects'
  },
  
  // Minimal hover for compact widgets
  minimal: {
    baseClasses: 'bg-white/[0.02] border-white/[0.08]',
    hoverClasses: 'hover:bg-white/[0.04] hover:border-white/[0.12]',
    transitionClasses: 'transition-all duration-200 ease-out',
    description: 'Minimal hover for small widgets and cards'
  },
  
  // Action hover for clickable cards
  action: {
    baseClasses: 'bg-white/[0.02] border-white/[0.08] cursor-pointer',
    hoverClasses: 'hover:bg-white/[0.08] hover:border-white/[0.25] hover:scale-[1.05] hover:shadow-xl hover:shadow-blue-500/20',
    transitionClasses: 'transition-all duration-300 ease-out',
    description: 'Action hover for cards that navigate or trigger actions'
  },
  
  // Glow hover for special cards
  glow: {
    baseClasses: 'bg-white/[0.02] border-white/[0.08]',
    hoverClasses: 'hover:bg-white/[0.06] hover:border-blue-400/[0.30] hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25',
    transitionClasses: 'transition-all duration-400 ease-out',
    description: 'Glow hover with blue accent for featured cards'
  }
};

// Component patterns that should have hover effects
export const CARD_COMPONENT_PATTERNS = [
  // Dashboard components
  'LinkedAccountsCard',
  'SmartSavingsCard', 
  'SafeToSpendCard',
  'AgeOfMoneyCard',
  'BiometricMonitorCard',
  'SharedBudgetsCard',
  'AdvisorChatCard',
  'HomeScreenWidgetsCard',
  
  // Feature cards
  'AccountCard',
  'TransactionCard', 
  'BudgetCard',
  'SavingsGoalCard',
  'CreditScoreCard',
  'InvestmentCard',
  'InsightsCard',
  'MetricCard',
  'HealthCard',
  'EcoCard',
  'WellnessCard',
  
  // UI components
  'UniversalCard',
  'GlassCard',
  'EnhancedGlassCard',
  'UnifiedCard',
  'CardSkeleton',
  
  // Widget components
  'BalanceWidget',
  'SpendingWidget',
  'GoalsWidget',
  'AlertsWidget',
  
  // More specific patterns
  'ProfileCard',
  'CalculatorCard',
  'ReportCard',
  'AnalyticsCard',
  'NotificationCard'
];

// CSS class patterns that indicate cards without hover effects
export const MISSING_HOVER_PATTERNS = [
  /bg-white\/\[0\.\d+\]/, // Has background opacity
  /border-white\/\[0\.\d+\]/, // Has border opacity  
  /rounded-\w+/, // Has border radius
  /p-\d+/ // Has padding
];

// Generate the complete hover class string
export function generateHoverClasses(type: keyof typeof CARD_HOVER_CONFIGS = 'subtle'): string {
  const config = CARD_HOVER_CONFIGS[type];
  return `${config.baseClasses} ${config.hoverClasses} ${config.transitionClasses}`;
}

// Check if a component has hover effects
export function hasHoverEffects(className: string): boolean {
  return /hover:/.test(className);
}

// Extract hover-related classes
export function extractHoverClasses(className: string): string[] {
  return className.match(/hover:[\w-\[\]\/\.]+/g) || [];
}

// Validate hover effects quality
export function validateHoverEffects(className: string): {
  hasHover: boolean;
  hasTransition: boolean;
  hasScale: boolean;
  hasBrightness: boolean;
  quality: 'none' | 'basic' | 'good' | 'excellent';
} {
  const hasHover = hasHoverEffects(className);
  const hasTransition = /transition/.test(className);
  const hasScale = /hover:scale/.test(className);
  const hasBrightness = /hover:bg-/.test(className) || /hover:border-/.test(className);
  
  let quality: 'none' | 'basic' | 'good' | 'excellent' = 'none';
  
  if (!hasHover) {
    quality = 'none';
  } else if (hasHover && !hasTransition) {
    quality = 'basic';
  } else if (hasHover && hasTransition && (hasScale || hasBrightness)) {
    quality = 'good';
  } else if (hasHover && hasTransition && hasScale && hasBrightness) {
    quality = 'excellent';
  }
  
  return {
    hasHover,
    hasTransition,
    hasScale,
    hasBrightness,
    quality
  };
}

// Specific card hover mappings based on the screenshot components
export const SPECIFIC_CARD_HOVERS = {
  'SmartAutomatedSavings': {
    selector: '[data-component="smart-savings-card"]',
    hoverType: 'enhanced' as const,
    priority: 'high'
  },
  'SharedBudgets': {
    selector: '[data-component="shared-budgets-card"]', 
    hoverType: 'action' as const,
    priority: 'high'
  },
  'AskAdvisor': {
    selector: '[data-component="advisor-chat-card"]',
    hoverType: 'glow' as const,
    priority: 'high'
  },
  'SafeToSpend': {
    selector: '[data-component="safe-to-spend-card"]',
    hoverType: 'subtle' as const,
    priority: 'medium'
  },
  'HomeScreenWidgets': {
    selector: '[data-component="home-widgets-card"]',
    hoverType: 'minimal' as const,
    priority: 'medium'
  },
  'AgeOfMoney': {
    selector: '[data-component="age-of-money-card"]',
    hoverType: 'enhanced' as const,
    priority: 'high'
  },
  'BiometricMonitor': {
    selector: '[data-component="biometric-monitor-card"]',
    hoverType: 'glow' as const,
    priority: 'high'
  }
};

// Generate audit report
export function generateHoverAuditReport(components: Array<{name: string, className: string}>): string {
  let report = "# Card Hover Effects Audit Report\n\n";
  
  const results = components.map(comp => ({
    ...comp,
    validation: validateHoverEffects(comp.className)
  }));
  
  const byQuality = results.reduce((acc, comp) => {
    acc[comp.validation.quality] = (acc[comp.validation.quality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  report += "## Summary\n";
  report += `- Total components: ${results.length}\n`;
  report += `- Excellent hover: ${byQuality.excellent || 0}\n`;
  report += `- Good hover: ${byQuality.good || 0}\n`;
  report += `- Basic hover: ${byQuality.basic || 0}\n`;
  report += `- No hover: ${byQuality.none || 0}\n\n`;
  
  report += "## Components Needing Hover Effects\n";
  results.filter(r => r.validation.quality === 'none' || r.validation.quality === 'basic')
    .forEach(comp => {
      report += `- **${comp.name}**: ${comp.validation.quality} (${comp.className})\n`;
    });
  
  return report;
}

// Utility to apply hover effects to a card
export function applyCardHover(
  baseClassName: string, 
  hoverType: keyof typeof CARD_HOVER_CONFIGS = 'subtle'
): string {
  const config = CARD_HOVER_CONFIGS[hoverType];
  
  // Remove existing hover classes
  const cleanedBase = baseClassName.replace(/hover:[\w-\[\]\/\.]+/g, '').trim();
  
  // Apply new hover configuration
  return `${cleanedBase} ${config.hoverClasses} ${config.transitionClasses}`.replace(/\s+/g, ' ').trim();
}

export default {
  CARD_HOVER_CONFIGS,
  CARD_COMPONENT_PATTERNS,
  SPECIFIC_CARD_HOVERS,
  generateHoverClasses,
  hasHoverEffects,
  validateHoverEffects,
  generateHoverAuditReport,
  applyCardHover
};
