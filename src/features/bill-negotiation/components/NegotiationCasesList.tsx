import React, { useEffect } from "react";
import { useNegotiationStore } from "../store";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Loader2, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const NegotiationCasesList: React.FC<{ className?: string }> = ({ className }) => {
  const { cases, loading, refresh } = useNegotiationStore((s) => ({
    cases: s.cases,
    loading: s.loading,
    refresh: s.refresh,
  }));

  useEffect(() => {
    if (cases.length > 0) {
      const interval = setInterval(() => refresh(), 3000);
      return () => clearInterval(interval);
    }
  }, [cases.length, refresh]);

  if (cases.length === 0) {
    return <p className={cn("text-muted-foreground", className)}>No negotiations yet.</p>;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {cases.map((cs) => {
        let icon = <Loader2 className="animate-spin text-primary" />;
        let statusText = "In progress";
        if (cs.status === "completed") {
          icon = <CheckCircle className="text-green-500" />;
          statusText = `Saved $${(cs.savingsAmount ?? 0).toFixed(2)}`;
        } else if (cs.status === "failed") {
          icon = <XCircle className="text-red-500" />;
          statusText = "Failed";
        }
        return (
          <Card key={cs.id}>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              {icon}
              <CardTitle>Case for Charge {cs.chargeId}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{statusText}</CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 