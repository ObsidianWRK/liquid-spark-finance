import React, { useEffect, useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import AnimatedCircularProgress from '@/shared/ui/charts/AnimatedCircularProgress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/shared/ui/tooltip';
import { getBloodPressureZones } from '@/data/health';

interface Zones {
  normal: number;
  elevated: number;
  stage1: number;
  stage2: number;
}

const BloodPressureZones: React.FC = () => {
  const [zones, setZones] = useState<Zones | null>(null);

  useEffect(() => {
    getBloodPressureZones().then(setZones);
  }, []);

  if (!zones) return null;

  const total = zones.normal + zones.elevated + zones.stage1 + zones.stage2;
  const risk = zones.stage1 + zones.stage2;
  const riskPercent = Math.round((risk / total) * 100);

  return (
    <UniversalCard variant="glass" interactive className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <HeartPulse className="w-5 h-5 text-red-400" />
        Blood Pressure Zones
      </h3>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex justify-center mb-4">
              <AnimatedCircularProgress
                value={riskPercent}
                color={riskPercent > 20 ? '#ef4444' : '#3b82f6'}
                showLabel
                label="Stage 1+"
                size={100}
              />
            </div>
          </TooltipTrigger>
          {riskPercent > 20 && (
            <TooltipContent>
              Stage&nbsp;1+ readings above 20% indicate hypertension risk.
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <div className="space-y-1 text-sm text-white/90">
        <div className="flex justify-between"><span>Normal</span><span>{zones.normal}%</span></div>
        <div className="flex justify-between"><span>Elevated</span><span>{zones.elevated}%</span></div>
        <div className="flex justify-between"><span>Stage 1</span><span>{zones.stage1}%</span></div>
        <div className="flex justify-between"><span>Stage 2</span><span>{zones.stage2}%</span></div>
      </div>
    </UniversalCard>
  );
};

export default BloodPressureZones;
