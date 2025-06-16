import React, { useState } from 'react';
import { calculateFinancialFreedomYears } from '@/utils/calculators';

const FinancialFreedomCalculator = () => {
  const [savings, setSavings] = useState(100000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [growthRate, setGrowthRate] = useState(5);
  const [years, setYears] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = calculateFinancialFreedomYears(savings, monthlyExpenses, growthRate / 100);
    setYears(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">Financial Freedom Calculator</h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Current Savings ($)
          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Monthly Expenses ($)
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Expected Annual Growth Rate (%)
          <input
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
      </div>
      <button
        onClick={handleCalculate}
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
      >
        Calculate
      </button>
      {years !== null && (
        <div className="text-white mt-4">
          Your savings will last approximately <span className="font-semibold">{years}</span> years.
        </div>
      )}
    </div>
  );
};

export default FinancialFreedomCalculator; 