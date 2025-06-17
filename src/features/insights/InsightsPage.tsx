import React from 'react';
import NewInsightsPage from './NewInsightsPage';
import { mockData } from '@/services/mockData';

const InsightsPage: React.FC = () => {
  return (
    <NewInsightsPage
      transactions={mockData.transactions}
      accounts={mockData.accounts}
    />
  );
};

export default InsightsPage; 