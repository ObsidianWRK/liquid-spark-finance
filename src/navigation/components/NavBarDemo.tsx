import React, { useState } from 'react';
import {
  Home,
  CreditCard,
  Receipt,
  TrendingUp,
  BarChart3,
  User,
  Settings,
  Plus,
  Bell,
  MessageCircle,
} from 'lucide-react';
import NavBar, { type Tab } from './NavBar';

/**
 * NavBarDemo Component
 *
 * Demonstrates various NavBar configurations and use cases:
 * - Basic navigation with route-based tabs
 * - Floating Action Button integration
 * - Badge notifications
 * - Scroll controller behavior
 * - Different positions (top/bottom)
 * - Responsive behavior
 * - Custom styling
 */
const NavBarDemo: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState('home');
  const [notificationCount, setNotificationCount] = useState(3);

  // Sample tabs with various configurations
  const mainTabs: Tab[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => {
        setActiveTabId('home');
      },
      isActive: activeTabId === 'home',
      ariaLabel: 'Go to home dashboard',
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: CreditCard,
      action: () => {
        setActiveTabId('accounts');
      },
      isActive: activeTabId === 'accounts',
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: Receipt,
      action: () => {
        setActiveTabId('transactions');
      },
      isActive: activeTabId === 'transactions',
      badgeCount: notificationCount,
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: TrendingUp,
      action: () => {
        console.log('Navigate to Insights');
        setActiveTabId('insights');
      },
      isActive: activeTabId === 'insights',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      action: () => {
        console.log('Navigate to Reports');
        setActiveTabId('reports');
      },
      isActive: activeTabId === 'reports',
      hideOnMobile: true, // Hidden on mobile to respect maxTabs limit
    },
  ];

  // Secondary tabs for alternative demo
  const secondaryTabs: Tab[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      action: () => {
        console.log('Navigate to Profile');
        setActiveTabId('profile');
      },
      isActive: activeTabId === 'profile',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      action: () => {
        console.log('Navigate to Notifications');
        setActiveTabId('notifications');
      },
      isActive: activeTabId === 'notifications',
      badgeCount: 12,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      action: () => {
        console.log('Navigate to Messages');
        setActiveTabId('messages');
      },
      isActive: activeTabId === 'messages',
      badgeCount: 99,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: () => {
        console.log('Navigate to Settings');
        setActiveTabId('settings');
      },
      isActive: activeTabId === 'settings',
    },
  ];

  // FAB configuration
  const fabConfig = {
    icon: Plus,
    action: () => {
      console.log('FAB pressed - Add new item');
      // Simulate adding notification
      setNotificationCount((prev) => prev + 1);
    },
    ariaLabel: 'Add new transaction',
    variant: 'primary' as const,
  };

  const secondaryFabConfig = {
    icon: MessageCircle,
    action: () => {
      console.log('FAB pressed - New message');
    },
    ariaLabel: 'Compose new message',
    variant: 'secondary' as const,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Page content to demonstrate scroll behavior */}
      <div className="px-4 py-8 space-y-8">
        <div className="text-center text-white space-y-4">
          <h1 className="text-3xl font-bold">NavBar Component Demo</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Scroll down to see the navbar hide/reveal behavior. Try the
            different configurations below.
          </p>
        </div>

        {/* Demo Controls */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-vueni-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Demo Controls</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setNotificationCount((prev) => prev + 1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-vueni-lg transition-colors"
              >
                Add Notification ({notificationCount})
              </button>

              <button
                onClick={() => setNotificationCount(0)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-vueni-lg transition-colors"
              >
                Clear Notifications
              </button>
            </div>

            <div className="text-sm text-white/70">
              Current active tab:{' '}
              <span className="font-mono text-blue-300">{activeTabId}</span>
            </div>
          </div>

          {/* Feature Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-vueni-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-white">Key Features</h3>
              <ul className="text-white/70 space-y-2 text-sm">
                <li>✅ TypeScript interfaces for type safety</li>
                <li>✅ Scroll-based hide/reveal animation</li>
                <li>✅ CSS transforms for performance</li>
                <li>✅ Responsive design (mobile/tablet/desktop)</li>
                <li>✅ WCAG 2.1 accessibility compliance</li>
                <li>✅ Orientation change handling</li>
                <li>✅ Badge notifications</li>
                <li>✅ Floating Action Button support</li>
                <li>✅ Haptic feedback simulation</li>
                <li>✅ Liquid glass visual effects</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-vueni-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-white">
                Performance Optimizations
              </h3>
              <ul className="text-white/70 space-y-2 text-sm">
                <li>✅ Avoid unnecessary re-renders with useMemo</li>
                <li>✅ Debounced scroll event handling</li>
                <li>✅ CSS transforms instead of layout changes</li>
                <li>✅ Passive scroll listeners</li>
                <li>✅ Efficient breakpoint detection</li>
                <li>✅ Conditional rendering for mobile</li>
                <li>✅ Memory leak prevention</li>
                <li>✅ Event listener cleanup</li>
              </ul>
            </div>
          </div>

          {/* Scroll Content */}
          <div className="space-y-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-vueni-lg p-6 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-2">
                  Content Block {i + 1}
                </h3>
                <p className="text-white/70">
                  This is sample content to demonstrate the scroll behavior.
                  Keep scrolling to see the navbar hide and reveal based on
                  scroll direction. The navbar uses CSS transforms for smooth,
                  performant animations.
                </p>

                {i === 5 && (
                  <div className="mt-4 p-4 bg-blue-500/20 rounded-vueni-lg border border-blue-400/30">
                    <p className="text-blue-200 text-sm">
                      💡 <strong>Tip:</strong> The navbar will hide when
                      scrolling down and reveal when scrolling up, but it always
                      shows when you're near the top of the page.
                    </p>
                  </div>
                )}

                {i === 10 && (
                  <div className="mt-4 p-4 bg-green-500/20 rounded-vueni-lg border border-green-400/30">
                    <p className="text-green-200 text-sm">
                      🎯 <strong>Accessibility:</strong> All buttons have proper
                      ARIA labels, focus indicators, and meet WCAG touch target
                      size requirements (48px minimum).
                    </p>
                  </div>
                )}

                {i === 15 && (
                  <div className="mt-4 p-4 bg-purple-500/20 rounded-vueni-lg border border-purple-400/30">
                    <p className="text-purple-200 text-sm">
                      📱 <strong>Responsive:</strong> The component adapts to
                      different screen sizes and orientations, hiding certain
                      tabs on mobile and adjusting spacing in landscape mode.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NavBar Instances */}

      {/* Primary NavBar - Bottom position with scroll controller */}
      <NavBar
        tabs={mainTabs}
        fab={fabConfig}
        scrollController={true}
        position="bottom"
        showLabels={true}
        maxTabs={5}
        onActiveTabChange={(tabId) => {
          console.log(`Active tab changed to: ${tabId}`);
          setActiveTabId(tabId);
        }}
        className="z-50"
      />

      {/* Secondary NavBar - Top position (hidden by default, uncomment to test) */}
      {/* 
      <NavBar
        tabs={secondaryTabs}
        fab={secondaryFabConfig}
        scrollController={false}
        position="top"
        showLabels={true}
        maxTabs={4}
        onActiveTabChange={(tabId) => {
          console.log(`Top nav active tab: ${tabId}`);
        }}
        className="z-40"
      />
      */}
    </div>
  );
};

export default NavBarDemo;
