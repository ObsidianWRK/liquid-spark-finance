/**
 * LineChart - Apple-style line chart component
 * Extends GraphBase foundation with line-specific features
 * Based on Apple Human Interface Guidelines 2025
 */

import React, {
  memo,
  useMemo,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { cn } from '@/shared/lib/utils';
import { GraphBase } from './GraphBase';
import {
  appleGraphTokens,
  getGraphColor,
  getTextColor,
  getChartAnimationPreset,
  shouldReduceMotion,
  getOptimalAnimationDuration,
} from '@/theme/graph-tokens';
import {
  GraphBaseProps,
  ChartDataPoint,
  ChartSeries,
  ChartRef,
  TimeRangeOption,
} from './types';

// Line-specific configuration
export interface LineChartConfig {
  // Line styling
  smoothLines?: boolean;
  strokeWidth?: 'thin' | 'medium' | 'thick';
  lineCap?: 'round' | 'square' | 'butt';
  lineJoin?: 'round' | 'bevel' | 'miter';

  // Point styling
  showDots?: boolean;
  dotSize?: 'small' | 'medium' | 'large';
  activeDotSize?: 'small' | 'medium' | 'large';

  // Gradient fills
  gradientFill?: boolean;
  gradientOpacity?: number;

  // Interaction
  hoverEffects?: boolean;
  crosshair?: boolean;

  // Financial-specific
  currencyFormat?: boolean;
  percentageFormat?: boolean;
  trendIndicators?: boolean;
}

// Extended props for LineChart
export interface LineChartProps extends Omit<GraphBaseProps, 'type'> {
  lineConfig?: LineChartConfig;

  // Financial data helpers
  financialType?: 'currency' | 'percentage' | 'number';
  trendAnalysis?: boolean;

  // Multiple series shortcuts
  multiSeries?: boolean;
  seriesColors?: string[];

  // Apple-specific enhancements
  appleAnimation?: boolean;
  precisionReduce?: boolean;
}

// Default line chart configuration
const DEFAULT_LINE_CONFIG: LineChartConfig = {
  smoothLines: true,
  strokeWidth: 'medium',
  lineCap: 'round',
  lineJoin: 'round',
  showDots: false,
  dotSize: 'small',
  activeDotSize: 'medium',
  gradientFill: true,
  gradientOpacity: 0.1,
  hoverEffects: true,
  crosshair: false,
  currencyFormat: false,
  percentageFormat: false,
  trendIndicators: false,
};

// Stroke width mapping
const STROKE_WIDTH_MAP = {
  thin: 1.5,
  medium: 2,
  thick: 3,
} as const;

// Dot size mapping
const DOT_SIZE_MAP = {
  small: 3,
  medium: 4,
  large: 6,
} as const;

// Custom tooltip for financial data
const FinancialTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  financialType?: 'currency' | 'percentage' | 'number';
}> = memo(({ active, payload, label, financialType = 'number' }) => {
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
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={cn(
        'bg-black/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-2xl',
        'border border-white/20 max-w-xs'
      )}
    >
      <p className="text-white/60 text-xs font-medium mb-2">
        {formatDate(label || '')}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between space-x-3"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/80 text-xs">{entry.name}</span>
            </div>
            <span className="text-white font-medium text-sm">
              {formatValue(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

FinancialTooltip.displayName = 'FinancialTooltip';

// Main LineChart component
export const LineChart = forwardRef<ChartRef, LineChartProps>(
  (
    {
      // Line-specific props
      lineConfig = {},
      financialType = 'number',
      trendAnalysis = false,
      multiSeries = false,
      seriesColors,
      appleAnimation = true,
      precisionReduce = true,

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
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);

    // Forward ref to internal element
    useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    // Merge line configuration with defaults
    const lineConfigMerged = useMemo(
      () => ({
        ...DEFAULT_LINE_CONFIG,
        ...lineConfig,
      }),
      [lineConfig]
    );

    // Generate optimized series for line charts with Apple-standard animations
    const optimizedSeries = useMemo((): ChartSeries[] => {
      const hoverPreset = getChartAnimationPreset('hover');

      if (series) {
        return series.map((serie, index) => ({
          ...serie,
          strokeWidth:
            STROKE_WIDTH_MAP[lineConfigMerged.strokeWidth || 'medium'],
          connectNulls: true,
          color:
            serie.color ||
            seriesColors?.[index] ||
            getGraphColor(
              (['income', 'spending', 'savings', 'investments', 'debt'][
                index
              ] as any) || 'neutral',
              'dark'
            ),
          // Apple-style hover animations
          activeDot: {
            r: DOT_SIZE_MAP[lineConfigMerged.activeDotSize || 'medium'],
            fill:
              serie.color ||
              getGraphColor(
                (['income', 'spending', 'savings', 'investments', 'debt'][
                  index
                ] as any) || 'neutral',
                'dark'
              ),
            strokeWidth: 2,
            stroke: '#ffffff',
            style: {
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
              transition: `all ${hoverPreset.duration}ms ${hoverPreset.easing}`,
            },
          },
          dot: lineConfigMerged.showDots
            ? {
                r: DOT_SIZE_MAP[lineConfigMerged.dotSize || 'small'],
                fill: serie.color,
                strokeWidth: 1,
                stroke: '#ffffff',
              }
            : false,
        }));
      }

      // Auto-generate series from data
      if (data.length === 0) return [];

      const firstPoint = data[0];
      const numericKeys = Object.keys(firstPoint).filter(
        (key) =>
          key !== 'date' &&
          key !== 'label' &&
          typeof firstPoint[key] === 'number'
      );

      return numericKeys.slice(0, multiSeries ? 6 : 1).map((key, index) => {
        const color =
          seriesColors?.[index] ||
          getGraphColor(
            (['income', 'spending', 'savings', 'investments', 'debt'][
              index
            ] as any) || 'neutral',
            'dark'
          );

        return {
          dataKey: key,
          label:
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, ' $1'),
          color,
          strokeWidth:
            STROKE_WIDTH_MAP[lineConfigMerged.strokeWidth || 'medium'],
          connectNulls: true,
          // Apple-style hover animations
          activeDot: {
            r: DOT_SIZE_MAP[lineConfigMerged.activeDotSize || 'medium'],
            fill: color,
            strokeWidth: 2,
            stroke: '#ffffff',
            style: {
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
              transition: `all ${hoverPreset.duration}ms ${hoverPreset.easing}`,
            },
          },
          dot: lineConfigMerged.showDots
            ? {
                r: DOT_SIZE_MAP[lineConfigMerged.dotSize || 'small'],
                fill: color,
                strokeWidth: 1,
                stroke: '#ffffff',
              }
            : false,
        };
      });
    }, [
      data,
      series,
      lineConfigMerged.strokeWidth,
      lineConfigMerged.activeDotSize,
      lineConfigMerged.dotSize,
      lineConfigMerged.showDots,
      multiSeries,
      seriesColors,
    ]);

    // Optimize data for performance if needed
    const optimizedData = useMemo(() => {
      if (!precisionReduce || data.length <= 100) return data;

      // Simple data reduction for large datasets
      const step = Math.ceil(data.length / 100);
      return data.filter((_, index) => index % step === 0);
    }, [data, precisionReduce]);

    // Enhanced animation configuration with Apple standards
    const animationConfig = useMemo(() => {
      const lineAnimationPreset = getChartAnimationPreset('line');
      const reducedMotion = shouldReduceMotion();

      return {
        enable: appleAnimation && !reducedMotion,
        duration: lineAnimationPreset.duration,
        easing: lineAnimationPreset.easing,
        delay: lineAnimationPreset.delay,
        // Override with any custom animation settings
        ...animation,
        // Ensure reduced motion is respected
        ...(reducedMotion && {
          enable: false,
          duration: 0,
        }),
      };
    }, [appleAnimation, animation]);

    // Custom tooltip configuration
    const tooltipConfig = useMemo(
      () => ({
        show: true,
        ...tooltip,
      }),
      [tooltip]
    );

    // Custom tooltip component
    const customTooltip = useCallback(
      (props: any) => (
        <FinancialTooltip {...props} financialType={financialType} />
      ),
      [financialType]
    );

    // Enhanced Y-axis formatter
    const yAxisFormatter = useCallback(
      (value: number) => {
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

        if (financialType === 'percentage') {
          return `${value}%`;
        }

        return value.toLocaleString();
      },
      [financialType]
    );

    // Generate trend indicators if enabled
    const trendIndicator = useMemo(() => {
      if (!trendAnalysis || !data.length || !optimizedSeries.length)
        return null;

      const firstValue = data[0]?.[optimizedSeries[0].dataKey];
      const lastValue = data[data.length - 1]?.[optimizedSeries[0].dataKey];

      if (typeof firstValue !== 'number' || typeof lastValue !== 'number')
        return null;

      const change = lastValue - firstValue;
      const changePercent = (change / firstValue) * 100;
      const isPositive = change > 0;

      return (
        <div className="flex items-center space-x-2 text-sm">
          <div
            className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-full',
              isPositive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            )}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
              {isPositive ? (
                <path
                  d="M3.75 6.75L6 4.5L8.25 6.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M8.25 5.25L6 7.5L3.75 5.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <span className="font-medium">
              {changePercent > 0 ? '+' : ''}
              {changePercent.toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }, [trendAnalysis, data, optimizedSeries]);

    return (
      <GraphBase
        ref={internalRef}
        // Core props
        data={optimizedData}
        type="line"
        series={optimizedSeries}
        // Header
        title={title}
        subtitle={subtitle}
        headerActions={
          <>
            {headerActions}
            {trendIndicator}
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
        }}
        // Grid configuration optimized for line charts
        grid={{
          show: true,
          horizontal: true,
          vertical: false,
          strokeDasharray: '2 2',
          opacity: 0.3,
        }}
        // Styling
        className={cn('line-chart', className)}
        style={style}
        // Event handlers
        onDataPointClick={onDataPointClick}
        onDataPointHover={onDataPointHover}
        {...rest}
      />
    );
  }
);

LineChart.displayName = 'LineChart';

// Export memoized version
export default memo(LineChart);
