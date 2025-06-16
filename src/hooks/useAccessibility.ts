import { useEffect, useRef, useCallback, useState } from 'react';

export interface AccessibilityOptions {
  announcePageChanges?: boolean;
  focusOnMount?: boolean;
  trapFocus?: boolean;
  escapeToClose?: (() => void) | null;
}

export const useAccessibility = (options: AccessibilityOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const {
    announcePageChanges = true,
    focusOnMount = false,
    trapFocus = false,
    escapeToClose = null,
  } = options;

  // Announce page changes to screen readers
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Focus management
  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  }, []);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (lastElement) {
      lastElement.focus();
    }
  }, []);

  // Focus trap for modals and overlays
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isVisible) return;

    // Escape key handling
    if (e.key === 'Escape' && escapeToClose) {
      escapeToClose();
      return;
    }

    // Focus trap
    if (trapFocus && e.key === 'Tab' && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [trapFocus, escapeToClose, isVisible]);

  // Setup and cleanup
  useEffect(() => {
    // Store previous focus for restoration
    if (trapFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Focus management on mount
    if (focusOnMount) {
      setTimeout(() => focusFirst(), 100);
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus when component unmounts
      if (trapFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [focusOnMount, handleKeyDown, trapFocus, focusFirst]);

  return {
    containerRef,
    announceToScreenReader,
    focusFirst,
    focusLast,
    setIsVisible,
  };
};

// Hook for skip links
export const useSkipLinks = () => {
  useEffect(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg';
    
    // Insert as first element in body
    document.body.insertBefore(skipLink, document.body.firstChild);

    return () => {
      if (document.body.contains(skipLink)) {
        document.body.removeChild(skipLink);
      }
    };
  }, []);
};

// Hook for keyboard navigation helpers
export const useKeyboardNavigation = () => {
  const handleArrowKeyNavigation = useCallback((
    e: React.KeyboardEvent,
    items: NodeListOf<Element> | Element[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      return;
    }

    e.preventDefault();
    
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
    }
    
    onIndexChange(newIndex);
    (items[newIndex] as HTMLElement)?.focus();
  }, []);

  return { handleArrowKeyNavigation };
};

// Hook for reduced motion preferences
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange(); // Check initial value
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

// Hook for color scheme preferences
export const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    };

    handleChange(); // Check initial value
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return colorScheme;
}; 