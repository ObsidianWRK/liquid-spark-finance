import { Investment, InvestmentAccount, Portfolio, Holding, PerformanceMetrics, AssetAllocation, RiskMetrics } from '@/types/investments';
import { secureStorage } from '@/utils/crypto';

/**
 * Investment Portfolio Management Service
 * Handles portfolio tracking, performance analytics, and investment insights
 */
class InvestmentService {
  private static instance: InvestmentService;
  private storageKey = 'vueni:portfolio:v1';
  private investments: Map<string, Investment> = new Map();
  private accounts: Map<string, InvestmentAccount> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private holdings: Map<string, Holding> = new Map();

  // Mock market data service - in production would integrate with real data providers
  private marketDataService = {
    getCurrentPrice: async (symbol: string): Promise<number> => {
      // Mock price data - in production would fetch from Yahoo Finance, Alpha Vantage, etc.
      const mockPrices: Record<string, number> = {
        'AAPL': 185.50,
        'GOOGL': 142.20,
        'MSFT': 375.80,
        'TSLA': 195.30,
        'AMZN': 158.90,
        'SPY': 485.60,
        'QQQ': 392.40,
        'VTI': 252.30,
        'NVDA': 875.40,
        'BRK.B': 425.60
      };
      return mockPrices[symbol] || 100 + (Math.random() * 100);
    },
    
    getHistoricalPrices: async (symbol: string, days: number): Promise<Array<{ date: Date; price: number }>> => {
      const currentPrice = await this.getCurrentPrice(symbol);
      const prices: Array<{ date: Date; price: number }> = [];
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate price volatility
        const volatility = 0.02 + (Math.random() * 0.03);
        const change = (Math.random() - 0.5) * volatility;
        const price = currentPrice * (1 + change * (i / days));
        
        prices.push({ date, price });
      }
      
      return prices;
    }
  };

  private constructor() {
    this.loadFromStorage();
    this.seedDemoData();
  }

  public static getInstance() {
    if (!InvestmentService.instance) {
      InvestmentService.instance = new InvestmentService();
    }
    return InvestmentService.instance;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = secureStorage.getItem(this.storageKey);
      if (data) {
        // Load existing data
        const portfolioData = data as { holdings?: unknown[] };
        if (portfolioData.holdings) {
          portfolioData.holdings.forEach((holding: unknown) => {
            this.holdings.set(holding.id, holding);
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse investment data', e);
    }
  }

  private async seedDemoData() {
    // Create demo investment account
    const demoAccount: InvestmentAccount = {
      id: 'demo_investment_account',
      familyId: 'demo_family',
      institution: 'Demo Brokerage',
      accountType: 'brokerage',
      accountNumber: '****1234',
      name: 'Investment Account',
      balance: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.accounts.set(demoAccount.id, demoAccount);

    // Create demo holdings
    const demoHoldings = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        averageCostPerShare: 140,
        assetType: 'stock' as const,
        sector: 'Technology'
      },
      {
        symbol: 'MSFT', 
        name: 'Microsoft Corp.',
        quantity: 5,
        averageCostPerShare: 230,
        assetType: 'stock' as const,
        sector: 'Technology'
      },
      {
        symbol: 'VTI',
        name: 'Vanguard Total Market ETF',
        quantity: 15,
        averageCostPerShare: 180,
        assetType: 'etf' as const,
        sector: 'Diversified'
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        quantity: 3,
        averageCostPerShare: 260,
        assetType: 'stock' as const,
        sector: 'Automotive'
      }
    ];

    for (const holdingData of demoHoldings) {
      if (!Array.from(this.holdings.values()).some(h => h.symbol === holdingData.symbol)) {
        await this.addHolding(demoAccount.id, holdingData);
      }
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    const data = {
      holdings: Array.from(this.holdings.values()),
      accounts: Array.from(this.accounts.values())
    };
    secureStorage.setItem(this.storageKey, data);
  }

  /**
   * Create investment account
   */
  async createInvestmentAccount(data: Omit<InvestmentAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<InvestmentAccount> {
    const account: InvestmentAccount = {
      id: this.generateAccountId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accounts.set(account.id, account);
    this.persist();
    return account;
  }

  /**
   * Add investment holding
   */
  async addHolding(accountId: string, data: Omit<Holding, 'id' | 'accountId' | 'currentPrice' | 'marketValue' | 'unrealizedGainLoss' | 'unrealizedGainLossPercent' | 'createdAt' | 'updatedAt'>): Promise<Holding> {
    const holding: Holding = {
      id: this.generateHoldingId(),
      accountId,
      ...data,
      costBasis: data.averageCostPerShare * data.quantity,
      currentPrice: 0,
      marketValue: 0,
      unrealizedGainLoss: 0,
      unrealizedGainLossPercent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Get current market price
    holding.currentPrice = await this.marketDataService.getCurrentPrice(holding.symbol);
    holding.marketValue = holding.currentPrice * holding.quantity;
    holding.unrealizedGainLoss = holding.marketValue - holding.costBasis;
    holding.unrealizedGainLossPercent = holding.costBasis ? (holding.unrealizedGainLoss / holding.costBasis) * 100 : 0;

    this.holdings.set(holding.id, holding);
    this.persist();
    return holding;
  }

  /**
   * Get family's investment portfolio
   */
  async getFamilyPortfolio(familyId: string): Promise<Portfolio> {
    const accounts = Array.from(this.accounts.values())
      .filter(account => account.familyId === familyId);

    const holdings = Array.from(this.holdings.values())
      .filter(holding => accounts.some(account => account.id === holding.accountId));

    // Update current prices
    for (const holding of holdings) {
      holding.currentPrice = await this.marketDataService.getCurrentPrice(holding.symbol);
      holding.marketValue = holding.currentPrice * holding.quantity;
      holding.unrealizedGainLoss = holding.marketValue - holding.costBasis;
      holding.unrealizedGainLossPercent = holding.costBasis ? (holding.unrealizedGainLoss / holding.costBasis) * 100 : 0;
    }

    const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
    const totalCostBasis = holdings.reduce((sum, holding) => sum + holding.costBasis, 0);
    const totalGainLoss = totalValue - totalCostBasis;
    const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

    const portfolio: Portfolio = {
      id: `portfolio_${familyId}`,
      familyId,
      accounts,
      holdings,
      totalValue,
      totalCostBasis,
      totalGainLoss,
      totalGainLossPercent,
      performance: await this.calculatePerformanceMetrics(familyId),
      allocation: await this.calculateAssetAllocation(holdings),
      riskMetrics: await this.calculateRiskMetrics(holdings),
      lastUpdated: new Date()
    };

    this.portfolios.set(portfolio.id, portfolio);
    return portfolio;
  }

  /**
   * Legacy method for compatibility
   */
  async getPortfolio(): Promise<{ holdings: Holding[]; snapshots: Array<{ date: string; value: number }> }> {
    const portfolio = await this.getFamilyPortfolio('demo_family');
    
    // Generate snapshots for demo
    const snapshots = Array.from({ length: 12 }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const value = portfolio.totalValue * (0.8 + (i / 11) * 0.2) + (Math.random() - 0.5) * 1000;
      return { date: date.toISOString().split('T')[0], value: Number(value.toFixed(2)) };
    });

    return {
      holdings: portfolio.holdings,
      snapshots
    };
  }

  /**
   * Calculate portfolio performance metrics
   */
  async calculatePerformanceMetrics(familyId: string): Promise<PerformanceMetrics> {
    const portfolio = this.portfolios.get(`portfolio_${familyId}`);
    if (!portfolio) {
      // Return default metrics if portfolio not found
      return {
        totalReturn: 0,
        annualizedReturn: 0,
        returns: { '1d': 0, '7d': 0, '30d': 0, '90d': 0, '365d': 0 },
        sharpeRatio: 0,
        volatility: 0,
        maxDrawdown: 0,
        alpha: 0,
        beta: 1,
        rSquared: 0
      };
    }

    // Get historical data for performance calculation
    const periods = [1, 7, 30, 90, 365]; // Days
    const returns: Record<string, number> = {};

    for (const days of periods) {
      // Simulate historical returns - in production would use actual historical data
      const historicalReturn = (Math.random() - 0.4) * 0.2; // Random return between -8% and 12%
      returns[`${days}d`] = historicalReturn * 100;
    }

    // Calculate annualized return (simplified)
    const yearReturn = returns['365d'] || 0;
    const sharpeRatio = yearReturn / 15; // Assuming 15% volatility
    const maxDrawdown = Math.min(...Object.values(returns)) || -5;

    return {
      totalReturn: portfolio.totalGainLossPercent,
      annualizedReturn: yearReturn,
      returns,
      sharpeRatio,
      volatility: 15, // Mock volatility
      maxDrawdown,
      alpha: yearReturn - 8, // Assuming 8% market return
      beta: 1.0 + (Math.random() - 0.5) * 0.4, // Random beta around 1.0
      rSquared: 0.85 + Math.random() * 0.1 // Random R-squared between 0.85-0.95
    };
  }

  /**
   * Calculate asset allocation
   */
  async calculateAssetAllocation(holdings: Holding[]): Promise<AssetAllocation> {
    const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
    
    if (totalValue === 0) {
      return {
        stocks: 0,
        bonds: 0,
        cash: 0,
        reits: 0,
        commodities: 0,
        crypto: 0,
        other: 0,
        sectors: {},
        regions: {
          US: 0,
          International: 0,
          Emerging: 0
        }
      };
    }

    let stocks = 0, bonds = 0, crypto = 0, other = 0;
    const cash = 0, commodities = 0, reits = 0;
    const sectors: Record<string, number> = {};

    for (const holding of holdings) {
      const value = holding.marketValue;
      const percentage = (value / totalValue) * 100;

      // Categorize by asset type
      if (holding.assetType === 'stock') {
        stocks += percentage;
        const sector = holding.sector || 'Other';
        sectors[sector] = (sectors[sector] || 0) + percentage;
      } else if (holding.assetType === 'bond') {
        bonds += percentage;
      } else if (holding.assetType === 'reit') {
        reits += percentage;
      } else if (holding.assetType === 'crypto') {
        crypto += percentage;
      } else if (holding.assetType === 'etf' || holding.assetType === 'mutual_fund') {
        // Classify ETFs/mutual funds based on their underlying assets
        if (holding.symbol.includes('BOND')) {
          bonds += percentage;
        } else {
          stocks += percentage;
          const sector = 'Diversified';
          sectors[sector] = (sectors[sector] || 0) + percentage;
        }
      } else {
        other += percentage;
      }
    }

    return {
      stocks,
      bonds,
      cash,
      reits,
      commodities,
      crypto,
      other,
      sectors,
      regions: {
        US: stocks * 0.7, // Assume 70% US allocation
        International: stocks * 0.25, // 25% International
        Emerging: stocks * 0.05 // 5% Emerging markets
      }
    };
  }

  /**
   * Calculate risk metrics
   */
  async calculateRiskMetrics(holdings: Holding[]): Promise<RiskMetrics> {
    const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
    
    if (totalValue === 0) {
      return {
        concentrationRisk: 0,
        sectorConcentration: 0,
        geographicRisk: 0,
        currencyRisk: 0,
        correlation: 0,
        var95: 0,
        var99: 0,
        expectedShortfall: 0
      };
    }

    // Calculate concentration risk
    const concentrationRisk = holdings.length > 0 
      ? Math.max(...holdings.map(h => (h.marketValue / totalValue) * 100))
      : 0;

    // Calculate sector concentration
    const sectors: Record<string, number> = {};
    let maxSectorConcentration = 0;

    for (const holding of holdings) {
      const sector = holding.sector || 'Other';
      const percentage = (holding.marketValue / totalValue) * 100;
      sectors[sector] = (sectors[sector] || 0) + percentage;
      maxSectorConcentration = Math.max(maxSectorConcentration, sectors[sector]);
    }

    // Calculate portfolio correlation (simplified)
    const correlation = holdings.length > 5 ? 0.6 + Math.random() * 0.3 : 0.8;

    return {
      concentrationRisk,
      sectorConcentration: maxSectorConcentration,
      geographicRisk: 30, // Mock value
      currencyRisk: 15, // Mock value
      correlation,
      var95: totalValue * 0.05, // 5% Value at Risk
      var99: totalValue * 0.08, // 8% Value at Risk
      expectedShortfall: totalValue * 0.12 // 12% Expected Shortfall
    };
  }

  /**
   * Get investment recommendations
   */
  async getInvestmentRecommendations(familyId: string): Promise<Array<{
    type: 'rebalance' | 'diversify' | 'tax_optimize' | 'reduce_risk';
    title: string;
    description: string;
    actionItems: string[];
    priority: 'high' | 'medium' | 'low';
    potentialBenefit: string;
  }>> {
    const portfolio = await this.getFamilyPortfolio(familyId);
    const recommendations: Array<{
      type: 'rebalance' | 'diversify' | 'tax_optimize' | 'reduce_risk';
      title: string;
      description: string;
      actionItems: string[];
      priority: 'high' | 'medium' | 'low';
      potentialBenefit: string;
    }> = [];

    // Check for rebalancing needs
    if (portfolio.allocation.stocks > 80) {
      recommendations.push({
        type: 'rebalance',
        title: 'Consider Rebalancing Portfolio',
        description: `Your portfolio is ${portfolio.allocation.stocks.toFixed(1)}% stocks, which may be too aggressive.`,
        actionItems: [
          'Add bond ETFs or CDs for stability',
          'Consider target-date funds for automatic rebalancing',
          'Review your risk tolerance and investment timeline'
        ],
        priority: 'medium',
        potentialBenefit: 'Reduced portfolio volatility and risk'
      });
    }

    // Check for concentration risk
    if (portfolio.riskMetrics.concentrationRisk > 20) {
      recommendations.push({
        type: 'diversify',
        title: 'Reduce Concentration Risk',
        description: `Your largest holding represents ${portfolio.riskMetrics.concentrationRisk.toFixed(1)}% of your portfolio.`,
        actionItems: [
          'Consider selling some of your largest position',
          'Invest in broad market index funds',
          'Add international diversification'
        ],
        priority: 'high',
        potentialBenefit: 'Better risk-adjusted returns through diversification'
      });
    }

    // Tax optimization opportunities
    if (portfolio.totalGainLoss < 0) {
      recommendations.push({
        type: 'tax_optimize',
        title: 'Tax-Loss Harvesting Opportunity',
        description: 'You have unrealized losses that could offset gains for tax benefits.',
        actionItems: [
          'Harvest losses before year-end',
          'Avoid wash sale rules',
          'Reinvest in similar but not identical assets'
        ],
        priority: 'medium',
        potentialBenefit: 'Potential tax savings of $500-2,000'
      });
    }

    return recommendations;
  }

  /**
   * Update holding (legacy compatibility)
   */
  async updateHolding(id: string, updates: Partial<Holding>): Promise<void> {
    const holding = this.holdings.get(id);
    if (holding) {
      Object.assign(holding, updates, { updatedAt: new Date() });
      this.holdings.set(id, holding);
      this.persist();
    }
  }

  /**
   * Delete holding (legacy compatibility)
   */
  async deleteHolding(id: string): Promise<void> {
    this.holdings.delete(id);
    this.persist();
  }

  /**
   * Record snapshot (legacy compatibility)
   */
  async recordSnapshot(value: number) {
    // This would be used for historical tracking
    console.log(`Recording portfolio snapshot: $${value}`);
  }

  // Private helper methods
  private generateAccountId(): string {
    return `inv_acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateHoldingId(): string {
    return `holding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const investmentService = InvestmentService.getInstance(); 