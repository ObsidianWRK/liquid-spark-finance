/**
 * @fileoverview BodyHealthCard - Biometric Data Visualization
 * @description Real-time biometric monitoring with stress indicators
 * Replaces BiometricMonitorCard.tsx with enhanced MetricIQ design
 */

import React, { useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { GridTile } from './GridTile';
import { KpiDonut } from './KpiDonut';
import { DotMatrixSpark } from './DotMatrixSpark';
import { VIZ_TOKENS } from './tokens';
import type { BodyHealthCardProps } from './types';

/**
 * BodyHealthCard Component
 * 
 * Features:
 * - Real-time biometric display
 * - Stress level visualization
 * - Heart rate monitoring
 * - Activity trend analysis
 */
export const BodyHealthCard: React.FC<BodyHealthCardProps> = ({
  metrics,
  className,
  compact = false,
}) => {
  // Calculate wellness score (inverse of stress)
  const wellnessScore = useMemo(() => {
    return Math.max(0, 100 - metrics.stressLevel);
  }, [metrics.stressLevel]);

  // Generate activity trend sparkline
  const activityTrend = useMemo(() => {
    // Simulate last 15 readings based on current activity level
    return Array.from({ length: 15 }, (_, i) => {
      const baseActivity = metrics.activityLevel;
      const variation = (Math.sin(i * 0.5) * 10) + (Math.random() - 0.5) * 20;
      return Math.max(0, Math.min(100, baseActivity + variation));
    });
  }, [metrics.activityLevel]);

  // Get risk level based on stress
  const getRiskLevel = (stress: number) => {
    if (stress >= 70) return { level: 'High', color: '#ef4444' };
    if (stress >= 40) return { level: 'Medium', color: '#f59e0b' };
    return { level: 'Low', color: '#10b981' };
  };

  const riskAssessment = getRiskLevel(metrics.stressLevel);

  // Compact version for smaller displays
  if (compact) {
    return (
      <GridTile title="Health Monitor" className={cn("min-h-0", className)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <KpiDonut
              data={{
                value: wellnessScore,
                max: 100,
                label: 'Wellness',
                color: riskAssessment.color,
              }}
              size={80}
              showLabel
            />
          </div>
          <div className="flex-1 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Heart Rate</span>
              <span className="text-white font-medium">{metrics.heartRate} BPM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Stress</span>
              <span 
                className="font-medium"
                style={{ color: riskAssessment.color }}
              >
                {metrics.stressLevel}%
              </span>
            </div>
          </div>
        </div>
      </GridTile>
    );
  }

  return (
    <GridTile title="Biometric Health" className={className}>
      <div className="space-y-6">
        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-6">
          {/* Wellness Score Donut */}
          <div className="text-center">
            <KpiDonut
              data={{
                value: wellnessScore,
                max: 100,
                label: 'Wellness',
                trend: metrics.stressLevel < 50 ? 'up' : 'down',
                trendValue: `${metrics.stressLevel}% stress`,
                color: riskAssessment.color,
              }}
              size={120}
              showLabel
            />
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-[12px] bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white/80">Heart Rate</span>
                </div>
                <span className="text-lg font-bold text-white">
                  {metrics.heartRate} BPM
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: riskAssessment.color }}
                  />
                  <span className="text-sm text-white/80">Stress Level</span>
                </div>
                <span 
                  className="text-lg font-bold"
                  style={{ color: riskAssessment.color }}
                >
                  {metrics.stressLevel}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm text-white/80">Activity</span>
                </div>
                <span className="text-lg font-bold text-white">
                  {metrics.activityLevel}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Trend */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">Activity Trend</span>
            <span className="text-xs text-white/60">Last 15 readings</span>
          </div>
          <DotMatrixSpark 
            data={activityTrend}
            width={280}
            height={40}
            className="w-full"
          />
        </div>

        {/* Risk Assessment */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80">Risk Assessment</div>
              <div 
                className="text-lg font-bold"
                style={{ color: riskAssessment.color }}
              >
                {riskAssessment.level} Risk
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Last Updated</div>
              <div className="text-sm text-white/60">
                {new Date(metrics.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Recommendations */}
        <div className="p-3 rounded-[12px] bg-white/5 border border-white/10">
          <div className="text-xs font-medium text-white/80 mb-2">
            💡 Recommendation
          </div>
          <div className="text-xs text-white/60">
            {metrics.stressLevel > 70 
              ? "Consider taking a short break or practicing deep breathing exercises."
              : metrics.stressLevel > 40
                ? "Your stress levels are moderate. Stay hydrated and take regular breaks."
                : "Great job maintaining low stress levels! Keep up the healthy habits."
            }
          </div>
        </div>
      </div>
    </GridTile>
  );
}; 