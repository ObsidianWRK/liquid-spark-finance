export interface Family {
  id: string;
  name: string;
  ownerId: string;
  settings: FamilySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilySettings {
  currency: string;
  timezone: string;
  fiscalYearStart: number; // Month (1-12)
  budgetPeriod: 'monthly' | 'weekly' | 'quarterly' | 'annually';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentStyle: 'passive' | 'active' | 'mixed';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  budgetAlerts: boolean;
  largeTransactions: boolean;
  billReminders: boolean;
  goalMilestones: boolean;
  investmentUpdates: boolean;
  securityAlerts: boolean;
  emailDigest: 'daily' | 'weekly' | 'monthly' | 'never';
}

export interface PrivacySettings {
  dataSharing: boolean;
  analyticsOptOut: boolean;
  thirdPartyIntegrations: boolean;
  marketingCommunications: boolean;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: MemberPermissions;
  joinedAt: Date;
  isActive: boolean;
}

export interface MemberPermissions {
  canViewAccounts: boolean;
  canLinkAccounts: boolean;
  canCreateBudgets: boolean;
  canSetGoals: boolean;
  canManageInvestments: boolean;
  canAccessReports: boolean;
  canModifySettings: boolean;
  canInviteMembers: boolean;
}

export interface FamilyInvitation {
  id: string;
  familyId: string;
  inviterId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  token: string;
  expiresAt: Date;
  isAccepted: boolean;
  createdAt: Date;
}

export interface FamilyStats {
  totalNetWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  debtToIncomeRatio: number;
  emergencyFundMonths: number;
  investmentAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    realEstate: number;
    crypto: number;
    other: number;
  };
}
