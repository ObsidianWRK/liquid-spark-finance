/**
 * Secure Storage Utility for Vueni
 * Provides encrypted localStorage with error handling and fallbacks
 */

interface StorageOptions<T = unknown> {
  encrypt?: boolean;
  expiry?: number; // Time in milliseconds
  fallback?: T;
}

class SecureStorage {
  private static readonly PREFIX = 'vueni_';
  private static readonly ENCRYPTION_KEY = 'vueni_secure_key';

  /**
   * Simple encryption/decryption (for sensitive data, use a proper crypto library)
   */
  private static encrypt(data: string): string {
    try {
      // Basic encryption - in production, use proper crypto
      return btoa(encodeURIComponent(data));
    } catch {
      return data;
    }
  }

  private static decrypt(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return data;
    }
  }

  /**
   * Set item in storage with optional encryption and expiry
   */
  static setItem<T>(key: string, value: T, options: StorageOptions<T> = {}): boolean {
    try {
      const { encrypt = false, expiry } = options;
      const storageKey = this.PREFIX + key;
      
      const data = {
        value,
        timestamp: Date.now(),
        expiry: expiry ? Date.now() + expiry : null,
      };

      const serialized = JSON.stringify(data);
      const finalValue = encrypt ? this.encrypt(serialized) : serialized;
      
      localStorage.setItem(storageKey, finalValue);
      return true;
    } catch (error) {
      console.warn(`Failed to save to storage: ${key}`, error);
      return false;
    }
  }

  /**
   * Get item from storage with automatic expiry checking
   */
  static getItem<T>(key: string, options: StorageOptions<T> = {}): T | null {
    try {
      const { encrypt = false, fallback = null } = options;
      const storageKey = this.PREFIX + key;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return fallback as T | null;

      const decrypted = encrypt ? this.decrypt(stored) : stored;
      const data = JSON.parse(decrypted);

      // Check expiry
      if (data.expiry && Date.now() > data.expiry) {
        this.removeItem(key);
        return fallback as T | null;
      }

      return data.value;
    } catch (error) {
      console.warn(`Failed to retrieve from storage: ${key}`, error);
      return (options.fallback ?? null) as T | null;
    }
  }

  /**
   * Remove item from storage
   */
  static removeItem(key: string): boolean {
    try {
      const storageKey = this.PREFIX + key;
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.warn(`Failed to remove from storage: ${key}`, error);
      return false;
    }
  }

  /**
   * Clear all Vueni data from storage
   */
  static clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.PREFIX)
      );
      
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.warn('Failed to clear storage', error);
      return false;
    }
  }

  /**
   * Check if storage is available
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__vueni_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: number } {
    try {
      const used = JSON.stringify(localStorage).length;
      // Most browsers have ~5-10MB limit for localStorage
      const available = 5 * 1024 * 1024 - used; // Assume 5MB limit
      
      return { used, available };
    } catch {
      return { used: 0, available: 0 };
    }
  }
}

export default SecureStorage; 