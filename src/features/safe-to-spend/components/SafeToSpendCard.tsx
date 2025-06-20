import React, { useEffect } from "react";
import { useSafeToSpendStore } from "../store";
import { UniversalCard } from "@/shared/ui/UniversalCard";
import { formatCurrency } from "@/shared/utils/formatters";
import { DollarSign, Calendar } from "lucide-react";

export const SafeToSpendCard: React.FC = () => {
  const { cash, loading, refresh } = useSafeToSpendStore((s) => ({
    cash: s.cash,
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
      title="Safe to Spend"
      icon={DollarSign}
      iconColor="#10b981"
      value={cash ? formatCurrency(cash.amount) : loading ? "Calculating..." : "No data"}
      orientation="vertical"
    >
      {cash && (
        <div className="space-y-3">
          <p className="text-white/60 text-sm text-center">Available to spend safely</p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <Calendar className="w-4 h-4" />
            <span>Next payday: {new Date(cash.payday).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </UniversalCard>
  );
}; 