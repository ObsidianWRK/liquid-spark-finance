import React, { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import AnimatedCircularProgress from '@/shared/ui/charts/AnimatedCircularProgress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { getActivityRings, ActivityRingData } from '@/data/health';

const DailyActivityRings: React.FC = () => {
  const [rings, setRings] = useState<ActivityRingData[]>([]);

  useEffect(() => {
    getActivityRings().then(setRings).catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-yellow-400" />
          Activity Rings
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              Compare
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/[0.08] max-w-sm">
            <DialogHeader>
              <DialogTitle>Activity Ring Comparison</DialogTitle>
            </DialogHeader>
            <div className="flex justify-around py-4">
              {rings.map((ring) => (
                <div key={ring.id} className="text-center">
                  <AnimatedCircularProgress
                    value={ring.value}
                    maxValue={ring.goal}
                    color={ring.color}
                    size={90}
                  />
                  <div className="mt-2 text-sm text-white">
                    {ring.value}/{ring.goal}
                  </div>
                  <div className="text-xs text-white/60">{ring.label}</div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center justify-around">
        {rings.map((ring) => (
          <div key={ring.id} className="flex flex-col items-center">
            <AnimatedCircularProgress
              value={ring.value}
              maxValue={ring.goal}
              color={ring.color}
              size={70}
            />
            <span className="text-xs text-white mt-1">{ring.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyActivityRings; 