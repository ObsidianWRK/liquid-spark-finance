import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { mainRoutes, secondaryRoutes } from '@/navigation/routeConfig';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import { VueniLogo } from '@/shared/ui/VueniLogo';

/**
 * Sidebar Component
 * Desktop sidebar (≥1024px) - permanently visible
 * Features: Full navigation, grouped sections, persistent visibility
 */
const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const NavSection: React.FC<{
    title: string;
    routes: typeof mainRoutes;
  }> = ({ title, routes }) => (
    <div className="mb-8">
      <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3 px-4">
        {title}
      </h3>
      <div className="space-y-1 px-2">
        {routes.map((route) => {
          const IconComponent = route.icon;
          const isActive = location.pathname === route.path;
          
          return (
            <button
              key={route.id}
              onClick={() => handleNavigation(route.path)}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group",
                "focus:outline-none focus:ring-2 focus:ring-blue-400/50",
                isActive 
                  ? "liquid-glass-menu-item bg-white/10 text-white border border-white/20" 
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
              aria-label={`Navigate to ${route.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative mr-3">
                <IconComponent 
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "text-blue-400" : ""
                  )} 
                  aria-hidden="true" 
                />
                
                {/* Badge indicator */}
                {route.badgeKey && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black/20 text-xs" />
                )}
              </div>
              
              <span className="font-medium flex-1 text-left">
                {route.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="w-2 h-2 bg-blue-400 rounded-full ml-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <LiquidGlassSVGFilters />
      
      {/* Desktop Sidebar - Dark Mode Only */}
      <aside 
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 z-40 flex-col"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="liquid-glass-nav h-full backdrop-blur-md saturate-[180%] border-r border-white/20">
          {/* Logo/Brand Section */}
          <div className="p-6 border-b border-white/10">
            <VueniLogo
              size="xl"
              variant="full"
              onClick={() => navigate('/')}
              className="liquid-glass-button p-3 rounded-xl w-full justify-start"
            />
          </div>

          {/* Navigation Content */}
          <div className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            <NavSection title="Main" routes={mainRoutes} />
            <NavSection title="Account" routes={secondaryRoutes} />
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="text-xs text-white/40 text-center">
              Vueni Finance Platform
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 