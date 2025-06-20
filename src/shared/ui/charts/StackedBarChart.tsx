/**
 * StackedBarChart - Apple-style stacked bar chart component
 * Extends GraphBase foundation with specialized stacked bar functionality
 * Perfect for spending breakdowns, budget comparisons, and portfolio allocations
 */

import React, { memo, useMemo, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { 
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Cell
} from 'recharts';
import { cn } from '@/shared/lib/utils';
import { 
  appleGraphTokens,
  getGraphColor,
  getTextColor,
  getBackgroundColor,
  generateGraphCSSProperties,
  getChartAnimationPreset,
  shouldReduceMotion,
  getOptimalAnimationDuration 
} from '@/theme/graph-tokens';
import { GraphBase } from './GraphBase';
import { 
  ChartDataPoint, 
  ChartSeries, 
  ChartRef,
  TimeRangeOption,
  LoadingState,
  AccessibilityConfig
} from './types';

// Enhanced data point interface for stacked bars
export interface StackedBarDataPoint extends ChartDataPoint {
  total?: number;
  categories?: { [key: string]: number };
  percentages?: { [key: string]: number };
}

// Stacked bar specific configuration
export interface StackedBarConfig {
  // Display modes
  displayMode?: 'absolute' | 'percentage' | 'both';
  showTotal?: boolean;
  
  // Bar styling
  barRadius?: number;
  barGap?: number;
  categoryGap?: number;
  maxBarHeight?: number;
  
  // Color and styling
  colorScheme?: 'financial' | 'categorical' | 'custom';
  gradientFill?: boolean;
  
  // Category management
  maxCategories?: number;
  groupSmallCategories?: boolean;
  smallCategoryThreshold?: number;
  
  // Interactions
  hoverEffects?: boolean;
  clickableSegments?: boolean;
  animateOnLoad?: boolean;
}

// Financial category mappings for automatic color assignment
const FINANCIAL_CATEGORY_COLORS = {
  // Spending categories
  food: '#FF453A',           // Apple red
  housing: '#FF9F0A',        // Apple orange
  transportation: '#FFCC00', // Apple yellow
  entertainment: '#AF52DE',  // Apple purple
  healthcare: '#FF375F',     // Apple pink
  shopping: '#5AC8FA',       // Apple teal
  utilities: '#32D74B',      // Apple green
  debt_payments: '#FF3B30',  // Apple red light
  savings: '#007AFF',        // Apple blue
  other: '#8E8E93',          // Apple gray
  
  // Investment categories
  stocks: '#007AFF',         // Apple blue
  bonds: '#32D74B',          // Apple green
  cash: '#FFCC00',           // Apple yellow
  crypto: '#AF52DE',         // Apple purple
  real_estate: '#FF9F0A',    // Apple orange
  commodities: '#5AC8FA',    // Apple teal
  
  // Income categories
  salary: '#32D74B',         // Apple green
  freelance: '#007AFF',      // Apple blue
  investments: '#AF52DE',    // Apple purple
  business: '#FF9F0A',       // Apple orange
  rental: '#5AC8FA',         // Apple teal
};

// Props interface for StackedBarChart
export interface StackedBarChartProps {
  // Core data
  data: StackedBarDataPoint[];
  series?: ChartSeries[];
  
  // Header and metadata
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  
  // Stacked bar configuration
  stackedBarConfig?: StackedBarConfig;
  
  // Financial formatting
  financialType?: 'currency' | 'percentage' | 'number';
  currencyCode?: string;
  
  // Chart dimensions and styling
  dimensions?: {
    height?: number;
    minHeight?: number;
    maxHeight?: number;
    responsive?: boolean;
  };
  className?: string;
  style?: React.CSSProperties;
  
  // Time controls
  timeRange?: TimeRangeOption;
  timeControls?: {
    show: boolean;
    options: TimeRangeOption[];
    defaultRange: TimeRangeOption;
  };
  onTimeRangeChange?: (range: TimeRangeOption) => void;
  
  // State management
  loading?: boolean;
  loadingState?: LoadingState;
  error?: string | Error;
  
  // Accessibility
  accessibility?: AccessibilityConfig;
  
  // Event handlers
  onBarClick?: (data: StackedBarDataPoint, categoryKey: string, value: number) => void;
  onBarHover?: (data: StackedBarDataPoint | null, categoryKey: string | null) => void;
  onChartReady?: () => void;
  
  // Advanced
  customTooltip?: React.ComponentType<any>;
  customLegend?: React.ComponentType<any>;
  children?: React.ReactNode;
}

// Enhanced tooltip for stacked bars
const StackedBarTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  financialType?: 'currency' | 'percentage' | 'number';
  displayMode?: 'absolute' | 'percentage' | 'both';
}> = memo(({ active, payload, label, financialType = 'currency', displayMode = 'absolute' }) => {
  if (!active || !payload || !payload.length) return null;

  const formatValue = useCallback((value: number, type: 'currency' | 'percentage' | 'number') => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  }, []);

  // Calculate total for percentage display
  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-lg">
      <p className="text-white font-medium mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/80 text-sm capitalize">
                {entry.dataKey?.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-white font-medium">
                {formatValue(entry.value, financialType)}
              </span>
              {displayMode === 'both' && total > 0 && (
                <span className="text-white/60 text-xs ml-2">
                  ({((entry.value / total) * 100).toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        ))}
        {displayMode !== 'percentage' && (
          <div className="border-t border-white/10 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Total:</span>
              <span className="text-white font-medium">
                {formatValue(total, financialType)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

StackedBarTooltip.displayName = 'StackedBarTooltip';

// Main StackedBarChart component
export const StackedBarChart = forwardRef<ChartRef, StackedBarChartProps>(({
  data,
  series,
  title,
  subtitle,
  headerActions,
  stackedBarConfig = {},
  financialType = 'currency',
  currencyCode = 'USD',
  dimensions = { height: 300, responsive: true },
  className,
  style,
  timeRange,
  timeControls,
  onTimeRangeChange,
  loading = false,
  loadingState = 'idle',
  error,
  accessibility = { keyboardNavigation: true },
  onBarClick,
  onBarHover,
  onChartReady,
  customTooltip,
  customLegend,
  children,
  ...rest
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Expose ref imperatively
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  // Destructure stacked bar config with defaults
  const {
    displayMode = 'absolute',
    showTotal = true,
    barRadius = 8,
    barGap = 4,
    categoryGap = 16,
    colorScheme = 'financial',
    gradientFill = false,
    maxCategories = 8,
    groupSmallCategories = true,
    smallCategoryThreshold = 0.05,
    hoverEffects = true,
    clickableSegments = true,
    animateOnLoad = true
  } = stackedBarConfig;

  // Auto-generate series if not provided
  const computedSeries = useMemo((): ChartSeries[] => {
    if (series) return series;
    
    if (data.length === 0) return [];
    
    // Collect all category keys from data
    const categoryKeys = new Set<string>();
    data.forEach(point => {
      Object.keys(point).forEach(key => {
        if (key !== 'date' && key !== 'label' && key !== 'total' && key !== 'categories' && key !== 'percentages') {
          if (typeof point[key] === 'number') {
            categoryKeys.add(key);
          }
        }
      });
    });
    
    const categories = Array.from(categoryKeys);
    
    // Sort categories by total value (largest first)
    if (groupSmallCategories) {
      const categoryTotals = categories.map(key => ({
        key,
        total: data.reduce((sum, point) => sum + (point[key] as number || 0), 0)
      }));
      
      categoryTotals.sort((a, b) => b.total - a.total);
      
      // Group small categories if needed
      if (categoryTotals.length > maxCategories) {
        const mainCategories = categoryTotals.slice(0, maxCategories - 1);
        const otherCategories = categoryTotals.slice(maxCategories - 1);
        
        return [
          ...mainCategories.map(({ key }, index) => ({
            dataKey: key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
            color: FINANCIAL_CATEGORY_COLORS[key as keyof typeof FINANCIAL_CATEGORY_COLORS] || 
                   getGraphColor(['income', 'spending', 'savings', 'investments', 'debt'][index % 5] as any, 'dark')
          })),
          {
            dataKey: 'other',
            label: 'Other',
            color: '#8E8E93' // Apple gray
          }
        ];
      }
      
      return categoryTotals.map(({ key }, index) => ({
        dataKey: key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        color: FINANCIAL_CATEGORY_COLORS[key as keyof typeof FINANCIAL_CATEGORY_COLORS] || 
               getGraphColor(['income', 'spending', 'savings', 'investments', 'debt'][index % 5] as any, 'dark')
      }));
    }
    
    return categories.slice(0, maxCategories).map((key, index) => ({
      dataKey: key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      color: FINANCIAL_CATEGORY_COLORS[key as keyof typeof FINANCIAL_CATEGORY_COLORS] || 
             getGraphColor(['income', 'spending', 'savings', 'investments', 'debt'][index % 5] as any, 'dark')
    }));
  }, [data, series, maxCategories, groupSmallCategories]);

  // Process data for percentage mode
  const processedData = useMemo(() => {
    if (displayMode === 'absolute') return data;
    
    return data.map(point => {
      const total = computedSeries.reduce((sum, serie) => {
        return sum + (point[serie.dataKey] as number || 0);
      }, 0);
      
      const processed = { ...point };
      
      if (displayMode === 'percentage' && total > 0) {
        computedSeries.forEach(serie => {
          const value = point[serie.dataKey] as number || 0;
          processed[serie.dataKey] = (value / total) * 100;
        });
      }
      
      processed.total = total;
      return processed;
    });
  }, [data, computedSeries, displayMode]);

  // Format value for display
  const formatValue = useCallback((value: number) => {
    if (displayMode === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    
    switch (financialType) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  }, [displayMode, financialType, currencyCode]);

  // Handle bar click events
  const handleBarClick = useCallback((data: any, index: number) => {
    if (!clickableSegments || !onBarClick) return;
    
    // Find which segment was clicked
    const point = processedData[index];
    if (point) {
      // For now, we'll just trigger with the first series key
      // In a real implementation, you'd determine which segment was clicked
      const firstSeries = computedSeries[0];
      if (firstSeries) {
        onBarClick(point as StackedBarDataPoint, firstSeries.dataKey, point[firstSeries.dataKey] as number);
      }
    }
  }, [clickableSegments, onBarClick, processedData, computedSeries]);

  // Handle bar hover events
  const handleBarHover = useCallback((state: any) => {
    if (!hoverEffects || !onBarHover) return;
    
    if (state.isTooltipActive && state.activePayload && state.activePayload.length > 0) {
      const point = state.activePayload[0].payload as StackedBarDataPoint;
      const categoryKey = state.activePayload[0].dataKey;
      onBarHover(point, categoryKey);
    } else {
      onBarHover(null, null);
    }
  }, [hoverEffects, onBarHover]);

  // Custom legend component
  const renderLegend = useCallback(() => {
    if (customLegend) {
      return React.createElement(customLegend);
    }
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {computedSeries.map((serie) => (
          <div key={serie.dataKey} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: serie.color }}
            />
            <span className="text-white/80 text-sm">{serie.label}</span>
          </div>
        ))}
      </div>
    );
  }, [computedSeries, customLegend]);

  // Generate CSS properties for theme support
  const cssProperties = useMemo(() => 
    generateGraphCSSProperties('dark'), []
  );

  // Use GraphBase for core functionality
  return (
    <GraphBase
      ref={containerRef}
      data={processedData}
      type="stackedBar"
      series={computedSeries}
      title={title}
      subtitle={subtitle}
      headerActions={headerActions}
      timeRange={timeRange}
      timeControls={timeControls}
      onTimeRangeChange={onTimeRangeChange}
      dimensions={dimensions}
      className={cn("stacked-bar-chart", className)}
      style={{ ...cssProperties, ...style }}
      loading={loading}
      loadingState={loadingState}
      error={error}
      accessibility={accessibility}
      onChartReady={onChartReady}
      customTooltip={customTooltip || StackedBarTooltip}
      customLegend={renderLegend}
      animation={useMemo(() => {
        const barAnimationPreset = getChartAnimationPreset('stacked');
        const reducedMotion = shouldReduceMotion();
        
        return {
          enable: animateOnLoad && !reducedMotion,
          duration: barAnimationPreset.duration, // 400ms for staggered bars
          easing: barAnimationPreset.easing,     // iOS ease-out
          delay: barAnimationPreset.delay,       // No delay for bars
          // Ensure reduced motion is respected
          ...(reducedMotion && { 
            enable: false, 
            duration: 0,
            delay: 0 
          }),
        };
      }, [animateOnLoad])}
      {...rest}
    >
      {children}
    </GraphBase>
  );
});

StackedBarChart.displayName = 'StackedBarChart';

// Export memoized version
export default memo(StackedBarChart);