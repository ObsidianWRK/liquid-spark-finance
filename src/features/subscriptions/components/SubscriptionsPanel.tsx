import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RecurringChargesList } from "./RecurringChargesList";
import { Repeat } from "lucide-react";

export const SubscriptionsPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Repeat className="text-primary" />
        <CardTitle>Recurring Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <RecurringChargesList />
      </CardContent>
    </Card>
  );
}; 