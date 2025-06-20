import React from 'react';
import { UniversalCard } from './UniversalCard';

// Alias wrapper for backward compatibility
export type SimpleGlassCardProps = React.ComponentProps<typeof UniversalCard>;

const SimpleGlassCard: React.FC<SimpleGlassCardProps> = (props) => (
  <UniversalCard variant="glass" {...props} />
);

export default SimpleGlassCard;
export { SimpleGlassCard };
