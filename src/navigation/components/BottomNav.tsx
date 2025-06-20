import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { mainRoutes } from '@/navigation/routeConfig';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import {
  useAccessibility,
  useKeyboardNavigation,
  useTouchTarget,
} from '@/navigation/hooks/useAccessibility';

/**
 * BottomNav Component
 * Mobile-first bottom navigation (<640px)
 * Features: Glass-blur backdrop, safe-area insets, max 5 items, icons + labels
 * Accessibility: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support
 */
const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  // Filter routes for bottom nav (max 5 items)
  const navRoutes = mainRoutes
    .filter((route) => !route.hideInBottomNav)
    .slice(0, 5);

  // Accessibility hooks
  const {
    announce,
    getAccessibilityClasses,
    liveRegionRef,
    prefersReducedMotion,
    prefersReducedTransparency,
  } = useAccessibility();

  const { getTouchTargetProps } = useTouchTarget();

  const { getTabListProps, getTabProps } = useKeyboardNavigation(
    navRoutes.map((route) => ({ id: route.id, disabled: false })),
    navRoutes.find((route) => route.path === location.pathname)?.id,
    (id) => {
      const route = navRoutes.find((r) => r.id === id);
      if (route) {
        handleNavigation(route.path);
      }
    },
    'horizontal'
  );

  const handleNavigation = (path: string, routeLabel?: string) => {
    navigate(path);

    // Announce navigation to screen readers
    if (routeLabel) {
      announce(`Navigated to ${routeLabel}`, 'polite');
    }
  };

  // Handle skip link
  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent =
      document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard shortcut for navigation (Alt + N)
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        skipLinkRef.current?.focus();
        announce(
          'Navigation menu focused. Use arrow keys to navigate.',
          'assertive'
        );
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () =>
      document.removeEventListener('keydown', handleKeyboardShortcut);
  }, [announce]);

  return (
    <>
      <LiquidGlassSVGFilters />

      {/* Skip Link for Accessibility */}
      <a
        ref={skipLinkRef}
        href="#main-content"
        className="nav-skip-link sr-only-focusable"
        onClick={handleSkipToContent}
      >
        Skip to main content
      </a>

      {/* Live Region for Screen Reader Announcements */}
      <div
        ref={liveRegionRef}
        className="nav-live-region"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Mobile Bottom Navigation - Accessible Implementation */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 md:hidden bottom-nav',
          getAccessibilityClasses(),
          prefersReducedTransparency && 'reduce-transparency'
        )}
        aria-label="Main navigation"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        {...getTabListProps()}
      >
        <div
          className={cn(
            'liquid-glass-nav backdrop-blur-md saturate-[180%] border-t border-white/20',
            prefersReducedTransparency && 'bg-black/95 backdrop-blur-none'
          )}
        >
          {/* Navigation Instructions for Screen Readers */}
          <div className="sr-only">
            Navigation menu with {navRoutes.length} items. Use arrow keys to
            navigate, Enter or Space to select.
          </div>

          <div className="flex items-center justify-around px-2 py-3 nav-items-container">
            {navRoutes.map((route, index) => {
              const IconComponent = route.icon;
              const isActive = location.pathname === route.path;
              const tabProps = getTabProps(route.id, isActive);
              const rawTouchProps = getTouchTargetProps();
              const {
                className: touchClassName,
                style: touchStyle,
                ...restTouchProps
              } = rawTouchProps;

              return (
                <button
                  key={route.id}
                  onClick={() => handleNavigation(route.path, route.label)}
                  className={cn(
                    'nav-item flex flex-col items-center justify-center space-y-1 py-2 px-3 rounded-xl transition-all interactive-enhanced',
                    'min-w-[56px] min-h-[56px] touch-manipulation',
                    'focus:outline-none focus-ring',
                    prefersReducedMotion ? 'transition-none' : 'duration-300',
                    isActive
                      ? 'liquid-glass-menu-item text-white bg-white/10 nav-item-active'
                      : 'text-white/70 hover:text-white hover:bg-white/5',
                    touchClassName
                  )}
                  aria-label={`${route.label} navigation tab${isActive ? ', currently selected' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-describedby={
                    route.badgeKey ? `${route.id}-badge` : undefined
                  }
                  {...tabProps}
                  {...restTouchProps}
                  style={{
                    ...touchStyle,
                    transform:
                      isActive && !prefersReducedMotion
                        ? 'scale(1.05)'
                        : 'scale(1)',
                  }}
                >
                  <IconComponent
                    className={cn(
                      'nav-item-icon w-5 h-5 transition-all',
                      prefersReducedMotion ? 'transition-none' : 'duration-300',
                      isActive && !prefersReducedMotion ? 'scale-110' : ''
                    )}
                    aria-hidden="true"
                  />
                  <span className="nav-item-label text-xs font-medium leading-tight">
                    {route.label}
                  </span>

                  {/* Accessible Badge indicator for notifications */}
                  {route.badgeKey && (
                    <span
                      id={`${route.id}-badge`}
                      className="nav-badge absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-black/20 flex items-center justify-center"
                      aria-label={`${route.label} has notifications`}
                      role="status"
                    >
                      <span className="sr-only">New notifications</span>
                      <span
                        className="w-2 h-2 bg-red-500 rounded-full"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Keyboard Navigation Hint */}
          <div className="sr-only" aria-live="polite">
            Press Alt+N to focus navigation menu
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
