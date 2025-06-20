// src/navigation/routeConfig.ts
// Canonical Vueni route definitions used across all navigation variants (bottom-nav, nav-rail, sidebar, top-bar).
// NOTE: The icon references come from lucide-react to avoid duplicating bundles and to keep tree-shaking effective.
// Any route-specific badges can be supplied at runtime via the optional `badgeKey` which maps to a count in shared app state.

import {
  Home,
  CreditCard,
  Receipt,
  TrendingUp,
  BarChart3,
  User,
  Settings,
} from 'lucide-react';

export type Route = {
  /** Unique identifier used for active state matching */
  id: string;
  /** Human-readable label shown inside navigation UI */
  label: string;
  /** React-router path */
  path: string;
  /** Lucide icon component reference */
  icon: React.ComponentType<{ className?: string }>;
  /** Optional key used to look up badge counts in application state */
  badgeKey?: string;
  /** Whether this route should be hidden from bottom navigation (e.g. settings) */
  hideInBottomNav?: boolean;
};

// MAIN APPLICATION ROUTES (order defines render order in navigation UIs)
export const mainRoutes: Route[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: Home,
  },
  {
    id: 'accounts',
    label: 'Accounts',
    path: '/accounts',
    icon: CreditCard,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
    icon: Receipt,
  },
  {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    icon: TrendingUp,
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
    hideInBottomNav: true, // limit bottom nav to 5 items
  },
];

export const secondaryRoutes: Route[] = [
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: User,
    hideInBottomNav: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    hideInBottomNav: true,
  },
];

export const allRoutes: Route[] = [...mainRoutes, ...secondaryRoutes];
