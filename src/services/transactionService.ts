import { 
  Transaction, 
  TransactionCategory, 
  TransactionRule, 
  TransferPair,
  TransactionAnalytics,
  CategorySpending,
  SpendingInsight,
  TransactionImport
} from '@/types/transactions';

/**
 * Comprehensive Transaction Processing Service
 * Handles categorization, rules engine, transfer detection, and analytics
 */
export class TransactionService {
  private static instance: TransactionService;
  private transactions: Map<string, Transaction> = new Map();
  private rules: Map<string, TransactionRule> = new Map();
  private transfers: Map<string, TransferPair> = new Map();
  private imports: Map<string, TransactionImport> = new Map();

  // Category mapping with enhanced intelligence
  private categoryKeywords: Record<TransactionCategory, string[]> = {
    income: ['salary', 'paycheck', 'bonus', 'freelance', 'dividend', 'interest', 'refund', 'cashback'],
    housing: ['rent', 'mortgage', 'property tax', 'hoa', 'utilities', 'insurance home', 'repair', 'maintenance'],
    transportation: ['gas', 'fuel', 'uber', 'lyft', 'parking', 'toll', 'car payment', 'auto insurance', 'metro', 'bus'],
    food: ['grocery', 'restaurant', 'fast food', 'coffee', 'starbucks', 'mcdonalds', 'whole foods', 'safeway'],
    utilities: ['electric', 'gas bill', 'water', 'internet', 'phone', 'cable', 'streaming', 'netflix'],
    insurance: ['health insurance', 'auto insurance', 'life insurance', 'dental', 'vision'],
    healthcare: ['doctor', 'hospital', 'pharmacy', 'medical', 'dentist', 'therapy', 'prescription'],
    savings: ['transfer to savings', 'investment', '401k', 'ira', 'pension'],
    debt_payments: ['credit card payment', 'loan payment', 'student loan', 'mortgage payment'],
    entertainment: ['movie', 'concert', 'sports', 'gaming', 'spotify', 'amazon prime', 'gym'],
    personal_care: ['haircut', 'spa', 'cosmetics', 'clothing', 'shoes'],
    shopping: ['amazon', 'target', 'walmart', 'online shopping', 'retail'],
    education: ['tuition', 'books', 'course', 'training', 'certification'],
    gifts_donations: ['gift', 'charity', 'donation', 'church', 'nonprofit'],
    business: ['office supplies', 'software', 'business expense', 'conference'],
    taxes: ['tax payment', 'irs', 'state tax', 'property tax'],
    investments: ['brokerage', 'stock purchase', 'etf', 'mutual fund'],
    fees: ['bank fee', 'atm fee', 'overdraft', 'maintenance fee', 'late fee'],
    transfers: ['transfer', 'wire', 'check deposit', 'internal transfer'],
    other: ['miscellaneous', 'unknown', 'cash withdrawal']
  };

  static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  /**
   * Create new transaction with automatic categorization
   */
  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Apply automatic categorization
    if (!transaction.category || transaction.category === 'other') {
      transaction.category = await this.categorizeTransaction(transaction);
    }

    // Check for transfer patterns
    await this.detectTransfers(transaction);

    // Apply transaction rules
    await this.applyRules(transaction);

    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  /**
   * Smart transaction categorization using ML-inspired algorithms
   */
  async categorizeTransaction(transaction: Transaction): Promise<TransactionCategory> {
    const text = `${transaction.description} ${transaction.merchantName || ''}`.toLowerCase();
    
    // Calculate confidence scores for each category
    const categoryScores: Record<TransactionCategory, number> = {} as any;
    
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      let score = 0;
      
      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          // Boost score based on keyword relevance and position
          const position = text.indexOf(keyword.toLowerCase());
          const relevanceBoost = keyword.length / text.length;
          const positionBoost = position === 0 ? 2 : 1; // Boost if at beginning
          
          score += (1 + relevanceBoost) * positionBoost;
        }
      }

      // Apply amount-based heuristics
      if (category === 'income' && transaction.amount > 0) {
        score *= 2;
      } else if (category === 'income' && transaction.amount < 0) {
        score *= 0.1;
      }

      // Apply frequency-based learning
      const historicalCategory = await this.getHistoricalCategoryForMerchant(transaction.merchantName);
      if (historicalCategory === category) {
        score *= 1.5;
      }

      categoryScores[category as TransactionCategory] = score;
    }

    // Find category with highest score
    const bestCategory = Object.entries(categoryScores).reduce((a, b) => 
      categoryScores[a[0] as TransactionCategory] > categoryScores[b[0] as TransactionCategory] ? a : b
    )[0] as TransactionCategory;

    return categoryScores[bestCategory] > 0.5 ? bestCategory : 'other';
  }

  /**
   * Create and manage transaction rules
   */
  async createTransactionRule(rule: Omit<TransactionRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<TransactionRule> {
    const newRule: TransactionRule = {
      id: this.generateRuleId(),
      ...rule,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.rules.set(newRule.id, newRule);
    
    // Apply rule to existing transactions
    await this.applyRuleToExistingTransactions(newRule);
    
    return newRule;
  }

  /**
   * Apply rules to a transaction
   */
  private async applyRules(transaction: Transaction): Promise<void> {
    const activeRules = Array.from(this.rules.values())
      .filter(rule => rule.isActive)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of activeRules) {
      if (await this.evaluateRuleConditions(transaction, rule.conditions)) {
        await this.executeRuleActions(transaction, rule.actions);
      }
    }
  }

  /**
   * Detect transfer transactions between accounts
   */
  private async detectTransfers(transaction: Transaction): Promise<void> {
    // Look for potential matching transactions
    const potentialMatches = Array.from(this.transactions.values()).filter(t => {
      const timeDiff = Math.abs(t.date.getTime() - transaction.date.getTime());
      const amountMatch = Math.abs(Math.abs(t.amount) - Math.abs(transaction.amount)) < 0.01;
      const sameFamily = t.familyId === transaction.familyId;
      const differentAccount = t.accountId !== transaction.accountId;
      const oppositeSign = (t.amount > 0) !== (transaction.amount > 0);
      const withinTimeWindow = timeDiff <= 3 * 24 * 60 * 60 * 1000; // 3 days

      return sameFamily && differentAccount && amountMatch && oppositeSign && withinTimeWindow;
    });

    if (potentialMatches.length > 0) {
      const bestMatch = potentialMatches.sort((a, b) => {
        const aTimeDiff = Math.abs(a.date.getTime() - transaction.date.getTime());
        const bTimeDiff = Math.abs(b.date.getTime() - transaction.date.getTime());
        return aTimeDiff - bTimeDiff;
      })[0];

      // Create transfer pair
      const transfer: TransferPair = {
        id: this.generateTransferId(),
        familyId: transaction.familyId,
        sourceTransactionId: transaction.amount < 0 ? transaction.id : bestMatch.id,
        targetTransactionId: transaction.amount > 0 ? transaction.id : bestMatch.id,
        amount: Math.abs(transaction.amount),
        confidence: 0.9, // High confidence for amount and time matching
        isConfirmed: false,
        createdAt: new Date()
      };

      this.transfers.set(transfer.id, transfer);

      // Mark transactions as transfers
      transaction.isTransfer = true;
      transaction.transferAccountId = bestMatch.accountId;
      transaction.transferTransactionId = bestMatch.id;
      transaction.category = 'transfers';

      bestMatch.isTransfer = true;
      bestMatch.transferAccountId = transaction.accountId;
      bestMatch.transferTransactionId = transaction.id;
      bestMatch.category = 'transfers';

      this.transactions.set(bestMatch.id, bestMatch);
    }
  }

  /**
   * Bulk transaction operations
   */
  async bulkUpdateTransactions(
    transactionIds: string[],
    updates: Partial<Pick<Transaction, 'category' | 'tags' | 'notes' | 'excludeFromBudget'>>
  ): Promise<Transaction[]> {
    const updatedTransactions: Transaction[] = [];

    for (const id of transactionIds) {
      const transaction = this.transactions.get(id);
      if (transaction) {
        const updated = {
          ...transaction,
          ...updates,
          updatedAt: new Date()
        };
        this.transactions.set(id, updated);
        updatedTransactions.push(updated);
      }
    }

    return updatedTransactions;
  }

  /**
   * Advanced transaction filtering and search
   */
  async searchTransactions(
    familyId: string,
    filters: {
      query?: string;
      categories?: TransactionCategory[];
      accountIds?: string[];
      dateRange?: { start: Date; end: Date };
      amountRange?: { min: number; max: number };
      tags?: string[];
      excludeTransfers?: boolean;
      excludeFromBudget?: boolean;
    }
  ): Promise<Transaction[]> {
    let results = Array.from(this.transactions.values())
      .filter(t => t.familyId === familyId);

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(t => 
        t.description.toLowerCase().includes(query) ||
        t.merchantName?.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query)
      );
    }

    if (filters.categories?.length) {
      results = results.filter(t => filters.categories!.includes(t.category));
    }

    if (filters.accountIds?.length) {
      results = results.filter(t => filters.accountIds!.includes(t.accountId));
    }

    if (filters.dateRange) {
      results = results.filter(t => 
        t.date >= filters.dateRange!.start && t.date <= filters.dateRange!.end
      );
    }

    if (filters.amountRange) {
      results = results.filter(t => 
        Math.abs(t.amount) >= filters.amountRange!.min && 
        Math.abs(t.amount) <= filters.amountRange!.max
      );
    }

    if (filters.tags?.length) {
      results = results.filter(t => 
        filters.tags!.some(tag => t.tags.includes(tag))
      );
    }

    if (filters.excludeTransfers) {
      results = results.filter(t => !t.isTransfer);
    }

    if (filters.excludeFromBudget !== undefined) {
      results = results.filter(t => t.excludeFromBudget === filters.excludeFromBudget);
    }

    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Generate comprehensive spending analytics
   */
  async generateAnalytics(
    familyId: string,
    period: 'month' | 'quarter' | 'year'
  ): Promise<TransactionAnalytics> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    const transactions = await this.searchTransactions(familyId, {
      dateRange: { start: startDate, end: endDate },
      excludeTransfers: true
    });

    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const categoryBreakdown = await this.calculateCategoryBreakdown(transactions);
    const merchantBreakdown = await this.calculateMerchantBreakdown(transactions);
    const insights = await this.generateSpendingInsights(transactions, categoryBreakdown);

    return {
      period,
      totalIncome: income,
      totalExpenses: expenses,
      netCashFlow: income - expenses,
      categoryBreakdown,
      merchantBreakdown,
      trends: [], // TODO: Calculate trends
      insights
    };
  }

  /**
   * Import transactions from CSV/OFX files
   */
  async importTransactions(
    familyId: string,
    file: File,
    mapping: Record<string, string>
    mapping: any
  ): Promise<TransactionImport> {
    const importRecord: TransactionImport = {
      id: this.generateImportId(),
      familyId,
      filename: file.name,
      format: this.detectFileFormat(file.name),
      status: 'processing',
      totalTransactions: 0,
      importedTransactions: 0,
      errorTransactions: 0,
      duplicateTransactions: 0,
      mapping,
      errors: [],
      createdAt: new Date()
    };

    this.imports.set(importRecord.id, importRecord);

    // Process file asynchronously
    this.processImportFile(importRecord, file, mapping);

    return importRecord;
  }

  // Private helper methods
  private async getHistoricalCategoryForMerchant(merchantName?: string): Promise<TransactionCategory | null> {
    if (!merchantName) return null;

    const historicalTransactions = Array.from(this.transactions.values())
      .filter(t => t.merchantName?.toLowerCase() === merchantName.toLowerCase());

    if (historicalTransactions.length === 0) return null;

    // Return most common category for this merchant
    const categoryCount: Record<string, number> = {};
    for (const transaction of historicalTransactions) {
      categoryCount[transaction.category] = (categoryCount[transaction.category] || 0) + 1;
    }

    const mostCommon = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0];

    return mostCommon ? mostCommon[0] as TransactionCategory : null;
  }

  private async evaluateRuleConditions(
    transaction: Transaction,
    conditions: TransactionRule['conditions']
  ): Promise<boolean> {
    return conditions.every(condition => {
      const fieldValue = this.getTransactionFieldValue(transaction, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
        case 'starts_with':
          return String(fieldValue).toLowerCase().startsWith(String(condition.value).toLowerCase());
        case 'ends_with':
          return String(fieldValue).toLowerCase().endsWith(String(condition.value).toLowerCase());
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'between':
          return Number(fieldValue) >= Number(condition.value) && 
                 Number(fieldValue) <= Number(condition.value2);
        default:
          return false;
      }
    });
  }

  private async executeRuleActions(
    transaction: Transaction,
    actions: TransactionRule['actions']
  ): Promise<void> {
    for (const action of actions) {
      switch (action.type) {
        case 'set_category':
          transaction.category = action.value as TransactionCategory;
          break;
        case 'set_subcategory':
          transaction.subcategory = action.value as string;
          break;
        case 'add_tag':
          if (!transaction.tags.includes(action.value as string)) {
            transaction.tags.push(action.value as string);
          }
          break;
        case 'set_merchant':
          transaction.merchantName = action.value as string;
          break;
        case 'exclude_from_budget':
          transaction.excludeFromBudget = action.value as boolean;
          break;
        case 'mark_as_transfer':
          transaction.isTransfer = action.value as boolean;
          if (transaction.isTransfer) {
            transaction.category = 'transfers';
          }
          break;
      }
    }
  }

  private getTransactionFieldValue(transaction: Transaction, field: string): any {
    switch (field) {
      case 'merchant':
        return transaction.merchantName || '';
      case 'description':
        return transaction.description;
      case 'amount':
        return Math.abs(transaction.amount);
      case 'category':
        return transaction.category;
      case 'account':
        return transaction.accountId;
      default:
        return '';
    }
  }

  private async applyRuleToExistingTransactions(rule: TransactionRule): Promise<void> {
    const allTransactions = Array.from(this.transactions.values());
    
    for (const transaction of allTransactions) {
      if (await this.evaluateRuleConditions(transaction, rule.conditions)) {
        await this.executeRuleActions(transaction, rule.actions);
        transaction.updatedAt = new Date();
        this.transactions.set(transaction.id, transaction);
      }
    }
  }

  private async calculateCategoryBreakdown(transactions: Transaction[]): Promise<CategorySpending[]> {
    const categoryMap: Record<string, { amount: number; count: number; transactions: Transaction[] }> = {};

    for (const transaction of transactions) {
      if (transaction.amount >= 0) continue; // Skip income
      
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      
      if (!categoryMap[category]) {
        categoryMap[category] = { amount: 0, count: 0, transactions: [] };
      }
      
      categoryMap[category].amount += amount;
      categoryMap[category].count += 1;
      categoryMap[category].transactions.push(transaction);
    }

    const totalExpenses = Object.values(categoryMap).reduce((sum, cat) => sum + cat.amount, 0);

    return Object.entries(categoryMap).map(([category, data]) => ({
      category: category as TransactionCategory,
      amount: data.amount,
      percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      transactionCount: data.count,
      averageAmount: data.amount / data.count,
      change: {
        amount: 0, // TODO: Calculate vs previous period
        percentage: 0,
        direction: 'stable' as const
      }
    })).sort((a, b) => b.amount - a.amount);
  }

  private async calculateMerchantBreakdown(transactions: Transaction[]) {
    // Similar to category breakdown but for merchants
    return [];
  }

  private async generateSpendingInsights(
    transactions: Transaction[],
    categoryBreakdown: CategorySpending[]
  ): Promise<SpendingInsight[]> {
    const insights: SpendingInsight[] = [];

    // High spending categories
    const topCategories = categoryBreakdown.slice(0, 3);
    for (const category of topCategories) {
      if (category.percentage > 30) {
        insights.push({
          type: 'high_spending',
          title: `High ${category.category} spending`,
          description: `${category.category} accounts for ${category.percentage.toFixed(1)}% of your total spending`,
          amount: category.amount,
          category: category.category,
          confidence: 0.9,
          actionable: true,
          action: `Consider setting a budget for ${category.category} to control spending`
        });
      }
    }

    // TODO: Add more insight types
    // - Unusual merchant patterns
    // - Recurring charge analysis
    // - Budget alerts
    // - Savings opportunities

    return insights;
  }

  private getPeriodDates(period: 'month' | 'quarter' | 'year'): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }

  private detectFileFormat(filename: string): TransactionImport['format'] {
    const extension = filename.toLowerCase().split('.').pop();
    switch (extension) {
      case 'csv':
        return 'csv';
      case 'ofx':
        return 'ofx';
      case 'qfx':
        return 'qfx';
      case 'qif':
        return 'qif';
      default:
        return 'csv';
    }
  }

  private async processImportFile(
    importRecord: TransactionImport,
    file: File,
    mapping: any
  ): Promise<void> {
    // TODO: Implement actual file processing
    // This would parse CSV/OFX and create transactions
    
    // Mock processing
    setTimeout(() => {
      importRecord.status = 'completed';
      importRecord.totalTransactions = 100;
      importRecord.importedTransactions = 95;
      importRecord.duplicateTransactions = 3;
      importRecord.errorTransactions = 2;
      importRecord.completedAt = new Date();
      
      this.imports.set(importRecord.id, importRecord);
    }, 3000);
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRuleId(): string {
    return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTransferId(): string {
    return `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateImportId(): string {
    return `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const transactionService = TransactionService.getInstance();