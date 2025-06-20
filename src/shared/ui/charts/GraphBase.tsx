/**
 * GraphBase - Apple-style foundation component for all charts
 * Based on Apple Human Interface Guidelines 2025
 * Provides consistent styling, accessibility, and behavior for all chart types
 */

import React, {
  memo,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  BarChart,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Area,
  Bar,
  Scatter,
  Cell,
} from 'recharts';
import { cn } from '@/shared/lib/utils';
import {
  appleGraphTokens,
  getGraphColor,
  getTextColor,
  getBackgroundColor,
  generateGraphCSSProperties,
  shouldReduceMotion,
  getOptimalAnimationDuration,
} from '@/theme/graph-tokens';
import {
  GraphBaseProps,
  ChartType,
  TimeRangeOption,
  LoadingState,
  ChartRef,
  ChartDataPoint,
  ChartSeries,
} from './types';
import TimeRangeToggle from './TimeRangeToggle';
import TimeRangeToggleRadix from './TimeRangeToggleRadix';
import { useTimeRange } from '@/shared/hooks/useTimeRange';

// Time control component with Apple-style segmented control
const TimeControl: React.FC<{
  currentRange: TimeRangeOption;
  options: TimeRangeOption[];
  onChange: (range: TimeRangeOption) => void;
  className?: string;
}> = memo(({ currentRange, options, onChange, className }) => {
  return (
    <div
      className={cn(
        'flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-1',
        'border border-white/10',
        className
      )}
      role="tablist"
      aria-label="Time range selection"
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent',
            currentRange === option
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-white/70 hover:text-white/90 hover:bg-white/5'
          )}
          role="tab"
          aria-selected={currentRange === option}
          tabIndex={currentRange === option ? 0 : -1}
        >
          {option}
        </button>
      ))}
    </div>
  );
});

TimeControl.displayName = 'TimeControl';

// Chart header with Apple typography hierarchy
const ChartHeader: React.FC<{
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}> = memo(({ title, subtitle, actions, className }) => {
  if (!title && !subtitle && !actions) return null;

  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div className="space-y-1">
        {title && (
          <h2
            className="text-xl font-semibold text-white leading-tight"
            style={{
              fontFamily: appleGraphTokens.typography.fontFamily.primary,
              fontSize: appleGraphTokens.typography.fontSize.chartTitle,
              fontWeight: appleGraphTokens.typography.fontWeight.chartTitle,
            }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            className="text-sm text-white/60 leading-normal"
            style={{
              fontFamily: appleGraphTokens.typography.fontFamily.primary,
              fontSize: appleGraphTokens.typography.fontSize.axisLabel,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
});

ChartHeader.displayName = 'ChartHeader';

// Apple-style loading skeleton
const ChartSkeleton: React.FC<{
  type: ChartType;
  height?: number;
  showTitle?: boolean;
  showLegend?: boolean;
  className?: string;
}> = memo(
  ({ type, height = 300, showTitle = true, showLegend = false, className }) => {
    const reducedMotion = shouldReduceMotion();

    return (
      <div className={cn(!reducedMotion && 'animate-pulse', className)}>
        {showTitle && (
          <div className="mb-6">
            <div className="h-5 bg-white/10 rounded-md w-48 mb-2"></div>
            <div className="h-3 bg-white/5 rounded-md w-32"></div>
          </div>
        )}

        <div
          className="bg-white/5 rounded-lg flex items-end justify-center space-x-1 p-4"
          style={{ height }}
        >
          {/* Skeleton bars/lines based on chart type */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-t-sm flex-1"
              style={{
                height: `${Math.random() * 60 + 20}%`,
                animationDelay: reducedMotion ? '0ms' : `${i * 100}ms`,
                transition: reducedMotion ? 'none' : undefined,
              }}
            />
          ))}
        </div>

        {showLegend && (
          <div className="flex justify-center space-x-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white/10 rounded-full"></div>
                <div className="h-3 bg-white/10 rounded w-16"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ChartSkeleton.displayName = 'ChartSkeleton';

// Error state component
const ChartError: React.FC<{
  error: string | Error;
  onRetry?: () => void;
  showRetry?: boolean;
  retryText?: string;
  className?: string;
}> = memo(
  ({ error, onRetry, showRetry = true, retryText = 'Retry', className }) => {
    const errorMessage = error instanceof Error ? error.message : error;

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center h-64 text-center space-y-4',
          className
        )}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">
            Unable to load chart
          </h3>
          <p className="text-sm text-white/60 max-w-md">
            {errorMessage || 'An error occurred while loading the chart data.'}
          </p>
        </div>

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              'bg-blue-500/20 text-blue-300 border border-blue-500/30',
              'hover:bg-blue-500/30 hover:border-blue-500/50',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent',
              'transition-all duration-200'
            )}
          >
            {retryText}
          </button>
        )}
      </div>
    );
  }
);

ChartError.displayName = 'ChartError';

// Accessible data table alternative for charts
const ChartDataTable: React.FC<{
  data: ChartDataPoint[];
  series: ChartSeries[];
  title?: string;
  className?: string;
}> = memo(({ data, series, title, className }) => {
  if (!data.length || !series.length) return null;

  const formatValue = useCallback((value: number, dataKey: string) => {
    // Auto-format based on common financial patterns
    if (
      dataKey.toLowerCase().includes('amount') ||
      dataKey.toLowerCase().includes('value')
    ) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(value);
    }
    if (
      dataKey.toLowerCase().includes('percent') ||
      dataKey.toLowerCase().includes('rate')
    ) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  }, []);

  const formatDate = useCallback((dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }, []);

  return (
    <div className={cn('chart-data-table-container mt-6', className)}>
      <table
        className="chart-data-table"
        role="table"
        aria-label={`Data table for ${title || 'chart'}`}
      >
        <caption className="sr-only">
          {title ? `Data table representation of ${title}` : 'Chart data table'}
          {` with ${data.length} data points and ${series.length} data series`}
        </caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            {series.map((serie) => (
              <th key={serie.dataKey} scope="col">
                {serie.label || serie.dataKey}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((point, rowIndex) => (
            <tr key={rowIndex}>
              <th scope="row">
                {point.date
                  ? formatDate(point.date)
                  : point.label || `Row ${rowIndex + 1}`}
              </th>
              {series.map((serie) => (
                <td key={serie.dataKey}>
                  {point[serie.dataKey] !== undefined
                    ? formatValue(point[serie.dataKey] as number, serie.dataKey)
                    : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

ChartDataTable.displayName = 'ChartDataTable';

// Live region for announcing chart updates
const ChartLiveRegion: React.FC<{
  announcement: string;
  className?: string;
}> = memo(({ announcement, className }) => {
  return (
    <div
      className={cn('chart-live-region sr-only', className)}
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {announcement}
    </div>
  );
});

ChartLiveRegion.displayName = 'ChartLiveRegion';

// Enhanced GraphBase component with TimeRange integration
export const GraphBase = forwardRef<ChartRef, GraphBaseProps>(
  (
    {
      // Core props
      data,
      type,
      series,

      // Header props
      title,
      subtitle,
      headerActions,

      // Time controls - enhanced with context support
      timeRange = '1M',
      timeControls,
      onTimeRangeChange,
      useGlobalTimeRange = false, // New prop to use global context

      // Dimensions and styling
      dimensions = { height: 300, responsive: true },
      className,
      style,

      // Chart configuration
      xAxis = { show: true },
      yAxis = { show: true },
      grid = { show: true, horizontal: true, vertical: false },
      legend = { show: false },
      tooltip = { show: true },
      animation = { enable: true, duration: 800 },

      // State management
      loading = false,
      loadingState = 'idle',
      error,
      errorConfig = { showRetry: true },

      // Accessibility
      accessibility = {
        keyboardNavigation: true,
        screenReaderSupport: true,
        dataTableAlternative: true,
        liveRegion: true,
      },

      // Performance
      virtualization = false,
      dataThreshold = 1000,

      // Event handlers
      onDataPointClick,
      onDataPointHover,
      onChartReady,
      onChartError,

      // Advanced
      customTooltip,
      customLegend,
      children,

      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
    const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
    const [showDataTable, setShowDataTable] = useState(false);

    // Conditionally use global time range context
    const timeRangeContext = useGlobalTimeRange
      ? useTimeRange({
          stabilizeCallbacks: true,
          memoizeData: true,
          enableCache: true,
        })
      : null;

    // Expose ref imperatively
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    // Detect theme changes
    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Generate theme-based CSS properties
    const cssProperties = useMemo(
      () => generateGraphCSSProperties(currentTheme),
      [currentTheme]
    );

    // Get current time range - use context if available, otherwise use prop
    const currentTimeRange = useGlobalTimeRange
      ? timeRangeContext?.selectedRange || timeRange
      : timeRange;

    // Filter data based on time range when using global context
    const processedData = useMemo(() => {
      if (!useGlobalTimeRange || !timeRangeContext) {
        return data;
      }

      // Use context to filter data if it has date information
      if (data.length > 0 && data[0].date) {
        return timeRangeContext.getFilteredData(data, 'date', 'iso');
      }

      return data;
    }, [data, useGlobalTimeRange, timeRangeContext]);

    // Auto-generate series if not provided
    const computedSeries = useMemo((): ChartSeries[] => {
      if (series) return series;

      // Auto-detect numeric fields for series
      if (processedData.length === 0) return [];

      const firstPoint = processedData[0];
      const numericKeys = Object.keys(firstPoint).filter(
        (key) =>
          key !== 'date' &&
          key !== 'label' &&
          typeof firstPoint[key] === 'number'
      );

      return numericKeys.slice(0, 6).map((key, index) => ({
        dataKey: key,
        label:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        color: getGraphColor(
          (['income', 'spending', 'savings', 'investments', 'debt'][
            index
          ] as any) || 'neutral',
          currentTheme
        ),
      }));
    }, [processedData, series, currentTheme]);

    // Handle time range changes
    const handleTimeRangeChange = useCallback(
      (range: TimeRangeOption) => {
        if (useGlobalTimeRange && timeRangeContext) {
          // Use global context
          timeRangeContext.setTimeRange(range);
        } else {
          // Use local prop callback
          onTimeRangeChange?.(range);
        }
      },
      [useGlobalTimeRange, timeRangeContext, onTimeRangeChange]
    );

    // Handle chart ready and announce changes
    useEffect(() => {
      if (!loading && !error && processedData.length > 0 && !isReady) {
        setIsReady(true);
        onChartReady?.();

        // Announce chart is ready for accessibility
        if (accessibility.liveRegion) {
          const seriesCount = computedSeries.length;
          const dataCount = processedData.length;
          setLiveAnnouncement(
            `Chart loaded with ${dataCount} data points across ${seriesCount} data series. ${title || ''}`
          );
          // Clear announcement after screen reader has time to announce
          setTimeout(() => setLiveAnnouncement(''), 3000);
        }
      }
    }, [
      loading,
      error,
      processedData.length,
      isReady,
      onChartReady,
      accessibility.liveRegion,
      computedSeries.length,
      title,
    ]);

    // Announce data changes
    useEffect(() => {
      if (isReady && accessibility.liveRegion && processedData.length > 0) {
        const timeoutId = setTimeout(() => {
          setLiveAnnouncement(
            `Chart data updated with ${processedData.length} data points`
          );
          setTimeout(() => setLiveAnnouncement(''), 2000);
        }, 500); // Debounce rapid updates

        return () => clearTimeout(timeoutId);
      }
    }, [processedData, isReady, accessibility.liveRegion]);

    // Handle errors
    useEffect(() => {
      if (error && onChartError) {
        const errorObj = error instanceof Error ? error : new Error(error);
        onChartError(errorObj);
      }
    }, [error, onChartError]);

    // Render chart based on type
    const renderChart = useCallback(() => {
      const commonProps = {
        data: processedData,
        margin: { top: 20, right: 30, left: 20, bottom: 20 },
      };

      const renderAxis = () => (
        <>
          {xAxis.show && (
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: appleGraphTokens.typography.fontSize.axisLabel,
                fill: getTextColor('secondary', currentTheme),
              }}
              tickFormatter={xAxis.tickFormatter}
              domain={xAxis.domain}
              type={xAxis.type}
              scale={xAxis.scale}
            />
          )}
          {yAxis.show && (
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: appleGraphTokens.typography.fontSize.axisLabel,
                fill: getTextColor('secondary', currentTheme),
              }}
              tickFormatter={yAxis.tickFormatter}
              domain={yAxis.domain}
              type={yAxis.type}
              scale={yAxis.scale}
            />
          )}
        </>
      );

      const renderGrid = () =>
        grid.show && (
          <CartesianGrid
            strokeDasharray={grid.strokeDasharray || '3 3'}
            horizontal={grid.horizontal}
            vertical={grid.vertical}
            stroke={appleGraphTokens.colors.separator[currentTheme]}
            strokeWidth={grid.strokeWidth || 1}
            opacity={grid.opacity || 0.5}
          />
        );

      const renderTooltip = () =>
        tooltip.show && (
          <Tooltip
            content={customTooltip}
            formatter={tooltip.formatter}
            labelFormatter={tooltip.labelFormatter}
            contentStyle={{
              backgroundColor: getBackgroundColor(
                'system',
                'secondary',
                currentTheme
              ),
              border: `1px solid ${appleGraphTokens.colors.separator[currentTheme]}`,
              borderRadius: appleGraphTokens.borderRadius.tooltip,
              fontSize: appleGraphTokens.typography.fontSize.tooltip,
              color: getTextColor('primary', currentTheme),
              ...tooltip.contentStyle,
            }}
            animationDuration={
              animation.enable && !shouldReduceMotion() ? animation.duration : 0
            }
            // Enhanced accessibility for tooltips
            wrapperStyle={{
              ...tooltip.contentStyle,
              zIndex: 1000,
            }}
            itemStyle={{
              color: getTextColor('primary', currentTheme),
            }}
            allowEscapeViewBox={{ x: true, y: true }}
          />
        );

      const renderLegend = () =>
        legend.show && (
          <Legend
            content={customLegend}
            verticalAlign={legend.position === 'top' ? 'top' : 'bottom'}
            align={legend.align}
            layout={legend.layout}
            wrapperStyle={{
              fontSize: appleGraphTokens.typography.fontSize.legend,
              color: getTextColor('secondary', currentTheme),
            }}
          />
        );

      switch (type) {
        case 'line':
          return (
            <LineChart {...commonProps}>
              {renderGrid()}
              {renderAxis()}
              {renderTooltip()}
              {renderLegend()}
              {computedSeries.map((serie) => (
                <Line
                  key={serie.dataKey}
                  type="monotone"
                  dataKey={serie.dataKey}
                  stroke={serie.color}
                  strokeWidth={
                    serie.strokeWidth ||
                    appleGraphTokens.dimensions.strokeWidth.medium
                  }
                  dot={false}
                  connectNulls={serie.connectNulls}
                  hide={serie.hide}
                  animationDuration={
                    animation.enable && !shouldReduceMotion()
                      ? animation.duration
                      : 0
                  }
                  animationEasing={animation.easing}
                />
              ))}
            </LineChart>
          );

        case 'area':
          return (
            <AreaChart {...commonProps}>
              {renderGrid()}
              {renderAxis()}
              {renderTooltip()}
              {renderLegend()}
              {computedSeries.map((serie) => (
                <Area
                  key={serie.dataKey}
                  type="monotone"
                  dataKey={serie.dataKey}
                  stroke={serie.color}
                  fill={serie.color}
                  fillOpacity={serie.fillOpacity || 0.2}
                  strokeWidth={
                    serie.strokeWidth ||
                    appleGraphTokens.dimensions.strokeWidth.thin
                  }
                  connectNulls={serie.connectNulls}
                  hide={serie.hide}
                  animationDuration={
                    animation.enable && !shouldReduceMotion()
                      ? animation.duration
                      : 0
                  }
                  animationEasing={animation.easing}
                />
              ))}
            </AreaChart>
          );

        case 'bar':
        case 'stackedBar':
          return (
            <BarChart {...commonProps}>
              {renderGrid()}
              {renderAxis()}
              {renderTooltip()}
              {renderLegend()}
              {computedSeries.map((serie) => (
                <Bar
                  key={serie.dataKey}
                  dataKey={serie.dataKey}
                  fill={serie.color}
                  hide={serie.hide}
                  stackId={type === 'stackedBar' ? 'stack' : undefined}
                  animationDuration={
                    animation.enable && !shouldReduceMotion()
                      ? animation.duration
                      : 0
                  }
                  animationEasing={animation.easing}
                />
              ))}
            </BarChart>
          );

        case 'scatter':
          return (
            <ScatterChart {...commonProps}>
              {renderGrid()}
              {renderAxis()}
              {renderTooltip()}
              {renderLegend()}
              {computedSeries.map((serie) => (
                <Scatter
                  key={serie.dataKey}
                  dataKey={serie.dataKey}
                  fill={serie.color}
                  hide={serie.hide}
                />
              ))}
            </ScatterChart>
          );

        default:
          return null;
      }
    }, [
      processedData,
      type,
      computedSeries,
      currentTheme,
      xAxis,
      yAxis,
      grid,
      tooltip,
      legend,
      animation,
      customTooltip,
      customLegend,
    ]);

    // Show loading state
    if (loading || loadingState === 'loading') {
      return (
        <div
          ref={containerRef}
          className={cn('w-full', className)}
          style={{ ...cssProperties, ...style }}
          {...rest}
        >
          <ChartSkeleton
            type={type}
            height={dimensions.height}
            showTitle={!!title}
            showLegend={legend.show}
          />
        </div>
      );
    }

    // Show error state
    if (error || loadingState === 'error') {
      return (
        <div
          ref={containerRef}
          className={cn('w-full', className)}
          style={{ ...cssProperties, ...style }}
          {...rest}
        >
          <ChartHeader
            title={title}
            subtitle={subtitle}
            actions={headerActions}
          />
          <ChartError
            error={error || 'Unknown error occurred'}
            onRetry={errorConfig.onRetry}
            showRetry={errorConfig.showRetry}
            retryText={errorConfig.retryText}
          />
        </div>
      );
    }

    // Show empty state
    if (!processedData || processedData.length === 0) {
      return (
        <div
          ref={containerRef}
          className={cn('w-full', className)}
          style={{ ...cssProperties, ...style }}
          {...rest}
        >
          <ChartHeader
            title={title}
            subtitle={subtitle}
            actions={headerActions}
          />
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">
                No data available
              </h3>
              <p className="text-sm text-white/60">
                There's no data to display in this chart yet.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Handle keyboard events for chart navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (!accessibility.keyboardNavigation) return;

        const { key, altKey, ctrlKey } = event;

        // Alt+T toggles data table (standard accessibility pattern)
        if (altKey && key.toLowerCase() === 't') {
          event.preventDefault();
          setShowDataTable((prev) => !prev);
          setLiveAnnouncement(
            showDataTable
              ? 'Data table hidden, returning to chart view'
              : 'Data table shown, displaying tabular data'
          );
          setTimeout(() => setLiveAnnouncement(''), 2000);
          return;
        }

        // Add more keyboard shortcuts as needed
        if (ctrlKey && key === 'Enter') {
          event.preventDefault();
          // Could trigger chart details or summary
          setLiveAnnouncement(
            `Chart summary: ${title || 'Chart'} with ${processedData.length} data points`
          );
          setTimeout(() => setLiveAnnouncement(''), 3000);
        }
      },
      [
        accessibility.keyboardNavigation,
        showDataTable,
        title,
        processedData.length,
      ]
    );

    // Main render
    return (
      <div
        ref={containerRef}
        className={cn('w-full chart-component', className)}
        style={{ ...cssProperties, ...style }}
        role="img"
        aria-label={
          accessibility.ariaLabel ||
          `${type} chart${title ? ` showing ${title}` : ''}`
        }
        aria-describedby={accessibility.ariaDescribedBy}
        onKeyDown={handleKeyDown}
        tabIndex={accessibility.keyboardNavigation ? 0 : -1}
        {...rest}
      >
        {/* Header with title and actions */}
        <ChartHeader
          title={title}
          subtitle={subtitle}
          actions={
            <>
              {headerActions}
              {timeControls?.show &&
                (useGlobalTimeRange ? (
                  <TimeRangeToggleRadix
                    value={currentTimeRange}
                    onChange={handleTimeRangeChange}
                    options={timeControls.options}
                    size="md"
                    aria-label="Chart time range selection"
                    disabled={loading || !!error}
                    showLabels={false}
                  />
                ) : (
                  <TimeControl
                    currentRange={currentTimeRange}
                    options={timeControls.options}
                    onChange={handleTimeRangeChange}
                  />
                ))}
            </>
          }
        />

        {/* Chart container */}
        <div
          className="relative"
          style={{
            height: dimensions.height,
            minHeight: dimensions.minHeight,
            maxHeight: dimensions.maxHeight,
          }}
        >
          {dimensions.responsive ? (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            renderChart()
          )}

          {children}
        </div>

        {/* Live region for accessibility announcements */}
        {accessibility.liveRegion && liveAnnouncement && (
          <ChartLiveRegion announcement={liveAnnouncement} />
        )}

        {/* Accessible data table alternative */}
        {accessibility.dataTableAlternative &&
          (showDataTable || accessibility.screenReaderSupport) && (
            <div className={showDataTable ? '' : 'sr-only'}>
              <ChartDataTable
                data={processedData}
                series={computedSeries}
                title={title}
              />
            </div>
          )}

        {/* Keyboard shortcuts help */}
        {accessibility.keyboardNavigation && (
          <div className="sr-only">
            Press Alt+T to toggle data table view. Press Ctrl+Enter for chart
            summary.
          </div>
        )}
      </div>
    );
  }
);

GraphBase.displayName = 'GraphBase';

// Export memoized version
export default memo(GraphBase);
