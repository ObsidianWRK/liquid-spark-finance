import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NegotiateBillsButton } from "./NegotiateBillsButton";
import { NegotiationCasesList } from "./NegotiationCasesList";
import { Handshake } from "lucide-react";

export const BillNegotiationPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Handshake className="text-primary" />
        <CardTitle>Bill Negotiation Concierge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NegotiateBillsButton />
        <NegotiationCasesList />
      </CardContent>
    </Card>
  );
}; 