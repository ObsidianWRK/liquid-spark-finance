import { Family, FamilyStats } from '@/types/family';
import { Account } from '@/types/accounts';
import { Transaction, TransactionAnalytics } from '@/types/transactions';
import { Budget } from '@/types/budgets';

interface AIFinancialContext {
  family: Family;
  accounts: Account[];
  recentTransactions: Transaction[];
  budgets: Budget[];
  stats: FamilyStats;
  analytics: TransactionAnalytics;
}

interface AIResponse {
  content: string;
  insights: FinancialInsight[];
  recommendations: FinancialRecommendation[];
  confidence: number;
}

interface FinancialInsight {
  id: string;
  type:
    | 'spending_pattern'
    | 'savings_opportunity'
    | 'budget_analysis'
    | 'investment_advice'
    | 'debt_management';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category?: string;
  amount?: number;
  confidence: number;
}

interface FinancialRecommendation {
  id: string;
  type: 'action' | 'optimization' | 'alert' | 'goal_setting';
  title: string;
  description: string;
  actionItems: string[];
  potentialSavings?: number;
  timeframe: 'immediate' | 'short_term' | 'long_term';
  priority: 'high' | 'medium' | 'low';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: FinancialInsight[];
  recommendations?: FinancialRecommendation[];
  context?: Partial<AIFinancialContext>;
}

/**
 * AI-Powered Financial Advisory Service
 * Provides contextual financial insights and personalized recommendations
 */
export class AIFinancialService {
  private static instance: AIFinancialService;
  private chatHistory: Map<string, ChatMessage[]> = new Map();
  private insights: Map<string, FinancialInsight[]> = new Map();
  private recommendations: Map<string, FinancialRecommendation[]> = new Map();

  // Mock OpenAI client - in production this would be the actual OpenAI SDK
  private openaiClient = {
    chat: {
      completions: {
        create: async (params: any) => {
          // Mock AI response - in production this would call OpenAI API
          return {
            choices: [
              {
                message: {
                  content: this.generateMockResponse(params.messages),
                },
              },
            ],
          };
        },
      },
    },
  };

  static getInstance(): AIFinancialService {
    if (!AIFinancialService.instance) {
      AIFinancialService.instance = new AIFinancialService();
    }
    return AIFinancialService.instance;
  }

  /**
   * Process user query with full financial context
   */
  async processFinancialQuery(
    familyId: string,
    message: string,
    context: AIFinancialContext
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const userMessage = this.buildUserMessage(message, context);

      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const aiContent = response.choices[0].message.content;

      // Generate insights and recommendations based on the query and context
      const insights = await this.generateInsights(message, context);
      const recommendations = await this.generateRecommendations(
        message,
        context
      );

      // Store in chat history
      const chatMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        insights,
        recommendations,
        context,
      };

      this.addToChatHistory(familyId, chatMessage);

      return {
        content: aiContent,
        insights,
        recommendations,
        confidence: 0.85,
      };
    } catch (error) {
      console.error('AI query processing failed:', error);
      throw new Error('Unable to process your request. Please try again.');
    }
  }

  /**
   * Generate proactive financial insights
   */
  async generateProactiveInsights(
    familyId: string,
    context: AIFinancialContext
  ): Promise<FinancialInsight[]> {
    const insights: FinancialInsight[] = [];

    // Spending pattern analysis
    const spendingInsights = this.analyzeSpendingPatterns(context);
    insights.push(...spendingInsights);

    // Budget analysis
    const budgetInsights = this.analyzeBudgetPerformance(context);
    insights.push(...budgetInsights);

    // Savings opportunities
    const savingsInsights = this.identifySavingsOpportunities(context);
    insights.push(...savingsInsights);

    // Investment advice
    const investmentInsights = this.generateInvestmentAdvice(context);
    insights.push(...investmentInsights);

    // Store insights
    this.insights.set(familyId, insights);

    return insights;
  }

  /**
   * Get personalized financial recommendations
   */
  async getPersonalizedRecommendations(
    familyId: string,
    context: AIFinancialContext
  ): Promise<FinancialRecommendation[]> {
    const recommendations: FinancialRecommendation[] = [];

    // Emergency fund recommendations
    if (context.stats.emergencyFundMonths < 3) {
      recommendations.push({
        id: this.generateRecommendationId(),
        type: 'goal_setting',
        title: 'Build Emergency Fund',
        description: `You currently have ${context.stats.emergencyFundMonths.toFixed(1)} months of expenses saved. Financial experts recommend 3-6 months.`,
        actionItems: [
          'Set up automatic transfers to savings',
          'Reduce discretionary spending by 10%',
          'Consider a high-yield savings account',
        ],
        potentialSavings: context.stats.monthlyExpenses * 3,
        timeframe: 'long_term',
        priority: 'high',
      });
    }

    // High spending category recommendations
    const topCategory = context.analytics.categoryBreakdown[0];
    if (topCategory && topCategory.percentage > 40) {
      recommendations.push({
        id: this.generateRecommendationId(),
        type: 'optimization',
        title: `Optimize ${topCategory.category} Spending`,
        description: `${topCategory.category} accounts for ${topCategory.percentage.toFixed(1)}% of your spending. This is higher than recommended.`,
        actionItems: [
          'Review recent transactions in this category',
          'Set a monthly budget limit',
          'Look for alternative options to reduce costs',
        ],
        potentialSavings: topCategory.amount * 0.15,
        timeframe: 'short_term',
        priority: 'medium',
      });
    }

    // Debt management
    if (context.stats.debtToIncomeRatio > 36) {
      recommendations.push({
        id: this.generateRecommendationId(),
        type: 'action',
        title: 'Reduce Debt-to-Income Ratio',
        description: `Your debt-to-income ratio is ${context.stats.debtToIncomeRatio.toFixed(1)}%. Aim for below 36%.`,
        actionItems: [
          'Consider debt consolidation',
          'Pay more than minimum on high-interest debt',
          'Avoid taking on new debt',
        ],
        timeframe: 'long_term',
        priority: 'high',
      });
    }

    // Investment allocation
    const stockAllocation =
      context.stats.investmentAllocation.stocks /
      (context.stats.investmentAllocation.stocks +
        context.stats.investmentAllocation.bonds +
        context.stats.investmentAllocation.cash);

    if (
      stockAllocation < 0.6 &&
      context.family.settings.riskTolerance !== 'conservative'
    ) {
      recommendations.push({
        id: this.generateRecommendationId(),
        type: 'optimization',
        title: 'Optimize Investment Allocation',
        description:
          'Your portfolio may be too conservative for your risk tolerance and time horizon.',
        actionItems: [
          'Consider increasing stock allocation',
          'Review investment fees and expenses',
          'Rebalance portfolio quarterly',
        ],
        timeframe: 'medium_term',
        priority: 'medium',
      });
    }

    this.recommendations.set(familyId, recommendations);
    return recommendations;
  }

  /**
   * Get chat history for a family
   */
  getChatHistory(familyId: string): ChatMessage[] {
    return this.chatHistory.get(familyId) || [];
  }

  /**
   * Clear chat history for a family
   */
  clearChatHistory(familyId: string): void {
    this.chatHistory.delete(familyId);
  }

  // Private helper methods
  private buildSystemPrompt(context: AIFinancialContext): string {
    return `You are a highly knowledgeable financial advisor AI assistant. You have access to the user's complete financial picture and should provide personalized, actionable advice.

Family Financial Context:
- Family Name: ${context.family.name}
- Currency: ${context.family.settings.currency}
- Risk Tolerance: ${context.family.settings.riskTolerance}
- Investment Style: ${context.family.settings.investmentStyle}

Financial Summary:
- Total Net Worth: $${context.stats.totalNetWorth.toLocaleString()}
- Monthly Income: $${context.stats.monthlyIncome.toLocaleString()}
- Monthly Expenses: $${context.stats.monthlyExpenses.toLocaleString()}
- Savings Rate: ${context.stats.savingsRate.toFixed(1)}%
- Emergency Fund: ${context.stats.emergencyFundMonths.toFixed(1)} months
- Debt-to-Income Ratio: ${context.stats.debtToIncomeRatio.toFixed(1)}%

Key Guidelines:
1. Provide specific, actionable advice based on their actual financial data
2. Be encouraging but realistic about financial goals
3. Prioritize emergency fund, debt reduction, and savings optimization
4. Consider their risk tolerance and investment preferences
5. Suggest concrete next steps they can take immediately
6. Use their actual spending patterns to inform recommendations
7. Be mindful of their current financial situation and constraints

Always format your response in a friendly, professional tone and include specific dollar amounts or percentages when relevant.`;
  }

  private buildUserMessage(
    message: string,
    context: AIFinancialContext
  ): string {
    const recentSpending = context.analytics.categoryBreakdown
      .slice(0, 3)
      .map((cat) => `${cat.category}: $${cat.amount.toLocaleString()}`)
      .join(', ');

    return `User Query: ${message}

Additional Context:
- Recent spending breakdown: ${recentSpending}
- Active accounts: ${context.accounts.length}
- Recent transactions: ${context.recentTransactions.length} in the last 30 days

Please provide a helpful response based on their specific financial situation.`;
  }

  private generateMockResponse(messages: any[]): string {
    const userMessage = messages[messages.length - 1]?.content || '';

    // Simple keyword-based responses for demonstration
    if (userMessage.toLowerCase().includes('budget')) {
      return "Based on your spending patterns, I notice you're spending about 35% of your income on housing and 15% on food. This is within healthy ranges! However, I see some opportunities to optimize your entertainment spending, which could free up an additional $200 per month for savings or debt reduction.";
    }

    if (
      userMessage.toLowerCase().includes('save') ||
      userMessage.toLowerCase().includes('savings')
    ) {
      return "Your current savings rate of 12% is a good start! To reach the recommended 20%, consider automating transfers to savings right after payday. Based on your spending patterns, you could potentially increase this by reducing discretionary spending by just 8%. I'd recommend starting with a high-yield savings account for your emergency fund.";
    }

    if (
      userMessage.toLowerCase().includes('invest') ||
      userMessage.toLowerCase().includes('investment')
    ) {
      return "Given your moderate risk tolerance and current financial position, I'd suggest a diversified portfolio with 70% stocks and 30% bonds. Your emergency fund looks solid, so you're ready to invest for long-term growth. Consider low-cost index funds to start, and you could benefit from dollar-cost averaging with $500 monthly contributions.";
    }

    if (userMessage.toLowerCase().includes('debt')) {
      return 'I see you have a debt-to-income ratio of 28%, which is within acceptable limits. However, focusing on high-interest debt first (like credit cards) could save you significant money. Based on your cash flow, you could allocate an extra $300 per month toward debt reduction and be debt-free 18 months sooner.';
    }

    return "I'm here to help with your financial questions! Based on your current financial picture, you're doing well with a positive net worth and steady income. I can provide specific advice about budgeting, saving, investing, or debt management. What would you like to focus on?";
  }

  private async generateInsights(
    message: string,
    context: AIFinancialContext
  ): Promise<FinancialInsight[]> {
    // Generate contextual insights based on the query
    return this.analyzeSpendingPatterns(context).slice(0, 2);
  }

  private async generateRecommendations(
    message: string,
    context: AIFinancialContext
  ): Promise<FinancialRecommendation[]> {
    // Generate contextual recommendations based on the query
    const allRecommendations = await this.getPersonalizedRecommendations(
      'temp',
      context
    );
    return allRecommendations.slice(0, 2);
  }

  private analyzeSpendingPatterns(
    context: AIFinancialContext
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];
    const categories = context.analytics.categoryBreakdown;

    // High spending categories
    const highSpendingCategories = categories.filter(
      (cat) => cat.percentage > 25
    );
    for (const category of highSpendingCategories) {
      insights.push({
        id: this.generateInsightId(),
        type: 'spending_pattern',
        title: `High ${category.category} Spending`,
        description: `You're spending ${category.percentage.toFixed(1)}% of your budget on ${category.category}. This is above the recommended 20-25%.`,
        impact: 'medium',
        category: category.category,
        amount: category.amount,
        confidence: 0.8,
      });
    }

    return insights;
  }

  private analyzeBudgetPerformance(
    context: AIFinancialContext
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];

    if (context.stats.savingsRate < 10) {
      insights.push({
        id: this.generateInsightId(),
        type: 'savings_opportunity',
        title: 'Low Savings Rate',
        description: `Your current savings rate is ${context.stats.savingsRate.toFixed(1)}%. Financial experts recommend saving at least 10-20% of income.`,
        impact: 'high',
        confidence: 0.9,
      });
    }

    return insights;
  }

  private identifySavingsOpportunities(
    context: AIFinancialContext
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];

    // Look for subscription patterns or high-frequency spending
    const frequentCategories = context.analytics.categoryBreakdown.filter(
      (cat) => cat.transactionCount > 20
    ); // More than 20 transactions per month

    for (const category of frequentCategories) {
      if (category.averageAmount > 10) {
        insights.push({
          id: this.generateInsightId(),
          type: 'savings_opportunity',
          title: `Frequent ${category.category} Purchases`,
          description: `You make ${category.transactionCount} ${category.category} purchases monthly, averaging $${category.averageAmount.toFixed(2)} each. Consider bulk purchases or subscriptions to save money.`,
          impact: 'low',
          category: category.category,
          confidence: 0.7,
        });
      }
    }

    return insights;
  }

  private generateInvestmentAdvice(
    context: AIFinancialContext
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];

    if (
      context.stats.emergencyFundMonths > 6 &&
      context.stats.totalNetWorth > 10000
    ) {
      insights.push({
        id: this.generateInsightId(),
        type: 'investment_advice',
        title: 'Ready for Investment Growth',
        description:
          'You have a solid emergency fund and positive net worth. Consider increasing your investment allocation to grow wealth faster.',
        impact: 'high',
        confidence: 0.8,
      });
    }

    return insights;
  }

  private addToChatHistory(familyId: string, message: ChatMessage): void {
    const history = this.chatHistory.get(familyId) || [];
    history.push(message);

    // Keep only last 50 messages
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }

    this.chatHistory.set(familyId, history);
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateInsightId(): string {
    return `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRecommendationId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const aiFinancialService = AIFinancialService.getInstance();
