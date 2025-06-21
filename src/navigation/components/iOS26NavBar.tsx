import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { useScrollController } from '@/navigation/hooks/useScrollController';
import { useViewportGuardian } from '@/shared/utils/viewport-guardian';

// Re-export Tab interface from NavBar
export type { Tab } from './NavBar';

export interface iOS26NavBarProps {
  /** Array of navigation tabs */
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    action: () => void;
    isActive?: boolean;
    badgeCount?: number;
    hideOnMobile?: boolean;
    ariaLabel?: string;
  }>;
  /** Optional floating action button */
  fab?: {
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    action: () => void;
    ariaLabel?: string;
    variant?: 'primary' | 'secondary';
  };
  /** Whether to enable scroll-based hide/reveal */
  enableScrollHide?: boolean;
  /** Custom className for the navbar */
  className?: string;
  /** Position of the navbar */
  position?: 'top' | 'bottom';
  /** Whether to show labels on tabs */
  showLabels?: boolean;
  /** Maximum number of tabs to show before creating overflow */
  maxTabs?: number;
  /** Transform to side rail on desktop */
  enableSideRail?: boolean;
  /** Callback when active tab changes */
  onActiveTabChange?: (tabId: string) => void;
}

/**
 * iOS 26-Style Navigation Bar
 *
 * Features:
 * - Liquid Glass effect with backdrop blur
 * - Universal safe area support
 * - Scroll-based hide/reveal
 * - Responsive heights (68px portrait, 56px landscape)
 * - Side rail transformation on desktop
 * - Virtual keyboard awareness
 * - Full accessibility support
 */
const iOS26NavBar: React.FC<iOS26NavBarProps> = ({
  tabs,
  fab,
  enableScrollHide = true,
  className,
  position = 'bottom',
  showLabels = true,
  maxTabs = 5,
  enableSideRail = true,
  onActiveTabChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  // Viewport and scroll state
  const viewportState = useViewportGuardian();
  const scrollState = useScrollController({
    hideThreshold: 48,
    hideVelocity: 0.5,
    showVelocity: -0.3,
    alwaysShowTop: 100,
    onVisibilityChange: (isVisible) => {
      // Add will-change when animating
      if (navRef.current) {
        navRef.current.style.willChange = isVisible ? 'auto' : 'transform';
      }
    },
  });

  // Determine if we should show as side rail
  const showAsSideRail =
    enableSideRail && viewportState.dimensions.width >= 960;

  // Filter tabs based on device constraints
  const visibleTabs = useMemo(() => {
    let filteredTabs = tabs;

    // On mobile, respect hideOnMobile flag and maxTabs limit
    if (viewportState.dimensions.width < 640) {
      filteredTabs = tabs.filter((tab) => !tab.hideOnMobile);
      if (filteredTabs.length > maxTabs) {
        filteredTabs = filteredTabs.slice(0, maxTabs);
      }
    }

    return filteredTabs;
  }, [tabs, maxTabs, viewportState.dimensions.width]);

  // Handle tab press
  const handleTabPress = useCallback(
    (tab: (typeof tabs)[0]) => {
      // Haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }

      tab.action();

      if (onActiveTabChange) {
        onActiveTabChange(tab.id);
      }
    },
    [onActiveTabChange]
  );

  // Handle FAB press
  const handleFabPress = useCallback(() => {
    if (!fab) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }

    fab.action();
  }, [fab]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + N to focus navigation
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        const firstTab = navRef.current?.querySelector('[role="tab"]');
        if (firstTab instanceof HTMLElement) {
          firstTab.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate navigation visibility
  const isVisible =
    !enableScrollHide ||
    scrollState.isVisible ||
    viewportState.isVirtualKeyboardOpen;

  // Determine orientation-based height
  const navHeight = viewportState.orientation === 'landscape' ? '56px' : '68px';

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-vueni-lg"
      >
        Skip to main content
      </a>

      {/* Main Navigation */}
      <nav
        ref={navRef}
        className={cn(
          'ios26-nav',
          position === 'top' ? 'ios26-nav--top' : 'ios26-nav--bottom',
          !isVisible && 'ios26-nav--hidden',
          showAsSideRail && 'ios26-nav--side-rail',
          className
        )}
        role="navigation"
        aria-label={
          position === 'top' ? 'Primary navigation' : 'Bottom navigation'
        }
        style={{
          // Apply safe area padding
          paddingBottom:
            position === 'bottom'
              ? `${viewportState.safeAreaInsets.bottom}px`
              : undefined,
          paddingTop:
            position === 'top'
              ? `${viewportState.safeAreaInsets.top}px`
              : undefined,
          paddingLeft: showAsSideRail
            ? `${viewportState.safeAreaInsets.left}px`
            : undefined,
        }}
      >
        <div className="ios26-nav__glass">
          <div
            className="ios26-nav__tabs"
            role="tablist"
            aria-orientation={showAsSideRail ? 'vertical' : 'horizontal'}
            style={{
              height: showAsSideRail ? '100%' : navHeight,
            }}
          >
            {visibleTabs.map((tab, index) => {
              const IconComponent = tab.icon;
              const isActive =
                tab.isActive || location.pathname === (tab as any).path;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={tab.ariaLabel || tab.label}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabPress(tab)}
                  onKeyDown={(e) => {
                    // Handle arrow key navigation
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      const nextIndex = (index + 1) % visibleTabs.length;
                      const nextButton =
                        navRef.current?.querySelectorAll('[role="tab"]')[
                          nextIndex
                        ];
                      if (nextButton instanceof HTMLElement) {
                        nextButton.focus();
                      }
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      const prevIndex =
                        index === 0 ? visibleTabs.length - 1 : index - 1;
                      const prevButton =
                        navRef.current?.querySelectorAll('[role="tab"]')[
                          prevIndex
                        ];
                      if (prevButton instanceof HTMLElement) {
                        prevButton.focus();
                      }
                    } else if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTabPress(tab);
                    }
                  }}
                  className={cn(
                    'ios26-nav__tab',
                    isActive && 'ios26-nav__tab--active'
                  )}
                >
                  {/* Icon with badge */}
                  <div className="relative">
                    <IconComponent
                      className="ios26-nav__icon"
                      aria-hidden={true}
                    />
                    {tab.badgeCount && tab.badgeCount > 0 && (
                      <span
                        className="ios26-nav__badge"
                        aria-label={`${tab.badgeCount} notifications`}
                      >
                        {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  {showLabels && (
                    <span className="ios26-nav__label">{tab.label}</span>
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
                'ios26-nav__fab',
                fab.variant === 'secondary'
                  ? 'ios26-nav__fab--secondary'
                  : 'ios26-nav__fab--primary'
              )}
              aria-label={fab.ariaLabel || 'Floating action button'}
              type="button"
            >
              <fab.icon className="w-6 h-6" aria-hidden={true} />
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default iOS26NavBar;
