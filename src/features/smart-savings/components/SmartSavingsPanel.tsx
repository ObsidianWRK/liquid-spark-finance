import React from 'react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { CreatePlanForm } from './CreatePlanForm';
import { AutosavePlansList } from './AutosavePlansList';
import { PiggyBank } from 'lucide-react';
import { getColor } from '@/theme/vueniPalette';

export const SmartSavingsPanel: React.FC = () => {
  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Smart Automated Savings"
      icon={PiggyBank}
      iconColor={getColor('charts.colors.extended.pink')}
    >
      <div className="space-y-4">
        <CreatePlanForm />
        <AutosavePlansList />
      </div>
    </UniversalCard>
  );
};
