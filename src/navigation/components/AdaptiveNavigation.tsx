import React from 'react';
import { useBreakpoint } from '@/shared/hooks/useBreakpoint';
import BottomNav from './BottomNav';
import NavRail from './NavRail';

/**
 * AdaptiveNavigation Component
 * Automatically selects the appropriate navigation variant based on viewport size:
 * - Mobile (<640px): BottomNav
 * - Tablet (640-1024px): NavRail
 * - Desktop (≥1024px): BottomNav
 */
const AdaptiveNavigation: React.FC = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <div data-testid="adaptive-navigation">
      {/* Mobile Navigation */}
      {(isMobile || isDesktop) && <BottomNav />}

      {/* Tablet Navigation */}
      {isTablet && <NavRail />}
    </div>
  );
};

export default AdaptiveNavigation;
