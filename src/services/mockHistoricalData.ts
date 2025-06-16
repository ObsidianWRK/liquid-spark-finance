export interface HistoricalScore {
  date: string;
  financial: number;
  health: number;
  eco: number;
}

export interface MonthlySpending {
  date: string;
  spending: number;
  income: number;
  savings: number;
}

export interface CategoryTrend {
  date: string;
  fitness: number;
  nutrition: number;
  healthcare: number;
  wellness: number;
  supplements: number;
  mentalHealth: number;
  sustainableFood: number;
  renewableEnergy: number;
  ecoTransport: number;
  greenProducts: number;
  carbonOffset: number;
  conservation: number;
}

// Generate historical scores for the past 12 months
export const generateHistoricalScores = (): HistoricalScore[] => {
  const data: HistoricalScore[] = [];
  const currentDate = new Date();
  
  // Start from 12 months ago
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    // Generate realistic score progression with some randomness
    const baseFinancial = 50 + (11 - i) * 1.5; // Gradual improvement
    const baseHealth = 65 + Math.sin((11 - i) * 0.5) * 10; // Seasonal variation
    const baseEco = 70 + (11 - i) * 1.2; // Steady improvement
    
    // Add some realistic variance
    const variance = () => (Math.random() - 0.5) * 8;
    
    data.push({
      date: date.toISOString().split('T')[0],
      financial: Math.max(30, Math.min(85, baseFinancial + variance())),
      health: Math.max(45, Math.min(90, baseHealth + variance())),
      eco: Math.max(60, Math.min(95, baseEco + variance()))
    });
  }
  
  return data;
};

// Generate monthly financial data
export const generateMonthlyFinancialData = (): MonthlySpending[] => {
  const data: MonthlySpending[] = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    // Base values with realistic trends
    const baseIncome = 4200 + Math.sin((11 - i) * 0.3) * 300; // Slight seasonal variation
    const baseSpending = 3200 + Math.sin((11 - i) * 0.4) * 400; // Holiday spending patterns
    const savings = baseIncome - baseSpending;
    
    // Add some variance
    const variance = () => (Math.random() - 0.5) * 200;
    
    data.push({
      date: date.toISOString().split('T')[0],
      spending: Math.max(2500, baseSpending + variance()),
      income: Math.max(3500, baseIncome + variance()),
      savings: Math.max(0, savings + variance())
    });
  }
  
  return data;
};

// Generate category spending trends
export const generateCategoryTrends = (): CategoryTrend[] => {
  const data: CategoryTrend[] = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    // Seasonal patterns for different categories
    const seasonalFactor = Math.sin((11 - i) * 0.5);
    const trendFactor = (11 - i) * 0.1; // Gradual increase over time
    
    data.push({
      date: date.toISOString().split('T')[0],
      // Health categories
      fitness: Math.max(50, 85 + seasonalFactor * 20 + trendFactor * 5),
      nutrition: Math.max(30, 38 + seasonalFactor * 10),
      healthcare: Math.max(200, 340 + seasonalFactor * 50),
      wellness: Math.max(50, 75 + seasonalFactor * 15),
      supplements: Math.max(30, 45 + seasonalFactor * 8),
      mentalHealth: Math.max(80, 120 + seasonalFactor * 25),
      // Eco categories
      sustainableFood: Math.max(100, 127 + seasonalFactor * 20 + trendFactor * 10),
      renewableEnergy: Math.max(70, 85 + seasonalFactor * 15),
      ecoTransport: Math.max(30, 45 + seasonalFactor * 12),
      greenProducts: Math.max(80, 120 + seasonalFactor * 25 + trendFactor * 8),
      carbonOffset: Math.max(15, 25 + seasonalFactor * 8),
      conservation: Math.max(40, 60 + seasonalFactor * 15 + trendFactor * 5)
    });
  }
  
  return data;
};

// Service object with all historical data generators
export const mockHistoricalService = {
  getHistoricalScores: generateHistoricalScores,
  getMonthlyFinancialData: generateMonthlyFinancialData,
  getCategoryTrends: generateCategoryTrends
}; 