import React from 'react';
import { RecurringChargesList } from './RecurringChargesList';
import { Repeat } from 'lucide-react';

export const SubscriptionsPanel: React.FC = () => {
  return (
    <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-4 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-vueni-lg bg-orange-500/20 flex items-center justify-center">
          <Repeat className="w-4 h-4 text-orange-400" />
        </div>
        <h3 className="font-medium text-white/80 text-sm">Recurring Subscriptions</h3>
      </div>
      <RecurringChargesList />
    </div>
  );
};
