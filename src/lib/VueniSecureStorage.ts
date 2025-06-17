import CryptoJS from 'crypto-js';

const VUENI_STORAGE_KEY = import.meta.env.VITE_VUENI_ENCRYPTION_KEY || 'vueni-secure-key-2024';

export class VueniSecureStorage {
  private static encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), VUENI_STORAGE_KEY).toString();
  }
  
  private static decrypt(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, VUENI_STORAGE_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  
  static setFinancialData(key: string, value: any): void {
    this.logVueniAccess('SET_FINANCIAL', key);
    localStorage.setItem(`vueni_${key}`, this.encrypt(value));
  }
  
  static getFinancialData(key: string): any {
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
      sessionId = CryptoJS.lib.WordArray.random(128/8).toString();
      sessionStorage.setItem('vueni_session_id', sessionId);
    }
    return sessionId;
  }
}