import { VueniSecureStorage } from './VueniSecureStorage';
import {
  generateSecureSessionId,
  generateSecureCSRFToken,
} from '../utils/secureRandom';

export interface VueniSession {
  id: string;
  userId: string;
  email: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
}

export class VueniSessionManager {
  private static readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  private static readonly SESSION_KEY = 'current_session';
  private static readonly ACTIVITY_KEY = 'last_activity';

  static createSession(userId: string, email: string): VueniSession {
    const session: VueniSession = {
      id: this.generateSessionId(),
      userId,
      email,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true,
    };

    VueniSecureStorage.setFinancialData(this.SESSION_KEY, session);
    this.updateActivity();

    return session;
  }

  static getCurrentSession(): VueniSession | null {
    const session = VueniSecureStorage.getFinancialData(this.SESSION_KEY);
    if (!session) return null;

    if (this.isSessionExpired(session)) {
      this.destroySession();
      return null;
    }

    return session;
  }

  static updateActivity(): void {
    const session = this.getCurrentSession();
    if (session) {
      session.lastActivity = new Date().toISOString();
      VueniSecureStorage.setFinancialData(this.SESSION_KEY, session);
    }
    localStorage.setItem(this.ACTIVITY_KEY, new Date().toISOString());
  }

  static destroySession(): void {
    VueniSecureStorage.removeFinancialData(this.SESSION_KEY);
    localStorage.removeItem(this.ACTIVITY_KEY);

    // Clear all Vueni financial data on logout
    VueniSecureStorage.clearAllFinancialData();
  }

  static isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return session?.isActive === true;
  }

  private static isSessionExpired(session: VueniSession): boolean {
    const lastActivity = new Date(session.lastActivity).getTime();
    const now = new Date().getTime();
    return now - lastActivity > this.SESSION_DURATION;
  }

  private static generateSessionId(): string {
    return generateSecureSessionId('vueni');
  }

  // Auto-logout on inactivity
  static initInactivityMonitor(): void {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      this.updateActivity();

      inactivityTimer = setTimeout(() => {
        if (this.isAuthenticated()) {
          this.destroySession();
          window.location.href = '/login';
        }
      }, this.SESSION_DURATION);
    };

    // Monitor user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
    ];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    // Initial timer
    resetTimer();
  }

  // CSRF Protection with secure random generation
  static generateCSRFToken(): string {
    const token = generateSecureCSRFToken();
    sessionStorage.setItem('vueni_csrf_token', token);
    return token;
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('vueni_csrf_token');
    return storedToken === token;
  }
}
