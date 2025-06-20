/**
 * Quick test to verify GraphBase component works
 */

import React from 'react';
import { GraphBase } from './index';

const testData = [
  { date: '2024-01-01', revenue: 1000, profit: 200 },
  { date: '2024-01-02', revenue: 1200, profit: 300 },
  { date: '2024-01-03', revenue: 800, profit: 100 },
  { date: '2024-01-04', revenue: 1500, profit: 400 },
];

export const GraphBaseQuickTest: React.FC = () => (
  <div className="p-4">
    <GraphBase
      data={testData}
      type="line"
      title="Quick Test Chart"
      dimensions={{ height: 200 }}
    />
  </div>
);

export default GraphBaseQuickTest;
