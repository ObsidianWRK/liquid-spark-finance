import React, { useEffect, useState } from 'react';
import { AlertTriangle, Heart, Clock, Shield, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';
import { InterventionEvent } from '../types';

interface InterventionNudgeProps {
  event: InterventionEvent;
  onDismiss: () => void;
  onProceedAnyway: () => void;
  onTakeBreathing: () => void;
  className?: string;
}

export const InterventionNudge: React.FC<InterventionNudgeProps> = ({
  event,
  onDismiss,
  onProceedAnyway,
  onTakeBreathing,
  className,
}) => {
  const [countdown, setCountdown] = useState(
    event.policy.actions.delayPurchase
  );
  const [showBreathingOption, setShowBreathingOption] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Show breathing option after 3 seconds
    const timer = setTimeout(() => setShowBreathingOption(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getStressColor = (score: number) => {
    if (score >= 80) return 'text-red-400 border-red-500/30 bg-red-500/10';
    if (score >= 60)
      return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
  };

  const getStressIcon = (score: number) => {
    if (score >= 80) return <AlertTriangle className="w-5 h-5" />;
    if (score >= 60) return <Heart className="w-5 h-5" />;
    return <Shield className="w-5 h-5" />;
  };

  const getStressMessage = (score: number) => {
    if (score >= 80)
      return 'High stress detected! Consider taking a moment to breathe before this purchase.';
    if (score >= 60)
      return 'Elevated stress noticed. This might be a good time to pause and reflect.';
    return 'Mild stress detected. Would you like to take a moment before proceeding?';
  };

  return (
    <Card
      className={cn(
        'fixed bottom-4 right-4 w-80 z-50 shadow-2xl border',
        getStressColor(event.stressLevel.score),
        className
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStressIcon(event.stressLevel.score)}
            <h3 className="font-semibold text-sm">Spending Nudge</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
            onClick={onDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Stress Level Indicator */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Stress Level</span>
            <span>{event.stressLevel.score}/100</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                event.stressLevel.score >= 80
                  ? 'bg-red-400'
                  : event.stressLevel.score >= 60
                    ? 'bg-orange-400'
                    : 'bg-yellow-400'
              )}
              style={{ width: `${event.stressLevel.score}%` }}
            />
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-white/90 mb-4">
          {getStressMessage(event.stressLevel.score)}
        </p>

        {/* Countdown Timer */}
        {countdown > 0 && (
          <div className="flex items-center justify-center mb-4 p-2 bg-white/10 rounded-lg">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Cooling off: {countdown}s
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {showBreathingOption && event.policy.actions.breathingExercise && (
            <Button
              onClick={onTakeBreathing}
              variant="outline"
              size="sm"
              className="w-full bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
            >
              <Heart className="w-4 h-4 mr-2" />
              Take a 30-second breathing break
            </Button>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
              className="flex-1 bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
            >
              Cancel Purchase
            </Button>

            <Button
              onClick={onProceedAnyway}
              disabled={countdown > 0}
              size="sm"
              className={cn(
                'flex-1',
                countdown > 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
              )}
            >
              {countdown > 0 ? `Wait ${countdown}s` : 'Proceed Anyway'}
            </Button>
          </div>
        </div>

        {/* Policy Info */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-white/60">
            Policy: {event.policy.name} • Confidence:{' '}
            {Math.round(event.stressLevel.confidence * 100)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
