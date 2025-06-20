import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdaptiveNavigation from '../components/AdaptiveNavigation';
import { useBreakpoint } from '@/shared/hooks/useBreakpoint';

// Mock the useBreakpoint hook
jest.mock('@/shared/hooks/useBreakpoint');
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

// Mock the navigation components
jest.mock('../components/BottomNav', () => {
  return function MockBottomNav() {
    return <div data-testid="bottom-nav">Bottom Navigation</div>;
  };
});

jest.mock('../components/NavRail', () => {
  return function MockNavRail() {
    return <div data-testid="nav-rail">Navigation Rail</div>;
  };
});

jest.mock('../components/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('../components/TopBar', () => {
  return function MockTopBar() {
    return <div data-testid="top-bar">Top Bar</div>;
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AdaptiveNavigation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders BottomNav on mobile breakpoint', () => {
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'mobile',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isLargeDesktop: false,
    });

    renderWithRouter(<AdaptiveNavigation />);

    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-rail')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('top-bar')).not.toBeInTheDocument();
  });

  it('renders NavRail on tablet breakpoint', () => {
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'tablet',
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isLargeDesktop: false,
    });

    renderWithRouter(<AdaptiveNavigation />);

    expect(screen.getByTestId('nav-rail')).toBeInTheDocument();
    expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('top-bar')).not.toBeInTheDocument();
  });

  it('renders Sidebar and TopBar on desktop breakpoint', () => {
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLargeDesktop: false,
    });

    renderWithRouter(<AdaptiveNavigation />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('top-bar')).toBeInTheDocument();
    expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-rail')).not.toBeInTheDocument();
  });

  it('renders Sidebar and TopBar on large desktop breakpoint', () => {
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'large',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLargeDesktop: true,
    });

    renderWithRouter(<AdaptiveNavigation />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('top-bar')).toBeInTheDocument();
    expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-rail')).not.toBeInTheDocument();
  });

  it('switches navigation correctly when breakpoint changes', () => {
    const { rerender } = renderWithRouter(<AdaptiveNavigation />);

    // Start with mobile
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'mobile',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isLargeDesktop: false,
    });
    rerender(
      <BrowserRouter>
        <AdaptiveNavigation />
      </BrowserRouter>
    );
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();

    // Switch to tablet
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'tablet',
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isLargeDesktop: false,
    });
    rerender(
      <BrowserRouter>
        <AdaptiveNavigation />
      </BrowserRouter>
    );
    expect(screen.getByTestId('nav-rail')).toBeInTheDocument();
    expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();

    // Switch to desktop
    mockUseBreakpoint.mockReturnValue({
      breakpoint: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLargeDesktop: false,
    });
    rerender(
      <BrowserRouter>
        <AdaptiveNavigation />
      </BrowserRouter>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('top-bar')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-rail')).not.toBeInTheDocument();
  });
});
