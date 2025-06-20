import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { useBreakpoint } from '@/shared/hooks/useBreakpoint';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import { useScrollController } from '@/navigation/hooks/useScrollController';
import { useViewportGuardian } from '@/shared/utils/viewport-guardian';

// TypeScript interfaces
export interface Tab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Icon component (from lucide-react or similar) */
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  /** Action to execute when tab is pressed */
  action: () => void;
  /** Whether this tab is currently active */
  isActive?: boolean;
  /** Optional badge count for notifications */
  badgeCount?: number;
  /** Whether to hide this tab on mobile (for FAB overflow) */
  hideOnMobile?: boolean;
  /** Custom aria-label for accessibility */
  ariaLabel?: string;
}

export interface NavBarProps {
  /** Array of navigation tabs */
  tabs: Tab[];
  /** Optional floating action button */
  fab?: {
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    action: () => void;
    ariaLabel?: string;
    variant?: 'primary' | 'secondary';
  };
  /** Whether to enable scroll-based hide/reveal */
  scrollController?: boolean;
  /** Custom className for the navbar */
  className?: string;
  /** Position of the navbar */
  position?: 'top' | 'bottom';
  /** Whether to show labels on tabs */
  showLabels?: boolean;
  /** Maximum number of tabs to show before creating overflow */
  maxTabs?: number;
  /** Callback when active tab changes */
  onActiveTabChange?: (tabId: string) => void;
}

// Touch target size constants following WCAG 2.5.5
const TOUCH_TARGET_SIZE = 48; // 48px minimum
const SCROLL_THRESHOLD = 10; // Pixels to scroll before hiding
const SCROLL_DEBOUNCE = 16; // ~60fps

/**
 * NavBar Component
 *
 * A performant and accessible navigation bar component with:
 * - TypeScript support with comprehensive interfaces
 * - Scroll-based hide/reveal functionality
 * - Responsive design across all device sizes
 * - Proper semantic HTML and ARIA attributes
 * - CSS transforms for performance (avoiding repaints)
 * - Orientation change handling
 * - Active state management
 * - Optional floating action button
 * - Composable and easy to integrate
 */
const NavBar: React.FC<NavBarProps> = ({
  tabs,
  fab,
  scrollController = false,
  className,
  position = 'bottom',
  showLabels = true,
  maxTabs = 5,
  onActiveTabChange,
}) => {
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { breakpoint, isMobile, isTablet } = useBreakpoint();

  // State
  const [isVisible, setIsVisible] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );

  // Refs
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Detect orientation changes
  useEffect(() => {
    const getOrientation = (): 'portrait' | 'landscape' => {
      if (typeof window === 'undefined') return 'portrait';
      return window.matchMedia('(orientation: landscape)').matches
        ? 'landscape'
        : 'portrait';
    };

    const handleOrientationChange = () => {
      setOrientation(getOrientation());
    };

    // Set initial orientation
    setOrientation(getOrientation());

    // Listen for orientation changes
    const mediaQuery = window.matchMedia('(orientation: landscape)');
    mediaQuery.addEventListener('change', handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  // Scroll controller for hide/reveal
  const handleScroll = useCallback(() => {
    if (!scrollController) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY.current;

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Debounce scroll handling
    scrollTimeout.current = setTimeout(() => {
      if (Math.abs(scrollDelta) < SCROLL_THRESHOLD) return;

      // Hide on scroll down, show on scroll up
      if (scrollDelta > 0 && currentScrollY > 100) {
        setIsVisible(false);
      } else if (scrollDelta < 0) {
        setIsVisible(true);
      }

      // Always show when near top
      if (currentScrollY < 50) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    }, SCROLL_DEBOUNCE);
  }, [scrollController]);

  // Setup scroll listener
  useEffect(() => {
    if (!scrollController) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll, scrollController]);

  // Filter and prepare tabs based on device constraints
  const visibleTabs = useMemo(() => {
    let filteredTabs = tabs;

    // On mobile, respect hideOnMobile flag and maxTabs limit
    if (isMobile) {
      filteredTabs = tabs.filter((tab) => !tab.hideOnMobile);
      if (filteredTabs.length > maxTabs) {
        filteredTabs = filteredTabs.slice(0, maxTabs);
      }
    }

    return filteredTabs;
  }, [tabs, isMobile, maxTabs]);

  // Handle tab press with haptic feedback simulation
  const handleTabPress = useCallback(
    (tab: Tab) => {
      // Simulate haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }

      // Execute tab action
      tab.action();

      // Notify parent of active tab change
      if (onActiveTabChange) {
        onActiveTabChange(tab.id);
      }
    },
    [onActiveTabChange]
  );

  // Handle FAB press
  const handleFabPress = useCallback(() => {
    if (!fab) return;

    // Simulate haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }

    fab.action();
  }, [fab]);

  // Calculate transform for hide/reveal animation
  const transform = useMemo(() => {
    if (!scrollController) return 'translateY(0)';

    const translateValue =
      position === 'top'
        ? isVisible
          ? '0'
          : '-100%'
        : isVisible
          ? '0'
          : '100%';

    return `translateY(${translateValue})`;
  }, [isVisible, position, scrollController]);

  // Dynamic styles based on breakpoint and orientation
  const navStyles = useMemo(
    () => ({
      transform,
      paddingBottom:
        position === 'bottom' && isMobile
          ? 'env(safe-area-inset-bottom)'
          : undefined,
      paddingTop:
        position === 'top' && isMobile ? 'env(safe-area-inset-top)' : undefined,
      height: orientation === 'landscape' && isMobile ? '52px' : undefined,
    }),
    [transform, position, isMobile, orientation]
  );

  // Accessibility attributes
  const navAriaLabel =
    position === 'top' ? 'Primary navigation' : 'Bottom navigation';

  return (
    <>
      <LiquidGlassSVGFilters />

      <nav
        ref={navRef}
        className={cn(
          // Base styles
          'fixed left-0 right-0 z-50 transition-transform duration-300 ease-out',

          // Position
          position === 'top' ? 'top-0' : 'bottom-0',

          // Responsive visibility
          isMobile ? 'block' : 'hidden md:block',

          // Glass effect
          'liquid-glass-nav backdrop-blur-md saturate-[180%]',
          position === 'top'
            ? 'border-b border-white/20'
            : 'border-t border-white/20',

          // Custom className
          className
        )}
        style={navStyles}
        role="navigation"
        aria-label={navAriaLabel}
      >
        <div className="relative">
          {/* Main navigation container */}
          <div
            className={cn(
              'flex items-center justify-around px-2',
              // Responsive padding
              isMobile && orientation === 'portrait' ? 'py-3' : 'py-2',
              isTablet ? 'px-4 py-3' : '',
              // Ensure proper spacing for FAB
              fab && !isMobile ? 'pr-16' : ''
            )}
          >
            {visibleTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive =
                tab.isActive || location.pathname === (tab as any).path;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabPress(tab)}
                  className={cn(
                    // Base button styles
                    'flex flex-col items-center justify-center transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent',
                    'touch-manipulation rounded-xl',

                    // Touch target size
                    `min-w-[${TOUCH_TARGET_SIZE}px] min-h-[${TOUCH_TARGET_SIZE}px]`,

                    // Spacing
                    showLabels ? 'space-y-1 py-2 px-3' : 'p-3',

                    // Active state
                    isActive
                      ? 'liquid-glass-menu-item text-white bg-white/10 scale-105 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/5 hover:scale-102',

                    // Responsive adjustments
                    isMobile && orientation === 'landscape' ? 'px-2 py-1' : ''
                  )}
                  aria-label={tab.ariaLabel || `Navigate to ${tab.label}`}
                  aria-current={isActive ? 'page' : undefined}
                  type="button"
                >
                  {/* Icon */}
                  <div className="relative">
                    <IconComponent
                      className={cn(
                        'transition-all duration-300',
                        // Responsive icon sizes
                        isMobile && orientation === 'landscape'
                          ? 'w-4 h-4'
                          : 'w-5 h-5',
                        isTablet ? 'w-6 h-6' : '',
                        isActive ? 'scale-110' : ''
                      )}
                      aria-hidden={true}
                    />

                    {/* Badge indicator */}
                    {tab.badgeCount && tab.badgeCount > 0 && (
                      <span
                        className={cn(
                          'absolute -top-1 -right-1 min-w-[16px] h-4 px-1',
                          'bg-red-500 text-white text-xs font-bold rounded-full',
                          'flex items-center justify-center border border-black/20',
                          'animate-pulse'
                        )}
                        aria-label={`${tab.badgeCount} notifications`}
                      >
                        {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  {showLabels && (
                    <span
                      className={cn(
                        'font-medium leading-tight text-center',
                        // Responsive text sizes
                        isMobile && orientation === 'landscape'
                          ? 'text-xs'
                          : 'text-xs',
                        isTablet ? 'text-sm' : '',
                        // Ensure text doesn't wrap
                        'max-w-full truncate'
                      )}
                    >
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Floating Action Button */}
          {fab && (
            <button
              onClick={handleFabPress}
              className={cn(
                // Base FAB styles
                'absolute rounded-full shadow-lg transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2',
                'touch-manipulation',

                // Position (detached)
                position === 'bottom' ? '-top-6' : '-bottom-6',
                'right-4',

                // Size
                'w-14 h-14',

                // Colors based on variant
                fab.variant === 'secondary'
                  ? 'bg-white/20 text-white hover:bg-white/30 liquid-glass-menu-item'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/25',

                // Responsive adjustments
                isMobile
                  ? 'scale-100 hover:scale-105'
                  : 'scale-110 hover:scale-115',

                // Animation
                'transform-gpu active:scale-95'
              )}
              aria-label={fab.ariaLabel || 'Floating action button'}
              type="button"
            >
              <fab.icon className="w-6 h-6 mx-auto" aria-hidden={true} />
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
