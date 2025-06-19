import React from "react";
import { Switch } from "@/components/ui/switch";
import { usePrivacyStore } from "../store";
import { UniversalCard } from "@/components/ui/UniversalCard";
import { EyeOff } from "lucide-react";

export const PrivacyToggle: React.FC = () => {
  const hide = usePrivacyStore((s) => s.setting.hideAmounts);
  const toggle = usePrivacyStore((s) => s.toggle);
  
  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Privacy Settings"
      icon={EyeOff}
      iconColor="#8b5cf6"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">Hide amounts</span>
        <Switch checked={hide} onCheckedChange={toggle} />
      </div>
    </UniversalCard>
  );
}; 