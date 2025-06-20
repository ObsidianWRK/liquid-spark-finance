/**
 * Environment Variable Security Validation
 * Ensures critical security environment variables are properly configured
 */

export class SecurityEnvValidator {
  private static readonly REQUIRED_ENV_VARS = [
    'VITE_VUENI_ENCRYPTION_KEY'
  ];

  private static readonly MIN_KEY_LENGTH = 32;

  /**
   * Validates all required security environment variables on app startup
   */
  static validateSecurityEnvironment(): void {
    const missingVars: string[] = [];
    const invalidVars: string[] = [];

    for (const envVar of this.REQUIRED_ENV_VARS) {
      const value = this.getEnvVar(envVar);
      
      if (!value) {
        missingVars.push(envVar);
      } else if (value.length < this.MIN_KEY_LENGTH) {
        invalidVars.push(`${envVar} (must be at least ${this.MIN_KEY_LENGTH} characters)`);
      }
    }

    if (missingVars.length > 0 || invalidVars.length > 0) {
      const errors: string[] = [];
      
      if (missingVars.length > 0) {
        errors.push(`Missing required environment variables: ${missingVars.join(', ')}`);
      }
      
      if (invalidVars.length > 0) {
        errors.push(`Invalid environment variables: ${invalidVars.join(', ')}`);
      }

      const errorMessage = [
        'SECURITY WARNING: Environment validation failed',
        ...errors,
        '',
        'To fix this:',
        '1. Create a .env file in your project root',
        '2. Add the required environment variables with secure values:',
        '   VITE_VUENI_ENCRYPTION_KEY=your-secure-32-character-or-longer-key-here',
        '3. Restart your development server',
        '',
        'For production, ensure these variables are set in your deployment environment.'
      ].join('\n');

      // In development, log warning instead of throwing
      if (!this.isProduction()) {
        console.warn('⚠️ [SECURITY WARNING] Development mode detected - continuing without proper environment variables');
        console.warn(errorMessage);
        return;
      }

      // In production, still throw the error
      throw new Error(errorMessage);
    }
  }

  /**
   * Gets and validates a specific encryption key
   */
  static getValidatedEncryptionKey(envVarName: string): string {
    const key = this.getEnvVar(envVarName);
    
    if (!key) {
      throw new Error(`CRITICAL SECURITY ERROR: ${envVarName} environment variable is required`);
    }
    
    if (key.length < this.MIN_KEY_LENGTH) {
      throw new Error(`CRITICAL SECURITY ERROR: ${envVarName} must be at least ${this.MIN_KEY_LENGTH} characters long`);
    }
    
    return key;
  }

  /**
   * Gets environment variable value (handles both Node.js and Vite environments)
   */
  private static getEnvVar(name: string): string | undefined {
    // Vite environment (browser/dev)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[name];
    }
    
    // Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      return process.env[name];
    }
    
    return undefined;
  }

  /**
   * Checks if we're in a production environment
   */
  static isProduction(): boolean {
    const nodeEnv = this.getEnvVar('NODE_ENV');
    const mode = this.getEnvVar('MODE');
    
    return nodeEnv === 'production' || mode === 'production';
  }

  /**
   * Logs security configuration status (without exposing sensitive values)
   */
  static logSecurityStatus(): void {
    const status = {
      environment: this.isProduction() ? 'production' : 'development',
      encryptionKeysConfigured: this.REQUIRED_ENV_VARS.every(envVar => !!this.getEnvVar(envVar)),
      timestamp: new Date().toISOString()
    };

    if (this.isProduction()) {
      console.log('[SECURITY] Environment validation passed for production');
    } else {
      console.log('[SECURITY] Environment validation status:', status);
    }
  }
}

// Auto-validate environment on module load in production
if (SecurityEnvValidator.isProduction()) {
  SecurityEnvValidator.validateSecurityEnvironment();
}