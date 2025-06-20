import React, { useEffect } from 'react';
import { Droplet } from 'lucide-react';
import { toast } from '@/shared/ui/sonner';
import { useHydrationStore } from '../../store/hydration';

const TOTAL_GLASSES = 8;

export const HydrationTracker: React.FC = () => {
  const { count, increment, checkReminder, remind, dismissReminder } =
    useHydrationStore();

  useEffect(() => {
    checkReminder();
  }, [checkReminder]);

  useEffect(() => {
    if (remind) {
      toast('Drink up & bank $2…');
      dismissReminder();
    }
  }, [remind, dismissReminder]);

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: TOTAL_GLASSES }).map((_, i) => (
        <button
          key={i}
          onClick={() => increment()}
          className="focus:outline-none"
        >
          <Droplet
            className={`w-5 h-5 ${i < count ? 'text-blue-400' : 'text-white/20'}`}
            fill={i < count ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
};

export default HydrationTracker;
