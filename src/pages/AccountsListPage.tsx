import React from 'react';
import type { AccountCardDTO } from "@/shared/types/accounts";
import { useNavigate } from 'react-router-dom';
import { CreditCard, ChevronRight, Building2, TrendingUp, Shield } from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Badge } from '@/shared/ui/badge';
import { formatCurrency } from '@/shared/utils/formatters';
import { fetchAccountCards, MOCK_ACCOUNTS } from "@/services/dataProvider";
import { BackButton } from '@/shared/components/ui/BackButton';
import { BankLinkingPanel } from '@/features/bank-linking/components/BankLinkingPanel';
// Financial selectors for proper financial calculations
import { selectTotalWealth, selectTotalAssets, selectTotalLiabilities } from '@/selectors/financialSelectors';

/**
 * AccountsListPage Component
 *
 * Displays a list of all user accounts. This serves as the parent page
 * for account detail navigation, allowing proper back navigation flow:
 * Dashboard → Accounts List → Account Detail
 */
const AccountsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = React.useState<AccountCardDTO[]>([]);
  React.useEffect(() => {
    fetchAccountCards().then(setAccounts);
  }, []);

  const netWorth = selectTotalWealth(MOCK_ACCOUNTS);
  const totalAssets = selectTotalAssets(MOCK_ACCOUNTS);
  const totalLiabilities = selectTotalLiabilities(MOCK_ACCOUNTS);
  const handleAccountClick = (accountId: string) => {
    navigate(`/accounts/${accountId}`);
  };

  const getAccountTypeColor = (category: string) => {
    switch (category) {
      case 'CHECKING':
        return 'bg-blue-500/20 text-blue-400';
      case 'SAVINGS':
        return 'bg-green-500/20 text-green-400';
      case 'CREDIT':
        return 'bg-purple-500/20 text-purple-400';
      case 'INVESTMENT':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <BackButton
            fallbackPath="/"
            variant="default"
            label="Back to Dashboard"
            className="mb-6"
          />

          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Your Accounts</h1>
          </div>
          <p className="text-white/60">
            Manage and view details for all your financial accounts
          </p>
        </div>

        {/* Account Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UniversalCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-white/60 text-sm">Total Accounts</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {accounts.length}
            </div>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white/60 text-sm">Net Worth</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(netWorth, { currency: 'USD' })}
            </div>
            <div className="text-white/40 text-xs mt-1">
              Assets - Liabilities
            </div>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              <span className="text-white/60 text-sm">Institutions</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {
                new Set(accounts.map((account) => account.institution.name))
                  .size
              }
            </div>
          </UniversalCard>
        </div>

        {/* Financial Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UniversalCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white/60 text-sm">Total Assets</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              {formatCurrency(totalAssets, { currency: 'USD' })}
            </div>
            <div className="text-white/40 text-xs mt-1">
              Checking, Savings, Investments
            </div>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-orange-400" />
              <span className="text-white/60 text-sm">Total Liabilities</span>
            </div>
            <div className="text-xl font-bold text-orange-400">
              {formatCurrency(totalLiabilities, { currency: 'USD' })}
            </div>
            <div className="text-white/40 text-xs mt-1">
              Credit Cards, Loans
            </div>
          </UniversalCard>
        </div>

        {/* Bank Linking Panel */}
        <BankLinkingPanel />

        {/* Accounts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            All Accounts
          </h2>

          {accounts
            .filter((account) => account.id)
            .map((account) => (
              <UniversalCard
                key={account.id}
                variant="glass"
                className="p-6 card-hover"
                interactive={true}
                onClick={() => handleAccountClick(account.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-400" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {account.accountName}
                        </h3>
                        <Badge
                          className={`text-xs ${getAccountTypeColor(account.category)}`}
                          variant="outline"
                        >
                          {account.category}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-sm">
                        {account.institution.name} ••••{account.last4}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(account.currentBalance, {
                          currency: account.currency,
                        })}
                      </div>
                      {account.availableBalance &&
                        account.availableBalance !== account.currentBalance && (
                          <div className="text-white/60 text-sm">
                            Available:{' '}
                            {formatCurrency(account.availableBalance, {
                              currency: account.currency,
                            })}
                          </div>
                        )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </div>
                </div>
              </UniversalCard>
            ))}
        </div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <UniversalCard variant="glass" className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Accounts Found
            </h3>
            <p className="text-white/60 mb-6">
              Connect your bank accounts to start tracking your finances
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors">
              Add Account
            </button>
          </UniversalCard>
        )}
      </div>
    </div>
  );
};

export default AccountsListPage;
