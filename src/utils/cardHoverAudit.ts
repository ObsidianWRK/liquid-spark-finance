/**
 * Card Hover Audit Utility
 * Helps verify that standardized card hover effects are being applied correctly
 */

interface CardHoverAuditResult {
  standardizedCards: string[];
  nonStandardCards: string[];
  totalCards: number;
  compliancePercentage: number;
}

export const auditCardHoverEffects = (): CardHoverAuditResult => {
  console.info('[UICard-Refactor] Starting card hover effects audit...');

  // Find all elements with card hover classes
  const standardCardHover = document.querySelectorAll('.card-hover');
  const subtleCardHover = document.querySelectorAll('.card-hover-subtle');
  const enhancedCardHover = document.querySelectorAll('.card-hover-enhanced');

  // Find cards with old non-standard hover effects
  const oldHoverEffects = document.querySelectorAll(
    [
      '[class*="hover:scale-105"]',
      '[class*="hover:scale-[1.01]"]',
      '[class*="hover:scale-[1.025]"]',
      '[class*="hover:bg-white"][class*="hover:border-white"]',
    ].join(', ')
  );

  const standardizedCount =
    standardCardHover.length +
    subtleCardHover.length +
    enhancedCardHover.length;
  const nonStandardCount = oldHoverEffects.length;
  const totalCards = standardizedCount + nonStandardCount;

  const result: CardHoverAuditResult = {
    standardizedCards: [
      ...Array.from(standardCardHover, (el) => getElementIdentifier(el)),
      ...Array.from(subtleCardHover, (el) => getElementIdentifier(el)),
      ...Array.from(enhancedCardHover, (el) => getElementIdentifier(el)),
    ],
    nonStandardCards: Array.from(oldHoverEffects, (el) =>
      getElementIdentifier(el)
    ),
    totalCards,
    compliancePercentage:
      totalCards > 0 ? Math.round((standardizedCount / totalCards) * 100) : 100,
  };

  console.info('[UICard-Refactor] Audit Results:', {
    standardizedCards: standardizedCount,
    nonStandardCards: nonStandardCount,
    totalCards,
    compliancePercentage: result.compliancePercentage,
  });

  if (result.nonStandardCards.length > 0) {
    console.warn(
      '[UICard-Refactor] Found cards with non-standard hover effects:',
      result.nonStandardCards
    );
  }

  return result;
};

const getElementIdentifier = (element: Element): string => {
  const id = element.id;
  const className = element.className;
  const tagName = element.tagName.toLowerCase();
  const testId = element.getAttribute('data-testid');

  if (testId) return `${tagName}[data-testid="${testId}"]`;
  if (id) return `${tagName}#${id}`;
  if (className) {
    const relevantClasses = className
      .split(' ')
      .filter(
        (cls) =>
          cls.includes('card') || cls.includes('hover') || cls.includes('glass')
      )
      .slice(0, 2);
    return `${tagName}.${relevantClasses.join('.')}`;
  }

  return tagName;
};

export const logCardHoverApplication = (
  componentName: string,
  hoverType: 'standard' | 'subtle' | 'enhanced'
) => {
  console.info(
    `[UICard-Refactor] Applied ${hoverType} hover effect to ${componentName}`
  );
};

// Export for use in development mode
if (process.env.NODE_ENV === 'development') {
  (window as any).auditCardHoverEffects = auditCardHoverEffects;
}
