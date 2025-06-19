import React from "react";
import { LinkAccountsButton } from "./LinkAccountsButton";
import { LinkedAccountsList } from "./LinkedAccountsList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Banknote } from "lucide-react";

export const BankLinkingPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Banknote className="text-primary" />
        <CardTitle>Linked Bank Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LinkAccountsButton />
        <LinkedAccountsList />
      </CardContent>
    </Card>
  );
}; 