export interface Holding {
  id: string;
  symbol: string; // e.g. "AAPL"
  name: string; // Company name
  shares: number;
  purchasePrice: number; // Avg cost basis
  currentPrice: number;
  sector?: string;
}

export interface PortfolioSnapshot {
  date: string; // ISO date string
  value: number; // Portfolio total value at that time
}

export interface PortfolioSummary {
  holdings: Holding[];
  snapshots: PortfolioSnapshot[];
} 