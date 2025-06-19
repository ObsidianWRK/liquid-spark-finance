import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreatePlanForm } from "./CreatePlanForm";
import { AutosavePlansList } from "./AutosavePlansList";
import { PiggyBank } from "lucide-react";

export const SmartSavingsPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <PiggyBank className="text-primary" />
        <CardTitle>Smart Automated Savings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreatePlanForm />
        <AutosavePlansList />
      </CardContent>
    </Card>
  );
}; 