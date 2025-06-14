
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface BudgetInsight {
  category: string;
  spent: number;
  budget: number;
  variance: number;
  trend: 'up' | 'down' | 'stable';
}

// Mock AI service
export const mockAiService = {
  sendMessage: async (message: string, context?: any): Promise<ChatMessage> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const responses = [
      "Based on your spending patterns, I'd recommend setting aside $200 more for groceries this month.",
      "You've saved 15% more than last month! Your biggest expense was dining out at $342.",
      "I noticed you have several subscriptions. Would you like me to help you review them?",
      "Your emergency fund is looking healthy at 4.2 months of expenses covered.",
      "Consider increasing your investment allocation by 5% based on your current savings rate."
    ];
    
    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date()
    };
  },

  getBudgetInsights: (): BudgetInsight[] => [
    { category: 'Groceries', spent: 580, budget: 600, variance: -20, trend: 'stable' },
    { category: 'Dining', spent: 420, budget: 300, variance: 120, trend: 'up' },
    { category: 'Transportation', spent: 180, budget: 200, variance: -20, trend: 'down' },
    { category: 'Entertainment', spent: 150, budget: 200, variance: -50, trend: 'stable' }
  ]
};
