import React, { useState } from 'react';
import { calculateMortgagePayoffSavings } from '@/shared/utils/calculators';

const MortgagePayoffCalculator = () => {
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(4);
  const [years, setYears] = useState(30);
  const [extraPayment, setExtraPayment] = useState(300);
  const [result, setResult] = useState<ReturnType<
    typeof calculateMortgagePayoffSavings
  > | null>(null);

  const handleCalculate = () => {
    const res = calculateMortgagePayoffSavings(
      principal,
      rate,
      years,
      extraPayment
    );
    setResult(res);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">
        Early Mortgage Payoff Calculator
      </h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Mortgage Balance ($)
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Interest Rate (%)
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Original Term (years)
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Extra Monthly Payment ($)
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
      </div>
      <button
        onClick={handleCalculate}
        className="w-full py-3 px-6 rounded-vueni-lg bg-white/10 border border-white/20 text-white font-semibold button-hover"
      >
        Calculate
      </button>
      {result && (
        <div className="text-white mt-4 space-y-1">
          <p>
            Original Payoff Time:{' '}
            <span className="font-semibold">{result.originalYears} years</span>
          </p>
          <p>
            New Payoff Time:{' '}
            <span className="font-semibold">{result.newYears} years</span>
          </p>
          <p>
            Interest Saved:{' '}
            <span className="font-semibold">${result.interestSaved}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MortgagePayoffCalculator;
