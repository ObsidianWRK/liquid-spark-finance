import React from 'react';
import BudgetPlannerPage from '@/features/budget/components/BudgetPlannerPage';
import { SharedBudgetsPanel } from '@/features/shared-budgets/components/SharedBudgetsPanel';

/**
 * Budget Planner Page
 * 
 * Wrapper component for the budget planning feature.
 * Provides budget creation, tracking, and management capabilities.
 * Includes shared budget/household collaboration features.
 */
const BudgetPlanner: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Shared Budgets / Household Collaboration */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <SharedBudgetsPanel />
      </div>
      
      {/* Core Budget Planning */}
      <BudgetPlannerPage />
    </div>
  );
};

export default BudgetPlanner;