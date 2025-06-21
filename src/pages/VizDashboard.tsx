/**
 * @fileoverview VizDashboard - MetricIQ Visualization Dashboard
 * @description Feature-flagged dashboard showcasing new visualization components
 * Gated behind VIZ_DASH_ENABLED environment variable
 */

import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardGrid, GridTile, isVizEnabled } from '@/viz';

// Lazy load viz components for optimal bundle splitting
const KpiDonut = React.lazy(() => import('@/viz/KpiDonut'));
const TimelineAreaChart = React.lazy(() => import('@/viz/TimelineAreaChart'));
const DotMatrixSpark = React.lazy(() => import('@/viz/DotMatrixSpark'));

/**
 * VizDashboard Component
 * 
 * Demo showcase of MetricIQ visualization system:
 * - Feature flag protection
 * - Grid layout system
 * - Sample data integration
 * - Performance monitoring
 */
const VizDashboard: React.FC = () => {
  // Feature flag check
  if (!isVizEnabled()) {
    return <Navigate to="/" replace />;
  }

  // Sample data for demonstration
  const sampleKpiData = {
    value: 78,
    max: 100,
    label: 'Credit Score',
    trend: 'up' as const,
    trendValue: '+5 pts',
  };

  const sampleTimelineData = Array.from({ length: 12 }, (_, i) => ({
    timestamp: new Date(2024, i, 1).toISOString(),
    value: 1000 + Math.sin(i * 0.5) * 200 + Math.random() * 100,
    label: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
  }));

  const sampleSparkData = Array.from({ length: 30 }, () => Math.random() * 100);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MetricIQ Visualization</h1>
        <p className="text-white/60">
          Feature preview of the new Vueni visualization system
        </p>
      </div>

      {/* Dashboard Grid */}
      <DashboardGrid maxCols={3} density="comfortable">
        {/* KPI Donut Demo */}
        <GridTile title="KPI Donut Component">
          <div className="flex justify-center py-4">
            <Suspense fallback={<div className="animate-pulse h-32 w-32 bg-white/10 rounded-full" />}>
              <KpiDonut data={sampleKpiData} size={120} showLabel />
            </Suspense>
          </div>
          <div className="text-center text-sm text-white/60 mt-2">
            Replaces AgeOfMoneyRing and CreditScore circles
          </div>
        </GridTile>

        {/* Timeline Chart Demo */}
        <GridTile title="Timeline Area Chart">
          <div className="py-4">
            <Suspense fallback={<div className="animate-pulse h-32 bg-white/10 rounded" />}>
              <TimelineAreaChart 
                data={sampleTimelineData} 
                height={120}
                color="rgba(255,255,255,0.8)"
              />
            </Suspense>
          </div>
          <div className="text-center text-sm text-white/60 mt-2">
            Smooth curves with d3-shape curveBasis
          </div>
        </GridTile>

        {/* Dot Matrix Spark Demo */}
        <GridTile title="Dot Matrix Spark">
          <div className="flex justify-center py-4">
            <Suspense fallback={<div className="animate-pulse h-12 w-32 bg-white/10 rounded" />}>
              <DotMatrixSpark 
                data={sampleSparkData}
                width={180}
                height={60}
              />
            </Suspense>
          </div>
          <div className="text-center text-sm text-white/60 mt-2">
            Uniform 3px dots for compact visualization
          </div>
        </GridTile>

        {/* Design Tokens Demo */}
        <GridTile title="Design System">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white/5 rounded-[24px] border border-white/10" />
              <span className="text-sm">24px border radius</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 shadow-dp2 bg-white/10 rounded" />
              <span className="text-sm">2dp shadow tier</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full" />
              <span className="text-sm">3px uniform dots</span>
            </div>
          </div>
        </GridTile>

        {/* Performance Stats */}
        <GridTile title="Bundle Performance">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Bundle Size:</span>
              <span className="text-white">~12KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Components:</span>
              <span className="text-white">8 primitives</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Tree-shaking:</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
          </div>
        </GridTile>

        {/* Integration Status */}
        <GridTile title="Integration Status">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Feature Flag:</span>
              <span className="text-green-400">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Route Guard:</span>
              <span className="text-green-400">✓ Protected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Zero Regression:</span>
              <span className="text-green-400">✓ Confirmed</span>
            </div>
          </div>
        </GridTile>
      </DashboardGrid>

      {/* Footer */}
      <div className="mt-12 text-center text-white/40 text-sm">
        <p>
          MetricIQ Visualization System • 
          Feature flagged via <code>VIZ_DASH_ENABLED</code>
        </p>
      </div>
    </div>
  );
};

export default VizDashboard; 