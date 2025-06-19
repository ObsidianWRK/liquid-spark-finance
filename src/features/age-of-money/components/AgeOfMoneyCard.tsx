import React, { useEffect } from "react";
import { useAgeOfMoneyStore } from "../store";
import { UniversalCard } from "@/components/ui/UniversalCard";
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
    <UniversalCard
      variant="glass"
      size="md"
      title="Age of Money"
      icon={Clock}
      iconColor="#06b6d4"
      score={metric ? Math.min(metric.averageDaysHeld, 100) : undefined}
      orientation="vertical"
    >
      {!metric && (
        <div className="text-center">
          <p className="text-white/60 text-sm">
            {loading ? "Calculating…" : "No data available"}
          </p>
        </div>
      )}
      {metric && (
        <div className="text-center mt-4">
          <p className="text-white/60 text-sm">
            Average {metric.averageDaysHeld} days held
          </p>
        </div>
      )}
    </UniversalCard>
  );
}; 