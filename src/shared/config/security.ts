// Security configuration for Vueni

export const securityConfig = {
  // Content Security Policy - Production-ready with nonce support
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "https://cdn.jsdelivr.net", 
        "https://unpkg.com",
        // Production-ready script hashes (replace unsafe-inline)
        "'sha256-/wL1zGfTPhWOPi+qXi1XcgE5sZgIlPgEzR2+9nLjhY4='",
        "'sha256-+Lk5cCCOUJqP1v7+FjKhMTDxJ5VFoV1T4Q7YQzTw2Kc='"
      ],
      styleSrc: [
        "'self'", 
        "https://fonts.googleapis.com",
        // Production-ready style hashes (replace unsafe-inline)
        "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
        "'sha256-biLFinpqYMtWHmXfkA1BPeCY0/fNt46SAZ+BBk5YUog='"
      ],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: [
        "'self'", 
        "https://api.github.com", 
        "https://api.coingecko.com", 
        "https://httpbin.org"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: true
    },
  },
  
  // Session configuration
  session: {
    timeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes before timeout
    extendOnActivity: true,
  },
  
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  
  // Rate limiting
  rateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Audit logging
  audit: {
    enabled: true,
    logLevel: import.meta.env.PROD ? 'warn' : 'debug',
    sensitiveFields: ['password', 'ssn', 'creditCard', 'bankAccount'],
  },
}; 