import { securityConfig } from '@/shared/config/security';
import { secureStorage } from './crypto';
import { VueniSecurityMonitor } from './security';

interface SessionData {
  userId?: string;
  startTime: number;
  lastActivity: number;
  expiresAt: number;
}

export class SessionManager {
  private static readonly SESSION_KEY = 'user-session';
  private static timeoutId: NodeJS.Timeout | null = null;
  private static warningId: NodeJS.Timeout | null = null;

  /**
   * Initialize a new session
   */
  static initSession(userId?: string): void {
    const now = Date.now();
    const sessionData: SessionData = {
      userId,
      startTime: now,
      lastActivity: now,
      expiresAt: now + securityConfig.session.timeout,
    };

    secureStorage.setItem(this.SESSION_KEY, sessionData);
    this.setupSessionTimers();
  }

  /**
   * Get current session data
   */
  static getSession(): SessionData | null {
    const sessionData = secureStorage.getItem(this.SESSION_KEY);
    
    if (!sessionData) return null;
    
    // Check if session has expired
    if (Date.now() > sessionData.expiresAt) {
      this.endSession();
      return null;
    }
    
    return sessionData;
  }

  /**
   * Update last activity time
   */
  static updateActivity(): void {
    const session = this.getSession();
    if (!session) return;

    const now = Date.now();
    
    if (securityConfig.session.extendOnActivity) {
      session.expiresAt = now + securityConfig.session.timeout;
    }
    
    session.lastActivity = now;
    secureStorage.setItem(this.SESSION_KEY, session);
    
    // Reset timers
    this.setupSessionTimers();
  }

  /**
   * End the current session
   */
  static endSession(): void {
    secureStorage.removeItem(this.SESSION_KEY);
    this.clearTimers();
    
    // Redirect to login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Setup session timeout timers
   */
  private static setupSessionTimers(): void {
    this.clearTimers();
    
    const session = this.getSession();
    if (!session) return;

    const now = Date.now();
    const timeUntilExpiry = session.expiresAt - now;
    const timeUntilWarning = timeUntilExpiry - securityConfig.session.warningTime;

    // Set warning timer
    if (timeUntilWarning > 0) {
      this.warningId = setTimeout(() => {
        this.showSessionWarning();
      }, timeUntilWarning);
    }

    // Set expiry timer
    if (timeUntilExpiry > 0) {
      this.timeoutId = setTimeout(() => {
        this.endSession();
      }, timeUntilExpiry);
    }
  }

  /**
   * Clear all timers
   */
  private static clearTimers(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningId) {
      clearTimeout(this.warningId);
      this.warningId = null;
    }
  }

  /**
   * Show session expiry warning
   */
  private static showSessionWarning(): void {
    // In a real app, this would show a modal or notification
    console.warn('Your session will expire in 5 minutes. Please save your work.');
    
    // Dispatch custom event for UI components to handle
    window.dispatchEvent(new CustomEvent('sessionWarning', {
      detail: {
        expiresIn: securityConfig.session.warningTime,
      },
    }));
  }

  /**
   * Check if session is valid
   */
  static isSessionValid(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Get time until session expires
   */
  static getTimeUntilExpiry(): number {
    const session = this.getSession();
    if (!session) return 0;
    
    const remaining = session.expiresAt - Date.now();
    return Math.max(0, remaining);
  }
} 