/**
 * Lightweight chart components to replace Recharts for simple use cases
 * Uses SVG and CSS for minimal bundle impact
 */
import React from 'react';

// Simple data types
interface ChartData {
  x: number | string;
  y: number;
  label?: string;
}

interface PieData {
  value: number;
  label: string;
  color: string;
}

// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getMinMax = (data: ChartData[]) => {
  const values = data.map((d) => d.y);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

// Simple Line Chart Component
interface SimpleLineChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  showDots?: boolean;
  className?: string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  width = 400,
  height = 200,
  strokeColor = '#3B82F6',
  strokeWidth = 2,
  showDots = true,
  className = '',
}) => {
  if (!data || data.length === 0) return null;

  const { min, max } = getMinMax(data);
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Create path
  const pathData = data
    .map((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + (1 - (point.y - min) / (max - min)) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" opacity="0.3" />

        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {showDots &&
          data.map((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y =
              padding + (1 - (point.y - min) / (max - min)) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={strokeColor}
                className="hover:r-6 transition-all duration-200"
              />
            );
          })}
      </svg>

      {/* Tooltip container */}
      <div className="absolute inset-0 pointer-events-none">
        {data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          const y = padding + (1 - (point.y - min) / (max - min)) * chartHeight;
          return (
            <div
              key={index}
              className="absolute opacity-0 hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-auto"
              style={{
                left: `${(x / width) * 100}%`,
                top: `${(y / height) * 100}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {point.label || point.x}: {formatCurrency(point.y)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple Area Chart Component
interface SimpleAreaChartProps extends SimpleLineChartProps {
  fillColor?: string;
  gradientId?: string;
}

export const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({
  data,
  width = 400,
  height = 200,
  strokeColor = '#3B82F6',
  fillColor = '#3B82F6',
  strokeWidth = 2,
  className = '',
  gradientId = 'areaGradient',
}) => {
  if (!data || data.length === 0) return null;

  const { min, max } = getMinMax(data);
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Create area path
  const linePath = data
    .map((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + (1 - (point.y - min) / (max - min)) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Complete area path
  const areaPath = `${linePath} L ${padding + chartWidth} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`;

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Gradient definition */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />

        {/* Top line */}
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Simple Pie Chart Component
interface SimplePieChartProps {
  data: PieData[];
  size?: number;
  innerRadius?: number;
  className?: string;
  showLabels?: boolean;
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({
  data,
  size = 200,
  innerRadius = 0,
  className = '',
  showLabels = true,
}) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const center = size / 2;
  const radius = (size - 20) / 2;

  let currentAngle = -90; // Start from top

  const segments = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate path
    const x1 = center + Math.cos(startRad) * radius;
    const y1 = center + Math.sin(startRad) * radius;
    const x2 = center + Math.cos(endRad) * radius;
    const y2 = center + Math.sin(endRad) * radius;

    const largeArcFlag = angle > 180 ? 1 : 0;

    let path;
    if (innerRadius > 0) {
      // Donut chart
      const innerX1 = center + Math.cos(startRad) * innerRadius;
      const innerY1 = center + Math.sin(startRad) * innerRadius;
      const innerX2 = center + Math.cos(endRad) * innerRadius;
      const innerY2 = center + Math.sin(endRad) * innerRadius;

      path = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${innerX2} ${innerY2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
        'Z',
      ].join(' ');
    } else {
      // Regular pie chart
      path = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');
    }

    currentAngle += angle;

    return {
      ...item,
      path,
      percentage: percentage * 100,
      midAngle: startAngle + angle / 2,
    };
  });

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size}>
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-1">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center text-xs text-white/80"
              >
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: segment.color }}
                />
                <span>
                  {segment.label}: {segment.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Bar Chart Component
interface SimpleBarChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  barColor?: string;
  className?: string;
  showValues?: boolean;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  width = 400,
  height = 200,
  barColor = '#3B82F6',
  className = '',
  showValues = true,
}) => {
  if (!data || data.length === 0) return null;

  const { min, max } = getMinMax(data);
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const barWidth = (chartWidth / data.length) * 0.8;
  const barSpacing = (chartWidth / data.length) * 0.2;

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height}>
        {data.map((point, index) => {
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
          const barHeight = ((point.y - min) / (max - min)) * chartHeight;
          const y = padding + chartHeight - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                className="hover:opacity-80 transition-opacity"
              />
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-white text-xs"
                >
                  {formatCurrency(point.y)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Multi-line chart for time series data
interface MultiLineData {
  [key: string]: number | string;
}

interface LineConfig {
  dataKey: string;
  stroke: string;
  label?: string;
}

interface MultiLineChartProps {
  data: MultiLineData[];
  lines: LineConfig[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
  xAxisKey?: string;
  showDots?: boolean;
  showLegend?: boolean;
}

export const MultiLineChart: React.FC<MultiLineChartProps> = ({
  data,
  lines,
  width = 400,
  height = 200,
  strokeWidth = 2,
  className = '',
  xAxisKey = 'x',
  showDots = true,
  showLegend = true,
}) => {
  if (!data || data.length === 0 || !lines || lines.length === 0) return null;

  // Get min/max for all line data
  const allValues = data.flatMap((item) =>
    lines.map((line) => Number(item[line.dataKey]) || 0)
  );
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - (showLegend ? 40 : 0);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    });
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height + (showLegend ? 40 : 0)}
        className="overflow-visible"
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="multiGrid"
            width="40"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 30"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect
          x={padding}
          y={padding}
          width={chartWidth}
          height={chartHeight}
          fill="url(#multiGrid)"
          opacity="0.3"
        />

        {/* Y-axis labels */}
        <g>
          {[0, 25, 50, 75, 100].map((value, index) => {
            const y = padding + chartHeight - (value / 100) * chartHeight;
            return (
              <g key={index}>
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-white text-xs"
                >
                  {value}
                </text>
                <line
                  x1={padding}
                  y1={y}
                  x2={padding + chartWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </g>

        {/* X-axis labels */}
        <g>
          {data.map((point, index) => {
            if (index % Math.ceil(data.length / 6) === 0) {
              const x = padding + (index / (data.length - 1)) * chartWidth;
              return (
                <text
                  key={index}
                  x={x}
                  y={padding + chartHeight + 20}
                  textAnchor="middle"
                  className="fill-white text-xs"
                >
                  {formatDate(String(point[xAxisKey]))}
                </text>
              );
            }
            return null;
          })}
        </g>

        {/* Draw lines */}
        {lines.map((line, lineIndex) => {
          const pathData = data
            .map((point, index) => {
              const x = padding + (index / (data.length - 1)) * chartWidth;
              const value = Number(point[line.dataKey]) || 0;
              const y =
                padding + (1 - (value - min) / (max - min)) * chartHeight;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');

          return (
            <g key={lineIndex}>
              {/* Line path */}
              <path
                d={pathData}
                fill="none"
                stroke={line.stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {showDots &&
                data.map((point, index) => {
                  const x = padding + (index / (data.length - 1)) * chartWidth;
                  const value = Number(point[line.dataKey]) || 0;
                  const y =
                    padding + (1 - (value - min) / (max - min)) * chartHeight;
                  return (
                    <circle
                      key={`${lineIndex}-${index}`}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={line.stroke}
                      className="hover:r-5 transition-all duration-200"
                    />
                  );
                })}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="flex justify-center space-x-6 mt-4">
          {lines.map((line, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-vueni-pill"
                style={{ backgroundColor: line.stroke }}
              />
              <span className="text-white text-xs">
                {line.label || line.dataKey}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Interactive tooltip overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {data.map((point, pointIndex) => {
          const x = padding + (pointIndex / (data.length - 1)) * chartWidth;
          return (
            <div
              key={pointIndex}
              className="absolute w-2 h-full pointer-events-auto group"
              style={{
                left: `${(x / width) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs p-2 rounded border border-white/20 z-10 whitespace-nowrap"
                style={{
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px',
                }}
              >
                <div className="font-medium mb-1">
                  {formatDate(String(point[xAxisKey]))}
                </div>
                {lines.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="flex items-center justify-between space-x-4"
                  >
                    <span>{line.label || line.dataKey}:</span>
                    <span className="font-medium">
                      {Math.round(Number(point[line.dataKey]) || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export all components
export default {
  SimpleLineChart,
  SimpleAreaChart,
  SimplePieChart,
  SimpleBarChart,
  MultiLineChart,
};
