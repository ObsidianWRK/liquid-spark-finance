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

export interface NetWorthData {
  date: string;
  netWorth: number;
  assets: number;
  liabilities: number;
  type: 'historical' | 'projected';
  growthRate?: number;
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
      eco: Math.max(60, Math.min(95, baseEco + variance())),
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
      savings: Math.max(0, savings + variance()),
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
      sustainableFood: Math.max(
        100,
        127 + seasonalFactor * 20 + trendFactor * 10
      ),
      renewableEnergy: Math.max(70, 85 + seasonalFactor * 15),
      ecoTransport: Math.max(30, 45 + seasonalFactor * 12),
      greenProducts: Math.max(80, 120 + seasonalFactor * 25 + trendFactor * 8),
      carbonOffset: Math.max(15, 25 + seasonalFactor * 8),
      conservation: Math.max(40, 60 + seasonalFactor * 15 + trendFactor * 5),
    });
  }

  return data;
};

// Generate net worth data for 3 years historical + 2 years projected
export const generateNetWorthData = (): NetWorthData[] => {
  const data: NetWorthData[] = [];
  const currentDate = new Date();

  // Base financial values (in thousands)
  const baseAssets = 85; // $85k in assets
  const baseLiabilities = 25; // $25k in liabilities
  const monthlyNetSavings = 2.5; // $2.5k per month

  // Historical data (3 years = 36 months)
  for (let i = 35; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);

    // Calculate growth with realistic patterns
    const monthsFromStart = 35 - i;
    const yearProgress = monthsFromStart / 12;

    // Compound growth with market volatility
    const marketVolatility = Math.sin(monthsFromStart * 0.3) * 0.15; // ±15% market swings
    const economicCycle = Math.cos(monthsFromStart * 0.1) * 0.08; // Longer economic cycles

    // Assets grow with investments and salary increases
    const assetGrowthRate = 0.07 + marketVolatility + economicCycle; // ~7% annual average
    const currentAssets =
      baseAssets * Math.pow(1 + assetGrowthRate / 12, monthsFromStart) +
      monthlyNetSavings * monthsFromStart;

    // Liabilities decrease over time (paying down debt)
    const debtPaydown = 200; // Monthly debt reduction
    const currentLiabilities = Math.max(
      5000,
      baseLiabilities - debtPaydown * monthsFromStart
    );

    const netWorth = currentAssets - currentLiabilities;

    // Add some realistic variance
    const variance = netWorth * (Math.random() - 0.5) * 0.03; // ±3% variance

    data.push({
      date: date.toISOString().split('T')[0],
      netWorth: Math.round(netWorth + variance),
      assets: Math.round(currentAssets + variance * 0.8),
      liabilities: Math.round(currentLiabilities),
      type: 'historical',
      growthRate:
        monthsFromStart > 0
          ? (netWorth / (baseAssets - baseLiabilities) - 1) * 100
          : 0,
    });
  }

  // Calculate historical growth trend for projections
  const historicalData = data.slice(-12); // Last 12 months
  const avgMonthlyGrowth =
    historicalData.reduce((sum, point, index) => {
      if (index === 0) return 0;
      const prevPoint = historicalData[index - 1];
      const monthlyGrowthRate =
        (point.netWorth - prevPoint.netWorth) / prevPoint.netWorth;
      return sum + monthlyGrowthRate;
    }, 0) /
    (historicalData.length - 1);

  // Projected data (2 years = 24 months)
  const lastHistoricalPoint = data[data.length - 1];
  for (let i = 1; i <= 24; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + i);

    // Project based on historical trends with some conservative adjustment
    const conservativeFactor = 0.8; // Be 20% more conservative in projections
    const projectedGrowthRate = avgMonthlyGrowth * conservativeFactor;

    // Add projected market cycles and economic uncertainty
    const futureVolatility = Math.sin(i * 0.2) * 0.1; // Reduced volatility in projections
    const adjustedGrowthRate = projectedGrowthRate + futureVolatility;

    const prevPoint = data[data.length - 1];
    const projectedNetWorth = prevPoint.netWorth * (1 + adjustedGrowthRate);
    const projectedAssets = prevPoint.assets * (1 + adjustedGrowthRate * 1.1); // Assets grow slightly faster
    const projectedLiabilities = Math.max(2000, prevPoint.liabilities * 0.995); // Continued debt reduction

    data.push({
      date: date.toISOString().split('T')[0],
      netWorth: Math.round(projectedNetWorth),
      assets: Math.round(projectedAssets),
      liabilities: Math.round(projectedLiabilities),
      type: 'projected',
      growthRate: (projectedNetWorth / lastHistoricalPoint.netWorth - 1) * 100,
    });
  }

  return data;
};

// Service object with all historical data generators
export const mockHistoricalService = {
  getHistoricalScores: generateHistoricalScores,
  getMonthlyFinancialData: generateMonthlyFinancialData,
  getCategoryTrends: generateCategoryTrends,
  getNetWorthData: generateNetWorthData,
};
