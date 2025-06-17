export const routes = {
  home: '/',
  accounts: '/accounts',
  transactions: '/transactions',
  transactionsNew: '/transactions/new',
  insights: '/insights',
  reports: '/reports',
  profile: '/profile',
  settings: '/settings',
  creditScore: '/credit-score',
  savings: '/savings',
  budgetPlanner: '/budget-planner',
  goalSetting: '/goal-setting',
  investmentTracker: '/investment-tracker',
  calculators: '/calculators',
} as const;

export type RouteKey = keyof typeof routes;
export type RoutePath = typeof routes[RouteKey]; 