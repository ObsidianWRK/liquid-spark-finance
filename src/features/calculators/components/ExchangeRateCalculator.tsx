import React, { useState } from 'react';
import { convertCurrency } from '@/shared/utils/calculators';

const ExchangeRateCalculator = () => {
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(1.1);
  const [converted, setConverted] = useState<number | null>(null);

  const handleCalculate = () => {
    const result = convertCurrency(amount, rate);
    setConverted(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-white">Exchange Rate Calculator</h1>
      <div className="space-y-2">
        <label className="block text-sm text-white/80">
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
        <label className="block text-sm text-white/80">
          Exchange Rate
          <input
            type="number"
            step="0.0001"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full p-2 rounded bg-white/5 text-white border border-white/10"
          />
        </label>
      </div>
      <button
        onClick={handleCalculate}
        className="w-full py-3 px-6 rounded-xl bg-white/10 border border-white/20 text-white font-semibold button-hover"
      >
        Convert
      </button>
      {converted !== null && (
        <div className="text-white mt-4">
          Converted Amount: <span className="font-semibold">{converted}</span>
        </div>
      )}
    </div>
  );
};

export default ExchangeRateCalculator;
