/**
 * TimeRangeContext - Global state management for time range selection
 * Features: localStorage persistence, data filtering utilities, cross-component sharing
 * Based on Apple Human Interface Guidelines 2025
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { TimeRangeOption } from '@/components/charts/types';

// Context state interface
export interface TimeRangeContextType {
  selectedRange: TimeRangeOption;
  setTimeRange: (range: TimeRangeOption) => void;
  getFilteredData: <T extends Record<string, any>>(
    data: T[],
    dateField?: string,
    dateFormat?: 'iso' | 'timestamp' | 'date'
  ) => T[];
  isInRange: (date: string | Date | number, range?: TimeRangeOption) => boolean;
  getRangeLabel: (range?: TimeRangeOption) => string;
  getRangeDates: (range?: TimeRangeOption) => { start: Date; end: Date };
  // Performance utilities
  getCacheKey: (range?: TimeRangeOption) => string;
  clearCache: () => void;
}

// Action types for reducer
type TimeRangeAction =
  | { type: 'SET_RANGE'; payload: TimeRangeOption }
  | { type: 'RESET_TO_DEFAULT' }
  | { type: 'HYDRATE_FROM_STORAGE'; payload: TimeRangeOption };

// State interface
interface TimeRangeState {
  selectedRange: TimeRangeOption;
  lastChanged: number;
}

// Default state
const DEFAULT_RANGE: TimeRangeOption = '1M';
const STORAGE_KEY = 'liquid-spark-time-range';

// Create context
const TimeRangeContext = createContext<TimeRangeContextType | null>(null);

// Time range configurations
const TIME_RANGE_CONFIG = {
  '1W': { days: 7, label: '1 Week' },
  '1M': { days: 30, label: '1 Month' },
  '3M': { days: 90, label: '3 Months' },
  '6M': { days: 180, label: '6 Months' },
  '1Y': { days: 365, label: '1 Year' },
  ALL: { days: Infinity, label: 'All Time' },
} as const;

// Reducer for state management
function timeRangeReducer(
  state: TimeRangeState,
  action: TimeRangeAction
): TimeRangeState {
  switch (action.type) {
    case 'SET_RANGE':
      return {
        ...state,
        selectedRange: action.payload,
        lastChanged: Date.now(),
      };
    case 'RESET_TO_DEFAULT':
      return {
        ...state,
        selectedRange: DEFAULT_RANGE,
        lastChanged: Date.now(),
      };
    case 'HYDRATE_FROM_STORAGE':
      return {
        ...state,
        selectedRange: action.payload,
        lastChanged: Date.now(),
      };
    default:
      return state;
  }
}

// Utility functions
const isValidTimeRange = (range: string): range is TimeRangeOption => {
  return Object.keys(TIME_RANGE_CONFIG).includes(range);
};

const getStoredRange = (): TimeRangeOption => {
  try {
    if (typeof window === 'undefined') return DEFAULT_RANGE;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidTimeRange(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read time range from localStorage:', error);
  }
  return DEFAULT_RANGE;
};

const storeRange = (range: TimeRangeOption): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, range);
  } catch (error) {
    console.warn('Failed to store time range in localStorage:', error);
  }
};

// Date parsing utilities
const parseDate = (
  date: string | Date | number,
  format: 'iso' | 'timestamp' | 'date' = 'iso'
): Date => {
  if (date instanceof Date) return date;

  switch (format) {
    case 'timestamp':
      return new Date(typeof date === 'number' ? date : parseInt(date));
    case 'date':
      return new Date(date);
    case 'iso':
    default:
      return new Date(date);
  }
};

// Data filtering cache
interface FilterCache {
  [key: string]: {
    data: any[];
    timestamp: number;
    range: TimeRangeOption;
  };
}

let filterCache: FilterCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Provider component
export interface TimeRangeProviderProps {
  children: ReactNode;
  defaultRange?: TimeRangeOption;
  persistSelection?: boolean;
  cacheFiltering?: boolean;
}

export function TimeRangeProvider({
  children,
  defaultRange = DEFAULT_RANGE,
  persistSelection = true,
  cacheFiltering = true,
}: TimeRangeProviderProps) {
  // Initialize state with stored value or default
  const [state, dispatch] = useReducer(timeRangeReducer, {
    selectedRange: defaultRange,
    lastChanged: Date.now(),
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (persistSelection) {
      const storedRange = getStoredRange();
      if (storedRange !== state.selectedRange) {
        dispatch({ type: 'HYDRATE_FROM_STORAGE', payload: storedRange });
      }
    }
  }, [persistSelection, state.selectedRange]);

  // Persist to localStorage when range changes
  useEffect(() => {
    if (persistSelection && state.selectedRange !== defaultRange) {
      storeRange(state.selectedRange);
    }
  }, [state.selectedRange, defaultRange, persistSelection]);

  // Set time range handler
  const setTimeRange = useCallback((range: TimeRangeOption) => {
    dispatch({ type: 'SET_RANGE', payload: range });
  }, []);

  // Get range dates utility
  const getRangeDates = useCallback(
    (range?: TimeRangeOption) => {
      const targetRange = range || state.selectedRange;
      const config = TIME_RANGE_CONFIG[targetRange];
      const end = new Date();

      if (config.days === Infinity) {
        // For "ALL", return a very early start date
        return {
          start: new Date('2000-01-01'),
          end,
        };
      }

      const start = new Date(end.getTime() - config.days * 24 * 60 * 60 * 1000);
      return { start, end };
    },
    [state.selectedRange]
  );

  // Check if date is in range
  const isInRange = useCallback(
    (date: string | Date | number, range?: TimeRangeOption): boolean => {
      try {
        const targetRange = range || state.selectedRange;
        if (targetRange === 'ALL') return true;

        const dateObj = parseDate(date);
        const { start, end } = getRangeDates(targetRange);

        return dateObj >= start && dateObj <= end;
      } catch (error) {
        console.warn('Error checking date range:', error);
        return false;
      }
    },
    [state.selectedRange, getRangeDates]
  );

  // Get filtered data
  const getFilteredData = useCallback(
    <T extends Record<string, any>>(
      data: T[],
      dateField: string = 'date',
      dateFormat: 'iso' | 'timestamp' | 'date' = 'iso'
    ): T[] => {
      if (!data || data.length === 0) return [];
      if (state.selectedRange === 'ALL') return data;

      // Generate cache key
      const cacheKey = cacheFiltering
        ? `${JSON.stringify(data.slice(0, 5))}-${dateField}-${dateFormat}-${state.selectedRange}`
        : '';

      // Check cache
      if (cacheFiltering && cacheKey && filterCache[cacheKey]) {
        const cached = filterCache[cacheKey];
        const now = Date.now();

        if (
          now - cached.timestamp < CACHE_DURATION &&
          cached.range === state.selectedRange
        ) {
          return cached.data as T[];
        }
      }

      // Filter data
      const filtered = data.filter((item) => {
        const dateValue = item[dateField];
        if (!dateValue) return false;

        try {
          return isInRange(dateValue, state.selectedRange);
        } catch (error) {
          console.warn('Error filtering data point:', error, item);
          return false;
        }
      });

      // Cache result
      if (cacheFiltering && cacheKey) {
        filterCache[cacheKey] = {
          data: filtered,
          timestamp: Date.now(),
          range: state.selectedRange,
        };
      }

      return filtered;
    },
    [state.selectedRange, isInRange, cacheFiltering]
  );

  // Get range label
  const getRangeLabel = useCallback(
    (range?: TimeRangeOption): string => {
      const targetRange = range || state.selectedRange;
      return TIME_RANGE_CONFIG[targetRange].label;
    },
    [state.selectedRange]
  );

  // Get cache key
  const getCacheKey = useCallback(
    (range?: TimeRangeOption): string => {
      const targetRange = range || state.selectedRange;
      return `timerange-${targetRange}-${Date.now()}`;
    },
    [state.selectedRange]
  );

  // Clear cache
  const clearCache = useCallback(() => {
    filterCache = {};
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    (): TimeRangeContextType => ({
      selectedRange: state.selectedRange,
      setTimeRange,
      getFilteredData,
      isInRange,
      getRangeLabel,
      getRangeDates,
      getCacheKey,
      clearCache,
    }),
    [
      state.selectedRange,
      setTimeRange,
      getFilteredData,
      isInRange,
      getRangeLabel,
      getRangeDates,
      getCacheKey,
      clearCache,
    ]
  );

  return (
    <TimeRangeContext.Provider value={contextValue}>
      {children}
    </TimeRangeContext.Provider>
  );
}

// Hook to use the context
export function useTimeRangeContext(): TimeRangeContextType {
  const context = useContext(TimeRangeContext);

  if (!context) {
    throw new Error(
      'useTimeRangeContext must be used within a TimeRangeProvider'
    );
  }

  return context;
}

// Export context for advanced use cases
export { TimeRangeContext };

// Export configuration for external use
export { TIME_RANGE_CONFIG, DEFAULT_RANGE };
