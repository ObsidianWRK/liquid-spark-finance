import React from "react";
import { LinkAccountsButton } from "./LinkAccountsButton";
import { LinkedAccountsList } from "./LinkedAccountsList";
import { UniversalCard } from "@/shared/ui/UniversalCard";
import { Banknote } from "lucide-react";

export const BankLinkingPanel: React.FC = () => {
  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Linked Bank Accounts"
      icon={Banknote}
      iconColor="#6366f1"
    >
      <div className="space-y-4">
        <LinkAccountsButton />
        <LinkedAccountsList />
      </div>
    </UniversalCard>
  );
}; 