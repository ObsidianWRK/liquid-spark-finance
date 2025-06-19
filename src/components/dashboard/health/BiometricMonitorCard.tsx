import React, { useState } from 'react';
import { Heart, Activity, Thermometer, Wind, Watch, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from './CardSkeleton';
import { MetricDisplay, StressMetric, HeartRateMetric, MetricGrid } from './MetricDisplay';
import { useBiometrics, useStressIndex, useHeartRate, useConnectedDevices, useBiometricTrends } from '@/providers/BiometricsProvider';
import { cn } from '@/lib/utils';

interface BiometricMonitorCardProps {
  className?: string;
  compact?: boolean;
  onInterventionTrigger?: (stressLevel: number) => void;
}

export const BiometricMonitorCard: React.FC<BiometricMonitorCardProps> = ({
  className,
  compact = false,
  onInterventionTrigger,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const { state, isInitialized, triggerManualCheck } = useBiometrics();
  const stressIndex = useStressIndex();
  const heartRate = useHeartRate();
  const connectedDevices = useConnectedDevices();
  const { stressTrend } = useBiometricTrends();

  // Show loading skeleton if not initialized
  if (!isInitialized || !state) {
    return (
      <CardSkeleton 
        variant={compact ? 'compact' : 'default'}
        className={className}
        loading
      />
    );
  }

  const getStressColor = (stress: number) => {
    if (stress >= 80) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (stress >= 60) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (stress >= 40) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-400 bg-green-500/10 border-green-500/20';
  };

  const getStressLabel = (stress: number) => {
    if (stress >= 80) return 'High Stress';
    if (stress >= 60) return 'Elevated';
    if (stress >= 40) return 'Moderate';
    return 'Low Stress';
  };

  const handleManualCheck = async () => {
    try {
      const newState = await triggerManualCheck();
      if (newState && newState.shouldIntervene && onInterventionTrigger) {
        onInterventionTrigger(newState.stressIndex);
      }
    } catch (error) {
      console.error('Manual check failed:', error);
    }
  };

  // Compact view for dashboard
  if (compact && !isExpanded) {
    return (
      <CardSkeleton 
        variant="compact"
        className={cn('cursor-pointer', className)}
        interactive
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Heart className={cn('w-5 h-5', getStressColor(stressIndex).split(' ')[0])} />
              {state.isActive && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">
                Stress: {stressIndex}/100
              </p>
              <p className="text-xs text-white/60">
                {getStressLabel(stressIndex)} • {connectedDevices.length} device(s)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={cn('text-xs', getStressColor(stressIndex))}
            >
              {stressTrend}
            </Badge>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
        </div>
      </CardSkeleton>
    );
  }

  // Expanded view
  return (
    <CardSkeleton 
      variant={compact ? 'default' : 'expanded'}
      className={className}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-white">Biometric Monitor</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant={state.isActive ? "default" : "secondary"} 
            className="text-xs"
          >
            {state.isActive ? 'Active' : 'Inactive'}
          </Badge>
          
          {compact && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronUp className="w-4 h-4 text-white/60" />
            </button>
          )}
        </div>
      </div>

      {/* Current Stress Level */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white/90">Current Stress Level</span>
          <span className="text-sm text-white/70">{stressIndex}/100</span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-3 mb-2">
          <div 
            className={cn(
              'h-3 rounded-full transition-all duration-500',
              stressIndex >= 80 ? 'bg-red-400' :
              stressIndex >= 60 ? 'bg-orange-400' :
              stressIndex >= 40 ? 'bg-yellow-400' : 'bg-green-400'
            )}
            style={{ width: `${stressIndex}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-white/60">
          <span>Low</span>
          <span className={cn(
            'font-medium',
            stressIndex >= 80 ? 'text-red-400' :
            stressIndex >= 60 ? 'text-orange-400' :
            stressIndex >= 40 ? 'text-yellow-400' : 'text-green-400'
          )}>
            {getStressLabel(stressIndex)}
          </span>
          <span>High</span>
        </div>
      </div>

      {/* Biometric Metrics Grid */}
      <MetricGrid columns={2} className="mb-4">
        <HeartRateMetric
          label="Heart Rate"
          value={heartRate || 0}
          unit="bpm"
          icon={Heart}
          variant="compact"
        />
        
        <MetricDisplay
          label="HRV"
          value={state.heartRateVariability || 0}
          unit="ms"
          icon={Activity}
          variant="compact"
          status={
            (state.heartRateVariability || 0) >= 40 ? 'good' :
            (state.heartRateVariability || 0) >= 25 ? 'warning' : 'danger'
          }
        />
        
        <MetricDisplay
          label="Skin Temp"
          value={(state.reading?.skinTemperature || 98.6).toFixed(1)}
          unit="°F"
          icon={Thermometer}
          variant="compact"
          status="neutral"
        />
        
        <MetricDisplay
          label="Breathing"
          value={Math.round(state.reading?.respiratoryRate || 16)}
          unit="/min"
          icon={Wind}
          variant="compact"
          status={
            Math.round(state.reading?.respiratoryRate || 16) >= 12 && 
            Math.round(state.reading?.respiratoryRate || 16) <= 20 ? 'good' : 'warning'
          }
        />
      </MetricGrid>

      {/* Connected Devices */}
      <div className="mb-4">
        <span className="text-sm font-medium text-white/90 mb-2 block">Connected Devices</span>
        <div className="flex flex-wrap gap-2">
          {connectedDevices.length > 0 ? (
            connectedDevices.map((device) => (
              <Badge 
                key={device.id} 
                variant="outline" 
                className={cn(
                  'text-xs',
                  device.isConnected 
                    ? 'bg-green-500/20 border-green-500/30 text-green-400'
                    : 'bg-gray-500/20 border-gray-500/30 text-gray-400'
                )}
              >
                <Watch className="w-3 h-3 mr-1" />
                {device.name}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-xs bg-yellow-500/20 border-yellow-500/30 text-yellow-400">
              No devices connected
            </Badge>
          )}
        </div>
      </div>

      {/* Manual Refresh Button */}
      <Button
        onClick={handleManualCheck}
        disabled={!state.isActive}
        variant="outline"
        size="sm"
        className="w-full bg-white/10 border-white/20 text-white/80 hover:bg-white/20 disabled:opacity-50"
      >
        {!state.isActive ? 'Monitoring Inactive' : 'Refresh Stress Level'}
      </Button>

      {/* Metadata Footer */}
      {state.lastReading && (
        <div className="pt-3 mt-3 border-t border-white/10">
          <div className="flex justify-between text-xs text-white/60">
            <span>Confidence: {Math.round((state.confidenceScore || 0) * 100)}%</span>
            <span>Updated: {new Date(state.lastReading).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </CardSkeleton>
  );
}; 