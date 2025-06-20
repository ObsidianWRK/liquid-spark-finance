import React from 'react';
import { useBreakpoint } from '@/shared/hooks/useBreakpoint';
import BottomNav from './BottomNav';
import NavRail from './NavRail';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * AdaptiveNavigation Component
 * Automatically selects the appropriate navigation variant based on viewport size:
 * - Mobile (<640px): BottomNav
 * - Tablet (640-1024px): NavRail
 * - Desktop (≥1024px): Sidebar + TopBar
 */
const AdaptiveNavigation: React.FC = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <>
      {/* Mobile Navigation */}
      {isMobile && <BottomNav />}
      
      {/* Tablet Navigation */}
      {isTablet && <NavRail />}
      
      {/* Desktop Navigation */}
      {isDesktop && (
        <>
          <Sidebar />
          <TopBar />
        </>
      )}
    </>
  );
};

export default AdaptiveNavigation; 