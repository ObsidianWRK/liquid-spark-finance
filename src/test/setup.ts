import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock crypto for Node.js environment
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn(() => new Uint8Array(16)),
    subtle: {
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      digest: vi.fn(),
    },
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup global test utilities
global.testUtils = {
  // Mock financial data for consistent testing
  mockTransaction: {
    id: '1',
    amount: 100.50,
    merchant: 'Test Merchant',
    date: '2024-01-01',
    category: 'Food & Dining',
    healthScore: 85,
    ecoScore: 70,
    financialScore: 90,
  },
  
  mockAccount: {
    id: '1',
    name: 'Test Checking',
    type: 'checking',
    balance: 5000.00,
    currency: 'USD',
  },

  // Test data generators
  generateTransactions: (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-txn-${i}`,
      amount: Math.random() * 1000,
      merchant: `Test Merchant ${i}`,
      date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      category: ['Food & Dining', 'Gas & Transport', 'Shopping', 'Bills & Utilities'][i % 4],
      healthScore: Math.floor(Math.random() * 100),
      ecoScore: Math.floor(Math.random() * 100),
      financialScore: Math.floor(Math.random() * 100),
    }));
  },

  // Security test helpers
  mockSecurityContext: {
    validateInput: vi.fn(),
    onCalculationSuccess: vi.fn(),
    onCalculationError: vi.fn(),
    securityLevel: 'high',
  },
};

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});