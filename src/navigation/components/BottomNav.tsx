import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { mainRoutes } from '@/navigation/routeConfig';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';

/**
 * BottomNav Component
 * Mobile-first bottom navigation (<640px)
 * Features: Glass-blur backdrop, safe-area insets, max 5 items, icons + labels
 */
const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Filter routes for bottom nav (max 5 items)
  const navRoutes = mainRoutes.filter(route => !route.hideInBottomNav).slice(0, 5);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <LiquidGlassSVGFilters />
      
      {/* Mobile Bottom Navigation - Dark Mode Only */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
        role="navigation"
        aria-label="Bottom navigation"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="liquid-glass-nav backdrop-blur-md saturate-[180%] border-t border-white/20">
          <div className="flex items-center justify-around px-2 py-3">
            {navRoutes.map((route) => {
              const IconComponent = route.icon;
              const isActive = location.pathname === route.path;
              
              return (
                <button
                  key={route.id}
                  onClick={() => handleNavigation(route.path)}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300",
                    "min-w-[56px] min-h-[56px] touch-manipulation",
                    "focus:outline-none focus:ring-2 focus:ring-blue-400/50",
                    isActive 
                      ? "liquid-glass-menu-item text-white bg-white/10 scale-105" 
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                  aria-label={`Navigate to ${route.label}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent 
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive ? "scale-110" : ""
                    )} 
                    aria-hidden="true" 
                  />
                  <span className="text-xs font-medium leading-tight">
                    {route.label}
                  </span>
                  
                  {/* Badge indicator for notifications if needed */}
                  {route.badgeKey && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-black/20" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav; 