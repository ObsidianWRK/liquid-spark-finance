import React from 'react';
import SavingsGoals from '@/features/savings/components/SavingsGoals';
import { SmartSavingsPanel } from '@/features/smart-savings/components/SmartSavingsPanel';

/**
 * Savings Goals Page
 * 
 * Wrapper component for the savings goals feature.
 * Provides goal creation, tracking, and progress monitoring.
 * Includes smart automated savings plans.
 */
const SavingsGoalsPage: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Smart Automated Savings Plans */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <SmartSavingsPanel />
      </div>
      
      {/* Core Savings Goals */}
      <SavingsGoals />
    </div>
  );
};

export default SavingsGoalsPage;