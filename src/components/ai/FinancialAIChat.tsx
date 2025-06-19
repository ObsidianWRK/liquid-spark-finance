import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  AlertCircle,
  Sparkles,
  MessageCircle,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { aiFinancialService } from '@/features/aiFinancialService';
import { familyService } from '@/features/familyService';
import { accountService } from '@/features/accounts/api/accountService';
import { transactionService } from '@/features/transactions/api/transactionService';
import { cn } from '@/shared/lib/utils';

interface FinancialAIChatProps {
  familyId: string;
  className?: string;
  compact?: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface FinancialContext {
  totalBalance: number;
  monthlySpending: number;
  savingsGoals: number;
  creditScore: number;
  investments: number;
  recentTransactions: Array<{
    id: string;
    amount: number;
    description: string;
    category: string;
  }>;
}

const FinancialAIChat = ({ familyId, className, compact = false }: FinancialAIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [financialContext, setFinancialContext] = useState<FinancialContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadChatHistory = useCallback(async () => {
    try {
      const history = await aiFinancialService.getChatHistory(familyId);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, [familyId]);

  const loadFinancialContext = useCallback(async () => {
    try {
      const [family, accounts, budgets, goals] = await Promise.all([
        familyService.getFamilyData(familyId),
        accountService.getAccountSummary(familyId),
        budgetService.getBudgetSummary(familyId),
        savingsGoalsService.getUserGoals(familyId)
      ]);

      setFinancialContext({
        totalBalance: accounts.totalBalance,
        monthlySpending: budgets.totalSpent,
        savingsGoals: goals.length,
        creditScore: 750, // This would come from credit service
        investments: accounts.totalInvestments || 0,
        recentTransactions: accounts.recentTransactions || []
      });
    } catch (error) {
      console.error('Failed to load financial context:', error);
    }
  }, [familyId]);

  useEffect(() => {
    loadChatHistory();
    loadFinancialContext();
  }, [loadChatHistory, loadFinancialContext]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading || !financialContext) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const response = await aiFinancialService.processFinancialQuery(
        familyId,
        currentInput.trim(),
        financialContext
      );

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.recommendations
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatHistory = () => {
    aiFinancialService.clearChatHistory(familyId);
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending_pattern':
        return <TrendingUp className="w-4 h-4" />;
      case 'savings_opportunity':
        return <Target className="w-4 h-4" />;
      case 'budget_analysis':
        return <AlertCircle className="w-4 h-4" />;
      case 'investment_advice':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const suggestedQuestions = [
    "How can I improve my savings rate?",
    "What should I focus on in my budget?",
    "Is my spending healthy this month?",
    "Should I invest more or pay down debt?",
    "How's my emergency fund looking?"
  ];

  if (!financialContext) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-center">
          <Bot className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white/60">Loading your financial context...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white/[0.02] rounded-2xl border border-white/[0.08]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Financial Advisor</h3>
            <p className="text-white/60 text-sm">
              {compact ? 'Ask me anything' : 'Personalized advice based on your financial data'}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearChatHistory}
              className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/60 hover:text-white"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", compact ? "max-h-96" : "min-h-[400px]")}>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">Hi there! I'm your AI financial advisor.</h4>
            <p className="text-white/60 text-sm mb-6">
              I have access to your complete financial picture and can provide personalized advice.
            </p>
            
            <div className="space-y-2">
              <p className="text-white/80 text-sm font-medium">Try asking:</p>
              <div className="space-y-2">
                {suggestedQuestions.slice(0, compact ? 3 : 5).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentInput(question)}
                    className="block w-full text-left p-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-lg text-white/80 hover:text-white text-sm transition-all"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.type === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn("flex gap-3 max-w-[80%]", message.type === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.type === 'user' 
                    ? "bg-green-500/20" 
                    : "bg-blue-500/20"
                )}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-green-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                {/* Message Content */}
                <div className={cn(
                  "flex flex-col gap-2",
                  message.type === 'user' ? 'items-end' : 'items-start'
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 max-w-full",
                    message.type === 'user'
                      ? "bg-blue-500 text-white"
                      : "bg-white/[0.05] border border-white/[0.08] text-white"
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="space-y-2 w-full max-w-lg">
                      {message.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-purple-400" />
                            <span className="font-medium text-purple-400">{suggestion}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-xs text-white/40">{formatTimestamp(message.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/[0.08]">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your finances..."
            className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isLoading}
            className={cn(
              "p-3 rounded-xl transition-all",
              currentInput.trim() && !isLoading
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-white/[0.05] text-white/40 cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialAIChat;