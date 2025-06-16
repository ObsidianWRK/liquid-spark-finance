import React, { useState } from 'react';
import { calculateROI } from '@/utils/calculators';

const ROICalculator = () => {
  const [initial, setInitial] = useState(1000);
  const [current, setCurrent] = useState(1200);
  const [roi, setRoi] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = calculateROI(initial, current);
    setRoi(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">ROI Calculator</h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Initial Investment ($)
          <input
            type="number"
            value={initial}
            onChange={(e) => setInitial(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Current Value ($)
          <input
            type="number"
            value={current}
            onChange={(e) => setCurrent(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
      </div>
      <button onClick={handleCalculate} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
        Calculate
      </button>
      {roi !== null && (
        <div className="text-white mt-4">
          ROI: <span className="font-semibold">{roi}%</span>
        </div>
      )}
    </div>
  );
};

export default ROICalculator; 