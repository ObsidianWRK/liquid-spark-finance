import React, { useState, useEffect, useRef } from 'react';
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
import { aiFinancialService } from '@/services/aiFinancialService';
import { familyService } from '@/services/familyService';
import { accountService } from '@/services/accountService';
import { transactionService } from '@/services/transactionService';
import { cn } from '@/lib/utils';

interface FinancialAIChatProps {
  familyId: string;
  className?: string;
  compact?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: any[];
  recommendations?: any[];
}

const FinancialAIChat = ({ familyId, className, compact = false }: FinancialAIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadChatHistory();
    loadFinancialContext();
  }, [familyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = aiFinancialService.getChatHistory(familyId);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const loadFinancialContext = async () => {
    try {
      const [family, accounts, stats, analytics] = await Promise.all([
        familyService.getFamilyById(familyId),
        accountService.getFamilyAccounts(familyId),
        familyService.calculateFamilyStats(familyId),
        transactionService.generateAnalytics(familyId, 'month')
      ]);

      const recentTransactions = await transactionService.searchTransactions(familyId, {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        }
      });

      setContext({
        family,
        accounts,
        recentTransactions: recentTransactions.slice(0, 20),
        budgets: [], // TODO: Add budgets
        stats,
        analytics
      });
    } catch (error) {
      console.error('Failed to load financial context:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !context) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiFinancialService.processFinancialQuery(
        familyId,
        input.trim(),
        context
      );

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        insights: response.insights,
        recommendations: response.recommendations
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
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

  if (!context) {
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
                    onClick={() => setInput(question)}
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
            <div key={message.id} className={cn("flex gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn("flex gap-3 max-w-[80%]", message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === 'user' 
                    ? "bg-green-500/20" 
                    : "bg-blue-500/20"
                )}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-green-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                {/* Message Content */}
                <div className={cn(
                  "flex flex-col gap-2",
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 max-w-full",
                    message.role === 'user'
                      ? "bg-blue-500 text-white"
                      : "bg-white/[0.05] border border-white/[0.08] text-white"
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Insights */}
                  {message.insights && message.insights.length > 0 && (
                    <div className="space-y-2 w-full max-w-lg">
                      {message.insights.map((insight) => (
                        <div
                          key={insight.id}
                          className={cn(
                            "p-3 rounded-xl border text-sm",
                            getInsightColor(insight.impact)
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getInsightIcon(insight.type)}
                            <span className="font-medium">{insight.title}</span>
                          </div>
                          <p className="text-xs opacity-90">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendations */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="space-y-2 w-full max-w-lg">
                      {message.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-purple-400" />
                            <span className="font-medium text-purple-400">{rec.title}</span>
                          </div>
                          <p className="text-xs text-white/80 mb-2">{rec.description}</p>
                          {rec.actionItems && rec.actionItems.length > 0 && (
                            <ul className="space-y-1">
                              {rec.actionItems.map((item: string, index: number) => (
                                <li key={index} className="text-xs text-white/70 flex items-start gap-1">
                                  <span className="text-purple-400 mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
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

        {loading && (
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your finances..."
            className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className={cn(
              "p-3 rounded-xl transition-all",
              input.trim() && !loading
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