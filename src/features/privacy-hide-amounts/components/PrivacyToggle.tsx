import React from "react";
import { Switch } from "@/components/ui/switch";
import { usePrivacyStore } from "../store";

export const PrivacyToggle: React.FC = () => {
  const hide = usePrivacyStore((s) => s.setting.hideAmounts);
  const toggle = usePrivacyStore((s) => s.toggle);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Hide amounts</span>
      <Switch checked={hide} onCheckedChange={toggle} />
    </div>
  );
}; 