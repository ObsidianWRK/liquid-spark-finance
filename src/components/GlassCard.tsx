import React from 'react';
import { UniversalCard } from '@/shared/ui/UniversalCard';

export type GlassCardProps = React.ComponentProps<typeof UniversalCard>;

const GlassCard: React.FC<GlassCardProps> = (props) => (
  <UniversalCard variant="glass" {...props} />
);

export default GlassCard;
export { GlassCard }; 