/**
 * VueniSecurity - Input sanitization and XSS protection for financial data
 * Implements security measures for financial compliance
 */

// Simple HTML entity encoding for XSS protection
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

/**
 * VueniInputSanitizer - Sanitizes user input for financial applications
 */
export class VueniInputSanitizer {
  /**
   * Sanitizes text input to prevent XSS attacks
   */
  static sanitizeText(input: string): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    return input.replace(/[&<>"'`='/]/g, (match) => HTML_ENTITIES[match] || match);
  }

  /**
   * Sanitizes financial amounts (numbers only with decimal points)
   */
  static sanitizeFinancialAmount(input: string | number): number {
    if (typeof input === 'number') {
      if (!Number.isFinite(input)) {
        throw new Error('Invalid financial amount: not a finite number');
      }
      return Math.round(input * 100) / 100; // Round to 2 decimal places
    }

    if (typeof input !== 'string') {
      throw new Error('Financial amount must be a string or number');
    }

    // Remove all non-numeric characters except decimal point and minus sign
    const sanitized = input.replace(/[^0-9.-]/g, '');
    
    // Validate format
    if (!/^-?\d*\.?\d*$/.test(sanitized)) {
      throw new Error('Invalid financial amount format');
    }

    const amount = parseFloat(sanitized);
    
    if (!Number.isFinite(amount)) {
      throw new Error('Invalid financial amount: not a finite number');
    }

    // Prevent extremely large amounts (over $1 trillion)
    if (Math.abs(amount) > 1000000000000) {
      throw new Error('Financial amount exceeds maximum allowed value');
    }

    return Math.round(amount * 100) / 100;
  }

  /**
   * Sanitizes transaction descriptions with length limits
   */
  static sanitizeTransactionDescription(input: string): string {
    if (typeof input !== 'string') {
      throw new Error('Transaction description must be a string');
    }

    // Limit length to prevent storage issues
    if (input.length > 500) {
      throw new Error('Transaction description too long (max 500 characters)');
    }

    // Sanitize HTML and trim whitespace
    return this.sanitizeText(input.trim());
  }

  /**
   * Sanitizes percentage values for financial calculations
   */
  static sanitizePercentage(input: string | number): number {
    const amount = this.sanitizeFinancialAmount(input);
    
    // Reasonable percentage limits
    if (amount < 0 || amount > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }

    return amount;
  }

  /**
   * Sanitizes interest rates (can be higher than 100%)
   */
  static sanitizeInterestRate(input: string | number): number {
    const rate = this.sanitizeFinancialAmount(input);
    
    // Reasonable interest rate limits (0% to 1000%)
    if (rate < 0 || rate > 1000) {
      throw new Error('Interest rate must be between 0% and 1000%');
    }

    return rate;
  }

  /**
   * Sanitizes year values for financial calculations
   */
  static sanitizeYear(input: string | number): number {
    const year = typeof input === 'string' ? parseInt(input, 10) : input;
    
    if (!Number.isInteger(year)) {
      throw new Error('Year must be an integer');
    }

    const currentYear = new Date().getFullYear();
    
    // Reasonable year range (1900 to 100 years in the future)
    if (year < 1900 || year > currentYear + 100) {
      throw new Error(`Year must be between 1900 and ${currentYear + 100}`);
    }

    return year;
  }

  /**
   * Sanitizes time periods (in years) for financial calculations
   */
  static sanitizeTimePeriod(input: string | number): number {
    const period = this.sanitizeFinancialAmount(input);
    
    // Reasonable time period limits (0.1 to 100 years)
    if (period < 0.1 || period > 100) {
      throw new Error('Time period must be between 0.1 and 100 years');
    }

    return period;
  }

  /**
   * Validates and sanitizes email addresses
   */
  static sanitizeEmail(input: string): string {
    if (typeof input !== 'string') {
      throw new Error('Email must be a string');
    }

    const sanitized = input.trim().toLowerCase();
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }

    if (sanitized.length > 254) {
      throw new Error('Email address too long');
    }

    return this.sanitizeText(sanitized);
  }

  /**
   * Sanitizes phone numbers (US format)
   */
  static sanitizePhoneNumber(input: string): string {
    if (typeof input !== 'string') {
      throw new Error('Phone number must be a string');
    }

    // Remove all non-numeric characters
    const digits = input.replace(/\D/g, '');
    
    // Validate US phone number format (10 or 11 digits)
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else {
      throw new Error('Invalid phone number format');
    }
  }
}

/**
 * VueniCSRFProtection - CSRF token management for financial operations
 */
export class VueniCSRFProtection {
  private static tokenKey = 'vueni:csrf:token';
  private static tokenExpiry = 'vueni:csrf:expiry';

  /**
   * Generates a new CSRF token
   */
  static generateToken(): string {
    const token = crypto.getRandomValues(new Uint8Array(32));
    const tokenString = Array.from(token, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Store token and expiry (1 hour)
    const expiry = Date.now() + (60 * 60 * 1000);
    sessionStorage.setItem(this.tokenKey, tokenString);
    sessionStorage.setItem(this.tokenExpiry, expiry.toString());
    
    return tokenString;
  }

  /**
   * Validates a CSRF token
   */
  static validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem(this.tokenKey);
    const expiry = sessionStorage.getItem(this.tokenExpiry);
    
    if (!storedToken || !expiry) {
      return false;
    }

    // Check if token has expired
    if (Date.now() > parseInt(expiry, 10)) {
      this.clearToken();
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    return this.constantTimeCompare(token, storedToken);
  }

  /**
   * Clears the current CSRF token
   */
  static clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenExpiry);
  }

  /**
   * Gets the current CSRF token or generates a new one
   */
  static getToken(): string {
    const storedToken = sessionStorage.getItem(this.tokenKey);
    const expiry = sessionStorage.getItem(this.tokenExpiry);
    
    if (storedToken && expiry && Date.now() < parseInt(expiry, 10)) {
      return storedToken;
    }

    return this.generateToken();
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  private static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}

/**
 * VueniRateLimit - Simple rate limiting for financial calculators
 */
export class VueniRateLimit {
  private static limits = new Map<string, { count: number; resetTime: number }>();
  private static readonly MAX_REQUESTS = 100; // Max requests per hour
  private static readonly WINDOW_MS = 60 * 60 * 1000; // 1 hour

  /**
   * Checks if an operation is rate limited
   */
  static isRateLimited(operation: string): boolean {
    const key = `vueni:rate:${operation}`;
    const now = Date.now();
    const limit = this.limits.get(key);

    if (!limit || now > limit.resetTime) {
      // Reset or initialize limit
      this.limits.set(key, { count: 1, resetTime: now + this.WINDOW_MS });
      return false;
    }

    if (limit.count >= this.MAX_REQUESTS) {
      return true;
    }

    limit.count++;
    return false;
  }

  /**
   * Gets remaining requests for an operation
   */
  static getRemainingRequests(operation: string): number {
    const key = `vueni:rate:${operation}`;
    const limit = this.limits.get(key);
    
    if (!limit || Date.now() > limit.resetTime) {
      return this.MAX_REQUESTS;
    }

    return Math.max(0, this.MAX_REQUESTS - limit.count);
  }

  /**
   * Clears rate limit for an operation (for testing)
   */
  static clearLimit(operation: string): void {
    const key = `vueni:rate:${operation}`;
    this.limits.delete(key);
  }
}

/**
 * VueniSecurityMonitor - Basic security event monitoring
 */
export class VueniSecurityMonitor {
  private static events: Array<{
    type: string;
    description: string;
    timestamp: string;
    userAgent?: string;
    ip?: string;
  }> = [];

  /**
   * Logs a security event
   */
  static logEvent(type: string, description: string, metadata?: any): void {
    const event = {
      type,
      description,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      ...metadata
    };

    this.events.push(event);

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn('[VueniSecurityMonitor]', event);
    }

    // In production, send to monitoring service
    if (import.meta.env.PROD) {
      this.sendToMonitoringService(event);
    }
  }

  /**
   * Gets recent security events
   */
  static getEvents(): typeof VueniSecurityMonitor.events {
    return [...this.events];
  }

  /**
   * Clears security events
   */
  static clearEvents(): void {
    this.events = [];
  }

  /**
   * Sends security events to monitoring service (production)
   */
  private static sendToMonitoringService(event: any): void {
    // Placeholder for production monitoring integration
    // This would send to services like DataDog, Sentry, etc.
  }
}

// Security utility functions
export const security = {
  sanitize: VueniInputSanitizer,
  csrf: VueniCSRFProtection,
  rateLimit: VueniRateLimit,
  monitor: VueniSecurityMonitor
};