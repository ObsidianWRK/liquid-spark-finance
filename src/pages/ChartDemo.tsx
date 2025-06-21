/**
 * Chart Demo Page - Test and demonstrate GraphBase component
 */

import React from 'react';
import GraphBaseDemo from '@/shared/ui/charts/GraphBase.demo';
import { BackButton } from '@/shared/components/ui/BackButton';

const ChartDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 space-y-6">
      <BackButton
        fallbackPath="/"
        variant="default"
        label="Back to Dashboard"
        className="mb-4"
      />
      <GraphBaseDemo />
    </div>
  );
};

export default ChartDemoPage;
