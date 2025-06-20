import React from "react";
import { UniversalCard } from "@/shared/ui/UniversalCard";
import { CreateHouseholdForm } from "./CreateHouseholdForm";
import { HouseholdsList } from "./HouseholdsList";
import { Users } from "lucide-react";

export const SharedBudgetsPanel: React.FC = () => {
  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Shared Budgets"
      icon={Users}
      iconColor="#8b5cf6"
    >
      <div className="space-y-4">
        <CreateHouseholdForm />
        <HouseholdsList />
      </div>
    </UniversalCard>
  );
}; 