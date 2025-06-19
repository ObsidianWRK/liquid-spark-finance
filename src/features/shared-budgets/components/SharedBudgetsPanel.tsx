import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreateHouseholdForm } from "./CreateHouseholdForm";
import { HouseholdsList } from "./HouseholdsList";
import { Users } from "lucide-react";

export const SharedBudgetsPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Users className="text-primary" />
        <CardTitle>Shared Budgets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreateHouseholdForm />
        <HouseholdsList />
      </CardContent>
    </Card>
  );
}; 