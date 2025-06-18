export interface Holding {
  id: string;
  symbol: string; // e.g. "AAPL"
  name: string; // Company name
  shares: number;
  purchasePrice: number; // Avg cost basis
  currentPrice: number;
  sector?: string;
  accountId: string;
  quantity: number;
  averageCostPerShare: number;
  assetType: 'stock' | 'etf' | 'bond' | 'crypto' | 'reit' | 'commodity' | 'cash';
  costBasis: number;
  marketValue: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  familyId: string;
  accountId: string;
  symbol: string;
  name: string;
  type: 'stock' | 'bond' | 'etf' | 'mutual_fund' | 'crypto' | 'reit';
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  sector?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentAccount {
  id: string;
  familyId: string;
  institution: string;
  accountType: 'brokerage' | 'ira' | '401k' | 'roth_ira' | 'pension';
  accountNumber: string;
  name: string;
  balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  familyId: string;
  name: string;
  description?: string;
  totalValue: number;
  totalCostBasis: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  accounts: InvestmentAccount[];
  holdings: Holding[];
  assetAllocation: AssetAllocation;
  performanceMetrics: PerformanceMetrics;
  riskMetrics: RiskMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
  periodReturn: {
    '1d': number;
    '1w': number;
    '1m': number;
    '3m': number;
    '6m': number;
    '1y': number;
    'ytd': number;
  };
}

export interface AssetAllocation {
  stocks: number;
  bonds: number;
  cash: number;
  reits: number;
  commodities: number;
  crypto: number;
  other: number;
  sectors: Record<string, number>;
  geographical: {
    domestic: number;
    international: number;
    emerging: number;
  };
}

export interface RiskMetrics {
  overallRisk: 'low' | 'moderate' | 'high';
  diversificationScore: number;
  concentrationRisk: number;
  sectorConcentration: Record<string, number>;
  topHoldingsPercentage: number;
  volatilityRating: number;
  recommendations: string[];
}

export interface PortfolioSnapshot {
  date: string; // ISO date string
  value: number; // Portfolio total value at that time
}

export interface PortfolioSummary {
  holdings: Holding[];
  snapshots: PortfolioSnapshot[];
} 