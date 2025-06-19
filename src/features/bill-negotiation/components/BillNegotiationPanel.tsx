import React from "react";
import { UniversalCard } from "@/components/ui/UniversalCard";
import { NegotiateBillsButton } from "./NegotiateBillsButton";
import { NegotiationCasesList } from "./NegotiationCasesList";
import { Handshake } from "lucide-react";

export const BillNegotiationPanel: React.FC = () => {
  return (
    <UniversalCard
      variant="glass"
      size="md"
      title="Bill Negotiation Concierge"
      icon={Handshake}
      iconColor="#10b981"
    >
      <div className="space-y-4">
        <NegotiateBillsButton />
        <NegotiationCasesList />
      </div>
    </UniversalCard>
  );
}; 