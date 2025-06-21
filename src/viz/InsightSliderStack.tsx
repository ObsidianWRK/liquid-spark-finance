/**
 * @fileoverview InsightSliderStack - Savings Goals Visualization
 * @description Multi-layered savings goal progress with segment sliders
 * Replaces SavingsGoals.tsx with MetricIQ design patterns
 */

import React, { useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { GridTile } from './GridTile';
import { SegmentSlider } from './SegmentSlider';
import { VIZ_TOKENS } from './tokens';
import type { InsightSliderStackProps } from './types';

/**
 * InsightSliderStack Component
 * 
 * Features:
 * - Stacked progress visualization
 * - Priority-based color coding
 * - Interactive goal selection
 * - Deadline urgency indicators
 */
export const InsightSliderStack: React.FC<InsightSliderStackProps> = ({
  goals,
  className,
  onGoalClick,
}) => {
  // Process goals with color coding
  const processedGoals = useMemo(() => {
    return goals.map((goal, index) => {
      const progress = (goal.current / goal.target) * 100;
      const daysLeft = Math.ceil(
        (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Color based on priority and urgency
      let color = VIZ_TOKENS.colors.WHITE_60;
      if (goal.priority === 'high') {
        color = daysLeft < 30 ? '#ef4444' : '#f59e0b'; // Red if urgent, amber if high priority
      } else if (goal.priority === 'medium') {
        color = '#6366f1'; // Indigo for medium
      } else {
        color = '#10b981'; // Green for low priority
      }

      return {
        ...goal,
        progress,
        daysLeft,
        color,
        segments: [
          {
            value: goal.current,
            color,
            label: `${goal.title} Progress`,
          },
          {
            value: goal.target - goal.current,
            color: VIZ_TOKENS.colors.WHITE_10,
            label: `Remaining`,
          },
        ],
      };
    });
  }, [goals]);

  // Overall progress summary
  const totalProgress = useMemo(() => {
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
    return totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  }, [goals]);

  return (
    <GridTile title="Savings Goals" className={className}>
      <div className="space-y-6">
        {/* Overall Progress */}
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-white">
            {totalProgress.toFixed(1)}%
          </div>
          <div className="text-sm text-white/60">Overall Progress</div>
          <SegmentSlider 
            segments={[
              {
                value: totalProgress,
                color: VIZ_TOKENS.colors.WHITE_80,
                label: 'Completed',
              },
              {
                value: 100 - totalProgress,
                color: VIZ_TOKENS.colors.WHITE_10,
                label: 'Remaining',
              },
            ]}
            className="h-2"
          />
        </div>

        {/* Individual Goals */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-white/80">
            Individual Goals ({goals.length})
          </div>
          
          <div className="space-y-3">
            {processedGoals.map((goal) => (
              <div 
                key={goal.id}
                className={cn(
                  "p-4 rounded-[12px] bg-white/5 border border-white/10",
                  "hover:bg-white/10 transition-all duration-200",
                  onGoalClick && "cursor-pointer"
                )}
                onClick={() => onGoalClick?.(goal.id)}
              >
                {/* Goal Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <span className="font-medium text-white/90">
                      {goal.title}
                    </span>
                    <span 
                      className={cn(
                        "px-2 py-1 rounded-vueni-pill text-xs font-medium",
                        goal.priority === 'high' && "bg-red-500/20 text-red-400",
                        goal.priority === 'medium' && "bg-blue-500/20 text-blue-400",
                        goal.priority === 'low' && "bg-green-500/20 text-green-400"
                      )}
                    >
                      {goal.priority}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      ${goal.current.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/60">
                      of ${goal.target.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <SegmentSlider 
                  segments={goal.segments}
                  className="h-2 mb-3"
                />

                {/* Goal Footer */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">
                    {goal.progress.toFixed(1)}% complete
                  </span>
                  <span 
                    className={cn(
                      "font-medium",
                      goal.daysLeft < 30 ? "text-red-400" : 
                      goal.daysLeft < 90 ? "text-yellow-400" : 
                      "text-green-400"
                    )}
                  >
                    {goal.daysLeft > 0 
                      ? `${goal.daysLeft} days left`
                      : `${Math.abs(goal.daysLeft)} days overdue`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-3 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                {goals.filter(g => (g.current / g.target) >= 1).length}
              </div>
              <div className="text-xs text-white/60">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {goals.filter(g => g.priority === 'high').length}
              </div>
              <div className="text-xs text-white/60">High Priority</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                ${goals.reduce((sum, g) => sum + g.target, 0).toLocaleString()}
              </div>
              <div className="text-xs text-white/60">Total Target</div>
            </div>
          </div>
        </div>
      </div>
    </GridTile>
  );
}; 