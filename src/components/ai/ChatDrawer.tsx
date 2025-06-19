
import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import GlassCard from '@/components/GlassCard';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { mockAiService, ChatMessage } from '@/features/mockAiService';

interface ChatDrawerProps {
  userContext?: Record<string, unknown>;
}

const ChatDrawer = ({ userContext }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await mockAiService.sendMessage(userMessage.content, userContext);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    'Help me create a budget',
    'Analyze my spending patterns',
    'Set a savings goal',
    'Review my subscriptions'
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <GlassCard
          className="fixed bottom-32 right-6 p-4 glass-interactive z-40 glass-fab"
          interactive
          shimmer
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </GlassCard>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md bg-gradient-to-br from-[#0A0A0B] via-[#1C1C1E] to-[#0A0A0B] border-white/10">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Financial Assistant
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-120px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-50" />
                <p className="text-white/70 mb-4">Hi! I'm your financial assistant. I can help you with budgeting, spending analysis, and financial goals.</p>
                
                <div className="space-y-2">
                  <p className="text-white/50 text-sm">Try asking:</p>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(action)}
                      className="block w-full text-left p-2 text-sm text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      "{action}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <GlassCard
                  className={`max-w-[80%] p-3 ${
                    message.role === 'user'
                      ? 'glass-blue text-white'
                      : 'glass-secondary text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </GlassCard>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <GlassCard className="glass-secondary p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-white/70 text-sm">Thinking...</span>
                  </div>
                </GlassCard>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your finances..."
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/10"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatDrawer;
