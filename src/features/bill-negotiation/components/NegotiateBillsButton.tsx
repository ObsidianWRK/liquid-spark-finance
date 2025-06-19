import React from "react";
import { Button } from "@/components/ui/button";
import { useNegotiationStore } from "../store";
import { useToast } from "@/hooks/use-toast";
import { Handshake } from "lucide-react";

export const NegotiateBillsButton: React.FC = () => {
  const negotiate = useNegotiationStore((s) => s.negotiateOutstanding);
  const loading = useNegotiationStore((s) => s.loading);
  const { toast } = useToast();

  const onClick = async () => {
    await negotiate();
    toast({ title: "Negotiation started", description: "We'll work on lowering your bills." });
  };

  return (
    <Button onClick={onClick} disabled={loading} variant="secondary">
      <Handshake className="mr-2" /> Negotiate Bills
    </Button>
  );
}; 