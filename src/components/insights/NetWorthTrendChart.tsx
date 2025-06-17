import React, { useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { NetWorthData } from '@/services/mockHistoricalData';
import { TrendingUp, TrendingDown, Eye, EyeOff, Heart } from 'lucide-react';

interface NetWorthTrendChartProps {
  data: NetWorthData[];
  title: string;
}

const NetWorthTrendChart: React.FC<NetWorthTrendChartProps> = ({ data, title }) => {
  const [showAssets, setShowAssets] = useState(true);
  const [showLiabilities, setShowLiabilities] = useState(true);
  const [showProjections, setShowProjections] = useState(true);
  const [showHealthScore, setShowHealthScore] = useState(true);

  // Split data into historical and projected
  const historicalData = data.filter(d => d.type === 'historical');
  const projectedData = data.filter(d => d.type === 'projected');
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Calculate key metrics
  const firstPoint = historicalData[0];
  const lastPoint = historicalData[historicalData.length - 1];
  const finalProjection = projectedData[projectedData.length - 1];
  
  const totalGrowth = ((lastPoint.netWorth - firstPoint.netWorth) / firstPoint.netWorth) * 100;
  const projectedGrowth = finalProjection ? ((finalProjection.netWorth - lastPoint.netWorth) / lastPoint.netWorth) * 100 : 0;
  const annualizedReturn = Math.pow(lastPoint.netWorth / firstPoint.netWorth, 1/3) - 1;
  
  // Calculate health score metrics
  const firstHealthScore = historicalData[0]?.healthScore || 0;
  const lastHealthScore = lastPoint?.healthScore || 0;
  const healthScoreChange = lastHealthScore - firstHealthScore;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Combine data for display, marking projection period
  const displayData = showProjections ? data : historicalData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isProjected = payload[0]?.payload?.type === 'projected';
      return (
        <div className="bg-black/90 border border-white/20 rounded-xl p-4 text-white">
          <p className="text-white/70 text-sm mb-2">
            {formatTooltipDate(label)}
            {isProjected && <span className=" ml-2 text-blue-400 text-xs">(Projected)</span>}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.dataKey === 'netWorth' ? 'Net Worth' : 
               entry.dataKey === 'assets' ? 'Assets' : 
               entry.dataKey === 'liabilities' ? 'Liabilities' :
               entry.dataKey === 'healthScore' ? 'Health Score' : entry.dataKey}: {
                 entry.dataKey === 'healthScore' ? `${entry.value}/100` : formatCurrency(entry.value)
               }
            </p>
          ))}
          {payload[0]?.payload?.growthRate !== undefined && (
            <p className="text-green-400 text-xs mt-1">
              Growth: {payload[0].payload.growthRate.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="liquid-glass-fallback rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 lg:mb-0">{title}</h3>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center lg:text-right">
          <div>
            <p className="text-white/60 text-xs">3-Year Growth</p>
            <p className={`font-bold ${totalGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Annual Return</p>
            <p className={`font-bold ${annualizedReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {annualizedReturn >= 0 ? '+' : ''}{(annualizedReturn * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Current Net Worth</p>
            <p className="font-bold text-white">{formatCurrency(lastPoint.netWorth)}</p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Health Score</p>
            <p className={`font-bold ${healthScoreChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {lastHealthScore}/100 {healthScoreChange >= 0 ? '+' : ''}{healthScoreChange.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setShowAssets(!showAssets)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            showAssets
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
          }`}
        >
          {showAssets ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>Assets</span>
        </button>
        
        <button
          onClick={() => setShowLiabilities(!showLiabilities)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            showLiabilities
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
          }`}
        >
          {showLiabilities ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>Liabilities</span>
        </button>
        
        <button
          onClick={() => setShowHealthScore(!showHealthScore)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            showHealthScore
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
          }`}
        >
          {showHealthScore ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <Heart className="w-3 h-3" />
          <span>Health Score</span>
        </button>
        
        <button
          onClick={() => setShowProjections(!showProjections)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            showProjections
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
          }`}
        >
          {showProjections ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>2-Year Projection</span>
        </button>
      </div>

      {/* Projection Summary */}
      {showProjections && finalProjection && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-medium text-blue-300">2-Year Projection</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-white/60">Projected Net Worth:</p>
              <p className="font-bold text-white">{formatCurrency(finalProjection.netWorth)}</p>
            </div>
            <div>
              <p className="text-white/60">Projected Growth:</p>
              <p className={`font-bold ${projectedGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {projectedGrowth >= 0 ? '+' : ''}{formatCurrency(finalProjection.netWorth - lastPoint.netWorth)} ({projectedGrowth.toFixed(1)}%)
              </p>
            </div>
            <div>
              <p className="text-white/60">Projected Health Score:</p>
              <p className="font-bold text-pink-400">{finalProjection.healthScore}/100</p>
            </div>
          </div>
          <p className="text-white/50 text-xs mt-2">
            * Projections based on historical trends and conservative market assumptions
          </p>
        </div>
      )}

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#fff" 
              fontSize={12}
              tickFormatter={formatDate}
            />
            {/* Primary Y-axis for financial data */}
            {/* Hidden default Y-axis to satisfy components that default to id '0' */}
            <YAxis yAxisId={0} hide />
            <YAxis 
              yAxisId="financial"
              stroke="#fff" 
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            {/* Secondary Y-axis for health score */}
            <YAxis 
              yAxisId="health"
              orientation="right"
              stroke="#ec4899" 
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#fff', paddingTop: '20px' }}
            />
            
            {/* Reference line for current date */}
            <ReferenceLine x={currentDate as unknown as number | string} stroke="rgba(255,255,255,0.5)" strokeDasharray="2 2" />
            
            {/* Net Worth Area */}
            <Area
              yAxisId="financial"
              type="monotone"
              dataKey="netWorth"
              fill="url(#netWorthGradient)"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Net Worth"
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
            />
            
            {/* Assets Line */}
            {showAssets && (
              <Line
                yAxisId="financial"
                type="monotone"
                dataKey="assets"
                stroke="#10b981"
                strokeWidth={2}
                name="Assets"
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }}
              />
            )}
            
            {/* Liabilities Line */}
            {showLiabilities && (
              <Line
                yAxisId="financial"
                type="monotone"
                dataKey="liabilities"
                stroke="#ef4444"
                strokeWidth={2}
                name="Liabilities"
                dot={false}
                activeDot={{ r: 4, fill: '#ef4444' }}
              />
            )}
            
            {/* Health Score Line */}
            {showHealthScore && (
              <Line
                yAxisId="health"
                type="monotone"
                dataKey="healthScore"
                stroke="#ec4899"
                strokeWidth={3}
                name="Health Score"
                dot={false}
                activeDot={{ r: 4, fill: '#ec4899' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-white/50 text-center">
        Historical data (3 years) | Current position | Projected trends (2 years)
        {showHealthScore && (
          <span className="block mt-1 text-pink-400">
            Health Score (0-100) displayed on right axis
          </span>
        )}
      </div>
    </div>
  );
};

export default NetWorthTrendChart; 