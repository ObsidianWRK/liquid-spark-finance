/**
 * VueniSessionManager - Secure session management for financial applications
 * Implements best practices for financial data security and user session handling
 */

import { VueniSecureStorage } from './crypto';
import { generateSecureToken } from './secureRandom';
import { VueniSecurityMonitor } from './security';

export interface VueniSession {
  id: string;
  userId?: string;
  startTime: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
  metadata: {
    userAgent: string;
    ipAddress?: string;
    loginMethod?: 'demo' | 'oauth' | 'email';
    securityLevel: 'basic' | 'enhanced' | 'maximum';
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    personalizedAds: boolean;
  };
}

/**
 * VueniSessionManager - Manages user sessions with financial-grade security
 */
export class VueniSessionManager {
  private static readonly SESSION_KEY = 'vueni:session:current';
  private static readonly PREFERENCES_KEY = 'vueni:user:preferences';
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Initializes the session manager
   */
  static initialize(): void {
    // Start cleanup interval for expired sessions
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, this.CLEANUP_INTERVAL);

    // Check if existing session is valid
    const session = this.getCurrentSession();
    if (session && !this.isSessionValid(session)) {
      this.endSession();
    }

    VueniSecurityMonitor.logEvent(
      'SESSION_MANAGER_INITIALIZED',
      'Session manager started'
    );
  }

  /**
   * Creates a new user session
   */
  static createSession(
    options: {
      userId?: string;
      loginMethod?: 'demo' | 'oauth' | 'email';
      securityLevel?: 'basic' | 'enhanced' | 'maximum';
    } = {}
  ): VueniSession {
    const sessionId = this.generateSessionId();
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + this.SESSION_TIMEOUT).toISOString();

    const session: VueniSession = {
      id: sessionId,
      userId: options.userId || 'demo-user',
      startTime: now,
      lastActivity: now,
      expiresAt: expires,
      isActive: true,
      metadata: {
        userAgent:
          typeof window !== 'undefined'
            ? window.navigator.userAgent
            : 'unknown',
        loginMethod: options.loginMethod || 'demo',
        securityLevel: options.securityLevel || 'basic',
      },
    };

    // Store session securely
    VueniSecureStorage.setItem(this.SESSION_KEY, session, {
      sensitive: true,
      sessionOnly: session.metadata.securityLevel === 'maximum',
    });

    VueniSecurityMonitor.logEvent(
      'SESSION_CREATED',
      `New session created for user ${session.userId}`,
      {
        sessionId: session.id,
        loginMethod: session.metadata.loginMethod,
        securityLevel: session.metadata.securityLevel,
      }
    );

    return session;
  }

  /**
   * Gets the current active session
   */
  static getCurrentSession(): VueniSession | null {
    try {
      const session = VueniSecureStorage.getItem(this.SESSION_KEY);

      if (!session) {
        return null;
      }

      // Validate session structure
      if (
        typeof session !== 'object' ||
        !session.id ||
        !session.startTime ||
        !session.expiresAt
      ) {
        VueniSecurityMonitor.logEvent(
          'SESSION_INVALID_STRUCTURE',
          'Invalid session structure detected'
        );
        this.endSession();
        return null;
      }

      return session as VueniSession;
    } catch (error) {
      VueniSecurityMonitor.logEvent(
        'SESSION_RETRIEVAL_ERROR',
        'Error retrieving current session',
        { error: error.message }
      );
      return null;
    }
  }

  /**
   * Updates the session activity timestamp
   */
  static updateActivity(): boolean {
    const session = this.getCurrentSession();

    if (!session || !this.isSessionValid(session)) {
      return false;
    }

    const now = new Date().toISOString();
    const updatedSession: VueniSession = {
      ...session,
      lastActivity: now,
      expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT).toISOString(),
    };

    VueniSecureStorage.setItem(this.SESSION_KEY, updatedSession, {
      sensitive: true,
      sessionOnly: session.metadata.securityLevel === 'maximum',
    });

    return true;
  }

  /**
   * Checks if a session is valid and not expired
   */
  static isSessionValid(session: VueniSession): boolean {
    if (!session || !session.isActive) {
      return false;
    }

    const now = Date.now();
    const expiresAt = new Date(session.expiresAt).getTime();

    if (now > expiresAt) {
      VueniSecurityMonitor.logEvent(
        'SESSION_EXPIRED',
        `Session ${session.id} has expired`
      );
      return false;
    }

    return true;
  }

  /**
   * Checks if user is authenticated
   */
  static isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return session !== null && this.isSessionValid(session);
  }

  /**
   * Ends the current session
   */
  static endSession(): void {
    const session = this.getCurrentSession();

    if (session) {
      VueniSecurityMonitor.logEvent(
        'SESSION_ENDED',
        `Session ${session.id} ended by user`
      );
    }

    VueniSecureStorage.removeItem(this.SESSION_KEY);

    // Clear any session-only data
    VueniSecureStorage.cleanupExpiredSessions();
  }

  /**
   * Gets user preferences
   */
  static getUserPreferences(): UserPreferences {
    try {
      const preferences = VueniSecureStorage.getItem(this.PREFERENCES_KEY);

      if (preferences) {
        return preferences as UserPreferences;
      }

      // Return default preferences
      return this.getDefaultPreferences();
    } catch (error) {
      VueniSecurityMonitor.logEvent(
        'PREFERENCES_RETRIEVAL_ERROR',
        'Error retrieving user preferences',
        { error: error.message }
      );
      return this.getDefaultPreferences();
    }
  }

  /**
   * Updates user preferences
   */
  static updateUserPreferences(updates: Partial<UserPreferences>): void {
    if (!this.isAuthenticated()) {
      throw new Error('User must be authenticated to update preferences');
    }

    try {
      const currentPreferences = this.getUserPreferences();
      const updatedPreferences = { ...currentPreferences, ...updates };

      VueniSecureStorage.setItem(this.PREFERENCES_KEY, updatedPreferences);

      VueniSecurityMonitor.logEvent(
        'PREFERENCES_UPDATED',
        'User preferences updated'
      );
    } catch (error) {
      VueniSecurityMonitor.logEvent(
        'PREFERENCES_UPDATE_ERROR',
        'Error updating user preferences',
        { error: error.message }
      );
      throw error;
    }
  }

  /**
   * Gets session information for display
   */
  static getSessionInfo(): {
    isActive: boolean;
    startTime?: string;
    lastActivity?: string;
    timeRemaining?: number;
    securityLevel?: string;
  } {
    const session = this.getCurrentSession();

    if (!session || !this.isSessionValid(session)) {
      return { isActive: false };
    }

    const expiresAt = new Date(session.expiresAt).getTime();
    const timeRemaining = Math.max(0, expiresAt - Date.now());

    return {
      isActive: true,
      startTime: session.startTime,
      lastActivity: session.lastActivity,
      timeRemaining,
      securityLevel: session.metadata.securityLevel,
    };
  }

  /**
   * Extends the current session
   */
  static extendSession(minutes: number = 30): boolean {
    const session = this.getCurrentSession();

    if (!session || !this.isSessionValid(session)) {
      return false;
    }

    const newExpiry = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    const updatedSession: VueniSession = {
      ...session,
      expiresAt: newExpiry,
      lastActivity: new Date().toISOString(),
    };

    VueniSecureStorage.setItem(this.SESSION_KEY, updatedSession, {
      sensitive: true,
      sessionOnly: session.metadata.securityLevel === 'maximum',
    });

    VueniSecurityMonitor.logEvent(
      'SESSION_EXTENDED',
      `Session ${session.id} extended by ${minutes} minutes`
    );

    return true;
  }

  /**
   * Generates a cryptographically secure session ID
   */
  private static generateSessionId(): string {
    return generateSecureToken(32);
  }

  /**
   * Cleans up expired sessions
   */
  private static cleanupExpiredSessions(): void {
    try {
      VueniSecureStorage.cleanupExpiredSessions();

      const session = this.getCurrentSession();
      if (session && !this.isSessionValid(session)) {
        this.endSession();
      }
    } catch (error) {
      VueniSecurityMonitor.logEvent(
        'CLEANUP_ERROR',
        'Error during session cleanup',
        { error: error.message }
      );
    }
  }

  /**
   * Gets default user preferences
   */
  private static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      currency: 'USD',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      privacy: {
        shareUsageData: false,
        personalizedAds: false,
      },
    };
  }

  /**
   * Destroys the session manager (cleanup)
   */
  static destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    VueniSecurityMonitor.logEvent(
      'SESSION_MANAGER_DESTROYED',
      'Session manager destroyed'
    );
  }
}

/**
 * Session hook for React components
 */
export function useVueniSession() {
  const session = VueniSessionManager.getCurrentSession();
  const isAuthenticated = VueniSessionManager.isAuthenticated();
  const sessionInfo = VueniSessionManager.getSessionInfo();
  const preferences = VueniSessionManager.getUserPreferences();

  return {
    session,
    isAuthenticated,
    sessionInfo,
    preferences,
    updateActivity: () => VueniSessionManager.updateActivity(),
    updatePreferences: (updates: Partial<UserPreferences>) =>
      VueniSessionManager.updateUserPreferences(updates),
    extendSession: (minutes?: number) =>
      VueniSessionManager.extendSession(minutes),
    endSession: () => VueniSessionManager.endSession(),
  };
}

// Initialize session manager when module loads
if (typeof window !== 'undefined') {
  VueniSessionManager.initialize();
}
