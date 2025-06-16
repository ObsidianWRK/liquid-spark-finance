import React from 'react';
import { Leaf, Droplets, Zap, TreePine, Car, Recycle, ShoppingBag, DollarSign } from 'lucide-react';
import ScoreCircle from './ScoreCircle';
import MetricCard from './MetricCard';

interface EcoData {
  overallScore: number;
  monthlyImpact: {
    co2Saved: number;
    treesEquivalent: number;
    waterSaved: number;
    energySaved: number;
  };
  monthlySpending: {
    sustainableFood: number;
    renewableEnergy: number;
    ecoTransport: number;
    greenProducts: number;
    carbonOffset: number;
    conservation: number;
  };
  environmentalTrends: {
    carbonFootprint: 'up' | 'down' | 'stable';
    sustainability: 'up' | 'down' | 'stable';
    renewable: 'up' | 'down' | 'stable';
    waste: 'up' | 'down' | 'stable';
  };
}

interface EcoCardProps {
  data: EcoData;
}

const EcoCard: React.FC<EcoCardProps> = ({ data }) => {
  const getScoreRating = (score: number) => {
    if (score >= 80) return 'Very Green';
    if (score >= 70) return 'Green';
    if (score >= 60) return 'Eco-Friendly';
    return 'Getting Started';
  };

  const impactMetrics = [
    { icon: Leaf, label: 'CO₂ Saved', value: data.monthlyImpact.co2Saved, suffix: 'kg', color: '#10b981' },
    { icon: TreePine, label: 'Trees Equivalent', value: data.monthlyImpact.treesEquivalent, suffix: '', color: '#059669' },
    { icon: Droplets, label: 'Water Saved', value: data.monthlyImpact.waterSaved, suffix: 'L', color: '#06b6d4' },
    { icon: Zap, label: 'Energy Saved', value: data.monthlyImpact.energySaved, suffix: 'kWh', color: '#f59e0b' },
  ];

  const spendingCategories = [
    { icon: ShoppingBag, label: 'Sustainable Food', amount: data.monthlySpending.sustainableFood, color: '#10b981' },
    { icon: Zap, label: 'Renewable Energy', amount: data.monthlySpending.renewableEnergy, color: '#f59e0b' },
    { icon: Car, label: 'Eco Transport', amount: data.monthlySpending.ecoTransport, color: '#3b82f6' },
    { icon: Recycle, label: 'Green Products', amount: data.monthlySpending.greenProducts, color: '#8b5cf6' },
    { icon: Leaf, label: 'Carbon Offset', amount: data.monthlySpending.carbonOffset, color: '#059669' },
    { icon: TreePine, label: 'Conservation', amount: data.monthlySpending.conservation, color: '#0d9488' },
  ];

  const trends = [
    { label: 'Carbon Footprint', trend: data.environmentalTrends.carbonFootprint },
    { label: 'Sustainability', trend: data.environmentalTrends.sustainability },
    { label: 'Renewable', trend: data.environmentalTrends.renewable },
    { label: 'Waste', trend: data.environmentalTrends.waste },
  ];

  const totalSpending = Object.values(data.monthlySpending).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="liquid-glass-fallback rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Eco Impact</h3>
            <p className="text-white/70 text-sm sm:text-base">
              Monthly eco spending: ${totalSpending.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ScoreCircle 
              score={data.overallScore} 
              size="large"
              label={getScoreRating(data.overallScore)}
              color="#10b981"
            />
          </div>
        </div>
      </div>

      {/* Environmental Impact Metrics */}
      <div className="liquid-glass-fallback rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
        <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Environmental Impact</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {impactMetrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              title={metric.label}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              suffix={metric.suffix}
            />
          ))}
        </div>
      </div>

      {/* Eco Spending Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {spendingCategories.map((category, index) => (
          <MetricCard
            key={category.label}
            title={category.label}
            value={category.amount}
            icon={category.icon}
            color={category.color}
            prefix="$"
          />
        ))}
      </div>

      {/* Environmental Trends */}
      <div className="liquid-glass-fallback rounded-2xl p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Environmental Trends</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {trends.map((trend, index) => (
            <div key={trend.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-white/80 text-xs sm:text-sm font-medium">{trend.label}</span>
              <span 
                className="text-sm sm:text-base font-bold"
                style={{ 
                  color: trend.trend === 'up' ? '#10b981' : 
                         trend.trend === 'down' ? '#ef4444' : '#6b7280'
                }}
              >
                {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoCard; 