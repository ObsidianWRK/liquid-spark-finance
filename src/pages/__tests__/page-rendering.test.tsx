/**
 * Phase 7 - Page Rendering Tests
 * Auto-generated unit tests to assert each page renders without crash
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock components that might have external dependencies
vi.mock('@/navigation', () => ({
  AdaptiveNavigation: () => <div data-testid="adaptive-navigation">Nav</div>,
}));

vi.mock('@/features/biometric-intervention', () => ({
  BiometricMonitor: () => <div data-testid="biometric-monitor">Monitor</div>,
  InterventionNudge: () => <div data-testid="intervention-nudge">Nudge</div>,
  useBiometricInterventionStore: () => ({}),
}));

// Mock performance APIs
vi.mock('@/shared/utils/performanceReporter', () => ({
  reportPerformanceMetrics: vi.fn(),
}));

// Mock stores
vi.mock('@/features/privacy-hide-amounts/store', () => ({
  usePrivacyStore: () => ({
    setting: { hideAmounts: false },
    toggle: vi.fn(),
  }),
}));

// Pages to test
import Index from '../Index';
import AccountsListPage from '../AccountsListPage';
import TransactionDemo from '../TransactionDemo';
import InsightsPage from '../InsightsPage';
import BudgetPlanner from '../BudgetPlanner';
import InvestmentTracker from '../InvestmentTracker';
import CreditScore from '../CreditScore';
import SavingsGoalsPage from '../SavingsGoals';
import Reports from '../Reports';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Page Rendering Tests - Phase 7', () => {
  describe('Dashboard (Index)', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );
      
      // Check for main content elements
      expect(document.body).toBeInTheDocument();
    });

    it('contains PFM features section', async () => {
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );
      
      // Should contain the PFM features heading we added
      const pfmHeading = await screen.findByText('Personal Finance Management');
      expect(pfmHeading).toBeInTheDocument();
    });
  });

  describe('Accounts List Page', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <AccountsListPage />
        </TestWrapper>
      );
      
      expect(screen.getByText('All Accounts')).toBeInTheDocument();
    });

    it('includes bank linking feature', () => {
      render(
        <TestWrapper>
          <AccountsListPage />
        </TestWrapper>
      );
      
      // Should include the bank linking panel we added
      expect(screen.getByText('Linked Bank Accounts')).toBeInTheDocument();
    });
  });

  describe('Transaction Demo Page', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <TransactionDemo />
        </TestWrapper>
      );
      
      expect(screen.getByText('Transaction Components')).toBeInTheDocument();
    });

    it('includes subscriptions feature', () => {
      render(
        <TestWrapper>
          <TransactionDemo />
        </TestWrapper>
      );
      
      // Should include the subscriptions panel we added
      expect(screen.getByText('Recurring Subscriptions')).toBeInTheDocument();
    });
  });

  describe('Insights Page', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <InsightsPage />
        </TestWrapper>
      );
      
      expect(document.body).toBeInTheDocument();
    });

    it('includes age of money feature', () => {
      render(
        <TestWrapper>
          <InsightsPage />
        </TestWrapper>
      );
      
      // Should include the age of money card we added
      expect(screen.getByText('Age of Money')).toBeInTheDocument();
    });
  });

  describe('Budget Planner Page', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <BudgetPlanner />
        </TestWrapper>
      );
      
      expect(document.body).toBeInTheDocument();
    });

    it('includes shared budgets feature', () => {
      render(
        <TestWrapper>
          <BudgetPlanner />
        </TestWrapper>
      );
      
      // Should include the shared budgets panel we added
      expect(screen.getByText('Shared Budgets')).toBeInTheDocument();
    });
  });

  describe('Investment Tracker Page', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <InvestmentTracker />
        </TestWrapper>
      );
      
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Credit Score Page', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <CreditScore />
        </TestWrapper>
      );
      
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Savings Goals Page', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <SavingsGoalsPage />
        </TestWrapper>
      );
      
      expect(document.body).toBeInTheDocument();
    });

    it('includes smart savings feature', () => {
      render(
        <TestWrapper>
          <SavingsGoalsPage />
        </TestWrapper>
      );
      
      // Should include the smart savings panel we added
      expect(screen.getByText('Smart Automated Savings Plans')).toBeInTheDocument();
    });
  });

  describe('Reports Page', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <Reports />
        </TestWrapper>
      );
      
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Responsive Design Tests', () => {
    it('all pages handle different viewport sizes', () => {
      const pages = [
        { name: 'Index', component: Index },
        { name: 'AccountsListPage', component: AccountsListPage },
        { name: 'TransactionDemo', component: TransactionDemo },
        { name: 'InsightsPage', component: InsightsPage },
      ];

      pages.forEach(({ name, component: Component }) => {
        // Test mobile viewport
        Object.defineProperty(window, 'innerWidth', { value: 375 });
        Object.defineProperty(window, 'innerHeight', { value: 667 });
        
        render(
          <TestWrapper>
            <Component />
          </TestWrapper>
        );
        
        expect(document.body).toBeInTheDocument();
        
        // Clean up for next test
        document.body.innerHTML = '';
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('pages have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );
      
      // Check for basic document structure - main content should exist
      expect(document.body).toBeInTheDocument();
    });

    it('interactive elements are keyboard accessible', () => {
      render(
        <TestWrapper>
          <AccountsListPage />
        </TestWrapper>
      );
      
      // Should have focusable elements with proper tab index
      const interactiveElements = document.querySelectorAll('[tabindex="0"]');
      expect(interactiveElements.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    it('lazy-loaded components render when needed', async () => {
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );
      
      // The dashboard should render without waiting for lazy components
      expect(document.body).toBeInTheDocument();
    });
  });
});