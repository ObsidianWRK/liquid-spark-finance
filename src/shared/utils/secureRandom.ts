/**
 * Secure Random Generation Utilities
 * Provides cryptographically secure random generation with fallbacks
 */

export class SecureRandom {
  /**
   * Generates cryptographically secure random bytes
   */
  static getRandomBytes(length: number): Uint8Array {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return array;
    } else {
      console.warn('SECURITY WARNING: crypto.getRandomValues not available, using fallback');
      // Less secure fallback
      const array = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }
  }

  /**
   * Generates a secure random hex string
   */
  static getRandomHex(length: number): string {
    const bytes = this.getRandomBytes(length);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generates a secure random alphanumeric string
   */
  static getRandomAlphaNumeric(length: number): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const bytes = this.getRandomBytes(length);
    return Array.from(bytes, byte => chars[byte % chars.length]).join('');
  }

  /**
   * Generates a secure session ID
   */
  static generateSessionId(prefix: string = 'sess'): string {
    const timestamp = Date.now().toString(36);
    const randomPart = this.getRandomHex(16);
    return `${prefix}_${timestamp}_${randomPart}`;
  }

  /**
   * Generates a secure CSRF token
   */
  static generateCSRFToken(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = this.getRandomHex(32);
    return `${randomPart}${timestamp}`;
  }

  /**
   * Generates a secure API key or token
   */
  static generateSecureToken(length: number = 32): string {
    return this.getRandomHex(length);
  }

  /**
   * Generates a secure ID for events/alerts
   */
  static generateSecureId(prefix: string): string {
    const timestamp = Date.now();
    const randomPart = this.getRandomHex(8);
    return `${prefix}_${timestamp}_${randomPart}`;
  }

  /**
   * Checks if secure random generation is available
   */
  static isSecureRandomAvailable(): boolean {
    return typeof crypto !== 'undefined' && !!crypto.getRandomValues;
  }
}

// Export individual functions for convenience
export const generateSecureSessionId = (prefix?: string) => SecureRandom.generateSessionId(prefix);
export const generateSecureCSRFToken = () => SecureRandom.generateCSRFToken();
export const generateSecureToken = (length?: number) => SecureRandom.generateSecureToken(length);
export const generateSecureId = (prefix: string) => SecureRandom.generateSecureId(prefix);
export const isSecureRandomAvailable = () => SecureRandom.isSecureRandomAvailable();