/**
 * useTimeRange - Hook for consuming time range context with additional utilities
 * Features: Optimized re-renders, data filtering, range validation
 * Based on Apple Human Interface Guidelines 2025
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useTimeRangeContext } from '@/context/TimeRangeContext';
import { TimeRangeOption } from '@/components/charts/types';

// Hook options interface
export interface UseTimeRangeOptions {
  // Optimization options
  stabilizeCallbacks?: boolean;
  memoizeData?: boolean;
  enableCache?: boolean;
  
  // Validation options
  validateDates?: boolean;
  fallbackRange?: TimeRangeOption;
  
  // Performance options
  debounceMs?: number;
  skipInitialRender?: boolean;
}

// Hook return interface
export interface UseTimeRangeReturn {
  // Current state
  selectedRange: TimeRangeOption;
  rangeLabel: string;
  rangeDates: { start: Date; end: Date };
  
  // Actions
  setTimeRange: (range: TimeRangeOption) => void;
  resetToDefault: () => void;
  
  // Data utilities
  getFilteredData: <T extends Record<string, any>>(
    data: T[], 
    dateField?: string,
    dateFormat?: 'iso' | 'timestamp' | 'date'
  ) => T[];
  isInRange: (date: string | Date | number) => boolean;
  
  // Optimization utilities
  getCacheKey: () => string;
  clearCache: () => void;
  
  // Validation utilities
  isValidRange: (range: string) => range is TimeRangeOption;
  getSafeRange: (range: string) => TimeRangeOption;
}

// Valid time ranges for validation
const VALID_RANGES: TimeRangeOption[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

// Default hook options
const DEFAULT_OPTIONS: UseTimeRangeOptions = {
  stabilizeCallbacks: true,
  memoizeData: true,
  enableCache: true,
  validateDates: true,
  fallbackRange: '1M',
  debounceMs: 0,
  skipInitialRender: false
};

/**
 * Hook for consuming time range context with additional utilities
 */
export function useTimeRange(options: UseTimeRangeOptions = {}): UseTimeRangeReturn {
  const context = useTimeRangeContext();
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Refs for stable callbacks
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const initialRenderRef = useRef(true);
  
  // Handle initial render skip
  useEffect(() => {
    if (opts.skipInitialRender && initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
  }, [opts.skipInitialRender]);

  // Validation utilities
  const isValidRange = useCallback((range: string): range is TimeRangeOption => {
    return VALID_RANGES.includes(range as TimeRangeOption);
  }, []);

  const getSafeRange = useCallback((range: string): TimeRangeOption => {
    return isValidRange(range) ? range : (opts.fallbackRange || '1M');
  }, [isValidRange, opts.fallbackRange]);

  // Memoized current range data
  const rangeDates = useMemo(() => {
    return context.getRangeDates();
  }, [context.selectedRange, context.getRangeDates]);

  const rangeLabel = useMemo(() => {
    return context.getRangeLabel();
  }, [context.selectedRange, context.getRangeLabel]);

  // Stable callback for setting time range
  const setTimeRange = useCallback((range: TimeRangeOption) => {
    if (opts.validateDates && !isValidRange(range)) {
      console.warn(`Invalid time range: ${range}. Using fallback: ${opts.fallbackRange}`);
      range = opts.fallbackRange || '1M';
    }

    if (opts.debounceMs && opts.debounceMs > 0) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        context.setTimeRange(range);
      }, opts.debounceMs);
    } else {
      context.setTimeRange(range);
    }
  }, [
    context.setTimeRange, 
    opts.validateDates, 
    opts.debounceMs, 
    opts.fallbackRange,
    isValidRange
  ]);

  // Reset to default range
  const resetToDefault = useCallback(() => {
    const defaultRange = opts.fallbackRange || '1M';
    setTimeRange(defaultRange);
  }, [setTimeRange, opts.fallbackRange]);

  // Enhanced data filtering with validation
  const getFilteredData = useCallback(<T extends Record<string, any>>(
    data: T[],
    dateField: string = 'date',
    dateFormat: 'iso' | 'timestamp' | 'date' = 'iso'
  ): T[] => {
    if (!data || !Array.isArray(data)) {
      console.warn('Invalid data provided to getFilteredData');
      return [];
    }

    if (opts.validateDates) {
      // Validate date field exists in data
      const hasDateField = data.length > 0 && data[0][dateField] !== undefined;
      if (!hasDateField) {
        console.warn(`Date field "${dateField}" not found in data`);
        return data; // Return unfiltered if no date field
      }
    }

    return context.getFilteredData(data, dateField, dateFormat);
  }, [context.getFilteredData, opts.validateDates]);

  // Enhanced date range checking
  const isInRange = useCallback((date: string | Date | number): boolean => {
    if (opts.validateDates) {
      // Validate date parameter
      if (date === null || date === undefined) {
        console.warn('Invalid date provided to isInRange');
        return false;
      }
      
      // Try to parse date to ensure it's valid
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date format provided to isInRange:', date);
          return false;
        }
      } catch (error) {
        console.warn('Error parsing date in isInRange:', error);
        return false;
      }
    }

    return context.isInRange(date);
  }, [context.isInRange, opts.validateDates]);

  // Stable cache utilities
  const getCacheKey = useCallback(() => {
    return context.getCacheKey();
  }, [context.getCacheKey]);

  const clearCache = useCallback(() => {
    context.clearCache();
  }, [context.clearCache]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Return stable object
  return useMemo((): UseTimeRangeReturn => ({
    // Current state
    selectedRange: context.selectedRange,
    rangeLabel,
    rangeDates,
    
    // Actions
    setTimeRange: opts.stabilizeCallbacks ? setTimeRange : context.setTimeRange,
    resetToDefault,
    
    // Data utilities
    getFilteredData: opts.memoizeData ? getFilteredData : context.getFilteredData,
    isInRange: opts.memoizeData ? isInRange : context.isInRange,
    
    // Optimization utilities
    getCacheKey,
    clearCache,
    
    // Validation utilities
    isValidRange,
    getSafeRange
  }), [
    context.selectedRange,
    rangeLabel,
    rangeDates,
    setTimeRange,
    resetToDefault,
    getFilteredData,
    isInRange,
    getCacheKey,
    clearCache,
    isValidRange,
    getSafeRange,
    opts.stabilizeCallbacks,
    opts.memoizeData,
    context.setTimeRange,
    context.getFilteredData,
    context.isInRange
  ]);
}

// Export hook as default
export default useTimeRange;

// Convenience hooks for specific use cases
export function useTimeRangeFilter<T extends Record<string, any>>(
  data: T[],
  dateField: string = 'date',
  dateFormat: 'iso' | 'timestamp' | 'date' = 'iso'
): T[] {
  const { getFilteredData } = useTimeRange({ memoizeData: true });
  
  return useMemo(() => {
    return getFilteredData(data, dateField, dateFormat);
  }, [data, dateField, dateFormat, getFilteredData]);
}

export function useTimeRangeValidator(): {
  isValidRange: (range: string) => range is TimeRangeOption;
  getSafeRange: (range: string) => TimeRangeOption;
  validateAndSet: (range: string) => void;
} {
  const { setTimeRange, isValidRange, getSafeRange } = useTimeRange({ 
    validateDates: true,
    stabilizeCallbacks: true
  });

  const validateAndSet = useCallback((range: string) => {
    const safeRange = getSafeRange(range);
    setTimeRange(safeRange);
  }, [getSafeRange, setTimeRange]);

  return { isValidRange, getSafeRange, validateAndSet };
}

export function useOptimizedTimeRange(): UseTimeRangeReturn {
  return useTimeRange({
    stabilizeCallbacks: true,
    memoizeData: true,
    enableCache: true,
    validateDates: true,
    debounceMs: 100
  });
}