
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { 
  Bell, 
  User, 
  Settings,
  Plus
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Bell },
    { id: 'accounts', label: 'Accounts', icon: User },
    { id: 'transactions', label: 'Transactions', icon: Bell },
    { id: 'insights', label: 'Insights', icon: Bell },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  return (
    <>
      {/* Bottom Tab Navigation */}
      <GlassCard className="fixed bottom-0 left-0 right-0 p-4 rounded-none border-x-0 border-b-0 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.slice(0, 4).map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`glass-interactive flex flex-col items-center space-y-1 py-2 px-3 rounded-lg ${
                  isActive ? 'bg-blue-500/20 text-blue-400' : 'text-white/70'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => onTabChange('profile')}
            className={`glass-interactive flex flex-col items-center space-y-1 py-2 px-3 rounded-lg ${
              activeTab === 'profile' ? 'bg-blue-500/20 text-blue-400' : 'text-white/70'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </GlassCard>

      {/* Floating Action Button */}
      <GlassCard
        variant="elevated"
        shape="capsule"
        className="fixed bottom-20 right-6 p-4 glass-interactive z-40"
        interactive
        shimmer
      >
        <Plus className="w-6 h-6 text-white" />
      </GlassCard>
    </>
  );
};

export default Navigation;
