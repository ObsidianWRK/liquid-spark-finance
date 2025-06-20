import React, { useState } from 'react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import {
  Home,
  CreditCard,
  Receipt,
  TrendingUp,
  BarChart3,
  User,
  Settings,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AppShell = ({
  children,
  activeTab = 'dashboard',
  onTabChange,
}: AppShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const secondaryNavigation = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId);
    setIsSidebarOpen(false); // Close sidebar on mobile when selecting
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <UniversalCard
          variant="glass"
          className="m-4 p-4 rounded-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <h1 className="text-xl font-bold text-white">Vueni</h1>
              </div>
            </div>

            {/* Center - Search (hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search transactions, accounts..."
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] transition-colors relative">
                <Bell className="w-5 h-5 text-white/70" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </UniversalCard>
      </header>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-full w-64 pt-24 pb-4 pl-4 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
      >
        <UniversalCard variant="glass" className="h-full p-4 rounded-xl">
          {/* Main Navigation */}
          <nav className="space-y-2">
            <div className="mb-6">
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                Main
              </p>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                      ${
                        activeTab === item.id
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Secondary Navigation */}
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                Account
              </p>
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                      ${
                        activeTab === item.id
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Bottom Card */}
          <div className="mt-auto pt-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <h4 className="text-sm font-medium text-white mb-1">
                Get Vueni Pro
              </h4>
              <p className="text-xs text-white/60 mb-3">
                Unlock advanced insights and unlimited exports
              </p>
              <button className="w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </UniversalCard>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`
        pt-32 pb-6 px-4 transition-all duration-300
        lg:ml-64 lg:pl-4
      `}
      >
        <div className="max-w-none">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
