import React, { useState } from 'react';
import { calculateThreeFundPortfolioReturn } from '@/utils/calculators';

const ThreeFundPortfolioCalculator = () => {
  const [usReturn, setUsReturn] = useState(8);
  const [intlReturn, setIntlReturn] = useState(7);
  const [bondReturn, setBondReturn] = useState(3);
  const [years, setYears] = useState(20);
  const [totalGrowth, setTotalGrowth] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = calculateThreeFundPortfolioReturn(usReturn, intlReturn, bondReturn, years);
    setTotalGrowth(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">Bogleheads 3-Fund Portfolio Calculator</h1>
      <p className="text-white/70 text-sm">Assumes 40% US Stocks, 20% International, 40% Bonds.</p>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Avg US Stock Annual Return (%)
          <input type="number" value={usReturn} onChange={(e) => setUsReturn(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Avg International Stock Annual Return (%)
          <input type="number" value={intlReturn} onChange={(e) => setIntlReturn(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Avg Bond Annual Return (%)
          <input type="number" value={bondReturn} onChange={(e) => setBondReturn(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Years
          <input type="number" value={years} onChange={(e) => setYears(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
      </div>
              <button onClick={handleCalculate} className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold transition-all duration-200">
        Calculate
      </button>
      {totalGrowth !== null && (
        <div className="text-white mt-4">
          Portfolio growth over {years} years: <span className="font-semibold">{totalGrowth}%</span>
        </div>
      )}
    </div>
  );
};

export default ThreeFundPortfolioCalculator; 