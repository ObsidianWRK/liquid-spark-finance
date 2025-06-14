
export interface TransactionScores {
  financial: number;  // 0-100
  health: number;     // 0-100
  eco: number;        // 0-100
}

interface TransactionData {
  merchant: string;
  amount: number;
  category: {
    name: string;
  };
  description?: string;
}

export function calculateTransactionScores(transaction: TransactionData): TransactionScores {
  const financialScore = calculateFinancialScore(transaction);
  const healthScore = calculateHealthScore(transaction);
  const ecoScore = calculateEcoScore(transaction);
  
  return { 
    financial: financialScore, 
    health: healthScore, 
    eco: ecoScore 
  };
}

function calculateFinancialScore(transaction: TransactionData): number {
  const { category, amount } = transaction;
  
  let score = 50;
  
  // Category impact
  const categoryScores: Record<string, number> = {
    'Investment': 90,
    'Savings': 85,
    'Income': 95,
    'Healthcare': 75,
    'Utilities': 70,
    'Groceries': 65,
    'Transportation': 50,
    'Entertainment': 30,
    'Dining': 35,
    'Shopping': 25,
    'Coffee': 20
  };
  
  score = categoryScores[category.name] || 50;
  
  // Amount impact (higher amounts = lower score for discretionary spending)
  const discretionaryCategories = ['Entertainment', 'Dining', 'Shopping', 'Coffee'];
  if (discretionaryCategories.includes(category.name)) {
    if (Math.abs(amount) > 100) score -= 20;
    else if (Math.abs(amount) > 50) score -= 10;
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
