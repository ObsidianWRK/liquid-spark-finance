// Transaction scoring utilities
export interface TransactionData {
  id: string;
  merchant: string;
  category: { name: string; color: string };
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface TransactionScores {
  financial: number;  // 0-100
  health: number;     // 0-100
  eco: number;        // 0-100
}

export function calculateTransactionScores(transaction: TransactionData): TransactionScores {
  const financialScore = calculateFinancialScore(transaction);
  const healthScore = calculateHealthScore(transaction);
  const ecoScore = calculateEcoScore(transaction);
  
  return { 
    financial: Math.round(financialScore), 
    health: Math.round(healthScore), 
    eco: Math.round(ecoScore) 
  };
}

function calculateFinancialScore(transaction: TransactionData): number {
  const { merchant, category, amount } = transaction;
  
  let score = 50; // Base score
  
  // Essential spending gets higher scores
  const essentialCategories = ['groceries', 'utilities', 'healthcare', 'insurance', 'gas'];
  if (essentialCategories.some(cat => category.name.toLowerCase().includes(cat))) {
    score += 20;
  }
  
  // Discretionary spending gets lower scores
  const discretionaryCategories = ['entertainment', 'dining', 'shopping', 'travel'];
  if (discretionaryCategories.some(cat => category.name.toLowerCase().includes(cat))) {
    score -= 10;
  }
  
  // Amount factor (smaller amounts are better for discretionary)
  const absAmount = Math.abs(amount);
  if (absAmount > 500) score -= 20;
  else if (absAmount > 200) score -= 10;
  else if (absAmount > 100) score -= 5;
  
  // Subscription services (good for budgeting)
  const subscriptionKeywords = ['netflix', 'spotify', 'gym', 'insurance', 'phone'];
  if (subscriptionKeywords.some(keyword => merchant.toLowerCase().includes(keyword))) {
    score += 15;
  }
  
  return Math.max(0, Math.min(100, score));
}

function calculateHealthScore(transaction: TransactionData): number {
  const { merchant, category, amount } = transaction;
  
  let score = 50;
  
  // Positive health impact
  const healthyKeywords = ['gym', 'fitness', 'organic', 'whole foods', 'medical', 'pharmacy', 'yoga', 'health'];
  if (healthyKeywords.some(keyword => merchant.toLowerCase().includes(keyword))) {
    score += 30;
  }
  
  // Negative health impact
  const unhealthyKeywords = ['mcdonald', 'burger', 'pizza', 'fast', 'alcohol', 'tobacco', 'candy'];
  if (unhealthyKeywords.some(keyword => merchant.toLowerCase().includes(keyword))) {
    score -= 30;
  }
  
  // Category impact
  const categoryImpact: Record<string, number> = {
    'Healthcare': 85,
    'Fitness': 90,
    'Groceries': 70,
    'Dining': 40,
    'Coffee': 45,
    'Entertainment': 50
  };
  
  if (categoryImpact[category.name]) {
    score = categoryImpact[category.name];
  }
  
  return Math.max(0, Math.min(100, score));
}

function calculateEcoScore(transaction: TransactionData): number {
  const { merchant, category, amount } = transaction;
  
  let score = 50;
  
  // Eco-friendly merchants
  const ecoMerchants = ['tesla', 'whole foods', 'trader joe', 'patagonia', 'rei', 'electric', 'solar'];
  if (ecoMerchants.some(eco => merchant.toLowerCase().includes(eco))) {
    score += 30;
  }
  
  // Category impact
  const categoryImpact: Record<string, number> = {
    'Transportation': 30, // Generally bad for environment
    'Groceries': 60,
    'Utilities': 40,
    'Healthcare': 70,
    'Entertainment': 50,
    'Shopping': 35,
    'Electronics': 40
  };
  
  if (categoryImpact[category.name]) {
    score = categoryImpact[category.name];
  }
  
  // Special cases
  if (merchant.toLowerCase().includes('gas') || merchant.toLowerCase().includes('fuel')) {
    score = 20;
  }
  
  if (merchant.toLowerCase().includes('electric') || merchant.toLowerCase().includes('renewable')) {
    score = 85;
  }
  
  return Math.max(0, Math.min(100, score));
}
