import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useWidgetsStore } from "../store";
import { WidgetPreview } from "./WidgetPreview";
import { AddWidgetButtons } from "./AddWidgetButtons";
import { Smartphone } from "lucide-react";

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
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Smartphone className="text-primary" />
        <CardTitle>Home Screen Widgets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddWidgetButtons />
        {loading && widgets.length === 0 ? (
          <p className="text-muted-foreground">Loading widgets...</p>
        ) : widgets.length === 0 ? (
          <p className="text-muted-foreground">No widgets configured yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgets.map((widget) => (
              <WidgetPreview key={widget.id} widget={widget} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 