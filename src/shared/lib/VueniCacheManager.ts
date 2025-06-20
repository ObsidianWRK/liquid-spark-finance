import type { Transaction } from '@/types/shared';

export interface VueniCacheItem<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
  size?: number;
  accessCount: number;
  lastAccessed: number;
}

export interface VueniCacheConfig {
  maxSize: number; // Maximum cache size in bytes
  maxAge: number; // Default TTL in milliseconds
  maxItems: number; // Maximum number of items
  enableCompression: boolean;
  enableMetrics: boolean;
  defaultTTL: number;
  cleanupInterval: number;
  compressionThreshold: number;
  enablePersistence: boolean;
  persistenceKey: string;
}

export class VueniCacheManager {
  private cache = new Map<string, VueniCacheItem>();
  private config: VueniCacheConfig;
  private currentSize = 0;
  private metrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    compressionSavings: 0
  };

  constructor(config: Partial<VueniCacheConfig> = {}) {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB default
      maxAge: 30 * 60 * 1000, // 30 minutes default
      maxItems: 1000,
      enableCompression: true,
      enableMetrics: true,
      defaultTTL: 30 * 60 * 1000, // 30 minutes default
      cleanupInterval: 5 * 60 * 1000, // 5 minutes
      compressionThreshold: 1024,
      enablePersistence: true,
      persistenceKey: 'vueni_cache',
      ...config
    };

    // Cleanup expired items periodically
    setInterval(() => this.cleanup(), this.config.cleanupInterval);
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + (ttl || this.config.maxAge);
    
    // Estimate size
    const dataSize = this.estimateSize(data);
    
    // Compress data if enabled and beneficial
    let processedData = data;
    if (this.config.enableCompression && dataSize > this.config.compressionThreshold) { // Compress if > 1KB
      processedData = this.compress(data);
      const compressedSize = this.estimateSize(processedData);
      this.metrics.compressionSavings += dataSize - compressedSize;
    }

    const item: VueniCacheItem<T> = {
      data: processedData,
      timestamp,
      expiresAt,
      key,
      size: dataSize,
      accessCount: 0,
      lastAccessed: timestamp
    };

    // Remove old item if exists
    if (this.cache.has(key)) {
      const oldItem = this.cache.get(key)!;
      this.currentSize -= oldItem.size || 0;
    }

    // Check cache limits and evict if necessary
    this.ensureCacheSpace(dataSize);

    this.cache.set(key, item);
    this.currentSize += dataSize;

    if (this.config.enableMetrics) {
      // Cache entry stored
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as VueniCacheItem<T> | undefined;
    
    if (!item) {
      this.metrics.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      this.metrics.misses++;
      return null;
    }

    // Update access metrics
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.metrics.hits++;

    // Decompress if needed
    let data = item.data;
    if (this.isCompressed(data)) {
      data = this.decompress(data);
    }

    return data;
  }

  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (item) {
      this.currentSize -= item.size || 0;
      return this.cache.delete(key);
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    // Cache cleared
  }

  // Cache financial transactions with optimized strategy
  cacheTransactions(transactions: Transaction[], userId: string): void {
    const key = `vueni_transactions_${userId}`;
    
    // Optimize transaction data for caching
    const optimizedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      merchant: transaction.merchant,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      status: transaction.status,
      scores: transaction.scores
    }));

    this.set(key, optimizedTransactions, 10 * 60 * 1000); // 10 minutes for transactions
  }

  getCachedTransactions(userId: string): Transaction[] | null {
    const key = `vueni_transactions_${userId}`;
    return this.get(key);
  }

  // Cache insights with longer TTL
  cacheInsights<T = Record<string, unknown>>(insights: T, userId: string): void {
    const key = `vueni_insights_${userId}`;
    this.set(key, insights, 60 * 60 * 1000); // 1 hour for insights
  }

  getCachedInsights<T = Record<string, unknown>>(userId: string): T | null {
    const key = `vueni_insights_${userId}`;
    return this.get(key);
  }

  // Cache component state
  cacheComponentState<T = Record<string, unknown>>(componentName: string, state: T): void {
    const key = `vueni_component_${componentName}`;
    this.set(key, state, 5 * 60 * 1000); // 5 minutes for component state
  }

  getCachedComponentState<T = Record<string, unknown>>(componentName: string): T | null {
    const key = `vueni_component_${componentName}`;
    return this.get(key);
  }

  private ensureCacheSpace(requiredSize: number): void {
    // If we exceed max items, evict oldest items
    if (this.cache.size >= this.config.maxItems) {
      this.evictLRU(1);
    }

    // If we exceed max size, evict until we have enough space
    while (this.currentSize + requiredSize > this.config.maxSize && this.cache.size > 0) {
      this.evictLRU(1);
    }
  }

  private evictLRU(count: number): void {
    const items = Array.from(this.cache.values())
      .sort((a, b) => a.lastAccessed - b.lastAccessed)
      .slice(0, count);

    items.forEach(item => {
      this.delete(item.key);
      this.metrics.evictions++;
    });

    if (this.config.enableMetrics && items.length > 0) {
      // Evicted items for LRU policy
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((item, key) => {
      if (now > item.expiresAt) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.delete(key));

    if (this.config.enableMetrics && expiredKeys.length > 0) {
      // Cleaned up expired cache entries
    }
  }

  private estimateSize(data: unknown): number {
    if (typeof data === 'string') {
      return data.length * 2; // UTF-16 encoding
    }
    
    if (typeof data === 'number') {
      return 8; // 64-bit number
    }
    
    if (typeof data === 'boolean') {
      return 4;
    }
    
    if (data === null || data === undefined) {
      return 0;
    }
    
    if (Array.isArray(data)) {
      return data.reduce((total, item) => total + this.estimateSize(item), 0);
    }
    
    if (typeof data === 'object') {
      return Object.entries(data).reduce((total, [key, value]) => {
        return total + this.estimateSize(key) + this.estimateSize(value);
      }, 0);
    }
    
    return JSON.stringify(data).length * 2; // Fallback
  }

  private compress(data: unknown): unknown {
    // Simple compression simulation (in real implementation, use a compression library)
    if (typeof data === 'object') {
      const compressed = {
        __compressed: true,
        data: JSON.stringify(data)
      };
      return compressed;
    }
    return data;
  }

  private decompress(data: unknown): unknown {
    if (this.isCompressed(data)) {
      return JSON.parse(data.data);
    }
    return data;
  }

  private isCompressed(data: unknown): data is { __compressed: true; data: string } {
    return typeof data === 'object' && data.__compressed === true;
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)}${units[unitIndex]}`;
  }

  // Performance and monitoring methods
  getStats() {
    return {
      size: this.cache.size,
      currentSize: this.formatSize(this.currentSize),
      maxSize: this.formatSize(this.config.maxSize),
      hitRate: (this.metrics.hits / (this.metrics.hits + this.metrics.misses) * 100).toFixed(1) + '%',
      metrics: this.metrics,
      compressionSavings: this.formatSize(this.metrics.compressionSavings)
    };
  }

  // Export cache contents for debugging
  exportCache() {
    const items: Array<{
      key: string;
      value: unknown;
      timestamp: number;
      expiresAt: number;
      size: string;
      expiresIn: number;
      accessCount: number;
      lastAccessed: string;
    }> = [];
    
    this.cache.forEach((item, key) => {
      items.push({
        key,
        value: item.data,
        timestamp: item.timestamp,
        expiresAt: item.expiresAt,
        size: this.formatSize(item.size || 0),
        expiresIn: Math.max(0, item.expiresAt - Date.now()),
        accessCount: item.accessCount,
        lastAccessed: new Date(item.lastAccessed).toISOString()
      });
    });
    
    return {
      stats: this.getStats(),
      items: items.sort((a, b) => b.accessCount - a.accessCount)
    };
  }

  // Preload commonly accessed data
  preloadCommonData(): void {
    // Preload data that's commonly accessed
    const commonKeys = [
      'vueni_user_preferences',
      'vueni_category_mappings',
      'vueni_feature_flags'
    ];

    commonKeys.forEach(key => {
      // Check if data exists in localStorage and cache it
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          this.set(key, parsedData, 60 * 60 * 1000); // 1 hour
        } catch (error) {
          console.warn(`[Vueni Cache] Failed to preload ${key}:`, error);
        }
      }
    });
  }
}

// Create global Vueni cache instance
export const vueniCache = new VueniCacheManager({
  maxSize: 100 * 1024 * 1024, // 100MB for Vueni
  maxAge: 30 * 60 * 1000, // 30 minutes default
  maxItems: 500,
  enableCompression: true,
  enableMetrics: import.meta.env.DEV // Enable metrics in development
});

// Initialize cache
if (typeof window !== 'undefined') {
  // Preload common data after a short delay
  setTimeout(() => {
    vueniCache.preloadCommonData();
  }, 1000);

  // Log cache stats periodically in development
  if (import.meta.env.DEV) {
    setInterval(() => {
      const stats = vueniCache.getStats();
      // Cache stats output for debugging
    }, 60000); // Every minute
  }
}

export default VueniCacheManager;