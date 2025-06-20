import React, { useEffect } from 'react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { useWidgetsStore } from '../store';
import { WidgetPreview } from './WidgetPreview';
import { AddWidgetButtons } from './AddWidgetButtons';
import { Grid } from 'lucide-react';

export const WidgetsPanel: React.FC = () => {
  const { widgets, loading, refresh } = useWidgetsStore((s) => ({
    widgets: s.widgets,
    loading: s.loading,
    refresh: s.refresh,
  }));

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Home Screen Widgets"
      icon={Grid}
      iconColor="#f59e0b"
    >
      <div className="space-y-4">
        <AddWidgetButtons />
        {loading && widgets.length === 0 ? (
          <p className="text-white/60">Loading widgets...</p>
        ) : widgets.length === 0 ? (
          <p className="text-white/60">No widgets configured yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgets.map((widget) => (
              <WidgetPreview key={widget.id} widget={widget} />
            ))}
          </div>
        )}
      </div>
    </UniversalCard>
  );
};
