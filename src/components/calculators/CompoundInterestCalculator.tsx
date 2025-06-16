import React, { useState } from 'react';
import { calculateCompoundInterest } from '@/utils/calculators';

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundFreq, setCompoundFreq] = useState(12);
  const [futureValue, setFutureValue] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = calculateCompoundInterest(principal, rate, years, compoundFreq);
    setFutureValue(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">Compound Interest Calculator</h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Principal ($)
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Annual Rate (%)
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
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
        <label className="block text-sm text-white/80">
          Compounds Per Year
          <input
            type="number"
            value={compoundFreq}
            onChange={(e) => setCompoundFreq(+e.target.value)}
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

export default CompoundInterestCalculator; 