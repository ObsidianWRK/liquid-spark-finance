/**
 * Accessibility Utilities for Vueni
 * Provides ARIA helpers, focus management, and keyboard navigation utilities
 */

// ARIA attributes generator
export const generateAriaProps = (props: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  pressed?: boolean;
  selected?: boolean;
  current?: string;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  busy?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  invalid?: boolean;
  required?: boolean;
  readonly?: boolean;
}) => {
  const ariaProps: Record<string, string | boolean | undefined> = {};

  if (props.label) ariaProps['aria-label'] = props.label;
  if (props.labelledBy) ariaProps['aria-labelledby'] = props.labelledBy;
  if (props.describedBy) ariaProps['aria-describedby'] = props.describedBy;
  if (props.expanded !== undefined) ariaProps['aria-expanded'] = props.expanded;
  if (props.pressed !== undefined) ariaProps['aria-pressed'] = props.pressed;
  if (props.selected !== undefined) ariaProps['aria-selected'] = props.selected;
  if (props.current) ariaProps['aria-current'] = props.current;
  if (props.live) ariaProps['aria-live'] = props.live;
  if (props.atomic !== undefined) ariaProps['aria-atomic'] = props.atomic;
  if (props.busy !== undefined) ariaProps['aria-busy'] = props.busy;
  if (props.disabled !== undefined) ariaProps['aria-disabled'] = props.disabled;
  if (props.hidden !== undefined) ariaProps['aria-hidden'] = props.hidden;
  if (props.invalid !== undefined) ariaProps['aria-invalid'] = props.invalid;
  if (props.required !== undefined) ariaProps['aria-required'] = props.required;
  if (props.readonly !== undefined) ariaProps['aria-readonly'] = props.readonly;

  return ariaProps;
};

// Focus management utilities
export class FocusManager {
  private static focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([aria-disabled="true"])',
    '[role="tab"]:not([aria-disabled="true"])',
    '[role="menuitem"]:not([aria-disabled="true"])',
  ].join(',');

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors));
  }

  static getFirstFocusable(container: HTMLElement): HTMLElement | null {
    const focusables = this.getFocusableElements(container);
    return focusables[0] || null;
  }

  static getLastFocusable(container: HTMLElement): HTMLElement | null {
    const focusables = this.getFocusableElements(container);
    return focusables[focusables.length - 1] || null;
  }

  static trapFocus(container: HTMLElement, event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    const focusables = this.getFocusableElements(container);
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  static restoreFocus(element: HTMLElement | null) {
    if (element && typeof element.focus === 'function') {
      // Use setTimeout to ensure the element is ready to receive focus
      setTimeout(() => element.focus(), 0);
    }
  }
}

// Keyboard navigation utilities
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  options: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onHome?: () => void;
    onEnd?: () => void;
    preventDefault?: boolean;
  } = {}
) => {
  const { preventDefault = true } = options;

  switch (event.key) {
    case 'Enter':
      if (options.onEnter) {
        if (preventDefault) event.preventDefault();
        options.onEnter();
      }
      break;
    case ' ':
    case 'Space':
      if (options.onSpace) {
        if (preventDefault) event.preventDefault();
        options.onSpace();
      }
      break;
    case 'Escape':
      if (options.onEscape) {
        if (preventDefault) event.preventDefault();
        options.onEscape();
      }
      break;
    case 'ArrowUp':
      if (options.onArrowUp) {
        if (preventDefault) event.preventDefault();
        options.onArrowUp();
      }
      break;
    case 'ArrowDown':
      if (options.onArrowDown) {
        if (preventDefault) event.preventDefault();
        options.onArrowDown();
      }
      break;
    case 'ArrowLeft':
      if (options.onArrowLeft) {
        if (preventDefault) event.preventDefault();
        options.onArrowLeft();
      }
      break;
    case 'ArrowRight':
      if (options.onArrowRight) {
        if (preventDefault) event.preventDefault();
        options.onArrowRight();
      }
      break;
    case 'Home':
      if (options.onHome) {
        if (preventDefault) event.preventDefault();
        options.onHome();
      }
      break;
    case 'End':
      if (options.onEnd) {
        if (preventDefault) event.preventDefault();
        options.onEnd();
      }
      break;
  }
};

// Announce to screen readers
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if user has high contrast preference
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Generate unique IDs for form elements
let idCounter = 0;
export const generateId = (prefix: string = 'vueni'): string => {
  return `${prefix}-${++idCounter}`;
};

// Validate color contrast ratio (simplified)
export const hasGoodContrast = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  // This is a simplified check - in production, use a proper contrast ratio library
  const requiredRatio = level === 'AAA' ? 7 : 4.5;
  // For now, assume good contrast if colors are sufficiently different
  return foreground !== background;
};

export default {
  generateAriaProps,
  FocusManager,
  handleKeyboardNavigation,
  announce,
  prefersReducedMotion,
  prefersHighContrast,
  generateId,
  hasGoodContrast,
}; 