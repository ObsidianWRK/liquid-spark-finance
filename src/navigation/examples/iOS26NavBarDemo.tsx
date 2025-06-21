import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import iOS26NavBar from '../components/iOS26NavBar';
import {
  Home,
  Search,
  CreditCard,
  TrendingUp,
  User,
  Plus,
  Bell,
  Settings,
  Shield,
} from 'lucide-react';

/**
 * Demo page component
 */
const DemoPage: React.FC<{ title: string; color: string }> = ({
  title,
  color,
}) => (
  <div
    className="min-h-screen flex items-center justify-center p-8"
    style={{ backgroundColor: color }}
  >
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      <p className="text-white/70">Scroll down to see navigation hide</p>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="bg-white/10 p-4 rounded-vueni-lg text-white">
            Content block {i + 1}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Navigation wrapper component
 */
const NavigationDemo: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);

  // Define navigation tabs
  const navigationTabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => navigate('/'),
      ariaLabel: 'Navigate to home',
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      action: () => navigate('/search'),
      ariaLabel: 'Search',
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: CreditCard,
      action: () => navigate('/accounts'),
      badgeCount: 2,
      ariaLabel: 'View accounts',
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: TrendingUp,
      action: () => navigate('/insights'),
      badgeCount: notifications,
      ariaLabel: `View insights (${notifications} new)`,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      action: () => navigate('/profile'),
      ariaLabel: 'View profile',
    },
    // Additional tabs that will be hidden on mobile
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      action: () => navigate('/security'),
      hideOnMobile: true,
      ariaLabel: 'Security settings',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: () => navigate('/settings'),
      hideOnMobile: true,
      ariaLabel: 'Application settings',
    },
  ];

  // Floating action button
  const fabConfig = {
    icon: Plus,
    action: () => {
      alert('FAB clicked! This could open a modal, start a flow, etc.');
    },
    ariaLabel: 'Create new item',
    variant: 'primary' as const,
  };

  // Notification FAB variant
  const notificationFab = {
    icon: Bell,
    action: () => {
      setNotifications(0);
      alert('Viewing notifications...');
    },
    ariaLabel: 'View notifications',
    variant: 'secondary' as const,
  };

  return (
    <>
      {/* iOS 26-style Navigation Bar */}
      <iOS26NavBar
        tabs={navigationTabs}
        fab={notifications > 0 ? notificationFab : fabConfig}
        enableScrollHide={true}
        position="bottom"
        showLabels={true}
        maxTabs={5}
        enableSideRail={true}
        onActiveTabChange={(tabId: string) => {
          console.log('Active tab changed to:', tabId);
        }}
      />

      {/* Main content area */}
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<DemoPage title="Home" color="#1a1a2e" />} />
          <Route
            path="/search"
            element={<DemoPage title="Search" color="#16213e" />}
          />
          <Route
            path="/accounts"
            element={<DemoPage title="Accounts" color="#0f3460" />}
          />
          <Route
            path="/insights"
            element={<DemoPage title="Insights" color="#533483" />}
          />
          <Route
            path="/profile"
            element={<DemoPage title="Profile" color="#c1f1c" />}
          />
          <Route
            path="/security"
            element={<DemoPage title="Security" color="#1b262c" />}
          />
          <Route
            path="/settings"
            element={<DemoPage title="Settings" color="#2d3436" />}
          />
        </Routes>
      </main>
    </>
  );
};

/**
 * Main demo app component
 */
const iOS26NavBarDemo: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        {/* Import navigation styles */}
        <style>{`@import url('/src/app/styles/nav-styles.css');`}</style>

        <NavigationDemo />
      </div>
    </BrowserRouter>
  );
};

/**
 * Configuration examples
 */
export const iOS26NavBarExamples = {
  // Basic usage
  basic: () => (
    <iOS26NavBar
      tabs={[
        { id: 'home', label: 'Home', icon: Home, action: () => {} },
        { id: 'search', label: 'Search', icon: Search, action: () => {} },
      ]}
    />
  ),

  // With FAB
  withFab: () => (
    <iOS26NavBar
      tabs={[{ id: 'home', label: 'Home', icon: Home, action: () => {} }]}
      fab={{
        icon: Plus,
        action: () => console.log('FAB clicked'),
        variant: 'primary',
      }}
    />
  ),

  // No labels
  noLabels: () => (
    <iOS26NavBar
      tabs={[{ id: 'home', label: 'Home', icon: Home, action: () => {} }]}
      showLabels={false}
    />
  ),

  // Top position
  topPosition: () => (
    <iOS26NavBar
      tabs={[{ id: 'home', label: 'Home', icon: Home, action: () => {} }]}
      position="top"
    />
  ),

  // Disabled scroll hide
  noScrollHide: () => (
    <iOS26NavBar
      tabs={[{ id: 'home', label: 'Home', icon: Home, action: () => {} }]}
      enableScrollHide={false}
    />
  ),
};

export default iOS26NavBarDemo;
