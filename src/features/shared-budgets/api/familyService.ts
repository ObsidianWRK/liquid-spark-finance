import { Family, FamilyMember, FamilyInvitation, FamilyStats, FamilySettings } from '@/types/family';
import { Account } from '@/types/accounts';
import { Transaction } from '@/types/transactions';

/**
 * Comprehensive Family Management Service
 * Handles multi-tenant family structure with role-based permissions
 */
export class FamilyService {
  private static instance: FamilyService;
  private families: Map<string, Family> = new Map();
  private members: Map<string, FamilyMember[]> = new Map();
  private invitations: Map<string, FamilyInvitation[]> = new Map();

  static getInstance(): FamilyService {
    if (!FamilyService.instance) {
      FamilyService.instance = new FamilyService();
    }
    return FamilyService.instance;
  }

  /**
   * Create new family with default settings
   */
  async createFamily(data: {
    name: string;
    ownerId: string;
    settings?: Partial<FamilySettings>;
  }): Promise<Family> {
    const family: Family = {
      id: this.generateId(),
      name: data.name,
      ownerId: data.ownerId,
      settings: {
        currency: 'USD',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        fiscalYearStart: 1,
        budgetPeriod: 'monthly',
        riskTolerance: 'moderate',
        investmentStyle: 'mixed',
        notifications: {
          budgetAlerts: true,
          largeTransactions: true,
          billReminders: true,
          goalMilestones: true,
          investmentUpdates: false,
          securityAlerts: true,
          emailDigest: 'weekly'
        },
        privacy: {
          dataSharing: false,
          analyticsOptOut: false,
          thirdPartyIntegrations: true,
          marketingCommunications: false
        },
        ...data.settings
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.families.set(family.id, family);

    // Create owner member record
    await this.addFamilyMember(family.id, data.ownerId, 'owner');

    return family;
  }

  /**
   * Add family member with role-based permissions
   */
  async addFamilyMember(
    familyId: string, 
    userId: string, 
    role: 'owner' | 'admin' | 'member' | 'viewer'
  ): Promise<FamilyMember> {
    const member: FamilyMember = {
      id: this.generateId(),
      familyId,
      userId,
      role,
      permissions: this.getDefaultPermissions(role),
      joinedAt: new Date(),
      isActive: true
    };

    const familyMembers = this.members.get(familyId) || [];
    familyMembers.push(member);
    this.members.set(familyId, familyMembers);

    return member;
  }

  /**
   * Generate family invitation with expiry
   */
  async createInvitation(data: {
    familyId: string;
    inviterId: string;
    email: string;
    role: 'admin' | 'member' | 'viewer';
  }): Promise<FamilyInvitation> {
    const invitation: FamilyInvitation = {
      id: this.generateId(),
      familyId: data.familyId,
      inviterId: data.inviterId,
      email: data.email,
      role: data.role,
      token: this.generateInvitationToken(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isAccepted: false,
      createdAt: new Date()
    };

    const familyInvitations = this.invitations.get(data.familyId) || [];
    familyInvitations.push(invitation);
    this.invitations.set(data.familyId, familyInvitations);

    // TODO: Send email invitation
    await this.sendInvitationEmail(invitation);

    return invitation;
  }

  /**
   * Calculate comprehensive family financial statistics
   */
  async calculateFamilyStats(familyId: string): Promise<FamilyStats> {
    // TODO: Integrate with account and transaction services
    const accounts = await this.getFamilyAccounts(familyId);
    const transactions = await this.getFamilyTransactions(familyId);

    const totalNetWorth = accounts.reduce((sum, account) => {
      if (account.accountType === 'credit') {
        return sum - Math.abs(account.balance); // Subtract debt
      }
      return sum + account.balance;
    }, 0);

    const monthlyIncome = this.calculateMonthlyIncome(transactions);
    const monthlyExpenses = this.calculateMonthlyExpenses(transactions);
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    const debtAccounts = accounts.filter(a => a.accountType === 'credit' || a.accountType === 'loan');
    const totalDebt = debtAccounts.reduce((sum, account) => sum + Math.abs(account.balance), 0);
    const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) * 100 : 0;

    const cashAccounts = accounts.filter(a => a.accountType === 'depository');
    const totalCash = cashAccounts.reduce((sum, account) => sum + account.balance, 0);
    const emergencyFundMonths = monthlyExpenses > 0 ? totalCash / monthlyExpenses : 0;

    const investmentAccounts = accounts.filter(a => a.accountType === 'investment');
    const totalInvestments = investmentAccounts.reduce((sum, account) => sum + account.balance, 0);

    return {
      totalNetWorth,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      debtToIncomeRatio,
      emergencyFundMonths,
      investmentAllocation: {
        stocks: 0.6 * totalInvestments, // TODO: Calculate actual allocation
        bonds: 0.3 * totalInvestments,
        cash: 0.05 * totalInvestments,
        realEstate: 0.05 * totalInvestments,
        crypto: 0,
        other: 0
      }
    };
  }

  /**
   * Update family settings with validation
   */
  async updateFamilySettings(
    familyId: string, 
    settings: Partial<FamilySettings>
  ): Promise<Family> {
    const family = this.families.get(familyId);
    if (!family) {
      throw new Error('Family not found');
    }

    family.settings = { ...family.settings, ...settings };
    family.updatedAt = new Date();

    this.families.set(familyId, family);
    return family;
  }

  /**
   * Get family by ID with member information
   */
  async getFamilyById(familyId: string): Promise<Family | null> {
    return this.families.get(familyId) || null;
  }

  /**
   * Get all family members with their permissions
   */
  async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    return this.members.get(familyId) || [];
  }

  /**
   * Update member permissions (admin/owner only)
   */
  async updateMemberPermissions(
    familyId: string,
    memberId: string,
    permissions: Partial<FamilyMember['permissions']>
  ): Promise<FamilyMember> {
    const familyMembers = this.members.get(familyId) || [];
    const memberIndex = familyMembers.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
      throw new Error('Member not found');
    }

    familyMembers[memberIndex].permissions = {
      ...familyMembers[memberIndex].permissions,
      ...permissions
    };

    this.members.set(familyId, familyMembers);
    return familyMembers[memberIndex];
  }

  // Private helper methods
  private getDefaultPermissions(role: FamilyMember['role']): FamilyMember['permissions'] {
    switch (role) {
      case 'owner':
        return {
          canViewAccounts: true,
          canLinkAccounts: true,
          canCreateBudgets: true,
          canSetGoals: true,
          canManageInvestments: true,
          canAccessReports: true,
          canModifySettings: true,
          canInviteMembers: true
        };
      case 'admin':
        return {
          canViewAccounts: true,
          canLinkAccounts: true,
          canCreateBudgets: true,
          canSetGoals: true,
          canManageInvestments: true,
          canAccessReports: true,
          canModifySettings: false,
          canInviteMembers: true
        };
      case 'member':
        return {
          canViewAccounts: true,
          canLinkAccounts: false,
          canCreateBudgets: true,
          canSetGoals: true,
          canManageInvestments: false,
          canAccessReports: true,
          canModifySettings: false,
          canInviteMembers: false
        };
      case 'viewer':
        return {
          canViewAccounts: true,
          canLinkAccounts: false,
          canCreateBudgets: false,
          canSetGoals: false,
          canManageInvestments: false,
          canAccessReports: true,
          canModifySettings: false,
          canInviteMembers: false
        };
    }
  }

  private generateId(): string {
    return `fam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateInvitationToken(): string {
    return Math.random().toString(36).substr(2, 32);
  }

  private async sendInvitationEmail(invitation: FamilyInvitation): Promise<void> {
    // TODO: Implement email service integration
    console.log(`Sending invitation email to ${invitation.email}`);
  }

  private async getFamilyAccounts(familyId: string): Promise<Account[]> {
    // TODO: Integrate with AccountService
    return [];
  }

  private async getFamilyTransactions(familyId: string): Promise<Transaction[]> {
    // TODO: Integrate with TransactionService
    return [];
  }

  private calculateMonthlyIncome(transactions: Transaction[]): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => t.date >= monthStart && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private calculateMonthlyExpenses(transactions: Transaction[]): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => t.date >= monthStart && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }
}

export const familyService = FamilyService.getInstance();