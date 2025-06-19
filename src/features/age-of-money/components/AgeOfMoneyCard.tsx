import React, { useEffect } from "react";
import { useAgeOfMoneyStore } from "../store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AnimatedCircularProgress from "@/components/insights/components/AnimatedCircularProgress";
import { Clock } from "lucide-react";

export const AgeOfMoneyCard: React.FC = () => {
  const { metric, loading, refresh } = useAgeOfMoneyStore((s) => ({
    metric: s.metric,
    loading: s.loading,
    refresh: s.refresh,
  }));

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Card className="flex flex-col items-center p-6">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Clock className="text-primary" />
        <CardTitle>Age of Money</CardTitle>
      </CardHeader>
      <CardContent>
        {metric ? (
          <AnimatedCircularProgress value={metric.averageDaysHeld} maxValue={120} label="days" />
        ) : (
          <p className="text-muted-foreground">{loading ? "Calculating…" : "No data"}</p>
        )}
      </CardContent>
    </Card>
  );
}; 