import { UniversalMetricCard } from './UniversalMetricCard';
import { ReactElement } from 'react';

interface LegacyMetricCardProps {
  title: string;
  value: string | number;
  icon: ReactElement;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

export default function MetricCard(props: LegacyMetricCardProps) {
  const { title, value, icon, color, trend } = props;
  return (
    <UniversalMetricCard
      title={title}
      value={value}
      icon={icon}
      color={color}
      trend={trend}
      size="sm"
      variant="default"
      interactive={false}
      animationsEnabled={false}
    />
  );
}
