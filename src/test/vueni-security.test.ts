import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VueniSecureStorage } from '../lib/VueniSecureStorage';
import { VueniSessionManager } from '../lib/VueniSessionManager';

// Mock crypto-js for testing
vi.mock('crypto-js', () => ({
  AES: {
    encrypt: vi.fn((data: string) => ({ toString: () => `encrypted_${data}` })),
    decrypt: vi.fn((data: string) => ({ 
      toString: vi.fn(() => data.replace('encrypted_', ''))
    }))
  },
  enc: {
    Utf8: 'utf8'
  },
  lib: {
    WordArray: {
      random: vi.fn(() => ({ toString: () => 'random-session-id' }))
    }
  }
}));

// Mock environment
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_VUENI_ENCRYPTION_KEY: 'test-key',
    PROD: false
  },
  writable: true
});

describe('VueniSecureStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should encrypt data before storing', () => {
    const testData = { amount: 100, merchant: 'Test Store' };
    
    VueniSecureStorage.setFinancialData('test-key', testData);
    
    const storedValue = localStorage.getItem('vueni_test-key');
    expect(storedValue).toContain('encrypted_');
    expect(storedValue).not.toContain('Test Store');
    expect(storedValue).not.toContain('100');
  });

  it('should decrypt data when retrieving', () => {
    const testData = { amount: 100, merchant: 'Test Store' };
    
    VueniSecureStorage.setFinancialData('test-key', testData);
    const retrievedData = VueniSecureStorage.getFinancialData('test-key');
    
    expect(retrievedData).toEqual(testData);
  });

  it('should return null for non-existent keys', () => {
    const result = VueniSecureStorage.getFinancialData('non-existent');
    expect(result).toBeNull();
  });

  it('should remove encrypted data', () => {
    VueniSecureStorage.setFinancialData('test-key', { data: 'test' });
    expect(localStorage.getItem('vueni_test-key')).toBeTruthy();
    
    VueniSecureStorage.removeFinancialData('test-key');
    expect(localStorage.getItem('vueni_test-key')).toBeNull();
  });

  it('should clear all Vueni financial data', () => {
    VueniSecureStorage.setFinancialData('key1', { data: 'test1' });
    VueniSecureStorage.setFinancialData('key2', { data: 'test2' });
    localStorage.setItem('other-key', 'should-remain');
    
    VueniSecureStorage.clearAllFinancialData();
    
    expect(localStorage.getItem('vueni_key1')).toBeNull();
    expect(localStorage.getItem('vueni_key2')).toBeNull();
    expect(localStorage.getItem('other-key')).toBe('should-remain');
  });

  it('should prefix all Vueni keys correctly', () => {
    VueniSecureStorage.setFinancialData('test', { data: 'test' });
    
    const keys = Object.keys(localStorage);
    const vueniKeys = keys.filter(key => key.startsWith('vueni_'));
    
    expect(vueniKeys).toHaveLength(1);
    expect(vueniKeys[0]).toBe('vueni_test');
  });
});

describe('VueniSessionManager', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a valid session', () => {
    const session = VueniSessionManager.createSession('user123', 'test@vueni.com');
    
    expect(session).toMatchObject({
      userId: 'user123',
      email: 'test@vueni.com',
      isActive: true
    });
    expect(session.id).toContain('vueni_');
    expect(session.createdAt).toBeTruthy();
    expect(session.lastActivity).toBeTruthy();
  });

  it('should retrieve current session', () => {
    const originalSession = VueniSessionManager.createSession('user123', 'test@vueni.com');
    const retrievedSession = VueniSessionManager.getCurrentSession();
    
    expect(retrievedSession).toEqual(originalSession);
  });

  it('should return null for expired session', () => {
    VueniSessionManager.createSession('user123', 'test@vueni.com');
    
    // Fast forward time beyond session duration (30 minutes)
    vi.advanceTimersByTime(31 * 60 * 1000);
    
    const session = VueniSessionManager.getCurrentSession();
    expect(session).toBeNull();
  });

  it('should update activity timestamp', () => {
    const session = VueniSessionManager.createSession('user123', 'test@vueni.com');
    const originalActivity = session.lastActivity;
    
    vi.advanceTimersByTime(5000); // 5 seconds
    VueniSessionManager.updateActivity();
    
    const updatedSession = VueniSessionManager.getCurrentSession();
    expect(updatedSession?.lastActivity).not.toBe(originalActivity);
  });

  it('should destroy session and clear data', () => {
    VueniSessionManager.createSession('user123', 'test@vueni.com');
    VueniSecureStorage.setFinancialData('test-data', { amount: 100 });
    
    expect(VueniSessionManager.getCurrentSession()).toBeTruthy();
    expect(VueniSecureStorage.getFinancialData('test-data')).toBeTruthy();
    
    VueniSessionManager.destroySession();
    
    expect(VueniSessionManager.getCurrentSession()).toBeNull();
    expect(VueniSecureStorage.getFinancialData('test-data')).toBeNull();
  });

  it('should validate authentication status', () => {
    expect(VueniSessionManager.isAuthenticated()).toBe(false);
    
    VueniSessionManager.createSession('user123', 'test@vueni.com');
    expect(VueniSessionManager.isAuthenticated()).toBe(true);
    
    VueniSessionManager.destroySession();
    expect(VueniSessionManager.isAuthenticated()).toBe(false);
  });

  it('should generate and validate CSRF tokens', () => {
    const token = VueniSessionManager.generateCSRFToken();
    
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(10);
    expect(VueniSessionManager.validateCSRFToken(token)).toBe(true);
    expect(VueniSessionManager.validateCSRFToken('invalid-token')).toBe(false);
  });

  it('should handle session expiration correctly', () => {
    const session = VueniSessionManager.createSession('user123', 'test@vueni.com');
    
    // Session should be valid initially
    expect(VueniSessionManager.isAuthenticated()).toBe(true);
    
    // Fast forward to just before expiration
    vi.advanceTimersByTime(29 * 60 * 1000); // 29 minutes
    expect(VueniSessionManager.isAuthenticated()).toBe(true);
    
    // Fast forward past expiration
    vi.advanceTimersByTime(2 * 60 * 1000); // 2 more minutes (31 total)
    expect(VueniSessionManager.isAuthenticated()).toBe(false);
  });
});

describe('Security Validation', () => {
  it('should not store sensitive data in plain text', () => {
    const sensitiveData = {
      ssn: '123-45-6789',
      creditCard: '4111-1111-1111-1111',
      password: 'secretpassword',
      accountNumber: '1234567890'
    };
    
    VueniSecureStorage.setFinancialData('sensitive', sensitiveData);
    
    const storedValue = localStorage.getItem('vueni_sensitive');
    
    // Verify none of the sensitive data appears in plain text
    expect(storedValue).not.toContain('123-45-6789');
    expect(storedValue).not.toContain('4111-1111-1111-1111');
    expect(storedValue).not.toContain('secretpassword');
    expect(storedValue).not.toContain('1234567890');
  });

  it('should handle encryption errors gracefully', () => {
    // Mock encryption failure
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    vi.mocked(require('crypto-js').AES.encrypt).mockImplementationOnce(() => {
      throw new Error('Encryption failed');
    });
    
    expect(() => {
      VueniSecureStorage.setFinancialData('test', { data: 'test' });
    }).toThrow('Encryption failed');
    
    console.error = originalConsoleError;
  });

  it('should handle decryption errors gracefully', () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Store valid encrypted data first
    VueniSecureStorage.setFinancialData('test', { data: 'test' });
    
    // Mock decryption failure
    vi.mocked(require('crypto-js').AES.decrypt).mockImplementationOnce(() => {
      throw new Error('Decryption failed');
    });
    
    expect(() => {
      VueniSecureStorage.getFinancialData('test');
    }).toThrow('Decryption failed');
    
    console.error = originalConsoleError;
  });

  it('should use secure session IDs', () => {
    const session1 = VueniSessionManager.createSession('user1', 'user1@vueni.com');
    const session2 = VueniSessionManager.createSession('user2', 'user2@vueni.com');
    
    // Session IDs should be different
    expect(session1.id).not.toBe(session2.id);
    
    // Session IDs should be sufficiently long
    expect(session1.id.length).toBeGreaterThan(15);
    expect(session2.id.length).toBeGreaterThan(15);
    
    // Session IDs should contain the Vueni prefix
    expect(session1.id).toContain('vueni_');
    expect(session2.id).toContain('vueni_');
  });

  it('should validate data integrity', () => {
    const originalData = {
      amount: 150.75,
      merchant: 'Secure Store',
      timestamp: Date.now()
    };
    
    VueniSecureStorage.setFinancialData('integrity-test', originalData);
    const retrievedData = VueniSecureStorage.getFinancialData('integrity-test');
    
    // Data should be exactly the same after encryption/decryption
    expect(retrievedData).toEqual(originalData);
    expect(retrievedData.amount).toBe(originalData.amount);
    expect(retrievedData.merchant).toBe(originalData.merchant);
    expect(retrievedData.timestamp).toBe(originalData.timestamp);
  });
});