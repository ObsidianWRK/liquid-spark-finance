/**
 * TimeRangeToggleRadix - Apple-style segmented control with Radix UI accessibility
 * Based on Apple Human Interface Guidelines 2025
 * Features: Full accessibility, keyboard navigation, screen reader support
 */

import React, { memo, forwardRef, useImperativeHandle, useRef } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '@/shared/lib/utils';
import { appleGraphTokens } from '@/theme/graph-tokens';
import { TimeRangeOption } from './types';

// Apple-style segmented control props
export interface TimeRangeToggleRadixProps {
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
  showLabels?: boolean;
}

// Default time range options
const DEFAULT_OPTIONS: TimeRangeOption[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

// Option labels for accessibility
const OPTION_LABELS: Record<TimeRangeOption, string> = {
  '1W': '1 Week',
  '1M': '1 Month', 
  '3M': '3 Months',
  '6M': '6 Months',
  '1Y': '1 Year',
  'ALL': 'All Time'
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
  }
} as const;

export interface TimeRangeToggleRadixRef {
  focus: () => void;
  blur: () => void;
  selectOption: (option: TimeRangeOption) => void;
}

export const TimeRangeToggleRadix = forwardRef<TimeRangeToggleRadixRef, TimeRangeToggleRadixProps>(({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
  disabled = false,
  size = 'md',
  fullWidth = false,
  'aria-label': ariaLabel = 'Time range selection',
  'aria-describedby': ariaDescribedBy,
  showLabels = false,
  ...rest
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeConfig = SIZE_CONFIG[size];

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
    }
  }));

  // Handle value change with validation
  const handleValueChange = (newValue: string | undefined) => {
    if (newValue && options.includes(newValue as TimeRangeOption)) {
      onChange(newValue as TimeRangeOption);
      
      // Announce change to screen readers
      const announcement = `Selected ${OPTION_LABELS[newValue as TimeRangeOption]}`;
      const ariaLive = document.createElement('div');
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.setAttribute('aria-atomic', 'true');
      ariaLive.className = 'sr-only';
      ariaLive.textContent = announcement;
      document.body.appendChild(ariaLive);
      setTimeout(() => document.body.removeChild(ariaLive), 1000);
    }
  };

  return (
    <ToggleGroup.Root
      ref={containerRef}
      type="single"
      value={value}
      onValueChange={handleValueChange}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      className={cn(
        "inline-flex items-center",
        "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10",
        "transition-all duration-200 ease-out",
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        height: sizeConfig.height,
        padding: sizeConfig.padding,
        borderRadius: appleGraphTokens.borderRadius.md,
      }}
      {...rest}
    >
      {options.map((option) => {
        const isSelected = option === value;
        
        return (
          <ToggleGroup.Item
            key={option}
            value={option}
            className={cn(
              "flex-1 px-3 py-1.5 text-center font-medium rounded-lg",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
              "disabled:cursor-not-allowed",
              // Apple-style selection states
              "data-[state=on]:bg-white/15 data-[state=on]:text-white data-[state=on]:shadow-sm",
              "data-[state=off]:text-white/70 data-[state=off]:hover:text-white/90 data-[state=off]:hover:bg-white/5",
              // Interactive states
              !disabled && "hover:bg-white/5 active:bg-white/10 active:scale-95",
              // Touch targets
              "min-w-0", // Allow flex to shrink
            )}
            style={{
              fontSize: sizeConfig.fontSize,
              minHeight: sizeConfig.minTouchTarget, // iOS accessibility
              fontFamily: appleGraphTokens.typography.fontFamily.primary,
              fontWeight: isSelected ? 500 : 400,
            }}
            aria-label={showLabels ? OPTION_LABELS[option] : option}
            disabled={disabled}
          >
            <span className="truncate">
              {showLabels ? OPTION_LABELS[option] : option}
            </span>
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
});

TimeRangeToggleRadix.displayName = 'TimeRangeToggleRadix';

// Export memoized version
export default memo(TimeRangeToggleRadix);