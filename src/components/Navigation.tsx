import React, { useState } from 'react';
import LiquidGlassSVGFilters from '@/components/ui/LiquidGlassSVGFilters';
import { 
  Home, 
  CreditCard, 
  Receipt,
  TrendingUp,
  BarChart3,
  Award,
  User,
  Settings,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [showMore, setShowMore] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: TrendingUp }
  ];

  const moreTabs = [
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'wrapped', label: 'Wrapped', icon: Award },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleMoreClick = () => {
    setShowMore(!showMore);
  };

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
      "flex flex-col items-center justify-center space-y-1 py-3 px-3 sm:px-4 transition-all duration-500 min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] focus:outline-none focus:ring-2 focus:ring-blue-400/50 relative border-r border-white/5 last:border-r-0",
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
          <div className="fixed bottom-28 sm:bottom-32 left-4 right-4 max-w-md mx-auto">
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
                        "flex flex-col items-center justify-center space-y-2 py-4 px-3 rounded-lg transition-all duration-300 min-w-[64px] min-h-[64px] focus:outline-none focus:ring-2 focus:ring-blue-400/50",
                        isActive ? 
                          "liquid-glass-menu-item active text-white shadow-lg" : 
                          "liquid-glass-menu-item text-white/70 hover:text-white"
                      )}
                      aria-label={`Navigate to ${tab.label}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <IconComponent className="w-6 h-6" aria-hidden="true" />
                      <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS 26 Style Seamless Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="ios26-nav-container mx-4 mb-4">
          <nav aria-label="Main navigation" className="ios26-nav-bubble">
            <div className="flex items-center max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
              {/* Main Navigation Tabs - Seamless touching bubbles */}
              <div className="flex items-center flex-1">
                {mainTabs.map((tab, index) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={getTabStyles(isActive, index, mainTabs.length + 1)}
                      aria-label={`Navigate to ${tab.label}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                      <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
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
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium">More</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Floating Action Button - Enhanced with Glass Effects */}
      <button
        className="liquid-glass-fab fixed bottom-28 sm:bottom-32 right-4 sm:right-6 p-3 sm:p-4 z-40 min-w-[52px] min-h-[52px] sm:min-w-[56px] sm:min-h-[56px] flex items-center justify-center"
        aria-label="Add new transaction"
        onClick={() => {
          // Handle FAB action
          console.log('FAB clicked');
        }}
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
      </button>
    </>
  );
};

export default Navigation;
