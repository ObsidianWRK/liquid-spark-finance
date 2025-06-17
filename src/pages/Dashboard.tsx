import React from 'react';
import { Layout, PageHeader, ContentSection, Grid } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { AccountCard } from '@/components/ui/account-card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Download,
  Plus,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Placeholder data; replace with real data source
  const accounts = [
    { id: 1, name: 'Main Checking', type: 'Checking Account', balance: 12450.0, isActive: true },
    { id: 2, name: 'Emergency Fund', type: 'Savings Account', balance: 25780.5, isActive: false },
    { id: 3, name: 'Rewards Card', type: 'Credit Card', balance: -1245.3, isActive: false },
    { id: 4, name: 'Investment Portfolio', type: 'Investment Account', balance: 45600.25, isActive: false },
  ];

  const metrics = [
    {
      label: 'Total Balance',
      value: '$82,585.45',
      change: { value: 12.5, type: 'increase' as const },
      icon: <DollarSign className="h-5 w-5 text-brand-600" />,
    },
    {
      label: 'Monthly Spending',
      value: '$3,245.67',
      change: { value: 8.2, type: 'decrease' as const },
      icon: <CreditCard className="h-5 w-5 text-brand-600" />,
    },
    {
      label: 'Savings Rate',
      value: '23.5%',
      change: { value: 2.1, type: 'increase' as const },
      icon: <PieChart className="h-5 w-5 text-brand-600" />,
    },
    {
      label: 'Credit Score',
      value: '680',
      change: { value: 15, type: 'increase' as const },
      icon: <TrendingUp className="h-5 w-5 text-brand-600" />,
    },
  ];

  const recentTransactions = [
    { id: 1, merchant: 'Goodman Theatre', category: 'Entertainment', amount: -48.67, date: 'Today' },
    { id: 2, merchant: 'Whirlyball', category: 'Entertainment', amount: -42.88, date: 'Yesterday' },
    { id: 3, merchant: 'La Colombe Coffee', category: 'Food & Drinks', amount: -18.5, date: '2 days ago' },
    { id: 4, merchant: 'Salary Deposit', category: 'Income', amount: 3500.0, date: '3 days ago' },
    { id: 5, merchant: 'Game Room', category: 'Entertainment', amount: -45.71, date: '6 days ago' },
  ];

  return (
    <Layout>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your financial overview."
        actions={
          <>
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </>
        }
      />

      {/* Key Metrics */}
      <ContentSection>
        <Grid cols={4} className="md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </Grid>
      </ContentSection>

      {/* Accounts Overview */}
      <ContentSection title="Your Accounts">
        <Grid cols={2} className="md:grid-cols-2 lg:grid-cols-4">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              accountName={account.name}
              accountType={account.type}
              balance={account.balance}
              isActive={account.isActive}
              onClick={() => console.log('Navigate to account:', account.id)}
            />
          ))}
        </Grid>
      </ContentSection>

      {/* Recent Activity & Insights */}
      <Grid cols={2} className="md:grid-cols-1 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium text-primary">{transaction.merchant}</p>
                    <p className="text-sm text-secondary">
                      {transaction.category} • {transaction.date}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.amount > 0 ? 'text-success-600' : 'text-primary'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spending Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Spending Insights</CardTitle>
              <Button variant="ghost" size="sm">
                View Details
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-secondary">Entertainment</span>
                  <span className="text-sm font-medium">$375.45</span>
                </div>
                <div className="w-full bg-tertiary rounded-full h-2">
                  <div className="bg-brand-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-secondary">Food & Drinks</span>
                  <span className="text-sm font-medium">$289.30</span>
                </div>
                <div className="w-full bg-tertiary rounded-full h-2">
                  <div className="bg-brand-600 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-secondary">Shopping</span>
                  <span className="text-sm font-medium">$156.80</span>
                </div>
                <div className="w-full bg-tertiary rounded-full h-2">
                  <div className="bg-brand-600 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <div className="pt-4 border-t border-primary">
                <p className="text-sm text-secondary">
                  You've spent <span className="font-semibold text-primary">18% less</span> than last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Layout>
  );
};

export default Dashboard; 