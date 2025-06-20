import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  BarChart3,
  Plus 
} from 'lucide-react';
import NavBar, { type Tab } from './NavBar';
import { mainRoutes } from '../routeConfig';

/**
 * NavBarIntegrationExample
 * 
 * Demonstrates how to integrate the NavBar component with existing route configuration
 * and React Router for a real-world application.
 */
const NavBarIntegrationExample: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCounts, setNotificationCounts] = useState({
    transactions: 3,
    insights: 1,
  });

  // Convert existing route configuration to NavBar tabs
  const tabs: Tab[] = mainRoutes.map(route => ({
    id: route.id,
    label: route.label,
    icon: route.icon,
    action: () => navigate(route.path),
    isActive: location.pathname === route.path,
    badgeCount: notificationCounts[route.id as keyof typeof notificationCounts] || undefined,
    hideOnMobile: route.hideInBottomNav,
    ariaLabel: `Navigate to ${route.label} page`,
  }));

  // FAB configuration for quick actions
  const fabConfig = {
    icon: Plus,
    action: () => {
      // Navigate to a quick add form or open a modal
      navigate('/transactions/add');
    },
    ariaLabel: 'Add new transaction',
    variant: 'primary' as const,
  };

  const handleActiveTabChange = (tabId: string) => {
    
    // Clear notifications for the visited tab
    if (notificationCounts[tabId as keyof typeof notificationCounts]) {
      setNotificationCounts(prev => ({
        ...prev,
        [tabId]: 0,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Main app content */}
      <div className="px-4 py-8 pb-24"> {/* pb-24 to account for navbar height */}
        <h1 className="text-3xl font-bold text-white mb-6">
          NavBar Integration Example
        </h1>
        
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Current Route: {location.pathname}
            </h2>
            <p className="text-white/70">
              The NavBar automatically highlights the current route and provides
              navigation between different sections of your application.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Notification Badges
            </h2>
            <div className="space-y-2">
              <p className="text-white/70">
                Transactions: {notificationCounts.transactions} notifications
              </p>
              <p className="text-white/70">
                Insights: {notificationCounts.insights} notifications
              </p>
            </div>
            <button
              onClick={() => setNotificationCounts({
                transactions: Math.floor(Math.random() * 10),
                insights: Math.floor(Math.random() * 5),
              })}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Simulate New Notifications
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Integration Steps
            </h2>
            <ol className="text-white/70 space-y-2 list-decimal list-inside">
              <li>Import the NavBar component and types</li>
              <li>Map your existing routes to Tab objects</li>
              <li>Connect navigation actions to React Router</li>
              <li>Handle active state with useLocation hook</li>
              <li>Optionally add notification badges and FAB</li>
              <li>Configure scroll controller and responsive settings</li>
            </ol>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Key Features Demonstrated
            </h2>
            <ul className="text-white/70 space-y-2 list-disc list-inside">
              <li>Route-based active state management</li>
              <li>Dynamic notification badges</li>
              <li>Floating Action Button integration</li>
              <li>Responsive design (try resizing the window)</li>
              <li>Accessibility features (keyboard navigation, ARIA labels)</li>
              <li>Performance optimizations (debounced scroll events)</li>
              <li>Liquid glass visual effects</li>
            </ul>
          </div>

          {/* Demo content to enable scrolling */}
          {Array.from({ length: 10 }, (_, i) => (
            <div 
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <h3 className="text-white font-semibold mb-2">Demo Content {i + 1}</h3>
              <p className="text-white/70 text-sm">
                This is sample content to demonstrate the scroll behavior. 
                The navbar will hide when scrolling down and reveal when scrolling up.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Integrated NavBar */}
      <NavBar
        tabs={tabs}
        fab={fabConfig}
        scrollController={true}
        position="bottom"
        showLabels={true}
        maxTabs={5}
        onActiveTabChange={handleActiveTabChange}
        className="z-50"
      />
    </div>
  );
};

export default NavBarIntegrationExample;