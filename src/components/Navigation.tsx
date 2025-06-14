
import React, { useState } from 'react';
import GlassCard from './GlassCard';
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

  const getTabStyles = (isActive: boolean) => cn(
    "flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-400",
    isActive ? 
      "bg-blue-500 text-white shadow-lg transform scale-105" : 
      "text-white/70 hover:text-white hover:bg-white/10"
  );

  return (
    <>
      {/* More Options Overlay */}
      {showMore && (
        <div 
          className="fixed inset-0 z-40 bg-black/50" 
          onClick={() => setShowMore(false)}
          aria-label="Close navigation menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setShowMore(false)}
        >
          <GlassCard className="fixed bottom-20 left-4 right-4 p-4 max-w-md mx-auto">
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
                    className={getTabStyles(isActive)}
                    aria-label={`Navigate to ${tab.label}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent className="w-6 h-6" aria-hidden="true" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Bottom Tab Navigation */}
      <GlassCard className="fixed bottom-0 left-0 right-0 p-4 rounded-none border-x-0 border-b-0 z-50">
        <nav aria-label="Main navigation">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {mainTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={getTabStyles(isActive)}
                  aria-label={`Navigate to ${tab.label}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
            <button
              onClick={handleMoreClick}
              className={getTabStyles(moreTabs.some(tab => tab.id === activeTab))}
              aria-label="More navigation options"
              aria-expanded={showMore}
              aria-haspopup="true"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </nav>
      </GlassCard>

      {/* Floating Action Button */}
      <GlassCard
        variant="elevated"
        shape="capsule"
        className="fixed bottom-20 right-6 p-4 glass-interactive z-40 min-w-[56px] min-h-[56px] flex items-center justify-center"
        interactive
        shimmer
        aria-label="Add new transaction"
        role="button"
      >
        <Plus className="w-6 h-6 text-white" aria-hidden="true" />
      </GlassCard>
    </>
  );
};

export default Navigation;
