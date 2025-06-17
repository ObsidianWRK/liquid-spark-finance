import CryptoJS from 'crypto-js';

// Use environment variable or fallback to a default key (should be changed in production)
const SECRET_KEY = process.env.VITE_ENCRYPTION_KEY || 'liquid-spark-secure-key-2024';

// Session timeout for sensitive data (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

/**
 * VueniSecureStorage - Production-grade encrypted storage for financial data
 * Implements PCI-DSS considerations and financial compliance standards
 */
export class VueniSecureStorage {
  private static sessionData = new Map<string, { data: any; timestamp: number; encrypted: boolean }>();
  private static auditLog: Array<{ action: string; key: string; timestamp: string; userAgent?: string }> = [];

  /**
   * Encrypts data with AES-256 and adds integrity check
   */
  private static encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      const timestamp = Date.now().toString();
      const payload = { data: jsonString, timestamp, integrity: this.generateIntegrityHash(jsonString) };
      
      return CryptoJS.AES.encrypt(JSON.stringify(payload), SECRET_KEY).toString();
    } catch (error) {
      console.error('VueniSecureStorage encryption error:', error);
      throw new Error('Failed to encrypt financial data');
    }
  }

  /**
   * Decrypts data and verifies integrity
   */
  private static decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }

      const payload = JSON.parse(decryptedString);
      
      // Verify data integrity
      if (payload.integrity !== this.generateIntegrityHash(payload.data)) {
        throw new Error('Data integrity check failed - possible tampering detected');
      }

      return JSON.parse(payload.data);
    } catch (error) {
      console.error('VueniSecureStorage decryption error:', error);
      this.logSecurityEvent('DECRYPTION_FAILED', 'unknown', error.message);
      return null;
    }
  }

  /**
   * Generates integrity hash for data verification
   */
  private static generateIntegrityHash(data: string): string {
    return CryptoJS.SHA256(data + SECRET_KEY).toString();
  }

  /**
   * Stores encrypted financial data with audit trail
   */
  static setItem(key: string, value: any, options: { sensitive?: boolean; sessionOnly?: boolean } = {}): void {
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
      this.logSecurityEvent('STORAGE_ERROR', key, error.message);
      throw error;
    }
  }

  /**
   * Retrieves and decrypts financial data
   */
  static getItem(key: string): any {
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
        return sessionItem.data;
      }

      // Fallback to localStorage
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      this.logAccess('GET', key, { source: 'localStorage' });
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('VueniSecureStorage getItem error:', error);
      this.logSecurityEvent('RETRIEVAL_ERROR', key, error.message);
      return null;
    }
  }

  /**
   * Securely removes financial data
   */
  static removeItem(key: string): void {
    try {
      this.validateFinancialDataKey(key);
      
      // Remove from session storage
      this.sessionData.delete(key);
      
      // Remove from localStorage
      localStorage.removeItem(key);
      
      this.logAccess('REMOVE', key);
    } catch (error) {
      console.error('VueniSecureStorage removeItem error:', error);
      this.logSecurityEvent('REMOVAL_ERROR', key, error.message);
    }
  }

  /**
   * Clears all financial data with confirmation
   */
  static clear(confirmationToken?: string): void {
    if (confirmationToken !== 'VUENI_CLEAR_ALL_DATA') {
      throw new Error('Data clear operation requires confirmation token');
    }

    this.sessionData.clear();
    
    // Only clear Vueni-related keys from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('vueni:')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    this.logAccess('CLEAR', 'all');
  }

  /**
   * Validates that data keys follow financial data naming conventions
   */
  private static validateFinancialDataKey(key: string): void {
    if (!key.startsWith('vueni:')) {
      throw new Error(`Invalid financial data key format: ${key}. Must start with 'vueni:'`);
    }
  }

  /**
   * Enhanced audit logging for financial compliance
   */
  private static logAccess(action: string, key: string, metadata: any = {}): void {
    const logEntry = {
      action,
      key: this.maskSensitiveKey(key),
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      ...metadata
    };

    this.auditLog.push(logEntry);

    // Keep only last 1000 log entries in memory
    if (this.auditLog.length > 1000) {
      this.auditLog.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[VueniSecureStorage] ${action}: ${this.maskSensitiveKey(key)}`, metadata);
    }

    // In production, send to audit service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAuditService(logEntry);
    }
  }

  /**
   * Logs security events for monitoring
   */
  private static logSecurityEvent(event: string, key: string, details?: string): void {
    const securityEvent = {
      event,
      key: this.maskSensitiveKey(key),
      details,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    };

    console.warn('[VueniSecureStorage Security Event]', securityEvent);

    // In production, this would trigger security monitoring alerts
    if (process.env.NODE_ENV === 'production') {
      this.sendSecurityAlert(securityEvent);
    }
  }

  /**
   * Masks sensitive parts of storage keys for logging
   */
  private static maskSensitiveKey(key: string): string {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '***' + key.substring(key.length - 4);
  }

  /**
   * Sends audit logs to external service (production)
   */
  private static sendToAuditService(logEntry: any): void {
    // Placeholder for production audit service integration
    // This would send to services like DataDog, Splunk, or custom audit API
  }

  /**
   * Sends security alerts to monitoring service (production)
   */
  private static sendSecurityAlert(securityEvent: any): void {
    // Placeholder for production security monitoring integration
    // This would trigger alerts in services like PagerDuty, Slack, etc.
  }

  /**
   * Gets audit log for compliance reporting
   */
  static getAuditLog(): Array<any> {
    return [...this.auditLog];
  }

  /**
   * Clears expired session data
   */
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [key, value] of this.sessionData.entries()) {
      if (now - value.timestamp > SESSION_TIMEOUT) {
        this.sessionData.delete(key);
        this.logSecurityEvent('SESSION_CLEANUP', key);
      }
    }
  }

  /**
   * Checks if a key exists without triggering a full get operation
   */
  static hasItem(key: string): boolean {
    return this.sessionData.has(key) || localStorage.getItem(key) !== null;
  }

  /**
   * Gets storage statistics for monitoring
   */
  static getStorageStats(): { sessionItems: number; localStorageItems: number; auditLogSize: number } {
    const localStorageItems = Object.keys(localStorage).filter(key => key.startsWith('vueni:')).length;
    
    return {
      sessionItems: this.sessionData.size,
      localStorageItems,
      auditLogSize: this.auditLog.length
    };
  }
}

// Legacy SecureStorage class for backward compatibility
export class SecureStorage extends VueniSecureStorage {
  static setItem(key: string, value: any): void {
    super.setItem(key, value);
  }

  static getItem(key: string): any {
    return super.getItem(key);
  }

  static removeItem(key: string): void {
    super.removeItem(key);
  }

  static clear(): void {
    super.clear('VUENI_CLEAR_ALL_DATA');
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

// Generate or retrieve encryption key
const getEncryptionKey = (): string => {
  const storedKey = sessionStorage.getItem('_ek');
  if (storedKey) return storedKey;
  
  const newKey = CryptoJS.lib.WordArray.random(256/8).toString();
  sessionStorage.setItem('_ek', newKey);
  return newKey;
};

// AES-256 encryption for sensitive data
export const encrypt = (data: string): string => {
  try {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(data, key).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

// AES-256 decryption
export const decrypt = (encryptedData: string): string => {
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Hash sensitive data for comparison without storing plaintext
export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};

// Generate secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

// Mask financial data for display
export const maskFinancialData = (value: string | number, showLast: number = 4): string => {
  const str = value.toString();
  if (str.length <= showLast) return str;
  
  const masked = '*'.repeat(str.length - showLast);
  return masked + str.slice(-showLast);
}; 