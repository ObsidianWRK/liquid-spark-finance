import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBankLinkingStore } from "../store";
import { Banknote } from "lucide-react";
import React from "react";

export const LinkAccountsButton: React.FC = () => {
  const { toast } = useToast();
  const linkMockAccount = useBankLinkingStore((s) => s.linkMockAccount);
  const loading = useBankLinkingStore((s) => s.loading);

  const handleClick = async () => {
    await linkMockAccount();
    toast({ title: "Account linked", description: "A mock account was added." });
  };

  return (
    <Button onClick={handleClick} disabled={loading} variant="secondary">
      <Banknote className="mr-2" /> Link Bank Account
    </Button>
  );
}; 