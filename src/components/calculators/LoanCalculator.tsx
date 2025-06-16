import React, { useState } from 'react';
import { calculateLoanPayment } from '@/utils/calculators';

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(30);
  const [payment, setPayment] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = calculateLoanPayment(principal, rate, years);
    setPayment(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">Loan Calculator</h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Loan Amount ($)
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Annual Interest Rate (%)
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Loan Term (years)
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
      {payment !== null && (
        <div className="text-white mt-4">
          Monthly Payment: <span className="font-semibold">${payment}</span>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator; 