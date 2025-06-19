import React from "react";
import { UniversalCard } from "@/components/ui/UniversalCard";
import { CreatePlanForm } from "./CreatePlanForm";
import { AutosavePlansList } from "./AutosavePlansList";
import { PiggyBank } from "lucide-react";

export const SmartSavingsPanel: React.FC = () => {
  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Smart Automated Savings"
      icon={PiggyBank}
      iconColor="#ec4899"
    >
      <div className="space-y-4">
        <CreatePlanForm />
        <AutosavePlansList />
      </div>
    </UniversalCard>
  );
}; 