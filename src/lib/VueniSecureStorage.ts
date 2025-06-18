import CryptoJS from 'crypto-js';
import { SecurityEnvValidator } from '../utils/envValidation';
import { generateSecureToken } from '../utils/secureRandom';

// Get validated encryption key from environment
const VUENI_STORAGE_KEY = SecurityEnvValidator.getValidatedEncryptionKey('VITE_VUENI_ENCRYPTION_KEY');

// Constants for session management
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

interface SessionItem {
  data: unknown;
  timestamp: number;
  encrypted: boolean;
}

export class VueniSecureStorage {
  private static sessionData = new Map<string, SessionItem>();

  private static encrypt<T>(data: T): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), VUENI_STORAGE_KEY).toString();
  }
  
  private static decrypt<T>(encryptedData: string): T {
    const bytes = CryptoJS.AES.decrypt(encryptedData, VUENI_STORAGE_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  private static validateFinancialDataKey(key: string): void {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid key provided for financial data');
    }
  }

  private static logAccess(action: string, key: string, metadata?: Record<string, unknown>): void {
    this.logVueniAccess(`${action}_FINANCIAL`, key);
  }

  private static logSecurityEvent(event: string, key: string, details?: string): void {
    if (import.meta.env.PROD) {
      fetch('/api/vueni/security-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          key,
          details,
          timestamp: new Date().toISOString(),
          sessionId: this.getSessionId()
        })
      }).catch(error => {
        console.error('Security event log failed:', error);
      });
    }
  }
  
  static setFinancialData<T>(key: string, value: T): void {
    this.logVueniAccess('SET_FINANCIAL', key);
    localStorage.setItem(`vueni_${key}`, this.encrypt(value));
  }
  
  static getFinancialData<T>(key: string): T | null {
    this.logVueniAccess('GET_FINANCIAL', key);
    const encrypted = localStorage.getItem(`vueni_${key}`);
    return encrypted ? this.decrypt(encrypted) : null;
  }
  
  static removeFinancialData(key: string): void {
    this.logVueniAccess('DELETE_FINANCIAL', key);
    localStorage.removeItem(`vueni_${key}`);
  }
  
  static clearAllFinancialData(): void {
    this.logVueniAccess('CLEAR_ALL', 'all_financial_data');
    const keys = Object.keys(localStorage).filter(key => key.startsWith('vueni_'));
    keys.forEach(key => localStorage.removeItem(key));
  }
  
  private static logVueniAccess(action: string, key: string): void {
    if (import.meta.env.PROD) {
      fetch('/api/vueni/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          key,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          sessionId: this.getSessionId()
        })
      }).catch(error => {
        console.error('Audit log failed:', error);
      });
    }
  }
  
  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('vueni_session_id');
    if (!sessionId) {
      sessionId = generateSecureToken(16); // 16 bytes = 32 hex characters
      sessionStorage.setItem('vueni_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Stores encrypted financial data with audit trail
   */
  static setItem<T>(key: string, value: T, options: { sensitive?: boolean; sessionOnly?: boolean } = {}): void {
    try {
      this.validateFinancialDataKey(key);
      
      if (options.sessionOnly) {
        // Store in memory session storage for highly sensitive data
        this.sessionData.set(key, {
          data: value,
          timestamp: Date.now(),
          encrypted: options.sensitive || false
        });
      } else {
        // Store encrypted in localStorage
        const encrypted = this.encrypt(value);
        localStorage.setItem(key, encrypted);
      }
      
      this.logAccess('SET', key, { sensitive: options.sensitive });
    } catch (error) {
      console.error('VueniSecureStorage setItem error:', error);
      this.logSecurityEvent('STORAGE_ERROR', key, (error as Error).message);
      throw error;
    }
  }

  /**
   * Retrieves and decrypts financial data
   */
  static getItem<T>(key: string): T | null {
    try {
      this.validateFinancialDataKey(key);

      // Check session storage first
      const sessionItem = this.sessionData.get(key);
      if (sessionItem) {
        // Check if session has expired
        if (Date.now() - sessionItem.timestamp > SESSION_TIMEOUT) {
          this.sessionData.delete(key);
          this.logSecurityEvent('SESSION_EXPIRED', key);
          return null;
        }
        this.logAccess('GET', key, { source: 'session' });
        return sessionItem.data as T;
      }

      // Fallback to localStorage
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      this.logAccess('GET', key, { source: 'localStorage' });
      return this.decrypt<T>(encrypted);
    } catch (error) {
      console.error('VueniSecureStorage getItem error:', error);
      this.logSecurityEvent('RETRIEVAL_ERROR', key, (error as Error).message);
      return null;
    }
  }
}