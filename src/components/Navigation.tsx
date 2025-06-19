import React, { useState } from 'react';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import { 
  Home, 
  CreditCard, 
  Receipt,
  TrendingUp,
  BarChart3,
  Award,
  User,
  Settings,
  Plus,
  Shield,
  Target
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = React.memo<NavigationProps>(({ activeTab, onTabChange }) => {
  const [showMore, setShowMore] = useState(false);

  // Memoized tab configurations to prevent recreation on every render
  const mainTabs = React.useMemo(() => [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ], []);

  const moreTabs = React.useMemo(() => [
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'investments', label: 'Investments', icon: Award },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'planning', label: 'Planning', icon: Target },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ], []);

  // Optimized event handlers with useCallback
  const handleMoreClick = React.useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);

  const handleTabClick = React.useCallback((tabId: string) => {
    onTabChange(tabId);
    setShowMore(false); // Close more menu when tab is selected
  }, [onTabChange]);

  const getTabStyles = (isActive: boolean, index: number, total: number) => {
    let borderRadius = '';
    
    // Create seamless borders - only round outer edges
    if (index === 0) {
      borderRadius = 'rounded-l-3xl';
    } else if (index === total - 1) {
      borderRadius = 'rounded-r-3xl';
    } else {
      borderRadius = 'rounded-none';
    }

    return cn(
      // Base responsive sizing with proper touch targets
      "flex flex-col items-center justify-center space-y-1 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 relative border-r border-white/5 last:border-r-0",
      // Mobile: Compact size
      "py-3 px-3 min-w-[56px] min-h-[56px]",
      // Tablet: Medium size  
      "md:py-4 md:px-4 md:min-w-[64px] md:min-h-[64px]",
      // Desktop: Larger, more accessible size
      "lg:py-5 lg:px-6 lg:min-w-[80px] lg:min-h-[80px]",
      // Large Desktop: Maximum comfortable size
      "xl:py-6 xl:px-8 xl:min-w-[96px] xl:min-h-[96px]",
      borderRadius,
      isActive ? 
        "ios26-nav-item-active text-white transform scale-105 z-10" : 
        "ios26-nav-item text-white/70 hover:text-white hover:scale-102"
    );
  };

  return (
    <>
      {/* SVG Filters for Glass Effects */}
      <LiquidGlassSVGFilters />

      {/* More Options Overlay */}
      {showMore && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
          onClick={() => setShowMore(false)}
          aria-label="Close navigation menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setShowMore(false)}
        >
          <div className="fixed bottom-navigation-spacing left-4 right-4 max-w-md mx-auto">
            <div className="liquid-glass-card p-6">
              <div className="grid grid-cols-3 gap-4">
                {moreTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        setShowMore(false);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center space-y-2 py-4 px-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50",
                        // Responsive sizing for more buttons
                        "min-w-[64px] min-h-[64px]",
                        "lg:min-w-[80px] lg:min-h-[80px] lg:py-6 lg:px-4",
                        isActive ? 
                          "liquid-glass-menu-item active text-white shadow-lg" : 
                          "liquid-glass-menu-item text-white/70 hover:text-white"
                      )}
                      aria-label={`Navigate to ${tab.label}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <IconComponent className="nav-icon" aria-hidden="true" />
                      <span className="nav-text font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS 26 Style Seamless Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        <div className="bottom-navigation">
          <nav aria-label="Main navigation" className="ios26-nav-bubble">
            <div className="flex items-center justify-around w-full">
              {/* Main Navigation Tabs - Seamless touching bubbles */}
              <div className="flex items-center justify-around flex-1">
                {mainTabs.map((tab, index) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={getTabStyles(isActive, index, mainTabs.length + 1)}
                      aria-label={`Navigate to ${tab.label}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <IconComponent className="nav-icon" aria-hidden="true" />
                      <span className="nav-text font-medium">{tab.label}</span>
                    </button>
                  );
                })}
                
                {/* More Button - Part of seamless design */}
                <button
                  onClick={handleMoreClick}
                  className={getTabStyles(
                    moreTabs.some(tab => tab.id === activeTab),
                    mainTabs.length,
                    mainTabs.length + 1
                  )}
                  aria-label="More navigation options"
                  aria-expanded={showMore}
                  aria-haspopup="true"
                >
                  <Settings className="nav-icon" aria-hidden="true" />
                  <span className="nav-text font-medium">More</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Floating Action Button - Enhanced with Glass Effects */}
      <button
        className={cn(
          "liquid-glass-fab fixed right-4 z-40 flex items-center justify-center",
          // Responsive positioning and sizing
          "bottom-fab-mobile",
          "sm:bottom-fab-tablet sm:right-6",
          "lg:bottom-fab-desktop lg:right-8",
          "xl:bottom-fab-large-desktop xl:right-12",
          // Responsive FAB sizing
          "p-3 min-w-[52px] min-h-[52px]",
          "sm:p-4 sm:min-w-[56px] sm:min-h-[56px]",
          "lg:p-5 lg:min-w-[64px] lg:min-h-[64px]",
          "xl:p-6 xl:min-w-[72px] xl:min-h-[72px]"
        )}
        aria-label="Add new transaction"
        onClick={() => {
          // Handle FAB action
          // FAB action handler
        }}
      >
        <Plus className="nav-icon text-white" aria-hidden="true" />
      </button>
    </>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
