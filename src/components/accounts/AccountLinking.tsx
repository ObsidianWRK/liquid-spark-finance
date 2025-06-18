import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Shield, 
  Zap, 
  Check,
  AlertCircle,
  CreditCard,
  Banknote,
  TrendingUp,
  Home,
  Car,
  GraduationCap
} from 'lucide-react';
import { Institution, Account } from '@/types/accounts';
import { accountService } from '@/services/accountService';
import { cn } from '@/lib/utils';

interface AccountLinkingProps {
  familyId: string;
  onAccountsLinked: (accounts: Account[]) => void;
  onClose: () => void;
}

const AccountLinking = ({ familyId, onAccountsLinked, onClose }: AccountLinkingProps) => {
  const [step, setStep] = useState<'search' | 'connect' | 'select' | 'success'>('search');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<Account[]>([]);

  useEffect(() => {
    loadInstitutions();
  }, [searchQuery]);

  const loadInstitutions = async () => {
    try {
      const data = await accountService.getSupportedInstitutions(searchQuery);
      setInstitutions(data);
    } catch (err) {
      setError('Failed to load institutions');
    }
  };

  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
    setStep('connect');
  };

  const handlePlaidSuccess = async (publicToken: string, accounts: any[]) => {
    if (!selectedInstitution) return;

    setLoading(true);
    try {
      const linkedAccounts = await accountService.linkAccountsViaPlaid({
        familyId,
        publicToken,
        institutionId: selectedInstitution.id,
        accounts: accounts.map(acc => ({
          id: acc.id,
          name: acc.name,
          type: acc.type,
          subtype: acc.subtype
        }))
      });

      setLinkedAccounts(linkedAccounts);
      setStep('success');
      onAccountsLinked(linkedAccounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link accounts');
    } finally {
      setLoading(false);
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'depository':
        return <Banknote className="w-5 h-5 text-green-400" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 text-orange-400" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'loan':
        return <Home className="w-5 h-5 text-purple-400" />;
      default:
        return <Building2 className="w-5 h-5 text-gray-400" />;
    }
  };

  if (step === 'search') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-black border border-white/[0.08] rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Link Your Accounts</h2>
                <p className="text-white/60 mt-1">
                  Connect to 10,000+ financial institutions securely
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-white/[0.08]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search for your bank or financial institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Institution List */}
          <div className="max-h-96 overflow-y-auto">
            {institutions.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">
                  {searchQuery ? 'No institutions found matching your search' : 'Start typing to search for institutions'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {institutions.map((institution) => (
                  <button
                    key={institution.id}
                    onClick={() => handleInstitutionSelect(institution)}
                    className="w-full p-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-xl transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/[0.06] rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-400" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {institution.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400">Bank-level security</span>
                            </div>
                            {institution.capabilities.realTimeUpdates && (
                              <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs text-yellow-400">Real-time updates</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {institution.capabilities.accounts && (
                          <div className="p-1 bg-green-500/20 rounded">
                            <Banknote className="w-3 h-3 text-green-400" />
                          </div>
                        )}
                        {institution.capabilities.investments && (
                          <div className="p-1 bg-blue-500/20 rounded">
                            <TrendingUp className="w-3 h-3 text-blue-400" />
                          </div>
                        )}
                        {institution.capabilities.liabilities && (
                          <div className="p-1 bg-orange-500/20 rounded">
                            <CreditCard className="w-3 h-3 text-orange-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual Account Option */}
          <div className="p-4 border-t border-white/[0.08]">
            <button
              onClick={() => {/* TODO: Open manual account creation */}}
              className="w-full p-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-xl transition-all text-left group border-dashed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/[0.06] rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-400" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    Add Account Manually
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    For institutions not supported by automatic linking
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'connect') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-black border border-white/[0.08] rounded-2xl max-w-md w-full mx-4">
          <div className="p-6 text-center">
            {loading ? (
              <>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Connecting to {selectedInstitution?.name}</h2>
                <p className="text-white/60">
                  Securely linking your accounts...
                </p>
              </>
            ) : error ? (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Connection Failed</h2>
                <p className="text-red-400 mb-4">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('search')}
                    className="flex-1 px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white hover:bg-white/[0.08] transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Connect to {selectedInstitution?.name}</h2>
                <p className="text-white/60 mb-6">
                  You'll be redirected to {selectedInstitution?.name} to securely authenticate your account.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>256-bit encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Read-only access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Never stored credentials</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('search')}
                    className="flex-1 px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white hover:bg-white/[0.08] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Initialize Plaid Link
                      // Mock successful connection for now
                      setTimeout(() => {
                        handlePlaidSuccess('mock_public_token', [
                          { id: 'acc1', name: 'Checking Account', type: 'depository', subtype: 'checking' },
                          { id: 'acc2', name: 'Savings Account', type: 'depository', subtype: 'savings' }
                        ]);
                      }, 2000);
                      setLoading(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-black border border-white/[0.08] rounded-2xl max-w-md w-full mx-4">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">Accounts Connected!</h2>
            <p className="text-white/60 mb-6">
              Successfully linked {linkedAccounts.length} account{linkedAccounts.length !== 1 ? 's' : ''} from {selectedInstitution?.name}
            </p>

            <div className="space-y-3 mb-6">
              {linkedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg"
                >
                  {getAccountTypeIcon(account.accountType)}
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">{account.name}</p>
                    <p className="text-white/60 text-sm capitalize">
                      {account.accountSubtype.replace('_', ' ')}
                    </p>
                  </div>
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AccountLinking;