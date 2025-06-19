import React from "react";
import { UniversalCard } from "@/components/ui/UniversalCard";
import { AdvisorChatButton } from "./AdvisorChatButton";
import { ChatDialog } from "./ChatDialog";
import { MessageCircle } from "lucide-react";

export const AdvisorChatPanel: React.FC = () => {
  return (
    <>
      <UniversalCard
        variant="glass"
        size="md"
        title="Ask an Advisor"
        icon={MessageCircle}
        iconColor="#3b82f6"
      >
        <AdvisorChatButton />
      </UniversalCard>
      <ChatDialog />
    </>
  );
}; 