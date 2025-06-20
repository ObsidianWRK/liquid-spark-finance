// src/navigation/hooks/useAccessibility.ts
import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing accessibility preferences and states
 * Implements WCAG 2.1 AA compliance standards
 */
export const useAccessibility = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersReducedTransparency, setPrefersReducedTransparency] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check for reduced transparency preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    setPrefersReducedTransparency(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedTransparency(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check for high contrast preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Screen reader announcement function
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    // Clear announcement after a delay to prevent accumulation
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);

    // Also update live region directly
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  // Generate accessibility classes based on preferences
  const getAccessibilityClasses = useCallback(() => {
    const classes: string[] = [];
    
    if (prefersReducedMotion) {
      classes.push('reduce-motion');
    }
    
    if (prefersReducedTransparency) {
      classes.push('reduce-transparency');
    }
    
    if (prefersHighContrast) {
      classes.push('high-contrast');
    }
    
    return classes.join(' ');
  }, [prefersReducedMotion, prefersReducedTransparency, prefersHighContrast]);

  return {
    prefersReducedMotion,
    prefersReducedTransparency,
    prefersHighContrast,
    announce,
    getAccessibilityClasses,
    liveRegionRef,
    currentAnnouncement: announcements[announcements.length - 1] || '',
  };
};

/**
 * Hook for managing keyboard navigation in tabbed interfaces
 * Implements roving tabindex pattern for ARIA tablist/tab navigation
 */
export const useKeyboardNavigation = (
  items: Array<{ id: string; disabled?: boolean }>,
  activeId?: string,
  onActivate?: (id: string) => void,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Find active index based on activeId
  useEffect(() => {
    if (activeId) {
      const activeIndex = items.findIndex(item => item.id === activeId);
      if (activeIndex !== -1) {
        setFocusedIndex(activeIndex);
      }
    }
  }, [activeId, items]);

  // Register item ref
  const registerItem = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { key } = event;
    let nextIndex = focusedIndex;

    const isNextKey = orientation === 'horizontal' 
      ? key === 'ArrowRight' 
      : key === 'ArrowDown';
    
    const isPrevKey = orientation === 'horizontal' 
      ? key === 'ArrowLeft' 
      : key === 'ArrowUp';

    if (isNextKey) {
      event.preventDefault();
      nextIndex = (focusedIndex + 1) % items.length;
      
      // Skip disabled items
      while (items[nextIndex]?.disabled && nextIndex !== focusedIndex) {
        nextIndex = (nextIndex + 1) % items.length;
      }
    } else if (isPrevKey) {
      event.preventDefault();
      nextIndex = focusedIndex === 0 ? items.length - 1 : focusedIndex - 1;
      
      // Skip disabled items
      while (items[nextIndex]?.disabled && nextIndex !== focusedIndex) {
        nextIndex = nextIndex === 0 ? items.length - 1 : nextIndex - 1;
      }
    } else if (key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
      
      // Skip disabled items
      while (items[nextIndex]?.disabled && nextIndex < items.length - 1) {
        nextIndex++;
      }
    } else if (key === 'End') {
      event.preventDefault();
      nextIndex = items.length - 1;
      
      // Skip disabled items
      while (items[nextIndex]?.disabled && nextIndex > 0) {
        nextIndex--;
      }
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      const currentItem = items[focusedIndex];
      if (currentItem && !currentItem.disabled && onActivate) {
        onActivate(currentItem.id);
      }
      return;
    }

    if (nextIndex !== focusedIndex) {
      setFocusedIndex(nextIndex);
      
      // Focus the element
      const nextItem = items[nextIndex];
      if (nextItem) {
        const element = itemRefs.current.get(nextItem.id);
        element?.focus();
      }
    }
  }, [focusedIndex, items, orientation, onActivate]);

  // Get ARIA attributes for tablist container
  const getTabListProps = useCallback(() => ({
    role: 'tablist',
    'aria-orientation': orientation,
    onKeyDown: handleKeyDown,
  }), [orientation, handleKeyDown]);

  // Get ARIA attributes for individual tab items
  const getTabProps = useCallback((id: string, isActive: boolean = false) => {
    const index = items.findIndex(item => item.id === id);
    const isFocused = index === focusedIndex;
    const item = items[index];
    
    return {
      role: 'tab',
      'aria-selected': isActive,
      'aria-disabled': item?.disabled || false,
      tabIndex: isFocused ? 0 : -1,
      ref: (element: HTMLElement | null) => registerItem(id, element),
      onFocus: () => setFocusedIndex(index),
    };
  }, [items, focusedIndex, registerItem]);

  return {
    getTabListProps,
    getTabProps,
    focusedIndex,
  };
};

/**
 * Hook for managing touch targets and interaction areas
 * Ensures minimum 44x44px touch targets per WCAG guidelines
 */
export const useTouchTarget = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    setIsTouch(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsTouch(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getTouchTargetProps = useCallback(() => ({
    className: isTouch ? 'touch-target-enhanced' : '',
    style: isTouch ? {
      minHeight: '44px',
      minWidth: '44px',
      padding: '12px',
    } : {},
  }), [isTouch]);

  return {
    isTouch,
    getTouchTargetProps,
  };
};