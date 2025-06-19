import React, { useEffect } from "react";
import { useSharedBudgetsStore } from "../store";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const HouseholdsList: React.FC<{ className?: string }> = ({ className }) => {
  const { households, loading, refresh } = useSharedBudgetsStore((s) => ({
    households: s.households,
    loading: s.loading,
    refresh: s.refresh,
  }));

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading && households.length === 0) {
    return <p className={cn("text-muted-foreground", className)}>Loading households…</p>;
  }

  if (households.length === 0) {
    return <p className={cn("text-muted-foreground", className)}>No households yet.</p>;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {households.map((h) => (
        <Card key={h.id}>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Users className="text-primary" />
            <CardTitle>{h.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {h.members.length} member{h.members.length === 1 ? "" : "s"}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 