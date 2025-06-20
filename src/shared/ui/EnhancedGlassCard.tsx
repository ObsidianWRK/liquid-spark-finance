import React from 'react';
import { UniversalCard } from './UniversalCard';
export type EnhancedGlassCardProps = React.ComponentProps<typeof UniversalCard>;

const EnhancedGlassCard: React.FC<EnhancedGlassCardProps> = (props) => (
  <UniversalCard variant="glass" {...props} />
);

export default EnhancedGlassCard;
export { EnhancedGlassCard };
