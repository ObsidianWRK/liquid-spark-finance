import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Settings, 
  Plus, 
  Crown, 
  Shield, 
  Eye, 
  Mail,
  Check,
  X,
  Edit3
} from 'lucide-react';
import { Family, FamilyMember, FamilyInvitation } from '@/shared/types/family';
import { familyService } from '@/features/shared-budgets/api/familyService';
import { Switch } from '@/shared/ui/switch';
import { cn } from '@/shared/lib/utils';

interface FamilyManagementProps {
  familyId: string;
  currentUserId: string;
}

const FamilyManagement = ({ familyId, currentUserId }: FamilyManagementProps) => {
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'member' | 'admin'>('member');

  const loadFamilyData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await familyService.getFamilyData(familyId);
      setFamily(data.family);
      setMembers(data.members);
      setInvitations(data.invitations);
    } catch (error) {
      console.error('Failed to load family data:', error);
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  useEffect(() => {
    loadFamilyData();
  }, [loadFamilyData]);

  const getRoleIcon = (role: FamilyMember['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'member':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: FamilyMember['role']) => {
    switch (role) {
      case 'owner':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'admin':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'member':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'viewer':
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const currentMember = members.find(m => m.userId === currentUserId);
  const canManageFamily = currentMember?.role === 'owner' || currentMember?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-white/[0.05] rounded w-64"></div>
            <div className="h-32 bg-white/[0.02] rounded-xl border border-white/[0.08]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Family Not Found</h2>
          <p className="text-white/60">The requested family could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Family Header */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                {family.name}
              </h1>
              <p className="text-white/70 mt-2">
                {members.length} member{members.length !== 1 ? 's' : ''} • Created {family.createdAt.toLocaleDateString()}
              </p>
            </div>
            
            {canManageFamily && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="liquid-glass-button px-4 py-2 rounded-xl text-white/90 hover:text-white transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Invite Member
                </button>
                
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="liquid-glass-button p-2 rounded-xl text-white/90 hover:text-white transition-all"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Family Members */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            Family Members
          </h2>

          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-semibold text-lg">
                        {member.userId.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">
                          User {member.userId}
                        </h3>
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium",
                          getRoleColor(member.role)
                        )}>
                          {getRoleIcon(member.role)}
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </div>
                      </div>
                      <p className="text-white/60 text-sm mt-1">
                        Joined {member.joinedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {canManageFamily && member.role !== 'owner' && (
                    <button className="liquid-glass-button p-2 rounded-lg text-white/70 hover:text-white transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Member Permissions */}
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <h4 className="text-sm font-medium text-white/80 mb-3">Permissions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(member.permissions).map(([permission, granted]) => (
                      <div key={permission} className="flex items-center justify-between">
                        <span className="text-xs text-white/60 capitalize">
                          {permission.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          granted ? "bg-green-400" : "bg-gray-600"
                        )} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Mail className="w-6 h-6 text-orange-400" />
              Pending Invitations
            </h2>

            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{invitation.email}</p>
                    <p className="text-white/60 text-sm">
                      Invited as {invitation.role} • Expires {invitation.expiresAt.toLocaleDateString()}
                    </p>
                  </div>
                  
                  {canManageFamily && (
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Family Settings */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-400" />
            Family Settings
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-white mb-2">Currency</h3>
                <p className="text-white/60">{family.settings.currency}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Budget Period</h3>
                <p className="text-white/60 capitalize">{family.settings.budgetPeriod}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Risk Tolerance</h3>
                <p className="text-white/60 capitalize">{family.settings.riskTolerance}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Investment Style</h3>
                <p className="text-white/60 capitalize">{family.settings.investmentStyle}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.05]">
              <h3 className="font-medium text-white mb-4">Notification Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(family.settings.notifications).map(([key, value]) => (
                  key !== 'emailDigest' && (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-white/80 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Switch
                        checked={value as boolean}
                        disabled={!canManageFamily}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyManagement;