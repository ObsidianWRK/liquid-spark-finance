import React, { useEffect } from "react";
import { useSubscriptionsStore } from "../store";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Repeat, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const RecurringChargesList: React.FC<{ className?: string }> = ({ className }) => {
  const { charges, loading, detect, cancel } = useSubscriptionsStore((s) => ({
    charges: s.charges,
    loading: s.loading,
    detect: s.detect,
    cancel: s.cancel,
  }));

  useEffect(() => {
    detect();
  }, [detect]);

  if (loading && charges.length === 0) {
    return <p className={cn("text-muted-foreground", className)}>Scanning for subscriptions…</p>;
  }

  if (charges.length === 0) {
    return <p className={cn("text-muted-foreground", className)}>No subscriptions detected.</p>;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {charges.map((ch) => (
        <Card key={ch.id}>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Repeat className="text-primary" />
              <CardTitle>{ch.merchantName}</CardTitle>
            </div>
            {ch.status === "active" ? (
              <Button variant="destructive" size="sm" onClick={() => cancel(ch.id)}>
                Cancel
              </Button>
            ) : (
              <span className="text-sm text-muted-foreground">{ch.status.replace("_", " ")}</span>
            )}
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Next due {new Date(ch.nextDueDate).toLocaleDateString()} • ${ch.amount.toFixed(2)} / {ch.frequency}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 