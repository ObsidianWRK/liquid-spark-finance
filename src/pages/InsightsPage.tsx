import React from 'react';
import BaseInsightsPage from '@/features/insights/components/BaseInsightsPage';
import { MOCK_DATA } from '@/services/dataProvider';
import { AgeOfMoneyCard } from '@/features/age-of-money/components/AgeOfMoneyCard';
import PageContainer from '@/shared/components/PageContainer';

const InsightsPage = () => {
  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      {/* Age of Money Metric */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <AgeOfMoneyCard />
      </div>
      
      {/* Base Insights */}
      <BaseInsightsPage
        transactions={MOCK_DATA.transactions}
        accounts={MOCK_DATA.accounts}
      />
    </PageContainer>
  );
};

export default InsightsPage;
