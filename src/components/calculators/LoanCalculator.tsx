import React, { useState } from 'react';
import { calculateLoanPayment } from '@/utils/calculators';
import GlassSlider from '@/components/ui/GlassSlider';

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
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/60">
            <span>Loan Amount (${principal.toLocaleString()})</span>
          </div>
          <GlassSlider value={principal} min={10000} max={1000000} step={1000} onChange={setPrincipal} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/60">
            <span>Interest Rate ({rate}%)</span>
          </div>
          <GlassSlider value={rate} min={0} max={15} step={0.1} onChange={setRate} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/60">
            <span>Term ({years} yrs)</span>
          </div>
          <GlassSlider value={years} min={1} max={40} step={1} onChange={setYears} />
        </div>
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