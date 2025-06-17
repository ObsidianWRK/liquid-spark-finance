import CryptoJS from 'crypto-js';

// Use environment variable or fallback to a default key (should be changed in production)
const SECRET_KEY = process.env.VITE_ENCRYPTION_KEY || 'liquid-spark-secure-key-2024';

export class SecureStorage {
  private static encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  private static decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  static setItem(key: string, value: any): void {
    try {
      const encrypted = this.encrypt(value);
      localStorage.setItem(key, encrypted);
      this.logAccess('SET', key);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      throw error;
    }
  }

  static getItem(key: string): any {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      this.logAccess('GET', key);
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
    this.logAccess('REMOVE', key);
  }

  static clear(): void {
    localStorage.clear();
    this.logAccess('CLEAR', 'all');
  }

  // Audit logging for compliance
  private static logAccess(action: string, key: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SecureStorage] ${action}: ${key} at ${new Date().toISOString()}`);
    }
    // In production, this would send to a proper audit log service
  }
}

// Helper functions for backward compatibility
export const secureStorage = {
  setItem: (key: string, value: any) => SecureStorage.setItem(key, value),
  getItem: (key: string) => SecureStorage.getItem(key),
  removeItem: (key: string) => SecureStorage.removeItem(key),
  clear: () => SecureStorage.clear()
}; 