import React from "react";
import { HomeWidget } from "@/shared/types/shared";
import { formatCurrency } from "@/shared/utils/formatters";
import { DollarSign, Banknote, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useWidgetsStore } from "../store";

interface WidgetPreviewProps {
  widget: HomeWidget;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ widget }) => {
  const deleteWidget = useWidgetsStore((s) => s.delete);

  const renderContent = () => {
    switch (widget.type) {
      case "balance":
        return (
          <div className="flex items-center gap-2">
            <Banknote className="text-blue-400" />
            <div>
              <p className="text-sm font-medium">Account Balance</p>
              <p className="text-lg font-bold">{formatCurrency(5432.10)}</p>
            </div>
          </div>
        );
      case "safe_to_spend":
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-400" />
            <div>
              <p className="text-sm font-medium">Safe to Spend</p>
              <p className="text-lg font-bold">{formatCurrency(687.50)}</p>
            </div>
          </div>
        );
      default:
        return <p>Unknown widget</p>;
    }
  };

  return (
    <div className="relative bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 min-h-[80px] flex items-center">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 size-6"
        onClick={() => deleteWidget(widget.id)}
      >
        <X className="size-3" />
      </Button>
      {renderContent()}
    </div>
  );
}; 