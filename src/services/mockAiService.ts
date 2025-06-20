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

// Enhanced AI service with health and eco advice
export const mockAiService = {
  sendMessage: async (
    message: string,
    context?: Record<string, unknown>
  ): Promise<ChatMessage> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    const lowerMessage = message.toLowerCase();
    let response = '';

    if (
      lowerMessage.includes('health') ||
      lowerMessage.includes('fitness') ||
      lowerMessage.includes('wellness')
    ) {
      const healthResponses = [
        "I see you've been spending on fitness! Your health score is looking good at 78. Consider budgeting $100/month for gym membership and healthy meals.",
        "Your healthcare spending shows you're prioritizing preventive care - that's smart financially! Each $1 spent on prevention can save $4 in future medical costs.",
        'I notice some fast food expenses. Meal prepping could save you $120/month while boosting your health score by 15 points.',
        'Your wellness spending is balanced! Your current health score of 78 reflects good lifestyle choices within budget.',
      ];
      response =
        healthResponses[Math.floor(Math.random() * healthResponses.length)];
    } else if (
      lowerMessage.includes('eco') ||
      lowerMessage.includes('green') ||
      lowerMessage.includes('environment') ||
      lowerMessage.includes('sustainable')
    ) {
      const ecoResponses = [
        "Your eco score of 72 is impressive! You're spending 42% with sustainable brands. Consider adding $25/month for carbon offsets to reach 80+.",
        'I see opportunities to improve your environmental impact. Switching to green energy could save $30/month and boost your eco score significantly.',
        'Your sustainable spending habits are reducing your carbon footprint by 18kg CO₂ monthly - equivalent to planting 1 tree per month!',
        'Transportation spending is low - great for both budget and environment! Your green transport score is helping your overall eco rating.',
      ];
      response = ecoResponses[Math.floor(Math.random() * ecoResponses.length)];
    } else if (
      lowerMessage.includes('budget') ||
      lowerMessage.includes('save') ||
      lowerMessage.includes('money')
    ) {
      const budgetResponses = [
        "Based on your spending patterns, I'd recommend setting aside $200 more for groceries this month to maintain your health goals.",
        'Your savings rate of 15% is excellent! Consider allocating some towards both health insurance and sustainable investments.',
        'I notice you have several subscriptions. Reviewing them could free up $50/month for your health and eco budget goals.',
        "Your emergency fund covers 4.2 months of expenses - that's solid! Now might be time to invest in preventive healthcare.",
      ];
      response =
        budgetResponses[Math.floor(Math.random() * budgetResponses.length)];
    } else {
      const generalResponses = [
        'I can help you balance your financial, health, and environmental goals. What specific area would you like to focus on?',
        'Your overall financial health is strong with room for improvement in sustainable spending. Would you like specific recommendations?',
        "I see great potential to optimize your budget across health, eco-friendly choices, and traditional investments. What's your priority?",
        "Your spending patterns show you value both health and sustainability. Let's explore how to maximize impact in both areas within your budget.",
      ];
      response =
        generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
  },

  getBudgetInsights: (): BudgetInsight[] => [
    {
      category: 'Groceries',
      spent: 580,
      budget: 600,
      variance: -20,
      trend: 'stable',
    },
    { category: 'Dining', spent: 420, budget: 300, variance: 120, trend: 'up' },
    {
      category: 'Transportation',
      spent: 180,
      budget: 200,
      variance: -20,
      trend: 'down',
    },
    {
      category: 'Entertainment',
      spent: 150,
      budget: 200,
      variance: -50,
      trend: 'stable',
    },
    {
      category: 'Health & Fitness',
      spent: 85,
      budget: 100,
      variance: -15,
      trend: 'stable',
    },
    {
      category: 'Sustainable Products',
      spent: 95,
      budget: 80,
      variance: 15,
      trend: 'up',
    },
  ],
};
