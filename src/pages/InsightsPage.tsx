import React from 'react';
import BaseInsightsPage from '@/features/insights/components/BaseInsightsPage';
import { mockData } from '@/services/mockData';

const InsightsPage = () => {
  return (
    <BaseInsightsPage 
      transactions={mockData.transactions} 
      accounts={mockData.accounts} 
    />
  );
};

export default InsightsPage; 