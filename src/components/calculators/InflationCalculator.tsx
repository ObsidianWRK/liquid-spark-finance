import React, { useState } from 'react';
import { calculateInflationAdjustedValue } from '@/utils/calculators';

const InflationCalculator = () => {
  const [currentPrice, setCurrentPrice] = useState(100);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);
  const [futureValue, setFutureValue] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = calculateInflationAdjustedValue(currentPrice, inflationRate, years);
    setFutureValue(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">Inflation Calculator</h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Current Price ($)
          <input
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Annual Inflation Rate (%)
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Years
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
      </div>
      <button onClick={handleCalculate} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
        Calculate
      </button>
      {futureValue !== null && (
        <div className="text-white mt-4">
          Future Value: <span className="font-semibold">${futureValue}</span>
        </div>
      )}
    </div>
  );
};

export default InflationCalculator; 