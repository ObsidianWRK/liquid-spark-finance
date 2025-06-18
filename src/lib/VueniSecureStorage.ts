import CryptoJS from 'crypto-js';
import { SecurityEnvValidator } from '../utils/envValidation';
import { generateSecureToken } from '../utils/secureRandom';

// Get validated encryption key from environment
const VUENI_STORAGE_KEY = SecurityEnvValidator.getValidatedEncryptionKey('VITE_VUENI_ENCRYPTION_KEY');

export class VueniSecureStorage {
  private static encrypt<T>(data: T): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), VUENI_STORAGE_KEY).toString();
  }
  
  private static decrypt<T>(encryptedData: string): T {
    const bytes = CryptoJS.AES.decrypt(encryptedData, VUENI_STORAGE_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
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
}