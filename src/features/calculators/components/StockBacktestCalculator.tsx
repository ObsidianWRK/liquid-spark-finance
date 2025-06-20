import React, { useState } from 'react';
import { calculatePortfolioBacktest } from '@/shared/utils/calculators';

const StockBacktestCalculator = () => {
  const [initial, setInitial] = useState(10000);
  const [returns, setReturns] = useState<string>('10, -5, 12, 8, 6');
  const [finalValue, setFinalValue] = useState<number | null>(null);

  const handleCalculate = () => {
    const annualReturns = returns
      .split(',')
      .map((r) => parseFloat(r.trim()))
      .filter((n) => !isNaN(n));
    const result = calculatePortfolioBacktest(initial, annualReturns);
    setFinalValue(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">Stock Portfolio Backtest</h1>
      <p className="text-white/70 text-sm">Enter comma-separated annual returns (%) starting from the earliest year.</p>
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
          Annual Returns (%)
          <textarea
            value={returns}
            onChange={(e) => setReturns(e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
            rows={3}
          />
        </label>
      </div>
              <button onClick={handleCalculate} className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold transition-all duration-200">
        Calculate
      </button>
      {finalValue !== null && (
        <div className="text-white mt-4">
          Final Value: <span className="font-semibold">${finalValue}</span>
        </div>
      )}
    </div>
  );
};

export default StockBacktestCalculator; 