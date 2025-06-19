import React, { useState } from 'react';
import { calculateMaximumHomePrice } from '@/utils/calculators';

const HomeAffordabilityCalculator = () => {
  const [income, setIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [interestRate, setInterestRate] = useState(6);
  const [termYears, setTermYears] = useState(30);
  const [downPayment, setDownPayment] = useState(40000);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = calculateMaximumHomePrice(income, monthlyDebts, interestRate, termYears, downPayment);
    setMaxPrice(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">Home Affordability Calculator</h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Annual Household Income ($)
          <input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Total Monthly Debts ($)
          <input type="number" value={monthlyDebts} onChange={(e) => setMonthlyDebts(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Mortgage Interest Rate (%)
          <input type="number" value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Loan Term (years)
          <input type="number" value={termYears} onChange={(e) => setTermYears(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
        <label className="block text-sm text-white/80">
          Down Payment ($)
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} className="w-full p-2 rounded bg-white/5 text-white border border-white/10" />
        </label>
      </div>
              <button onClick={handleCalculate} className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold transition-all duration-200">
        Calculate
      </button>
      {maxPrice !== null && (
        <div className="text-white mt-4">
          You can afford a house up to: <span className="font-semibold">${maxPrice}</span>
        </div>
      )}
    </div>
  );
};

export default HomeAffordabilityCalculator; 