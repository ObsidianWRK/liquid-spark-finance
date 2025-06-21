import React from 'react';
import { Shield } from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';

export const BiometricGuardrailsCard: React.FC = () => (
  <UniversalCard
    variant="wellness"
    size="md"
    title="Spending Guardrails"
    icon={Shield}
    iconColor="#06b6d4"
    orientation="vertical"
  >
    <div className="text-center">
      <p className="text-white/60 text-sm">
        Pauses high-risk purchases when stress spikes.
      </p>
    </div>
  </UniversalCard>
);
