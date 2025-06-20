/**
 * TimeRangeToggle - Apple-style segmented control for time range selection
 * Based on Apple Human Interface Guidelines 2025
 * Features: Keyboard navigation, touch-friendly, smooth animations, accessibility
 */

import React, {
  memo,
  useCallback,
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { cn } from '@/shared/lib/utils';
import {
  appleGraphTokens,
  getChartAnimationPreset,
  shouldReduceMotion,
  getOptimalAnimationDuration,
} from '@/theme/graph-tokens';
import { TimeRangeOption } from './types';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

// Apple-style segmented control props
export interface TimeRangeToggleProps {
  value: TimeRangeOption;
  onChange: (value: TimeRangeOption) => void;
  options?: TimeRangeOption[];
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
  // Advanced props
  animationDuration?: number;
  showLabels?: boolean;
  respectReducedMotion?: boolean;
}

// Default time range options
const DEFAULT_OPTIONS: TimeRangeOption[] = [
  '1W',
  '1M',
  '3M',
  '6M',
  '1Y',
  'ALL',
];

// Option labels for accessibility
const OPTION_LABELS: Record<TimeRangeOption, string> = {
  '1W': '1 Week',
  '1M': '1 Month',
  '3M': '3 Months',
  '6M': '6 Months',
  '1Y': '1 Year',
  ALL: 'All Time',
};

// Size configurations
const SIZE_CONFIG = {
  sm: {
    height: 32,
    padding: 2,
    fontSize: 11,
    minTouchTarget: 36,
  },
  md: {
    height: 36,
    padding: 3,
    fontSize: 12,
    minTouchTarget: 44,
  },
  lg: {
    height: 44,
    padding: 4,
    fontSize: 13,
    minTouchTarget: 48,
  },
} as const;

export interface TimeRangeToggleRef {
  focus: () => void;
  blur: () => void;
  selectOption: (option: TimeRangeOption) => void;
}

export const TimeRangeToggle = forwardRef<
  TimeRangeToggleRef,
  TimeRangeToggleProps
>(
  (
    {
      value,
      onChange,
      options = DEFAULT_OPTIONS,
      className,
      disabled = false,
      size = 'md',
      fullWidth = false,
      'aria-label': ariaLabel = 'Time range selection',
      'aria-describedby': ariaDescribedBy,
      animationDuration,
      showLabels = false,
      respectReducedMotion = true,
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const sizeConfig = SIZE_CONFIG[size];
    const currentIndex = options.indexOf(value);

    // Calculate optimal animation timings based on Apple standards
    const selectionPreset = getChartAnimationPreset('selection');
    const hoverPreset = getChartAnimationPreset('hover');
    const reducedMotion = respectReducedMotion && shouldReduceMotion();

    const optimalAnimationDuration =
      animationDuration ?? (reducedMotion ? 0 : selectionPreset.duration); // 100ms for selection
    const hoverAnimationDuration = reducedMotion ? 0 : hoverPreset.duration; // 150ms for hover

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      focus: () => {
        containerRef.current?.focus();
      },
      blur: () => {
        document.activeElement?.dispatchEvent(new Event('blur'));
      },
      selectOption: (option: TimeRangeOption) => {
        if (options.includes(option) && !disabled) {
          onChange(option);
        }
      },
    }));

    // Update selection indicator position
    const updateIndicatorPosition = useCallback(() => {
      if (
        !indicatorRef.current ||
        !optionRefs.current[currentIndex] ||
        !isInitialized
      ) {
        return;
      }

      const activeButton = optionRefs.current[currentIndex];
      const container = containerRef.current;

      if (!activeButton || !container) return;

      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      const left = buttonRect.left - containerRect.left - sizeConfig.padding;
      const width = buttonRect.width;

      indicatorRef.current.style.transform = `translateX(${left}px)`;
      indicatorRef.current.style.width = `${width}px`;
    }, [currentIndex, isInitialized, sizeConfig.padding]);

    // Initialize indicator position
    useEffect(() => {
      if (!isInitialized && currentIndex >= 0) {
        // Delay to ensure DOM is ready
        requestAnimationFrame(() => {
          setIsInitialized(true);
          updateIndicatorPosition();
        });
      }
    }, [currentIndex, isInitialized, updateIndicatorPosition]);

    // Update indicator when selection changes
    useEffect(() => {
      if (isInitialized) {
        updateIndicatorPosition();
      }
    }, [currentIndex, updateIndicatorPosition, isInitialized]);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        if (isInitialized) {
          updateIndicatorPosition();
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [updateIndicatorPosition, isInitialized]);

    // Handle option click
    const handleOptionClick = useCallback(
      (option: TimeRangeOption, index: number) => {
        if (disabled) return;

        onChange(option);
        setFocusedIndex(index);

        // Announce change to screen readers
        const announcement = `Selected ${OPTION_LABELS[option]}`;
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.setAttribute('aria-atomic', 'true');
        ariaLive.className = 'sr-only';
        ariaLive.textContent = announcement;
        document.body.appendChild(ariaLive);
        setTimeout(() => document.body.removeChild(ariaLive), 1000);
      },
      [disabled, onChange]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent, index: number) => {
        if (disabled) return;

        const { key } = event;
        let newIndex = index;

        switch (key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            newIndex = index > 0 ? index - 1 : options.length - 1;
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            newIndex = index < options.length - 1 ? index + 1 : 0;
            break;
          case 'Home':
            event.preventDefault();
            newIndex = 0;
            break;
          case 'End':
            event.preventDefault();
            newIndex = options.length - 1;
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            handleOptionClick(options[index], index);
            return;
          default:
            return;
        }

        // Focus and select new option
        if (newIndex !== index && optionRefs.current[newIndex]) {
          optionRefs.current[newIndex]?.focus();
          handleOptionClick(options[newIndex], newIndex);
        }
      },
      [disabled, options, handleOptionClick]
    );

    // Handle focus events
    const handleOptionFocus = useCallback((index: number) => {
      setFocusedIndex(index);
    }, []);

    const handleOptionBlur = useCallback(() => {
      setFocusedIndex(-1);
    }, []);

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative inline-flex items-center',
          'bg-white/5 backdrop-blur-sm rounded-xl border border-white/10',
          'transition-all duration-200 ease-out',
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={{
          height: sizeConfig.height,
          padding: sizeConfig.padding,
          borderRadius: appleGraphTokens.borderRadius.md,
        }}
        role="tablist"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...rest}
      >
        {/* Selection indicator */}
        <div
          ref={indicatorRef}
          className={cn(
            'absolute inset-y-1 rounded-lg bg-white/25 shadow-sm border border-white/40',
            'transition-all ease-out',
            !isInitialized && 'opacity-0'
          )}
          style={{
            transitionDuration: `${optimalAnimationDuration}ms`,
            transitionProperty: 'transform, width',
            transitionTimingFunction: reducedMotion
              ? 'ease'
              : selectionPreset.easing, // Apple selection easing
          }}
          aria-hidden="true"
        />

        {/* Option buttons */}
        {options.map((option, index) => {
          const isSelected = option === value;
          const isFocused = index === focusedIndex;

          return (
            <button
              key={option}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              type="button"
              className={cn(
                'relative z-10 flex-1 px-3 py-1.5 text-center font-medium rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent',
                'focus:bg-blue-500/15 focus:border-blue-500/40',
                'active:scale-95',
                // Text colors based on selection state
                isSelected ? 'text-white' : 'text-white/70 hover:text-white/90',
                // Interactive states with Apple-standard timing
                !disabled && 'hover:bg-white/5 active:bg-white/10',
                // Touch targets
                'min-w-0', // Allow flex to shrink
                disabled && 'cursor-not-allowed'
              )}
              style={{
                fontSize: sizeConfig.fontSize,
                minHeight: sizeConfig.minTouchTarget, // iOS accessibility
                fontFamily: appleGraphTokens.typography.fontFamily.primary,
                fontWeight: isSelected ? 500 : 400,
                transition: reducedMotion
                  ? 'none'
                  : `all ${hoverAnimationDuration}ms ${hoverPreset.easing}`, // Apple hover timing
              }}
              onClick={() => handleOptionClick(option, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => handleOptionFocus(index)}
              onBlur={handleOptionBlur}
              role="tab"
              aria-selected={isSelected}
              aria-label={showLabels ? OPTION_LABELS[option] : option}
              tabIndex={isSelected ? 0 : -1}
              disabled={disabled}
            >
              <span className="truncate">
                {showLabels ? OPTION_LABELS[option] : option}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);

TimeRangeToggle.displayName = 'TimeRangeToggle';

// Export memoized version
export default memo(TimeRangeToggle);
