import React from 'react';
import BaseInsightsPage from '@/features/insights/components/BaseInsightsPage';
import { mockData } from '@/services/mockData';
import { AgeOfMoneyCard } from '@/features/age-of-money/components/AgeOfMoneyCard';

const InsightsPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Age of Money Metric */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <AgeOfMoneyCard />
      </div>
      
      {/* Base Insights */}
      <BaseInsightsPage
        transactions={mockData.transactions}
        accounts={mockData.accounts}
      />
    </div>
  );
};

export default InsightsPage;
