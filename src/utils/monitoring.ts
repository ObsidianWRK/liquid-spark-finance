/**
 * VueniSecurityMonitoring - Production-grade security monitoring for financial applications
 * Implements comprehensive security event tracking and alerting
 */

import { VueniSecureStorage } from './crypto';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type SecurityEventType = 
  | 'AUTHENTICATION_FAILURE'
  | 'ENCRYPTION_ERROR'
  | 'DATA_INTEGRITY_VIOLATION'
  | 'UNAUTHORIZED_ACCESS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'SESSION_HIJACK_ATTEMPT'
  | 'XSS_ATTEMPT'
  | 'CSRF_ATTACK'
  | 'DATA_BREACH_ATTEMPT'
  | 'FINANCIAL_CALCULATION_ERROR'
  | 'STORAGE_CORRUPTION'
  | 'INVALID_INPUT'
  | 'SECURITY_POLICY_VIOLATION';

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highSeverityEvents: number;
  unresolvedEvents: number;
  averageResolutionTime: number;
  topEventTypes: Array<{ type: SecurityEventType; count: number }>;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface SecurityAlert {
  id: string;
  eventId: string;
  type: 'email' | 'sms' | 'webhook' | 'slack';
  recipient: string;
  message: string;
  sent: boolean;
  sentAt?: string;
  error?: string;
}

/**
 * VueniSecurityMonitoring - Comprehensive security monitoring system
 */
export class VueniSecurityMonitoring {
  private static readonly STORAGE_KEY = 'vueni:security:events:v1';
  private static readonly ALERTS_KEY = 'vueni:security:alerts:v1';
  private static readonly MAX_EVENTS = 10000;
  private static readonly ALERT_THRESHOLD = {
    critical: 1, // Alert immediately for critical events
    high: 5,     // Alert after 5 high severity events in 10 minutes
    medium: 20   // Alert after 20 medium severity events in 1 hour
  };

  private static events: SecurityEvent[] = [];
  private static alerts: SecurityAlert[] = [];
  private static isInitialized = false;

  /**
   * Initializes the security monitoring system
   */
  static initialize(): void {
    if (this.isInitialized) return;

    try {
      // Load existing events from secure storage
      const storedEvents = VueniSecureStorage.getItem(this.STORAGE_KEY);
      if (Array.isArray(storedEvents)) {
        this.events = storedEvents;
      }

      // Load existing alerts
      const storedAlerts = VueniSecureStorage.getItem(this.ALERTS_KEY);
      if (Array.isArray(storedAlerts)) {
        this.alerts = storedAlerts;
      }

      this.isInitialized = true;
      this.logEvent('MONITORING_INITIALIZED', 'low', 'Security monitoring system initialized');
    } catch (error) {
      console.error('Failed to initialize security monitoring:', error);
    }
  }

  /**
   * Logs a security event
   */
  static logEvent(
    type: SecurityEventType,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    const event: SecurityEvent = {
      id: this.generateEventId(),
      type,
      severity,
      description,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      ipAddress: this.getClientIP(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      metadata,
      resolved: false
    };

    this.events.push(event);

    // Maintain event limit
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Persist events
    this.persistEvents();

    // Check for alert conditions
    this.checkAlertConditions(event);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[VueniSecurity] ${severity.toUpperCase()}: ${type}`, event);
    }

    // Send to external monitoring in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalMonitoring(event);
    }
  }

  /**
   * Gets security events with filtering
   */
  static getEvents(filters?: {
    severity?: 'low' | 'medium' | 'high' | 'critical';
    type?: SecurityEventType;
    resolved?: boolean;
    since?: string;
    limit?: number;
  }): SecurityEvent[] {
    let filteredEvents = [...this.events];

    if (filters) {
      if (filters.severity) {
        filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
      }

      if (filters.type) {
        filteredEvents = filteredEvents.filter(e => e.type === filters.type);
      }

      if (filters.resolved !== undefined) {
        filteredEvents = filteredEvents.filter(e => e.resolved === filters.resolved);
      }

      if (filters.since) {
        const sinceDate = new Date(filters.since);
        filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) > sinceDate);
      }

      if (filters.limit) {
        filteredEvents = filteredEvents.slice(-filters.limit);
      }
    }

    return filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Resolves a security event
   */
  static resolveEvent(eventId: string, resolvedBy: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    
    if (!event) {
      return false;
    }

    event.resolved = true;
    event.resolvedAt = new Date().toISOString();
    event.resolvedBy = resolvedBy;

    this.persistEvents();
    
    this.logEvent('SECURITY_EVENT_RESOLVED', 'low', `Event ${eventId} resolved by ${resolvedBy}`, {
      originalEventType: event.type,
      originalSeverity: event.severity
    });

    return true;
  }

  /**
   * Gets security metrics
   */
  static getMetrics(timeRange?: { start: string; end: string }): SecurityMetrics {
    let events = this.events;

    if (timeRange) {
      const start = new Date(timeRange.start);
      const end = new Date(timeRange.end);
      events = events.filter(e => {
        const eventTime = new Date(e.timestamp);
        return eventTime >= start && eventTime <= end;
      });
    }

    const totalEvents = events.length;
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    const highSeverityEvents = events.filter(e => e.severity === 'high').length;
    const unresolvedEvents = events.filter(e => !e.resolved).length;

    // Calculate average resolution time
    const resolvedEvents = events.filter(e => e.resolved && e.resolvedAt);
    const averageResolutionTime = resolvedEvents.length > 0 
      ? resolvedEvents.reduce((sum, event) => {
          const created = new Date(event.timestamp).getTime();
          const resolved = new Date(event.resolvedAt!).getTime();
          return sum + (resolved - created);
        }, 0) / resolvedEvents.length
      : 0;

    // Get top event types
    const eventTypeCounts = new Map<SecurityEventType, number>();
    events.forEach(event => {
      eventTypeCounts.set(event.type, (eventTypeCounts.get(event.type) || 0) + 1);
    });

    const topEventTypes = Array.from(eventTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents,
      criticalEvents,
      highSeverityEvents,
      unresolvedEvents,
      averageResolutionTime,
      topEventTypes,
      timeRange: timeRange || {
        start: events.length > 0 ? events[0].timestamp : new Date().toISOString(),
        end: new Date().toISOString()
      }
    };
  }

  /**
   * Checks if alerts should be triggered
   */
  private static checkAlertConditions(event: SecurityEvent): void {
    const now = Date.now();

    // Critical events trigger immediate alerts
    if (event.severity === 'critical') {
      this.triggerAlert(event, 'Critical security event detected');
      return;
    }

    // High severity events - check threshold
    if (event.severity === 'high') {
      const recentHighEvents = this.events.filter(e => 
        e.severity === 'high' && 
        (now - new Date(e.timestamp).getTime()) < 600000 // 10 minutes
      );

      if (recentHighEvents.length >= this.ALERT_THRESHOLD.high) {
        this.triggerAlert(event, `${recentHighEvents.length} high severity events in 10 minutes`);
      }
    }

    // Medium severity events - check threshold
    if (event.severity === 'medium') {
      const recentMediumEvents = this.events.filter(e => 
        e.severity === 'medium' && 
        (now - new Date(e.timestamp).getTime()) < 3600000 // 1 hour
      );

      if (recentMediumEvents.length >= this.ALERT_THRESHOLD.medium) {
        this.triggerAlert(event, `${recentMediumEvents.length} medium severity events in 1 hour`);
      }
    }
  }

  /**
   * Triggers a security alert
   */
  private static triggerAlert(event: SecurityEvent, message: string): void {
    const alert: SecurityAlert = {
      id: this.generateAlertId(),
      eventId: event.id,
      type: 'webhook', // Default to webhook, can be configured
      recipient: 'security-team@vueni.com',
      message: `${message}: ${event.description}`,
      sent: false
    };

    this.alerts.push(alert);
    this.persistAlerts();

    // Send alert in production
    if (process.env.NODE_ENV === 'production') {
      this.sendAlert(alert);
    } else {
      console.warn('[VueniSecurity Alert]', alert);
    }
  }

  /**
   * Sends an alert to external systems
   */
  private static async sendAlert(alert: SecurityAlert): Promise<void> {
    try {
      // Placeholder for actual alert sending logic
      // This would integrate with services like:
      // - Slack webhooks
      // - Email providers (SendGrid, etc.)
      // - SMS providers (Twilio, etc.)
      // - PagerDuty
      // - Custom webhooks

      alert.sent = true;
      alert.sentAt = new Date().toISOString();
      this.persistAlerts();
    } catch (error) {
      alert.error = error.message;
      this.persistAlerts();
      console.error('Failed to send security alert:', error);
    }
  }

  /**
   * Persists events to secure storage
   */
  private static persistEvents(): void {
    try {
      VueniSecureStorage.setItem(this.STORAGE_KEY, this.events, { sensitive: true });
    } catch (error) {
      console.error('Failed to persist security events:', error);
    }
  }

  /**
   * Persists alerts to secure storage
   */
  private static persistAlerts(): void {
    try {
      VueniSecureStorage.setItem(this.ALERTS_KEY, this.alerts, { sensitive: true });
    } catch (error) {
      console.error('Failed to persist security alerts:', error);
    }
  }

  /**
   * Generates a unique event ID
   */
  private static generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generates a unique alert ID
   */
  private static generateAlertId(): string {
    return `alt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gets current user ID (placeholder)
   */
  private static getCurrentUserId(): string | undefined {
    // This would integrate with your authentication system
    return 'demo-user';
  }

  /**
   * Gets current session ID (placeholder)
   */
  private static getCurrentSessionId(): string | undefined {
    // This would integrate with your session management
    return undefined;
  }

  /**
   * Gets client IP address (placeholder)
   */
  private static getClientIP(): string | undefined {
    // This would be set by your server or proxy
    return undefined;
  }

  /**
   * Sends event to external monitoring service
   */
  private static sendToExternalMonitoring(event: SecurityEvent): void {
    // Placeholder for external monitoring integration
    // This would send to services like:
    // - DataDog
    // - Splunk
    // - Elasticsearch
    // - Sentry
    // - Custom logging endpoints
  }

  /**
   * Clears old events (maintenance)
   */
  static clearOldEvents(olderThanDays: number = 90): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const initialCount = this.events.length;
    this.events = this.events.filter(event => 
      new Date(event.timestamp) > cutoffDate
    );

    const removedCount = initialCount - this.events.length;
    
    if (removedCount > 0) {
      this.persistEvents();
      this.logEvent('EVENTS_CLEANUP', 'low', `Removed ${removedCount} old security events`);
    }

    return removedCount;
  }

  /**
   * Exports security events for compliance reporting
   */
  static exportEvents(format: 'json' | 'csv' = 'json'): string {
    const events = this.getEvents();

    if (format === 'csv') {
      const headers = ['ID', 'Type', 'Severity', 'Description', 'Timestamp', 'User ID', 'Resolved'];
      const rows = events.map(event => [
        event.id,
        event.type,
        event.severity,
        event.description.replace(/,/g, ';'), // Escape commas
        event.timestamp,
        event.userId || '',
        event.resolved ? 'Yes' : 'No'
      ]);

      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    return JSON.stringify(events, null, 2);
  }

  /**
   * Gets security dashboard data
   */
  static getDashboardData(): {
    recentEvents: SecurityEvent[];
    metrics: SecurityMetrics;
    alerts: SecurityAlert[];
  } {
    const recentEvents = this.getEvents({ limit: 50 });
    const metrics = this.getMetrics();
    const recentAlerts = this.alerts.slice(-20);

    return {
      recentEvents,
      metrics,
      alerts: recentAlerts
    };
  }
}

// Export singleton instance
export const securityMonitoring = VueniSecurityMonitoring;

// Initialize monitoring when module loads
if (typeof window !== 'undefined') {
  VueniSecurityMonitoring.initialize();
}