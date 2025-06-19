import React from "react";
import { Button } from "@/components/ui/button";
import { useWidgetsStore } from "../store";
import { Plus, DollarSign, Banknote } from "lucide-react";

export const AddWidgetButtons: React.FC = () => {
  const create = useWidgetsStore((s) => s.create);
  const loading = useWidgetsStore((s) => s.loading);

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => create("balance")}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        <Plus className="mr-2 size-4" />
        <Banknote className="mr-1 size-4" />
        Balance Widget
      </Button>
      <Button
        onClick={() => create("safe_to_spend")}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        <Plus className="mr-2 size-4" />
        <DollarSign className="mr-1 size-4" />
        Safe-to-Spend Widget
      </Button>
    </div>
  );
}; 