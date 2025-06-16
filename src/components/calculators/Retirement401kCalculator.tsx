import React, { useState } from 'react';
import { calculate401kBalance } from '@/utils/calculators';

const Retirement401kCalculator = () => {
  const [balance, setBalance] = useState(50000);
  const [contribution, setContribution] = useState(19000);
  const [matchRate, setMatchRate] = useState(0.5);
  const [returnRate, setReturnRate] = useState(7);
  const [years, setYears] = useState(25);
  const [futureBalance, setFutureBalance] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = calculate401kBalance(balance, contribution, matchRate, returnRate, years);
    setFutureBalance(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">401k Retirement Calculator</h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Current Balance ($)
          <input type="number" value={balance} onChange={(e) => setBalance(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Annual Contribution ($)
          <input type="number" value={contribution} onChange={(e) => setContribution(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Employer Match Rate (decimal)
          <input type="number" step="0.01" value={matchRate} onChange={(e) => setMatchRate(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Expected Annual Return Rate (%)
          <input type="number" value={returnRate} onChange={(e) => setReturnRate(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Years Until Retirement
          <input type="number" value={years} onChange={(e) => setYears(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
      </div>
      <button onClick={handleCalculate} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
        Calculate
      </button>
      {futureBalance !== null && (
        <div className="text-white mt-4">
          Projected Balance: <span className="font-semibold">${futureBalance}</span>
        </div>
      )}
    </div>
  );
};

export default Retirement401kCalculator; 