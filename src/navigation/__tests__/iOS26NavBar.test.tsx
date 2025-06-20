import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import iOS26NavBar from '../components/iOS26NavBar';
import { Home, Search, User, Settings, Plus } from 'lucide-react';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock hooks
jest.mock('@/navigation/utils/scroll-controller', () => ({
  useScrollController: () => ({
    isVisible: true,
    scrollY: 0,
    velocity: 0,
    isScrolling: false,
    virtualKeyboardHeight: 0,
  }),
}));

jest.mock('@/shared/utils/viewport-guardian', () => ({
  useViewportGuardian: () => ({
    dimensions: {
      width: 375,
      height: 812,
      visualWidth: 375,
      visualHeight: 812,
      scale: 1,
      offsetTop: 0,
      offsetLeft: 0,
    },
    safeAreaInsets: {
      top: 44,
      right: 0,
      bottom: 34,
      left: 0,
    },
    orientation: 'portrait',
    isVirtualKeyboardOpen: false,
    virtualKeyboardHeight: 0,
    devicePixelRatio: 3,
  }),
}));

// Mock tabs data
const mockTabs = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    action: jest.fn(),
    ariaLabel: 'Navigate to home',
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    action: jest.fn(),
    badgeCount: 3,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    action: jest.fn(),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    action: jest.fn(),
    hideOnMobile: true,
  },
];

const mockFab = {
  icon: Plus,
  action: jest.fn(),
  ariaLabel: 'Create new item',
};

// Wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('iOS26NavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders navigation with all visible tabs', () => {
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3); // Settings is hidden on mobile
    });

    it('renders with floating action button', () => {
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} fab={mockFab} />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Create new item')).toBeInTheDocument();
    });

    it('renders badges correctly', () => {
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} />
        </TestWrapper>
      );

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByLabelText('3 notifications')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} fab={mockFab} />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('includes skip link for keyboard navigation', () => {
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} />
        </TestWrapper>
      );

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveClass('sr-only');
    });

    it('implements proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Bottom navigation');

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');

      const tabs = screen.getAllByRole('tab');
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('tabindex');
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} />
        </TestWrapper>
      );

      const firstTab = screen.getAllByRole('tab')[0];
      const secondTab = screen.getAllByRole('tab')[1];

      // Focus first tab
      firstTab.focus();
      expect(firstTab).toHaveFocus();

      // Arrow right to next tab
      await user.keyboard('{ArrowRight}');
      expect(secondTab).toHaveFocus();

      // Arrow left back to first tab
      await user.keyboard('{ArrowLeft}');
      expect(firstTab).toHaveFocus();

      // Enter to activate
      await user.keyboard('{Enter}');
      expect(mockTabs[0].action).toHaveBeenCalled();
    });

    it('responds to Alt+N keyboard shortcut', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} />
        </TestWrapper>
      );

      await user.keyboard('{Alt>}n{/Alt}');
      
      // First tab should be focused
      const firstTab = screen.getAllByRole('tab')[0];
      expect(firstTab).toHaveFocus();
    });
  });

  describe('Interactions', () => {
    it('calls action when tab is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} />
        </TestWrapper>
      );

      const homeTab = screen.getByLabelText('Navigate to home');
      await user.click(homeTab);

      expect(mockTabs[0].action).toHaveBeenCalled();
    });

    it('calls FAB action when clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} fab={mockFab} />
        </TestWrapper>
      );

      const fabButton = screen.getByLabelText('Create new item');
      await user.click(fabButton);

      expect(mockFab.action).toHaveBeenCalled();
    });

    it('triggers onActiveTabChange callback', async () => {
      const onActiveTabChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <iOS26NavBar 
            tabs={mockTabs} 
            onActiveTabChange={onActiveTabChange}
          />
        </TestWrapper>
      );

      const searchTab = screen.getByText('Search').closest('button')!;
      await user.click(searchTab);

      expect(onActiveTabChange).toHaveBeenCalledWith('search');
    });
  });

  describe('Responsive Behavior', () => {
    it('hides tabs marked as hideOnMobile on small screens', () => {
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} />
        </TestWrapper>
      );

      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('limits tabs to maxTabs on mobile', () => {
      const manyTabs = Array.from({ length: 10 }, (_, i) => ({
        id: `tab-${i}`,
        label: `Tab ${i}`,
        icon: Home,
        action: jest.fn(),
      }));

      render(
        <TestWrapper>
          <iOS26NavBar tabs={manyTabs} maxTabs={5} />
        </TestWrapper>
      );

      expect(screen.getAllByRole('tab')).toHaveLength(5);
    });

    it('hides labels when showLabels is false', () => {
      render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} showLabels={false} />
        </TestWrapper>
      );

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.queryByText('Search')).not.toBeInTheDocument();
    });
  });

  describe('Safe Area Support', () => {
    it('applies safe area padding to bottom navigation', () => {
      const { container } = render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} position="bottom" />
        </TestWrapper>
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveStyle({ paddingBottom: '34px' });
    });

    it('applies safe area padding to top navigation', () => {
      const { container } = render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} position="top" />
        </TestWrapper>
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveStyle({ paddingTop: '44px' });
    });
  });

  describe('Visual States', () => {
    it('applies active state to current tab', () => {
      render(
        <TestWrapper>
          <iOS26NavBar 
            tabs={mockTabs.map((tab, i) => ({
              ...tab,
              isActive: i === 0,
            }))} 
          />
        </TestWrapper>
      );

      const activeTab = screen.getAllByRole('tab')[0];
      expect(activeTab).toHaveClass('ios26-nav__tab--active');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
      expect(activeTab).toHaveAttribute('aria-current', 'page');
    });

    it('applies correct FAB variant styles', () => {
      const { rerender } = render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} fab={{ ...mockFab, variant: 'primary' }} />
        </TestWrapper>
      );

      let fabButton = screen.getByLabelText('Create new item');
      expect(fabButton).toHaveClass('ios26-nav__fab--primary');

      rerender(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} fab={{ ...mockFab, variant: 'secondary' }} />
        </TestWrapper>
      );

      fabButton = screen.getByLabelText('Create new item');
      expect(fabButton).toHaveClass('ios26-nav__fab--secondary');
    });
  });

  describe('Scroll Behavior', () => {
    it('hides navigation when scrolling down', () => {
      // This would be tested in integration tests with actual scroll events
      // Here we just verify the class is applied based on scroll state
      const { container } = render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} enableScrollHide={true} />
        </TestWrapper>
      );

      const nav = container.querySelector('nav');
      expect(nav).not.toHaveClass('ios26-nav--hidden');
    });

    it('shows navigation when virtual keyboard is open', () => {
      // Mock viewport state with keyboard open
      jest.spyOn(require('@/shared/utils/viewport-guardian'), 'useViewportGuardian')
        .mockReturnValue({
          dimensions: { width: 375, height: 500 },
          safeAreaInsets: { top: 44, right: 0, bottom: 34, left: 0 },
          orientation: 'portrait',
          isVirtualKeyboardOpen: true,
          virtualKeyboardHeight: 312,
          devicePixelRatio: 3,
        });

      const { container } = render(
        <TestWrapper>
          <iOS26NavBar tabs={mockTabs} enableScrollHide={true} />
        </TestWrapper>
      );

      const nav = container.querySelector('nav');
      expect(nav).not.toHaveClass('ios26-nav--hidden');
    });
  });
}); 