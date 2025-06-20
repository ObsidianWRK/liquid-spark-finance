import React from 'react';
import { Button } from '@/shared/ui/button';
import { useAdvisorChatStore } from '../store';
import { MessageCircle } from 'lucide-react';

export const AdvisorChatButton: React.FC = () => {
  const openChat = useAdvisorChatStore((s) => s.openChat);
  const loading = useAdvisorChatStore((s) => s.loading);

  return (
    <Button onClick={openChat} disabled={loading} variant="secondary">
      <MessageCircle className="mr-2" /> Ask Advisor
    </Button>
  );
};
