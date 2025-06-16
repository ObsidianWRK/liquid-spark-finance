import React from 'react';
import { Leaf, Zap, Car, Recycle, Droplets, Wind, Globe, TrendingUp, Trees, Sun } from 'lucide-react';
import EnhancedGlassCard from '../ui/EnhancedGlassCard';

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

const ComprehensiveEcoCard: React.FC<{ data: EcoData }> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Very Green';
    if (score >= 60) return 'Green';
    return 'Needs Improvement';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '—';
    }
  };

  const categories = [
    { key: 'C.a.', icon: Globe, label: 'Carbon' },
    { key: 'E.n.', icon: Zap, label: 'Energy' },
    { key: 'T.r.', icon: Car, label: 'Transport' },
    { key: 'W.a.', icon: Droplets, label: 'Water' },
    { key: 'W.a.', icon: Recycle, label: 'Waste' },
    { key: 'S.u.', icon: Sun, label: 'Sustainable' },
    { key: 'G.r.', icon: TrendingUp, label: 'Green' },
    { key: 'B.i.', icon: Leaf, label: 'Bio' },
    { key: 'C.i.', icon: Globe, label: 'Circular' },
    { key: 'C.e.', icon: Wind, label: 'Clean' },
    { key: 'A.i.', icon: Leaf, label: 'Air' },
    { key: 'D.i.', icon: Globe, label: 'Digital' }
  ];

  return (
    <EnhancedGlassCard className="comprehensive-card responsive-padding-md responsive-spacing-md w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          <h2 className="responsive-text-base font-semibold text-white">Comprehensive Eco Impact</h2>
        </div>
        <button className="text-white/60 hover:text-white">
          <span className="text-sm">⌄</span>
        </button>
      </div>

      {/* Overall Score Circle */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative score-circle">
          <svg className="score-circle transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getScoreColor(data.overallScore)}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.overallScore / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="score-text text-white">{data.overallScore}</span>
            <span className="score-label text-green-400">Eco Score</span>
          </div>
        </div>
        <span className="text-white font-medium">{getScoreLabel(data.overallScore)}</span>
      </div>

      {/* Eco Categories Grid */}
      <div className="category-grid">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div key={index} className="category-item flex flex-col items-center space-y-1">
              <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
              <span className="responsive-text-xs text-white/60">{category.key}</span>
            </div>
          );
        })}
      </div>

      {/* Monthly Environmental Impact */}
      <div className="responsive-spacing-sm">
        <h3 className="responsive-text-sm text-white font-medium">Monthly Environmental Impact</h3>
        <div className="impact-grid">
          <div className="impact-item">
            <div className="text-green-400 responsive-text-base font-bold">{data.monthlyImpact.co2Saved}kg</div>
            <div className="text-white/60 responsive-text-xs">CO₂ Saved</div>
          </div>
          <div className="impact-item">
            <div className="text-green-400 responsive-text-base font-bold">{data.monthlyImpact.treesEquivalent}</div>
            <div className="text-white/60 responsive-text-xs">Trees Equivalent</div>
          </div>
          <div className="impact-item">
            <div className="text-blue-400 responsive-text-base font-bold">{data.monthlyImpact.waterSaved}L</div>
            <div className="text-white/60 responsive-text-xs">Water Saved</div>
          </div>
          <div className="impact-item">
            <div className="text-yellow-400 responsive-text-base font-bold">{data.monthlyImpact.energySaved}kWh</div>
            <div className="text-white/60 responsive-text-xs">Energy Saved</div>
          </div>
        </div>
      </div>

      {/* Eco Spending This Month */}
      <div className="responsive-spacing-sm">
        <h3 className="responsive-text-sm text-white font-medium">Eco Spending This Month</h3>
        <div className="spending-grid">
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Sustainable Food</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.sustainableFood}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Renewable Energy</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.renewableEnergy}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Eco Transport</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.ecoTransport}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Green Products</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.greenProducts}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Carbon Offset</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.carbonOffset}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Conservation</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.conservation}</div>
          </div>
        </div>
      </div>

      {/* Environmental Trends */}
      <div className="responsive-spacing-sm">
        <h3 className="responsive-text-sm text-white font-medium">Environmental Trends</h3>
        <div className="trends-grid">
          <div className="trend-item">
            <span className="text-white/70">Carbon Footprint</span>
            <span className="text-green-400">{getTrendIcon(data.environmentalTrends.carbonFootprint)}</span>
          </div>
          <div className="trend-item">
            <span className="text-white/70">Sustainability</span>
            <span className="text-green-400">{getTrendIcon(data.environmentalTrends.sustainability)}</span>
          </div>
          <div className="trend-item">
            <span className="text-white/70">Renewable</span>
            <span className="text-orange-400">{getTrendIcon(data.environmentalTrends.renewable)}</span>
          </div>
          <div className="trend-item">
            <span className="text-white/70">Waste</span>
            <span className="text-white/70">{getTrendIcon(data.environmentalTrends.waste)}</span>
          </div>
        </div>
      </div>
    </EnhancedGlassCard>
  );
};

export default ComprehensiveEcoCard; 