import React, { useState } from 'react';
import { useAdvisorChatStore } from '../store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Send } from 'lucide-react';

export const ChatDialog: React.FC = () => {
  const { thread, sendMessage, closeChat } = useAdvisorChatStore((s) => ({
    thread: s.thread,
    sendMessage: s.sendMessage,
    closeChat: s.closeChat,
  }));
  const [message, setMessage] = useState('');

  const onSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message.trim());
    setMessage('');
  };

  return (
    <Dialog open={!!thread} onOpenChange={(open) => !open && closeChat()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ask an Advisor</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-64 w-full border rounded p-2">
          {thread?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${msg.sender === 'user' ? 'text-right' : ''}`}
            >
              <div
                className={`inline-block p-2 rounded text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </ScrollArea>
        <DialogFooter className="flex-row gap-2">
          <Input
            placeholder="Ask your question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            className="flex-1"
          />
          <Button onClick={onSend} disabled={!message.trim()} size="icon">
            <Send className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
