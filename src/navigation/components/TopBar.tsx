import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  Bell,
  User,
  Settings,
  Menu,
  Plus
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import LiquidGlassSVGFilters from '@/shared/ui/LiquidGlassSVGFilters';
import { MENU_BAR_HEIGHT } from '@/shared/tokens/menuBar.tokens';
import { useNavigationState } from '@/navigation/context/ScrollControllerContext';

/**
 * TopBar Component
 * Desktop top bar (≥1024px) - hosts search, profile, quick actions
 * Features: Search bar, notifications, profile access, quick actions
 * Now with fallback rendering to ensure visibility
 */
const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get navigation state with fallback values
  const rawNavigationState = useNavigationState();
  const navigationState = {
    shouldAnimate: rawNavigationState?.shouldAnimate ?? false,
    safeAreaTop: rawNavigationState?.safeAreaTop ?? 0,
    transform: rawNavigationState?.transform ?? 'translateY(0)',
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Search:', searchQuery);
    }
  };

  const handleNotifications = () => {
    // Handle notifications
    console.log('Open notifications');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleQuickAdd = () => {
    navigate('/transactions?new=true');
  };

  return (
    <>
      <LiquidGlassSVGFilters />
      
      {/* Desktop Top Bar - Dark Mode Only */}
      <header 
        className={cn(
          "flex fixed top-0 left-0 right-0 z-60 items-center",
          "hidden lg:flex",
          navigationState.shouldAnimate && "transition-transform duration-300 ease-out"
        )}
        style={{
          height: `${MENU_BAR_HEIGHT.landscape}px`,
          paddingTop: `${navigationState.safeAreaTop || 0}px`,
          transform: navigationState.transform || 'translateY(0)',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(20px)',
        }}
        role="banner"
        aria-label="Top navigation bar"
      >
        <div className="liquid-glass-nav w-full backdrop-blur-md saturate-[180%] border-b border-white/20">
          <div className="flex items-center justify-between h-full px-6">
            
            {/* Search Section */}
            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search transactions, accounts, insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-6">
              
              {/* Quick Add Button */}
              <button
                onClick={handleQuickAdd}
                className="liquid-glass-button p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300"
                aria-label="Add new transaction"
                title="Add Transaction"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button
                onClick={handleNotifications}
                className="liquid-glass-button p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 relative"
                aria-label="View notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black/20" />
              </button>

              {/* Settings */}
              <button
                onClick={() => navigate('/settings')}
                className="liquid-glass-button p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300"
                aria-label="Open settings"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Profile */}
              <button
                onClick={handleProfile}
                className="liquid-glass-button p-2 rounded-xl text-white/80 hover:text-white transition-all duration-300"
                aria-label="View profile"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopBar; 