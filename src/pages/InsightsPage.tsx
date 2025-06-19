import React from 'react';
import NewInsightsPage from '@/features/insights/components/NewInsightsPage';
import { mockData } from '@/features/mockData';

const InsightsPage = () => {
  return (
    <NewInsightsPage 
      transactions={mockData.transactions} 
      accounts={mockData.accounts} 
    />
  );
};

export default InsightsPage; 