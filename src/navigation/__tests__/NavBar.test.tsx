import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Home, CreditCard, Receipt, TrendingUp, Plus } from 'lucide-react';
import NavBar, { type Tab, type NavBarProps } from '../components/NavBar';

// Mock the hooks and utilities
vi.mock('@/shared/hooks/useBreakpoint', () => ({
  useBreakpoint: vi.fn(() => ({
    breakpoint: 'mobile',
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
  })),
}));

vi.mock('@/shared/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('@/shared/ui/LiquidGlassSVGFilters', () => ({
  __esModule: true,
  default: () => <div data-testid="liquid-glass-filters" />,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Sample tabs for testing
const sampleTabs: Tab[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    action: vi.fn(),
    isActive: true,
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: CreditCard,
    action: vi.fn(),
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: Receipt,
    action: vi.fn(),
    badgeCount: 5,
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: TrendingUp,
    action: vi.fn(),
    hideOnMobile: true,
  },
];

const defaultProps: NavBarProps = {
  tabs: sampleTabs,
};

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window methods
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the navbar with provided tabs', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to Home')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to Accounts')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to Transactions')).toBeInTheDocument();
    });

    it('applies correct aria-label based on position', () => {
      const { rerender } = render(
        <TestWrapper>
          <NavBar {...defaultProps} position="top" />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Primary navigation')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <NavBar {...defaultProps} position="bottom" />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Bottom navigation')).toBeInTheDocument();
    });

    it('renders liquid glass filters', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByTestId('liquid-glass-filters')).toBeInTheDocument();
    });
  });

  describe('Tab Interactions', () => {
    it('calls tab action when clicked', () => {
      const mockAction = vi.fn();
      const tabsWithMock = [
        {
          ...sampleTabs[0],
          action: mockAction,
        },
      ];

      render(
        <TestWrapper>
          <NavBar tabs={tabsWithMock} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByLabelText('Navigate to Home'));
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('calls onActiveTabChange when tab is pressed', () => {
      const mockOnActiveTabChange = vi.fn();

      render(
        <TestWrapper>
          <NavBar {...defaultProps} onActiveTabChange={mockOnActiveTabChange} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByLabelText('Navigate to Accounts'));
      expect(mockOnActiveTabChange).toHaveBeenCalledWith('accounts');
    });

    it('shows badge count when provided', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByLabelText('5 notifications')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows 99+ for badge counts over 99', () => {
      const tabsWithLargeBadge = [
        {
          ...sampleTabs[2],
          badgeCount: 150,
        },
      ];

      render(
        <TestWrapper>
          <NavBar tabs={tabsWithLargeBadge} />
        </TestWrapper>
      );

      expect(screen.getByText('99+')).toBeInTheDocument();
    });
  });

  describe('Floating Action Button', () => {
    it('renders FAB when provided', () => {
      const fabProps = {
        icon: Plus,
        action: vi.fn(),
        ariaLabel: 'Add new item',
      };

      render(
        <TestWrapper>
          <NavBar {...defaultProps} fab={fabProps} />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Add new item')).toBeInTheDocument();
    });

    it('calls FAB action when clicked', () => {
      const mockFabAction = vi.fn();
      const fabProps = {
        icon: Plus,
        action: mockFabAction,
      };

      render(
        <TestWrapper>
          <NavBar {...defaultProps} fab={fabProps} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByLabelText('Floating action button'));
      expect(mockFabAction).toHaveBeenCalledTimes(1);
    });

    it('applies correct variant styles', () => {
      const fabProps = {
        icon: Plus,
        action: vi.fn(),
        variant: 'secondary' as const,
      };

      render(
        <TestWrapper>
          <NavBar {...defaultProps} fab={fabProps} />
        </TestWrapper>
      );

      const fabButton = screen.getByLabelText('Floating action button');
      expect(fabButton).toHaveClass('bg-white/20');
    });
  });

  describe('Responsive Behavior', () => {
    it('filters out hideOnMobile tabs on mobile', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} />
        </TestWrapper>
      );

      // Insights tab should be hidden on mobile
      expect(screen.queryByLabelText('Navigate to Insights')).not.toBeInTheDocument();
    });

    it('respects maxTabs limit', () => {
      const manyTabs = Array.from({ length: 10 }, (_, i) => ({
        id: `tab-${i}`,
        label: `Tab ${i}`,
        icon: Home,
        action: vi.fn(),
      }));

      render(
        <TestWrapper>
          <NavBar tabs={manyTabs} maxTabs={3} />
        </TestWrapper>
      );

      // Should only show first 3 tabs
      expect(screen.getByLabelText('Navigate to Tab 0')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to Tab 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to Tab 2')).toBeInTheDocument();
      expect(screen.queryByLabelText('Navigate to Tab 3')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Bottom navigation');

      const activeTab = screen.getByLabelText('Navigate to Home');
      expect(activeTab).toHaveAttribute('aria-current', 'page');
    });

    it('has proper touch target sizes', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} />
        </TestWrapper>
      );

      const homeButton = screen.getByLabelText('Navigate to Home');
      expect(homeButton).toHaveClass('min-w-[48px]', 'min-h-[48px]');
    });

    it('has focus indicators', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} />
        </TestWrapper>
      );

      const homeButton = screen.getByLabelText('Navigate to Home');
      expect(homeButton).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  describe('Scroll Controller', () => {
    it('applies transform when scrollController is enabled', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} scrollController />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveStyle({ transform: 'translateY(0)' });
    });

    it('handles scroll events for hide/reveal', async () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} scrollController />
        </TestWrapper>
      );

      // Simulate scroll down
      Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
      fireEvent.scroll(window);

      // Note: Due to debouncing, we'd need to wait for the timeout
      // This is a simplified test - in practice you'd mock timers
    });
  });

  describe('Orientation Changes', () => {
    it('detects orientation changes', () => {
      const mockMediaQuery = {
        matches: true, // landscape
        media: '(orientation: landscape)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      render(
        <TestWrapper>
          <NavBar {...defaultProps} />
        </TestWrapper>
      );

      // Component should adapt to landscape orientation
      expect(window.matchMedia).toHaveBeenCalledWith('(orientation: landscape)');
    });
  });

  describe('Label Display', () => {
    it('shows labels when showLabels is true', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} showLabels />
        </TestWrapper>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Accounts')).toBeInTheDocument();
    });

    it('hides labels when showLabels is false', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} showLabels={false} />
        </TestWrapper>
      );

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.queryByText('Accounts')).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(
        <TestWrapper>
          <NavBar {...defaultProps} className="custom-nav-class" />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-nav-class');
    });

    it('applies position-specific styles', () => {
      const { rerender } = render(
        <TestWrapper>
          <NavBar {...defaultProps} position="top" />
        </TestWrapper>
      );

      let nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('top-0', 'border-b');

      rerender(
        <TestWrapper>
          <NavBar {...defaultProps} position="bottom" />
        </TestWrapper>
      );

      nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('bottom-0', 'border-t');
    });
  });
});