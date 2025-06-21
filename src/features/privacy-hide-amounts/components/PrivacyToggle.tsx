import React from 'react';
import { Switch } from '@/shared/ui/switch';
import { usePrivacyStore } from '../store';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { EyeOff } from 'lucide-react';
import { getColor } from '@/theme/vueniPalette';

export const PrivacyToggle: React.FC = () => {
  const hide = usePrivacyStore((s) => s.setting.hideAmounts);
  const toggle = usePrivacyStore((s) => s.toggle);

  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Privacy Settings"
      icon={EyeOff}
      iconColor={getColor('semantic.chart.investments')}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">Hide amounts</span>
        <Switch checked={hide} onCheckedChange={toggle} />
      </div>
    </UniversalCard>
  );
};
