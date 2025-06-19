import React, { useEffect, useMemo } from 'react';
import { Heart, Activity, Thermometer, Wind, Watch, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/lib/utils';
import { useBiometricInterventionStore } from '../store';
import { StressLevel, BiometricData } from '../types';

interface BiometricMonitorProps {
  className?: string;
  compact?: boolean;
}

export const BiometricMonitor: React.FC<BiometricMonitorProps> = ({
  className,
  compact = false
}) => {
  const {
    currentStress,
    preferences,
    loading,
    error,
    triggerManualStressCheck,
    isActive
  } = useBiometricInterventionStore();

  useEffect(() => {
    // Auto-refresh stress level every 30 seconds if active
    if (isActive) {
      const interval = setInterval(() => {
        triggerManualStressCheck();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isActive, triggerManualStressCheck]);

  const mockBiometricData: BiometricData = useMemo(() => ({
    heartRate: 72 + Math.random() * 20,
    heartRateVariability: 35 + Math.random() * 20,
    galvanicSkinResponse: 2.1 + Math.random() * 1.5,
    skinTemperature: 98.6 + Math.random() * 2 - 1,
    respiratoryRate: 16 + Math.random() * 4,
    timestamp: new Date().toISOString(),
    deviceId: 'apple-watch-series-8'
  }), []);

  const getStressIndicator = (stress?: StressLevel) => {
    if (!stress) return { color: 'gray', label: 'Unknown', icon: Minus };
    
    if (stress.score >= 80) return { color: 'red', label: 'High', icon: TrendingUp };
    if (stress.score >= 60) return { color: 'orange', label: 'Elevated', icon: TrendingUp };
    if (stress.score >= 40) return { color: 'yellow', label: 'Moderate', icon: Minus };
    return { color: 'green', label: 'Low', icon: TrendingDown };
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <Minus className="w-4 h-4 text-white/40" />;
    }
  };

  const getConnectedDevices = (): string[] => {
    const devices: string[] = [];
    if (preferences.wearableIntegrations.appleWatch) devices.push('Apple Watch');
    if (preferences.wearableIntegrations.fitbit) devices.push('Fitbit');
    if (preferences.wearableIntegrations.garmin) devices.push('Garmin');
    if (preferences.wearableIntegrations.oura) devices.push('Oura Ring');
    return devices;
  };

  const stressIndicator = getStressIndicator(currentStress);
  const connectedDevices = getConnectedDevices();

  if (compact) {
    return (
      <div className={cn("bg-white/[0.02] rounded-2xl border border-white/[0.08] p-4 hover:bg-white/[0.03] transition-all duration-300", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                <Heart className={cn(
                  "w-5 h-5",
                  stressIndicator.color === 'red' ? 'text-red-400' :
                  stressIndicator.color === 'orange' ? 'text-orange-400' :
                  stressIndicator.color === 'yellow' ? 'text-yellow-400' :
                  stressIndicator.color === 'green' ? 'text-green-400' : 'text-white/40'
                )} />
              </div>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">
                Stress: {currentStress?.score || '--'}/100
              </p>
              <p className="text-xs text-white/60">
                {stressIndicator.label} • {connectedDevices.length} device(s)
              </p>
            </div>
          </div>
          {getTrendIcon(currentStress?.trend)}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-medium text-white/80">Biometric Monitor</h3>
        </div>
        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Current Stress Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/90">Current Stress Level</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/70">
                {currentStress?.score || '--'}/100
              </span>
              {getTrendIcon(currentStress?.trend)}
            </div>
          </div>
          
          <div className="w-full bg-white/[0.05] rounded-full h-3">
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-300",
                stressIndicator.color === 'red' ? 'bg-red-400' :
                stressIndicator.color === 'orange' ? 'bg-orange-400' :
                stressIndicator.color === 'yellow' ? 'bg-yellow-400' :
                stressIndicator.color === 'green' ? 'bg-green-400' : 'bg-white/20'
              )}
              style={{ width: `${currentStress?.score || 0}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-white/60">
            <span>Low</span>
            <span className={cn(
              "font-medium",
              stressIndicator.color === 'red' ? 'text-red-400' :
              stressIndicator.color === 'orange' ? 'text-orange-400' :
              stressIndicator.color === 'yellow' ? 'text-yellow-400' :
              stressIndicator.color === 'green' ? 'text-green-400' : 'text-white/40'
            )}>
              {stressIndicator.label}
            </span>
            <span>High</span>
          </div>
        </div>

        {/* Biometric Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
            <div className="flex items-center space-x-2 mb-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-xs text-white/70">Heart Rate</span>
            </div>
            <p className="text-sm font-medium text-white/90">
              {Math.round(mockBiometricData.heartRate || 0)} bpm
            </p>
          </div>
          
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white/70">HRV</span>
            </div>
            <p className="text-sm font-medium text-white/90">
              {Math.round(mockBiometricData.heartRateVariability || 0)} ms
            </p>
          </div>
          
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
            <div className="flex items-center space-x-2 mb-1">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-white/70">Skin Temp</span>
            </div>
            <p className="text-sm font-medium text-white/90">
              {mockBiometricData.skinTemperature?.toFixed(1) || '--'}°F
            </p>
          </div>
          
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
            <div className="flex items-center space-x-2 mb-1">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/70">Breathing</span>
            </div>
            <p className="text-sm font-medium text-white/90">
              {Math.round(mockBiometricData.respiratoryRate || 0)}/min
            </p>
          </div>
        </div>

        {/* Connected Devices */}
        <div className="space-y-3">
          <span className="text-sm font-medium text-white/90">Connected Devices</span>
          <div className="flex flex-wrap gap-2">
            {connectedDevices.length > 0 ? (
              connectedDevices.map((device) => (
                <Badge key={device} variant="outline" className="text-xs bg-green-500/20 border-green-500/30 text-green-400">
                  <Watch className="w-3 h-3 mr-1" />
                  {device}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs bg-yellow-500/20 border-yellow-500/30 text-yellow-400">
                No devices connected
              </Badge>
            )}
          </div>
        </div>

        {/* Manual Refresh */}
        <Button
          onClick={triggerManualStressCheck}
          disabled={loading}
          variant="outline"
          size="sm"
          className="w-full bg-white/[0.05] border-white/[0.08] text-white/80 hover:bg-white/[0.08] hover:text-white transition-all"
        >
          {loading ? 'Checking...' : 'Refresh Stress Level'}
        </Button>

        {/* Metadata */}
        {currentStress && (
          <div className="pt-3 border-t border-white/[0.08]">
            <div className="flex justify-between text-xs text-white/60">
              <span>Confidence: {Math.round((currentStress.confidence || 0) * 100)}%</span>
              <span>Updated: {new Date(currentStress.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 