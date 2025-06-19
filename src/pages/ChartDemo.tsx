/**
 * Chart Demo Page - Test and demonstrate GraphBase component
 */

import React from 'react';
import GraphBaseDemo from '@/components/charts/GraphBase.demo';

const ChartDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GraphBaseDemo />
    </div>
  );
};

export default ChartDemoPage;