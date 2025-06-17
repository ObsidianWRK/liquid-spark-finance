import React from 'react';
import NewInsightsPage from '@/components/insights/NewInsightsPage';
import { mockData } from '@/services/mockData';

const InsightsPage = () => {
  return (
    <NewInsightsPage 
      transactions={mockData.transactions} 
      accounts={mockData.accounts} 
    />
  );
};

export default InsightsPage; 