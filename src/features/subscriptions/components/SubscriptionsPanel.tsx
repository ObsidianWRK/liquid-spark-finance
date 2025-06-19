import React from "react";
import { UniversalCard } from "@/components/ui/UniversalCard";
import { RecurringChargesList } from "./RecurringChargesList";
import { Repeat } from "lucide-react";

export const SubscriptionsPanel: React.FC = () => {
  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Recurring Subscriptions"
      icon={Repeat}
      iconColor="#f59e0b"
    >
      <RecurringChargesList />
    </UniversalCard>
  );
}; 