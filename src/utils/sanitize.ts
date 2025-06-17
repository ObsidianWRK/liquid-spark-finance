// Input sanitization utility to prevent XSS attacks

export class InputSanitizer {
  // Basic HTML entities that need escaping
  private static htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  /**
   * Escape HTML entities to prevent XSS
   */
  static escapeHtml(input: string): string {
    return String(input).replace(/[&<>"'\/]/g, (match) => 
      this.htmlEntities[match] || match
    );
  }

  /**
   * Sanitize user input for display
   */
  static sanitizeText(input: string): string {
    if (!input) return '';
    
    // Remove any script tags
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove any event handlers
    sanitized = sanitized.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Escape HTML entities
    return this.escapeHtml(sanitized);
  }

  /**
   * Sanitize financial amounts
   */
  static sanitizeAmount(input: string | number): number {
    const amount = typeof input === 'string' ? parseFloat(input) : input;
    
    if (isNaN(amount) || !isFinite(amount)) {
      return 0;
    }
    
    // Limit to 2 decimal places for financial amounts
    return Math.round(amount * 100) / 100;
  }

  /**
   * Sanitize and validate email
   */
  static sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = email.trim().toLowerCase();
    
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Sanitize URL
   */
  static sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }
      return parsed.toString();
    } catch {
      return '';
    }
  }

  /**
   * Remove any potentially dangerous characters from filenames
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.{2,}/g, '_');
  }

  /**
   * Validate and sanitize transaction category
   */
  static sanitizeCategory(category: string): string {
    const validCategories = [
      'groceries', 'dining', 'transportation', 'entertainment',
      'shopping', 'utilities', 'healthcare', 'education',
      'savings', 'investments', 'other'
    ];
    
    const sanitized = category.toLowerCase().trim();
    return validCategories.includes(sanitized) ? sanitized : 'other';
  }
} 