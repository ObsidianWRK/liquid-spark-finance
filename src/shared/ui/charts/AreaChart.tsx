/**
 * AreaChart - Apple-style area chart component
 * Extends GraphBase foundation with area-specific features
 * Based on Apple Human Interface Guidelines 2025
 * Optimized for financial portfolio and cash flow visualizations
 */

import React, { 
  memo, 
  useMemo, 
  forwardRef, 
  useCallback,
  useImperativeHandle,
  useRef
} from 'react';
import { cn } from '@/shared/lib/utils';
import { GraphBase } from './GraphBase';
import { vueniTheme } from '@/theme/unified';
import {
  getGraphColor,
  getTextColor,
  getChartAnimationPreset,
  shouldReduceMotion,
  getOptimalAnimationDuration
} from '@/shared/utils/graph-utils';
import {
  GraphBaseProps,
  ChartDataPoint,
  ChartSeries,
  ChartRef,
  TimeRangeOption
} from './types';

// Area-specific configuration
export interface AreaChartConfig {
  // Fill styling
  fillOpacity?: number;
  gradientFill?: boolean;
  gradientDirection?: 'vertical' | 'horizontal';
  
  // Stacking behavior
  stackedAreas?: boolean;
  stackId?: string;
  
  // Stroke styling
  strokeWidth?: 'thin' | 'medium' | 'thick';
  strokeOpacity?: number;
  smoothCurves?: boolean;
  
  // Apple-specific enhancements
  appleGradients?: boolean;
  portfolioMode?: boolean;
  
  // Interactive features
  hoverEffects?: boolean;
  crosshair?: boolean;
  
  // Financial-specific
  currencyFormat?: boolean;
  percentageFormat?: boolean;
  showBaseline?: boolean;
  baselineValue?: number;
}

// Extended props for AreaChart
export interface AreaChartProps extends Omit<GraphBaseProps, 'type'> {
  areaConfig?: AreaChartConfig;
  
  // Financial data helpers
  financialType?: 'currency' | 'percentage' | 'allocation' | 'number';
  portfolioBreakdown?: boolean;
  
  // Multiple series shortcuts
  multiSeries?: boolean;
  seriesColors?: string[];
  
  // Apple-specific enhancements
  appleAnimation?: boolean;
  precisionReduce?: boolean;
  
  // Stacked data helpers
  stackedData?: boolean;
  stackNormalize?: boolean; // Convert to percentages
}

// Default area chart configuration
const DEFAULT_AREA_CONFIG: AreaChartConfig = {
  fillOpacity: 0.3,
  gradientFill: true,
  gradientDirection: 'vertical',
  stackedAreas: false,
  strokeWidth: 'thin',
  strokeOpacity: 1.0,
  smoothCurves: true,
  appleGradients: true,
  portfolioMode: false,
  hoverEffects: true,
  crosshair: false,
  currencyFormat: false,
  percentageFormat: false,
  showBaseline: false,
  baselineValue: 0,
};

// Stroke width mapping
const STROKE_WIDTH_MAP = {
  thin: 1,
  medium: 1.5,
  thick: 2,
} as const;

// Apple gradient definitions with proper opacity patterns
const APPLE_GRADIENTS = {
  income: {
    start: 'rgba(50, 215, 75, 0.4)',   // Apple green with 40% opacity
    end: 'rgba(50, 215, 75, 0.1)',     // Apple green with 10% opacity
  },
  spending: {
    start: 'rgba(255, 69, 58, 0.4)',   // Apple red with 40% opacity
    end: 'rgba(255, 69, 58, 0.1)',     // Apple red with 10% opacity
  },
  savings: {
    start: 'rgba(10, 132, 255, 0.4)',  // Apple blue with 40% opacity
    end: 'rgba(10, 132, 255, 0.1)',    // Apple blue with 10% opacity
  },
  investments: {
    start: 'rgba(191, 90, 242, 0.4)',  // Apple purple with 40% opacity
    end: 'rgba(191, 90, 242, 0.1)',    // Apple purple with 10% opacity
  },
  debt: {
    start: 'rgba(255, 159, 10, 0.4)',  // Apple orange with 40% opacity
    end: 'rgba(255, 159, 10, 0.1)',    // Apple orange with 10% opacity
  },
} as const;

// Custom tooltip for financial area data
const FinancialAreaTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  financialType?: 'currency' | 'percentage' | 'allocation' | 'number';
  stackedData?: boolean;
}> = memo(({ active, payload, label, financialType = 'number', stackedData = false }) => {
  if (!active || !payload || !payload.length) return null;

  const formatValue = (value: number) => {
    switch (financialType) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'allocation':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate total for stacked charts
  const total = stackedData 
    ? payload.reduce((sum, entry) => sum + (entry.value || 0), 0)
    : 0;

  return (
    <div className={cn(
      "bg-black/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-2xl",
      "border border-white/20 max-w-xs"
    )}>
      <p className="text-white/60 text-xs font-medium mb-2">
        {formatDate(label || '')}
      </p>
      
      {stackedData && total > 0 && (
        <div className="mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-xs">Total</span>
            <span className="text-white font-semibold text-sm">
              {formatValue(total)}
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const percentage = stackedData && total > 0 
            ? ((entry.value / total) * 100).toFixed(1)
            : null;
            
          return (
            <div key={index} className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-white/80 text-xs">
                  {entry.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white font-medium text-sm">
                  {formatValue(entry.value)}
                </span>
                {percentage && (
                  <span className="text-white/50 text-xs">
                    ({percentage}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

FinancialAreaTooltip.displayName = 'FinancialAreaTooltip';

// Main AreaChart component
export const AreaChart = forwardRef<ChartRef, AreaChartProps>(({
  // Area-specific props
  areaConfig = {},
  financialType = 'number',
  portfolioBreakdown = false,
  multiSeries = false,
  seriesColors,
  appleAnimation = true,
  precisionReduce = true,
  stackedData = false,
  stackNormalize = false,
  
  // GraphBase props
  data,
  series,
  title,
  subtitle,
  headerActions,
  
  // Styling
  className,
  style,
  
  // Chart configuration
  animation,
  tooltip,
  
  // Event handlers
  onDataPointClick,
  onDataPointHover,
  
  ...rest
}, ref) => {
  const internalRef = useRef<HTMLDivElement>(null);
  
  // Forward ref to internal element
  useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);
  
  // Merge area configuration with defaults
  const areaConfigMerged = useMemo(() => ({
    ...DEFAULT_AREA_CONFIG,
    ...areaConfig,
    // Auto-enable stacking if we have multiple series
    stackedAreas: areaConfig.stackedAreas ?? (multiSeries || stackedData),
    // Auto-enable portfolio mode for allocation data
    portfolioMode: areaConfig.portfolioMode ?? (financialType === 'allocation'),
  }), [areaConfig, multiSeries, stackedData, financialType]);

  // Process data for stacking if needed
  const processedData = useMemo(() => {
    if (!stackNormalize || !stackedData) return data;
    
    // Convert absolute values to percentages
    return data.map(point => {
      const numericKeys = Object.keys(point).filter(key => 
        key !== 'date' && 
        key !== 'label' && 
        typeof point[key] === 'number'
      );
      
      const total = numericKeys.reduce((sum, key) => sum + (point[key] as number || 0), 0);
      
      if (total === 0) return point;
      
      const normalizedPoint = { ...point };
      numericKeys.forEach(key => {
        normalizedPoint[key] = ((point[key] as number / total) * 100);
      });
      
      return normalizedPoint;
    });
  }, [data, stackNormalize, stackedData]);

  // Generate optimized series for area charts with Apple-standard animations
  const optimizedSeries = useMemo((): ChartSeries[] => {
    const hoverPreset = getChartAnimationPreset('hover');
    const strokeDuration = getOptimalAnimationDuration('chartDrawing'); // 800ms for stroke
    const fillDuration = getOptimalAnimationDuration('areaFill');        // 600ms for fill
    
    if (series) {
      return series.map((serie, index) => ({
        ...serie,
        strokeWidth: STROKE_WIDTH_MAP[areaConfigMerged.strokeWidth || 'thin'],
        fillOpacity: areaConfigMerged.fillOpacity,
        connectNulls: true,
        color: serie.color || (seriesColors?.[index]) || getGraphColor(
          ['income', 'spending', 'savings', 'investments', 'debt'][index] as any || 'neutral',
          'dark'
        ),
        // Apple-style coordinated stroke and fill animations
        animationBegin: 0,                    // Stroke starts immediately
        animationDuration: strokeDuration,    // 800ms stroke animation
        // Fill animation config (handled by Recharts internally)
        fillAnimationBegin: 100,             // Fill starts 100ms after stroke
        fillAnimationDuration: fillDuration, // 600ms fill animation
        // Hover effects
        activeDot: areaConfigMerged.hoverEffects ? {
          r: 4,
          fill: serie.color || getGraphColor(
            ['income', 'spending', 'savings', 'investments', 'debt'][index] as any || 'neutral',
            'dark'
          ),
          strokeWidth: 2,
          stroke: '#ffffff',
          style: {
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
            transition: `all ${hoverPreset.duration}ms ${hoverPreset.easing}`,
          }
        } : false,
      }));
    }
    
    // Auto-generate series from data
    if (processedData.length === 0) return [];
    
    const firstPoint = processedData[0];
    const numericKeys = Object.keys(firstPoint).filter(key => 
      key !== 'date' && 
      key !== 'label' && 
      typeof firstPoint[key] === 'number'
    );
    
    return numericKeys.slice(0, multiSeries ? 6 : 1).map((key, index) => {
      const color = seriesColors?.[index] || getGraphColor(
        ['income', 'spending', 'savings', 'investments', 'debt'][index] as any || 'neutral',
        'dark'
      );
      
      return {
        dataKey: key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        color,
        strokeWidth: STROKE_WIDTH_MAP[areaConfigMerged.strokeWidth || 'thin'],
        fillOpacity: areaConfigMerged.fillOpacity,
        connectNulls: true,
        // Apple-style coordinated stroke and fill animations
        animationBegin: 0,                    // Stroke starts immediately
        animationDuration: strokeDuration,    // 800ms stroke animation
        fillAnimationBegin: 100,             // Fill starts 100ms after stroke
        fillAnimationDuration: fillDuration, // 600ms fill animation
        // Hover effects
        activeDot: areaConfigMerged.hoverEffects ? {
          r: 4,
          fill: color,
          strokeWidth: 2,
          stroke: '#ffffff',
          style: {
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
            transition: `all ${hoverPreset.duration}ms ${hoverPreset.easing}`,
          }
        } : false,
      };
    });
  }, [processedData, series, areaConfigMerged.strokeWidth, areaConfigMerged.fillOpacity, multiSeries, seriesColors]);

  // Optimize data for performance if needed
  const optimizedData = useMemo(() => {
    if (!precisionReduce || processedData.length <= 100) return processedData;
    
    // Simple data reduction for large datasets
    const step = Math.ceil(processedData.length / 100);
    return processedData.filter((_, index) => index % step === 0);
  }, [processedData, precisionReduce]);

  // Enhanced animation configuration with coordinated fill and stroke
  const animationConfig = useMemo(() => {
    const areaAnimationPreset = getChartAnimationPreset('area');
    const reducedMotion = shouldReduceMotion();
    
    return {
      enable: appleAnimation && !reducedMotion,
      duration: areaAnimationPreset.duration, // 600ms for coordinated fill
      easing: areaAnimationPreset.easing,     // iOS ease-out
      delay: areaAnimationPreset.delay,       // 100ms delay for stroke-then-fill
      // Override with any custom animation settings
      ...animation,
      // Ensure reduced motion is respected
      ...(reducedMotion && { 
        enable: false, 
        duration: 0,
        delay: 0 
      }),
    };
  }, [appleAnimation, animation]);

  // Custom tooltip configuration
  const tooltipConfig = useMemo(() => ({
    show: true,
    ...tooltip,
  }), [tooltip]);

  // Custom tooltip component
  const customTooltip = useCallback((props: any) => (
    <FinancialAreaTooltip 
      {...props} 
      financialType={financialType}
      stackedData={areaConfigMerged.stackedAreas}
    />
  ), [financialType, areaConfigMerged.stackedAreas]);

  // Enhanced Y-axis formatter
  const yAxisFormatter = useCallback((value: number) => {
    if (financialType === 'currency') {
      // Shortened currency format for axis
      if (Math.abs(value) >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (Math.abs(value) >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      }
      return `$${value.toFixed(0)}`;
    }
    
    if (financialType === 'percentage' || financialType === 'allocation') {
      return `${value}%`;
    }
    
    return value.toLocaleString();
  }, [financialType]);

  // Generate portfolio composition summary if enabled
  const portfolioSummary = useMemo(() => {
    if (!areaConfigMerged.portfolioMode || !optimizedData.length || !optimizedSeries.length) return null;
    
    const latestData = optimizedData[optimizedData.length - 1];
    const total = optimizedSeries.reduce((sum, serie) => sum + (latestData[serie.dataKey] || 0), 0);
    
    if (total === 0) return null;
    
    return (
      <div className="flex items-center space-x-4 text-sm">
        <span className="text-white/60">Current Allocation:</span>
        {optimizedSeries.slice(0, 3).map(serie => {
          const value = latestData[serie.dataKey] || 0;
          const percentage = ((value / total) * 100).toFixed(1);
          
          return (
            <div key={serie.dataKey} className="flex items-center space-x-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: serie.color }}
              />
              <span className="text-white/80 text-xs">
                {serie.label}: {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    );
  }, [areaConfigMerged.portfolioMode, optimizedData, optimizedSeries]);

  return (
    <GraphBase
      ref={internalRef}
      // Core props
      data={optimizedData}
      type="area"
      series={optimizedSeries}
      
      // Header
      title={title}
      subtitle={subtitle}
      headerActions={
        <>
          {headerActions}
          {portfolioSummary}
        </>
      }
      
      // Chart configuration
      animation={animationConfig}
      tooltip={tooltipConfig}
      customTooltip={customTooltip}
      
      // Y-axis formatting
      yAxis={{
        show: true,
        tickFormatter: yAxisFormatter,
        domain: areaConfigMerged.showBaseline ? [areaConfigMerged.baselineValue, 'auto'] : undefined,
      }}
      
      // Grid configuration optimized for area charts
      grid={{
        show: true,
        horizontal: true,
        vertical: false,
        strokeDasharray: "1 1",
        opacity: 0.2,
      }}
      
      // Styling
      className={cn("area-chart", className)}
      style={style}
      
      // Event handlers
      onDataPointClick={onDataPointClick}
      onDataPointHover={onDataPointHover}
      
      {...rest}
    />
  );
});

AreaChart.displayName = 'AreaChart';

// Export memoized version
export default memo(AreaChart);