import React, { useEffect } from "react";
import { useSafeToSpendStore } from "../store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
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
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <DollarSign className="text-primary" />
        <CardTitle>Safe to Spend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cash ? (
          <>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {formatCurrency(cash.amount)}
              </div>
              <p className="text-sm text-muted-foreground">Available to spend safely</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>Next payday: {new Date(cash.payday).toLocaleDateString()}</span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center">
            {loading ? "Calculating..." : "No data"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}; 