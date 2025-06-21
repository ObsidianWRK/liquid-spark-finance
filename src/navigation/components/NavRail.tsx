import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { allRoutes } from '@/navigation/routeConfig';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import { VueniLogo } from '@/shared/ui/VueniLogo';

/**
 * NavRail Component
 * Tablet navigation rail (640px-1024px)
 * Features: Left-edge rail, collapses to icons, expands on hover/long-press, badges
 */
const NavRail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  // Long press for touch devices
  const handleTouchStart = () => {
    const timer = setTimeout(() => setIsExpanded(true), 500);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <LiquidGlassSVGFilters />

      {/* Tablet Navigation Rail - Dark Mode Only */}
      <nav
        className="hidden md:flex lg:hidden fixed left-0 top-0 bottom-0 z-40 flex-col"
        role="navigation"
        aria-label="Navigation rail"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        <div
          className={cn(
            'liquid-glass-nav h-full backdrop-blur-md saturate-[180%] border-r border-white/20 transition-all duration-300 ease-out',
            isExpanded ? 'w-64' : 'w-20'
          )}
        >
          {/* Logo/Brand Section */}
          <div className="p-4 border-b border-white/10">
            <VueniLogo
              size={isExpanded ? 'lg' : 'md'}
              variant={isExpanded ? 'full' : 'icon-only'}
              onClick={() => navigate('/')}
              className="liquid-glass-button p-2 rounded-vueni-lg w-full justify-center"
            />
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-4 space-y-2 px-3">
            {allRoutes.map((route) => {
              const IconComponent = route.icon;
              const isActive = location.pathname === route.path;

              return (
                <button
                  key={route.id}
                  onClick={() => handleNavigation(route.path)}
                  className={cn(
                    'w-full flex items-center transition-all duration-300 rounded-vueni-lg',
                    'focus:outline-none focus:ring-2 focus:ring-blue-400/50',
                    isExpanded ? 'px-4 py-3 space-x-3' : 'p-3 justify-center',
                    isActive
                      ? 'liquid-glass-menu-item bg-white/10 text-white scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                  aria-label={`Navigate to ${route.label}`}
                  aria-current={isActive ? 'page' : undefined}
                  title={!isExpanded ? route.label : undefined}
                >
                  <div className="relative">
                    <IconComponent
                      className="w-6 h-6 flex-shrink-0"
                      aria-hidden="true"
                    />

                    {/* Badge indicator */}
                    {route.badgeKey && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-vueni-pill border border-black/20 text-xs" />
                    )}
                  </div>

                  {/* Label - shown when expanded */}
                  {isExpanded && (
                    <span className="font-medium truncate">{route.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Expansion Indicator */}
          <div className="p-4 border-t border-white/10">
            <div
              className={cn(
                'flex items-center justify-center text-white/40 text-xs transition-all duration-300',
                isExpanded ? 'opacity-100' : 'opacity-50'
              )}
            >
              {isExpanded ? '← Hover to collapse' : '→ Hover to expand'}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavRail;
