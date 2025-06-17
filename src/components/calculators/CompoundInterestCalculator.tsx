import React, { useState, useMemo, useCallback } from 'react';
import { calculateCompoundInterest } from '@/utils/calculators';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SecureCalculatorWrapper, useSecureCalculator } from './SecureCalculatorWrapper';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface CompoundData {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

interface SecureCalculatorProps {
  securityContext?: {
    validateInput: (type: string, value: any) => any;
    onCalculationSuccess: () => void;
    onCalculationError: (error: Error) => void;
    securityLevel: string;
  };
  onSecurityEvent?: (violationType: string, details: any) => void;
}

const CompoundInterestCalculator = React.memo<SecureCalculatorProps>(({ securityContext, onSecurityEvent }) => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundFreq, setCompoundFreq] = useState(12);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [chartData, setChartData] = useState<CompoundData[]>([]);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  const { validateAndSanitizeInput, performSecureCalculation } = useSecureCalculator('compound-interest');

  // Memoized expensive calculation to prevent unnecessary recalculations
  const compoundData = useMemo((): CompoundData[] => {
    const data: CompoundData[] = [];
    let currentPrincipal = principal;
    const monthlyRate = rate / 100 / compoundFreq;
    const periodsPerYear = compoundFreq;
    
    // Add initial data point
    data.push({
      year: 0,
      principal: principal,
      interest: 0,
      total: principal
    });

    for (let year = 1; year <= years; year++) {
      // Calculate compound interest for the year
      const yearlyContributions = monthlyContribution * 12;
      
      // Calculate compound growth
      const periods = year * periodsPerYear;
      const compoundAmount = currentPrincipal * Math.pow(1 + monthlyRate, periods);
      
      // Add yearly contributions with compound interest
      let contributionGrowth = 0;
      for (let i = 1; i <= 12; i++) {
        const monthsRemaining = (years - year) * 12 + (12 - i);
        contributionGrowth += monthlyContribution * Math.pow(1 + monthlyRate, monthsRemaining * periodsPerYear / 12);
      }
      
      const totalContributions = principal + (yearlyContributions * year);
      const totalInterest = compoundAmount + contributionGrowth - totalContributions;
      const totalValue = totalContributions + totalInterest;
      
      data.push({
        year,
        principal: totalContributions,
        interest: totalInterest,
        total: totalValue
      });
    }
    
    return data;
  }, [principal, rate, years, compoundFreq, monthlyContribution]);

  const handleSecureInput = useCallback((field: string, value: string, type: string) => {
    setInputErrors(prev => ({ ...prev, [field]: '' }));
    
    try {
      let sanitizedValue;
      if (securityContext) {
        sanitizedValue = securityContext.validateInput(type, value);
      } else {
        sanitizedValue = validateAndSanitizeInput(type, value);
      }

      switch (field) {
        case 'principal':
          setPrincipal(sanitizedValue);
          break;
        case 'monthlyContribution':
          setMonthlyContribution(sanitizedValue);
          break;
        case 'rate':
          setRate(sanitizedValue);
          break;
        case 'years':
          setYears(sanitizedValue);
          break;
      }
    } catch (error) {
      setInputErrors(prev => ({ ...prev, [field]: error.message }));
      onSecurityEvent?.('invalid_input', { field, value, error: error.message });
    }
  }, [securityContext, validateAndSanitizeInput, onSecurityEvent]);

  const handleCalculate = useCallback(async () => {
    try {
      const calculationFunction = () => {
        const result = calculateCompoundInterest(principal, rate, years, compoundFreq);
        const chartData = compoundData;
        setFutureValue(result);
        setChartData(chartData);
        return result;
      };

      if (securityContext) {
        await calculationFunction();
        securityContext.onCalculationSuccess();
      } else {
        await performSecureCalculation(calculationFunction);
      }
    } catch (error) {
      if (securityContext) {
        securityContext.onCalculationError(error);
      }
      setInputErrors(prev => ({ ...prev, calculation: error.message }));
    }
  }, [principal, rate, years, compoundFreq, monthlyContribution, securityContext, performSecureCalculation, compoundData]);

  // Memoized currency formatter
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return (value: number) => formatter.format(value);
  }, []);

  const totalContributions = principal + (monthlyContribution * 12 * years);
  const totalInterest = futureValue ? futureValue - totalContributions : 0;

  const frequencyOptions = [
    { value: 1, label: 'Annually' },
    { value: 4, label: 'Quarterly' },
    { value: 12, label: 'Monthly' },
    { value: 365, label: 'Daily' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Compound Interest Calculator</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Investment Parameters</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Initial Investment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => handleSecureInput('principal', e.target.value, 'amount')}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 text-white border transition-colors focus:outline-none ${
                    inputErrors.principal ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-blue-400'
                  }`}
                  placeholder="10,000"
                />
                {inputErrors.principal && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{inputErrors.principal}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Monthly Contribution
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => handleSecureInput('monthlyContribution', e.target.value, 'amount')}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 text-white border transition-colors focus:outline-none ${
                    inputErrors.monthlyContribution ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-blue-400'
                  }`}
                  placeholder="200"
                />
                {inputErrors.monthlyContribution && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{inputErrors.monthlyContribution}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Annual Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => handleSecureInput('rate', e.target.value, 'interestRate')}
                  className={`w-full pr-8 pl-4 py-3 rounded-xl bg-white/5 text-white border transition-colors focus:outline-none ${
                    inputErrors.rate ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-blue-400'
                  }`}
                  placeholder="7"
                  step="0.1"
                />
                {inputErrors.rate && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{inputErrors.rate}</AlertDescription>
                  </Alert>
                )}
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60">%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Investment Period
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => handleSecureInput('years', e.target.value, 'timePeriod')}
                  className={`w-full pr-16 pl-4 py-3 rounded-xl bg-white/5 text-white border transition-colors focus:outline-none ${
                    inputErrors.years ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-blue-400'
                  }`}
                  placeholder="10"
                />
                {inputErrors.years && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{inputErrors.years}</AlertDescription>
                  </Alert>
                )}
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60">years</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Compounding Frequency
              </label>
              <select
                value={compoundFreq}
                onChange={(e) => setCompoundFreq(+e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleCalculate}
              className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold transition-all duration-200"
            >
              Calculate Growth
            </button>

            {inputErrors.calculation && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Calculation Error: {inputErrors.calculation}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Results Section */}
        {futureValue !== null && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Results</h2>
            <div className="space-y-4">
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(futureValue)}</div>
                <div className="text-white/80">Future Value</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{formatCurrency(totalContributions)}</div>
                  <div className="text-sm text-white/60">Total Contributions</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xl font-semibold text-white">{formatCurrency(totalInterest)}</div>
                  <div className="text-sm text-white/60">Interest Earned</div>
                </div>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-lg font-semibold text-white">
                  {totalContributions > 0 ? ((totalInterest / totalContributions) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-white/60">Total Return</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Growth Projection Over Time</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#fff" 
                  fontSize={12}
                  tickFormatter={(value) => `Year ${value}`}
                />
                <YAxis 
                  stroke="#fff" 
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const label = name === 'principal' ? 'Contributions' : 
                                  name === 'interest' ? 'Interest Earned' : 'Total Value';
                    return [formatCurrency(value), label];
                  }}
                  labelFormatter={(value) => `Year ${value}`}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="principal"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="url(#principalGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="interest"
                  stackId="1"
                  stroke="#10B981"
                  fill="url(#interestGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-8 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-white/80 text-sm">Contributions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-white/80 text-sm">Interest Earned</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

CompoundInterestCalculator.displayName = 'CompoundInterestCalculator';

// Wrapped component with security features
const SecureCompoundInterestCalculator = () => {
  return (
    <SecureCalculatorWrapper calculatorName="compound-interest">
      <CompoundInterestCalculator />
    </SecureCalculatorWrapper>
  );
};

export default SecureCompoundInterestCalculator;
export { CompoundInterestCalculator }; 