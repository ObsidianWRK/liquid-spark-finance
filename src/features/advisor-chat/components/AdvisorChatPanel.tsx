import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdvisorChatButton } from "./AdvisorChatButton";
import { ChatDialog } from "./ChatDialog";
import { MessageCircle } from "lucide-react";

export const AdvisorChatPanel: React.FC = () => {
  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <MessageCircle className="text-primary" />
          <CardTitle>Ask an Advisor</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvisorChatButton />
        </CardContent>
      </Card>
      <ChatDialog />
    </>
  );
}; 