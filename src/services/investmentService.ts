import { Holding, PortfolioSummary } from '@/types/investments';

class InvestmentService {
  private static instance: InvestmentService;
  private storageKey = 'vueni:portfolio:v1';
  private summary: PortfolioSummary = { holdings: [], snapshots: [] };

  private constructor() {
    this.load();
  }

  public static getInstance() {
    if (!InvestmentService.instance) {
      InvestmentService.instance = new InvestmentService();
    }
    return InvestmentService.instance;
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (raw) {
        this.summary = JSON.parse(raw) as PortfolioSummary;
      } else {
        // Seed demo data
        this.summary = {
          holdings: [
            { id: '1', symbol: 'AAPL', name: 'Apple Inc.', shares: 10, purchasePrice: 140, currentPrice: 195, sector: 'Technology' },
            { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, purchasePrice: 230, currentPrice: 440, sector: 'Technology' },
            { id: '3', symbol: 'VTI', name: 'Vanguard Total Market ETF', shares: 15, purchasePrice: 180, currentPrice: 260, sector: 'ETF' },
            { id: '4', symbol: 'TSLA', name: 'Tesla Inc.', shares: 3, purchasePrice: 260, currentPrice: 275, sector: 'Automotive' }
          ],
          snapshots: Array.from({ length: 12 }).map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (11 - i));
            const value = 10000 + i * 500 + Math.random() * 300; // mock growth
            return { date: date.toISOString().split('T')[0], value: Number(value.toFixed(2)) };
          })
        };
        this.persist();
      }
    } catch (e) {
      console.error('Failed to parse investment data', e);
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.summary));
  }

  async getPortfolio(): Promise<PortfolioSummary> {
    return { ...this.summary, holdings: [...this.summary.holdings], snapshots: [...this.summary.snapshots] };
  }

  async addHolding(partial: Omit<Holding, 'id' | 'currentPrice'> & { currentPrice?: number }): Promise<Holding> {
    const newHolding: Holding = {
      id: Date.now().toString(),
      currentPrice: partial.currentPrice ?? partial.purchasePrice,
      ...partial
    };
    this.summary.holdings.push(newHolding);
    this.persist();
    return newHolding;
  }

  async updateHolding(id: string, updates: Partial<Holding>): Promise<void> {
    const idx = this.summary.holdings.findIndex(h => h.id === id);
    if (idx !== -1) {
      this.summary.holdings[idx] = { ...this.summary.holdings[idx], ...updates };
      this.persist();
    }
  }

  async deleteHolding(id: string): Promise<void> {
    this.summary.holdings = this.summary.holdings.filter(h => h.id !== id);
    this.persist();
  }

  /** Demo: add a new snapshot (e.g., daily closing value) */
  async recordSnapshot(value: number) {
    this.summary.snapshots.push({ date: new Date().toISOString().split('T')[0], value });
    this.persist();
  }
}

export const investmentService = InvestmentService.getInstance(); 