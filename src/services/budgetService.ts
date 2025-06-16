import { BudgetCategory } from '@/types/budget';

/**
 * Very light-weight client-side service for managing user budget data.
 * Data is persisted to localStorage so it survives page refreshes during demos.
 *
 * In a production scenario this class would proxy network requests to a
 * backend service (e.g. Firebase, Supabase, GraphQL, REST, etc.).
 */
class BudgetService {
  private static instance: BudgetService;
  private storageKey = 'vueni:budgets:v1';
  private categories: BudgetCategory[] = [];

  private constructor() {
    this.load();
  }

  public static getInstance() {
    if (!BudgetService.instance) {
      BudgetService.instance = new BudgetService();
    }
    return BudgetService.instance;
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (raw) {
        this.categories = JSON.parse(raw) as BudgetCategory[];
      } else {
        // Seed with sample data the first time for a richer demo experience
        this.categories = [
          { id: '1', name: 'Groceries', budget: 600, spent: 450, color: '#4ade80', recurring: true },
          { id: '2', name: 'Dining', budget: 300, spent: 220, color: '#38bdf8', recurring: true },
          { id: '3', name: 'Transportation', budget: 200, spent: 145, color: '#f97316', recurring: true },
          { id: '4', name: 'Entertainment', budget: 200, spent: 165, color: '#a855f7', recurring: true },
          { id: '5', name: 'Savings & Investments', budget: 500, spent: 500, color: '#facc15', recurring: true }
        ];
        this.persist();
      }
    } catch (e) {
      console.error('Failed to parse budgets from localStorage', e);
      this.categories = [];
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.categories));
  }

  /** Budget CRUD **/
  async listCategories(): Promise<BudgetCategory[]> {
    return [...this.categories];
  }

  async addCategory(partial: Omit<BudgetCategory, 'id' | 'spent'>): Promise<BudgetCategory> {
    const newCat: BudgetCategory = {
      id: Date.now().toString(),
      spent: 0,
      ...partial
    };
    this.categories.push(newCat);
    this.persist();
    return newCat;
  }

  async updateCategory(id: string, updates: Partial<BudgetCategory>): Promise<void> {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.categories[idx] = { ...this.categories[idx], ...updates };
      this.persist();
    }
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter(c => c.id !== id);
    this.persist();
  }

  /** Utility: record spending that counts against a budget */
  async addSpending(id: string, amount: number): Promise<void> {
    const cat = this.categories.find(c => c.id === id);
    if (cat) {
      cat.spent += amount;
      this.persist();
    }
  }
}

export const budgetService = BudgetService.getInstance(); 